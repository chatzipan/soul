import { BOT_MAILBOX, SENDER_NAME, SHARED_ADDRESS } from "./constants";
import { InboundMessage } from "./gmail";

/**
 * RFC 2047 encoded word. Needed for any header holding a character outside
 * ASCII, such as the ü in "Soul Zürich" or an umlaut in a German subject.
 */
const encodeHeader = (value: string): string => {
  // eslint-disable-next-line no-control-regex
  if (/^[\x00-\x7F]*$/.test(value)) return value;
  return `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
};

/**
 * Encodes the display name of an address, leaving the address itself alone.
 * A customer called "Jürg Müller" would otherwise put raw 8-bit bytes in the
 * To header, which RFC 5322 does not allow.
 */
const encodeAddress = (value: string): string => {
  const match = value.match(/^(.*?)\s*<([^>]+)>\s*$/);
  if (!match) return value.trim();

  const name = match[1].replace(/^"|"$/g, "").trim();
  if (!name) return `<${match[2].trim()}>`;

  return `${encodeHeader(name)} <${match[2].trim()}>`;
};

/** Folds a base64 body onto lines of 76 characters, as RFC 5322 requires. */
const foldBase64 = (value: string): string =>
  (value.match(/.{1,76}/g) || []).join("\r\n");

/** Adds "Re: " unless the subject already carries it. */
export const replySubject = (subject: string): string => {
  const trimmed = (subject || "").trim();
  if (!trimmed) return "Re:";
  return /^re\s*:/i.test(trimmed) ? trimmed : `Re: ${trimmed}`;
};

/** R11: the headers that keep a message inside the customer's thread. */
const threadHeaders = (message: InboundMessage): string[] => {
  const references = [message.references, message.rfcMessageId]
    .filter(Boolean)
    .join(" ")
    .trim();

  const headers = [`Subject: ${encodeHeader(replySubject(message.subject))}`];

  if (message.rfcMessageId) {
    headers.push(`In-Reply-To: ${message.rfcMessageId}`);
  }
  if (references) {
    headers.push(`References: ${references}`);
  }

  return headers;
};

const PLAIN_TEXT_HEADERS = [
  "MIME-Version: 1.0",
  'Content-Type: text/plain; charset="UTF-8"',
  "Content-Transfer-Encoding: base64",
];

const toRaw = (headers: string[], bodyText: string): string => {
  const body = foldBase64(Buffer.from(bodyText, "utf8").toString("base64"));
  const mime = `${headers.join("\r\n")}\r\n\r\n${body}`;

  return Buffer.from(mime, "utf8").toString("base64url");
};

/**
 * Builds the base64url MIME message Gmail's send endpoint wants.
 *
 * R11: threadId, In-Reply-To, References and a matching Subject are all
 * required to stay inside the thread. threadId is passed separately in the
 * request body; the other three are set here.
 *
 * No Cc. Google Groups drops any message marked Auto-Submitted, so a Cc to the
 * group never reached the partners. Seen on 2026-09-16 in the admin email log:
 * "Message looks like an auto-response and has been dropped". The partners get
 * their copy from buildRawGroupCopy instead (R12).
 */
export const buildRawReply = (
  message: InboundMessage,
  bodyText: string,
): string =>
  toRaw(
    [
      `From: ${encodeAddress(`${SENDER_NAME} <${SHARED_ADDRESS}>`)}`,
      `To: ${encodeAddress(message.from)}`,
      ...threadHeaders(message),
      // RFC 3834. Tells another auto-responder not to answer this, which is
      // what stops two robots writing to each other forever.
      "Auto-Submitted: auto-replied",
      "X-Auto-Response-Suppress: All",
      ...PLAIN_TEXT_HEADERS,
    ],
    bodyText,
  );

/**
 * R12: the copy for the partners, sent to the group after the reply.
 *
 * It carries the customer's thread headers, so Gmail shows it inside the
 * customer's conversation. It must NOT carry Auto-Submitted or the group drops
 * it. It is internal mail, so no auto-responder outside ever sees it.
 *
 * From is the Bot Mailbox, a group member, not the group itself. A message
 * from the group to itself looks like a loop.
 */
export const buildRawGroupCopy = (
  message: InboundMessage,
  replyText: string,
): string =>
  toRaw(
    [
      `From: ${encodeAddress(`Soul auto-reply <${BOT_MAILBOX}>`)}`,
      `To: ${SHARED_ADDRESS}`,
      ...threadHeaders(message),
      ...PLAIN_TEXT_HEADERS,
    ],
    [
      `This email was answered automatically. Nobody needs to reply.`,
      ``,
      `Sent to: ${message.from}`,
      ``,
      `To write to the customer, reply to their email, not to this one.`,
      ``,
      `--- The reply they got ---`,
      ``,
      replyText,
    ].join("\n"),
  );
