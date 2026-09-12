import { gmail, gmail_v1 } from "@googleapis/gmail";
import { GoogleAuth, OAuth2Client } from "google-auth-library";

import {
  BOT_MAILBOX,
  DELEGATED_SERVICE_ACCOUNT,
  GMAIL_QUERY,
  GMAIL_SCOPE,
  HANDLED_LABEL,
  MAX_MESSAGES_PER_RUN,
} from "./constants";

export interface InboundMessage {
  id: string;
  threadId: string;
  /** The RFC 5322 Message-ID header. Needed to thread the reply (R11). */
  rfcMessageId: string | null;
  references: string | null;
  from: string;
  /** Just the address part of From, lower cased. */
  fromAddress: string;
  to: string;
  subject: string;
  receivedAt: number;
  bodyText: string;
}

/**
 * Builds a Gmail access token for the Bot Mailbox without any downloaded key.
 *
 * The function signs a JWT with the IAM credentials API using the delegated
 * service account, then trades that JWT for an access token. Google recommends
 * this over a service account key file for domain-wide delegation.
 * See research/gmail-access.md section 2.3.
 */
const fetchAccessToken = async (): Promise<{
  token: string;
  expiresAt: number;
}> => {
  const auth = new GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });
  const client = await auth.getClient();

  const serviceAccount =
    DELEGATED_SERVICE_ACCOUNT || (await auth.getCredentials()).client_email;

  if (!serviceAccount) {
    throw new Error(
      "Cannot work out which service account to use for Gmail delegation.",
    );
  }

  const issuedAt = Math.floor(Date.now() / 1000);
  const claims = {
    iss: serviceAccount,
    // The mailbox we act as. Must be a real user, never a group.
    sub: BOT_MAILBOX,
    scope: GMAIL_SCOPE,
    aud: "https://oauth2.googleapis.com/token",
    iat: issuedAt,
    exp: issuedAt + 3600,
  };

  const signed = await client.request<{ signedJwt: string }>({
    url:
      "https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/" +
      `${encodeURIComponent(serviceAccount)}:signJwt`,
    method: "POST",
    data: { payload: JSON.stringify(claims) },
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: signed.data.signedJwt,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Gmail token exchange failed: ${response.status} ${detail}`);
  }

  const body = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };

  return {
    token: body.access_token,
    expiresAt: Date.now() + (body.expires_in - 60) * 1000,
  };
};

let cached: { client: gmail_v1.Gmail; expiresAt: number } | null = null;

export const getGmailClient = async (): Promise<gmail_v1.Gmail> => {
  if (cached && cached.expiresAt > Date.now()) {
    return cached.client;
  }

  const { token, expiresAt } = await fetchAccessToken();
  const authClient = new OAuth2Client();
  authClient.setCredentials({ access_token: token });

  const client = gmail({ version: "v1", auth: authClient });
  cached = { client, expiresAt };
  return client;
};

const headerValue = (
  headers: gmail_v1.Schema$MessagePartHeader[] | undefined,
  name: string,
): string => {
  const match = (headers || []).find(
    (header) => (header.name || "").toLowerCase() === name.toLowerCase(),
  );
  return match?.value || "";
};

/** Pulls the address out of `Name <address@example.com>`. */
export const addressOf = (value: string): string => {
  const match = value.match(/<([^>]+)>/);
  return (match ? match[1] : value).trim().toLowerCase();
};

const decodeBody = (data: string): string =>
  Buffer.from(data, "base64url").toString("utf8");

/**
 * Finds the readable text of a message. Prefers text/plain. Falls back to
 * text/html with the tags removed, because some clients send HTML only.
 */
const extractBody = (payload: gmail_v1.Schema$MessagePart | undefined): string => {
  if (!payload) return "";

  const plain: string[] = [];
  const html: string[] = [];

  const walk = (part: gmail_v1.Schema$MessagePart) => {
    const mimeType = part.mimeType || "";
    const data = part.body?.data;

    if (data && mimeType === "text/plain") plain.push(decodeBody(data));
    if (data && mimeType === "text/html") html.push(decodeBody(data));

    (part.parts || []).forEach(walk);
  };

  walk(payload);

  if (plain.length) return plain.join("\n").trim();

  return html
    .join("\n")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/[ \t]+/g, " ")
    .trim();
};

export const listInboxMessages = async (
  client: gmail_v1.Gmail,
): Promise<string[]> => {
  const response = await client.users.messages.list({
    userId: "me",
    q: GMAIL_QUERY,
    maxResults: MAX_MESSAGES_PER_RUN,
  });

  return (response.data.messages || [])
    .map((message) => message.id)
    .filter((id): id is string => Boolean(id));
};

export const getMessage = async (
  client: gmail_v1.Gmail,
  id: string,
): Promise<InboundMessage> => {
  const response = await client.users.messages.get({
    userId: "me",
    id,
    format: "full",
  });

  const message = response.data;
  const headers = message.payload?.headers || undefined;
  const from = headerValue(headers, "From");

  return {
    id,
    threadId: message.threadId || id,
    rfcMessageId: headerValue(headers, "Message-ID") || null,
    references: headerValue(headers, "References") || null,
    from,
    fromAddress: addressOf(from),
    to: headerValue(headers, "To"),
    subject: headerValue(headers, "Subject"),
    receivedAt: Number(message.internalDate || Date.now()),
    bodyText: extractBody(message.payload || undefined),
  };
};

/** How many messages the thread holds. Used by R7. */
export const getThreadSize = async (
  client: gmail_v1.Gmail,
  threadId: string,
): Promise<number> => {
  const response = await client.users.threads.get({
    userId: "me",
    id: threadId,
    format: "minimal",
  });

  return (response.data.messages || []).length;
};

export const sendReply = async (
  client: gmail_v1.Gmail,
  options: { raw: string; threadId: string },
): Promise<string | null> => {
  const response = await client.users.messages.send({
    userId: "me",
    requestBody: { raw: options.raw, threadId: options.threadId },
  });

  return response.data.id || null;
};

/**
 * Marks a handled message in the Bot Mailbox (R15).
 * A label is private to one mailbox, so this is our own marker and nothing more.
 */
export const applyHandledLabel = async (
  client: gmail_v1.Gmail,
  messageId: string,
): Promise<void> => {
  const existing = await client.users.labels.list({ userId: "me" });
  let label = (existing.data.labels || []).find(
    (item) => item.name === HANDLED_LABEL,
  );

  if (!label) {
    const created = await client.users.labels.create({
      userId: "me",
      requestBody: {
        name: HANDLED_LABEL,
        labelListVisibility: "labelShow",
        messageListVisibility: "show",
      },
    });
    label = created.data;
  }

  if (!label.id) return;

  await client.users.messages.modify({
    userId: "me",
    id: messageId,
    requestBody: { addLabelIds: [label.id] },
  });
};
