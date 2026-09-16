/** Fixed values for the auto-reply job. See AUTO_REPLY_SPEC.md. */

/** The Shared Address. Customers write here. It is a Google Group, not a mailbox. */
export const SHARED_ADDRESS = "hallo@soulzuerich.ch";

/** The display name the customer sees in the From line. */
export const SENDER_NAME = "Soul Zürich";

/** The Bot Mailbox. The real Workspace user the job reads and sends through. */
export const BOT_MAILBOX =
  process.env.AUTO_REPLY_BOT_MAILBOX || "bot@soulcoffee.info";

/**
 * Own Address (R3). Both, always. Every reply is followed by a copy to the
 * group, and the Bot Mailbox is a group member, so our own mail can land back
 * in the mailbox we read.
 * A rule matching only one of the two lets the agent answer itself.
 */
export const OWN_ADDRESSES = [SHARED_ADDRESS, BOT_MAILBOX];

/** Alerts go here, and only here. Never to the partners (R17). */
export const ALERT_ADDRESS = "v.chatzipanagiotis@soulcoffee.info";

/**
 * The service account that has domain-wide delegation in the Workspace admin
 * console. Left empty the job uses its own attached identity, which works when
 * the function already runs as the delegated service account.
 */
export const DELEGATED_SERVICE_ACCOUNT =
  process.env.AUTO_REPLY_DELEGATED_SA || "";

export const GMAIL_SCOPE = "https://www.googleapis.com/auth/gmail.modify";

/**
 * Four days, not three, even though R4 refuses anything older than three.
 * The extra day is margin. Without it a message crossing the three day line
 * between runs would drop out of the search and never be recorded as skipped.
 */
export const GMAIL_QUERY = "in:inbox newer_than:4d";

export const MAX_MESSAGES_PER_RUN = 50;

/** R8: stop the run after this many replies. */
export const MAX_SENDS_PER_RUN = 3;

/** R9: stop the run when this many replies have already gone out today. */
export const MAX_SENDS_PER_DAY = 5;

/** A message younger than this is left alone, so a partner can get there first. */
export const MIN_MESSAGE_AGE_MINUTES = 15;

/** R4: nothing older than this is ever answered. */
export const MAX_MESSAGE_AGE_DAYS = 3;

/** Default Cutoff hour, used when settings/autoReply does not set one. */
export const DEFAULT_EVENT_CUTOFF_HOUR = 16;

export const TIMEZONE = "Europe/Zurich";

export const SETTINGS_COLLECTION = "settings";
export const SETTINGS_DOC_ID = "autoReply";
export const RECORDS_COLLECTION = "autoReplyRecords";
export const ALERTS_COLLECTION = "autoReplyAlerts";

/** Applied to a message in the Bot Mailbox after a successful send (R15). */
export const HANDLED_LABEL = "auto-replied";

export const CLASSIFIER_MODEL = "claude-opus-5";
