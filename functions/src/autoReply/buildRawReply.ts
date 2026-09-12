import { SENDER_NAME, SHARED_ADDRESS } from "./constants";
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

/**
 * Builds the base64url MIME message Gmail's send endpoint wants.
 *
 * R11: threadId, In-Reply-To, References and a matching Subject are all
 * required to stay inside the thread. threadId is passed separately in the
 * request body; the other three are set here.
 *
 * R12: every reply is Cc'd to the Shared Address. That is how the partners
 * find out the mail was answered.
 */
export const buildRawReply = (
  message: InboundMessage,
  bodyText: string,
): string => {
  const references = [message.references, message.rfcMessageId]
    .filter(Boolean)
    .join(" ")
    .trim();

  const headers = [
    `From: ${encodeAddress(`${SENDER_NAME} <${SHARED_ADDRESS}>`)}`,
    `To: ${encodeAddress(message.from)}`,
    `Cc: ${SHARED_ADDRESS}`,
    `Subject: ${encodeHeader(replySubject(message.subject))}`,
  ];

  if (message.rfcMessageId) {
    headers.push(`In-Reply-To: ${message.rfcMessageId}`);
  }
  if (references) {
    headers.push(`References: ${references}`);
  }

  headers.push(
    // RFC 3834. Tells another auto-responder not to answer this, which is
    // what stops two robots writing to each other forever.
    "Auto-Submitted: auto-replied",
    "X-Auto-Response-Suppress: All",
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
  );

  const body = foldBase64(Buffer.from(bodyText, "utf8").toString("base64"));
  const mime = `${headers.join("\r\n")}\r\n\r\n${body}`;

  return Buffer.from(mime, "utf8").toString("base64url");
};
