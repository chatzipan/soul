/**
 * Types for the weekend reservation auto-reply job.
 * See AUTO_REPLY_SPEC.md sections 6, 8 and 9.
 */

/** What the classifier decides the email is. Drives the rule table. */
export type AutoReplyCategory =
  | "plain_table_request"
  | "event_enquiry"
  | "not_our_case"
  | "unclear";

/**
 * Why the classifier landed on that category.
 * Never changes what the job does. Kept so skipped mail can be reviewed.
 */
export type AutoReplyReason =
  | "weekend_request"
  | "weekday_request"
  | "no_specific_date"
  | "mixed_days"
  | "extra_question"
  | "not_a_booking"
  | "other_language"
  | "supplier"
  | "spam"
  | "other";

export type AutoReplyLanguage = "de" | "en" | "other";

export interface Classification {
  category: AutoReplyCategory;
  reason: AutoReplyReason;
  language: AutoReplyLanguage;
  /** Specific calendar dates, "YYYY-MM-DD". Empty when none can be pinned. */
  requestedDates: string[];
  /** "HH:mm" in 24h, or null when no time is stated. */
  requestedTime: string | null;
  partySize: number | null;
}

export interface AutoReplySettings {
  /** Kill switch. False stops the whole run (R1). */
  enabled: boolean;
  /** Decide and record, never send (R2). */
  dryRun: boolean;
  /** Go-Live Floor. Nothing that arrived before this is ever answered (R5). */
  goLiveDate: number | null;
  /**
   * The Cutoff, as an hour in Europe/Zurich. Only affects Event Enquiries.
   * Never written in a reply, never shown on the website.
   */
  eventCutoffHour: number;
}

export type AutoReplyStatus = "skipped" | "sending" | "sent" | "failed";

/** Which of the four reply texts was chosen. */
export type ReplyVariant = "en_small" | "en_large" | "de_small" | "de_large";

export interface AutoReplyDecision {
  send: boolean;
  /** Short machine-readable note on why. Recorded, never shown to a customer. */
  disqualifier: string;
  variant: ReplyVariant | null;
}

export interface AutoReplyRecord {
  threadId: string;
  messageId: string;
  /** The RFC 5322 Message-ID header, needed to thread the reply. */
  rfcMessageId: string | null;
  from: string;
  subject: string;
  receivedAt: number;
  bodyText: string;
  classification: Classification | null;
  decision: AutoReplyDecision | null;
  variant: ReplyVariant | null;
  replyText: string | null;
  status: AutoReplyStatus;
  disqualifier: string;
  dryRun: boolean;
  error: string | null;
  createdAt: number;
  sentAt: number | null;
  /** "YYYY-MM-DD" in Europe/Zurich. Lets R9 count today's sends without a composite index. */
  sentDay: string | null;
}
