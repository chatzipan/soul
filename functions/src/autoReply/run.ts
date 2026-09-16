import { AutoReplyRecord, AutoReplySettings } from "../types/autoReply";
import { getReplyText } from "../email/autoReplyTexts";
import { sendAlert } from "./alerts";
import { buildRawGroupCopy, buildRawReply } from "./buildRawReply";
import { classifyEmail } from "./classify";
import {
  MAX_MESSAGE_AGE_DAYS,
  MAX_SENDS_PER_DAY,
  MAX_SENDS_PER_RUN,
  MIN_MESSAGE_AGE_MINUTES,
  OWN_ADDRESSES,
} from "./constants";
import { decide } from "./decide";
import {
  InboundMessage,
  applyHandledLabel,
  getGmailClient,
  getMessage,
  getThreadSize,
  listInboxMessages,
  sendReply,
} from "./gmail";
import {
  countSentToday,
  threadHasRecord,
  updateRecord,
  writeRecord,
  zurichDay,
} from "./records";
import { getAutoReplySettings } from "./settings";

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

const baseRecord = (
  message: InboundMessage,
  settings: AutoReplySettings,
): AutoReplyRecord => ({
  threadId: message.threadId,
  messageId: message.id,
  rfcMessageId: message.rfcMessageId,
  from: message.from,
  subject: message.subject,
  receivedAt: message.receivedAt,
  bodyText: message.bodyText,
  classification: null,
  decision: null,
  variant: null,
  replyText: null,
  status: "skipped",
  disqualifier: "",
  dryRun: settings.dryRun,
  error: null,
  createdAt: Date.now(),
  sentAt: null,
  sentDay: null,
});

/** A skip that is written down, so it can be reviewed later (R16). */
const recordSkip = async (
  message: InboundMessage,
  settings: AutoReplySettings,
  disqualifier: string,
): Promise<void> => {
  await writeRecord({
    ...baseRecord(message, settings),
    status: "skipped",
    disqualifier,
  });
};

/**
 * The whole run. The order of the checks is fixed and must not be changed.
 * See AUTO_REPLY_SPEC.md section 5.
 */
export const runAutoReply = async (): Promise<void> => {
  const settings = await getAutoReplySettings();

  // R1: the kill switch stops everything, with no deploy needed.
  if (!settings.enabled) {
    console.log("autoReply.enabled is false. Doing nothing.");
    // R19: at most one reminder per day while it is off.
    await sendAlert(
      "disabled_reminder",
      "The auto-reply job is switched off",
      "settings/autoReply has enabled: false, so no weekend reservation " +
        "emails are being answered automatically. This is a reminder, not a " +
        "fault. You get it once a day while the job stays off.",
    );
    return;
  }

  const client = await getGmailClient();
  const messageIds = await listInboxMessages(client);

  let sentThisRun = 0;
  let sentToday = await countSentToday();

  for (const messageId of messageIds) {
    const message = await getMessage(client, messageId);

    // Step 2, R6. Checked before R7 on purpose: our own group copy makes a
    // handled thread two messages long, so R7 alone would be right by accident.
    if (await threadHasRecord(message.threadId)) continue;

    // Step 3, R3. Both Own Addresses, always.
    if (OWN_ADDRESSES.includes(message.fromAddress)) continue;

    const age = Date.now() - message.receivedAt;

    // Step 4. The one skip that writes NO record. A record here would match R6
    // on the next run and block this message forever.
    if (age < MIN_MESSAGE_AGE_MINUTES * MINUTE) continue;

    // Step 5, R4.
    if (age > MAX_MESSAGE_AGE_DAYS * DAY) {
      await recordSkip(message, settings, "too_old");
      continue;
    }

    // Step 6, R5.
    if (settings.goLiveDate !== null && message.receivedAt < settings.goLiveDate) {
      await recordSkip(message, settings, "before_go_live");
      continue;
    }

    // Step 7, R7.
    if ((await getThreadSize(client, message.threadId)) > 1) {
      await recordSkip(message, settings, "thread_already_has_replies");
      continue;
    }

    // Step 8. Classify and apply the rule table.
    let classification;
    try {
      classification = await classifyEmail(message);
    } catch (error) {
      // No record on purpose. A record would block a real customer for good
      // over what is probably a temporary API failure. The next run retries.
      console.error(`Could not classify message ${message.id}.`, error);
      await sendAlert(
        "run_failed",
        "The classifier failed",
        `The auto-reply job could not classify at least one email today.\n\n` +
          `Message: ${message.id}\nSubject: ${message.subject}\n\n` +
          `${error instanceof Error ? error.message : String(error)}`,
      );
      continue;
    }

    const decision = decide(classification, settings.eventCutoffHour);

    if (!decision.send || !decision.variant) {
      await writeRecord({
        ...baseRecord(message, settings),
        classification,
        decision,
        status: "skipped",
        disqualifier: decision.disqualifier,
      });
      continue;
    }

    // Step 9, R8 and R9. Both stop the whole run, not just this message.
    if (sentThisRun >= MAX_SENDS_PER_RUN) {
      await sendAlert(
        "run_cap_hit",
        "Stopped after 3 replies in one run",
        `The auto-reply job wanted to send more than ${MAX_SENDS_PER_RUN} ` +
          `replies in a single run and stopped. Check settings/autoReply and ` +
          `the autoReplyRecords collection before it runs again.`,
      );
      return;
    }

    if (sentToday >= MAX_SENDS_PER_DAY) {
      await sendAlert(
        "day_cap_hit",
        "Stopped after 5 replies today",
        `The auto-reply job has already sent ${MAX_SENDS_PER_DAY} replies ` +
          `today and stopped. That is far above the usual 1 to 2 per week, ` +
          `so something is probably wrong.`,
      );
      return;
    }

    const replyText = getReplyText(decision.variant);

    // Step 10, R10: the record is written before Gmail is called, so a crash
    // mid-send can never turn into a second reply.
    const record: AutoReplyRecord = {
      ...baseRecord(message, settings),
      classification,
      decision,
      variant: decision.variant,
      replyText,
      status: "sending",
    };
    await writeRecord(record);

    // R2: a dry run does every step except the send.
    if (settings.dryRun) {
      await updateRecord(message.id, {
        status: "skipped",
        disqualifier: "dry_run",
      });
      // Counts against the per-run cap so a dry run shows the real behaviour,
      // but writes no sentDay, so it never eats into a live day's allowance.
      sentThisRun += 1;
      continue;
    }

    try {
      await sendReply(client, {
        raw: buildRawReply(message, replyText),
        threadId: message.threadId,
      });

      const sentAt = Date.now();
      await updateRecord(message.id, {
        status: "sent",
        sentAt,
        sentDay: zurichDay(sentAt),
      });

      sentThisRun += 1;
      sentToday += 1;

      // R15: a failed label must not turn a sent reply into a failure.
      try {
        await applyHandledLabel(client, message.id);
      } catch (error) {
        console.warn(`Could not label message ${message.id}.`, error);
      }

      // R12: the partners' copy. A failure here must not turn a sent reply
      // into a failure either, but the owner hears about it.
      try {
        await sendReply(client, {
          raw: buildRawGroupCopy(message, replyText),
          threadId: message.threadId,
        });
      } catch (error) {
        console.error(`Could not send the group copy for ${message.id}.`, error);
        await sendAlert(
          "copy_failed",
          "The partners' copy of a reply was not sent",
          `The customer got the automatic reply, but the copy to the group ` +
            `failed. The partners do not know this email is answered.\n\n` +
            `Subject: ${message.subject}\nFrom: ${message.from}\n\n` +
            `${error instanceof Error ? error.message : String(error)}`,
        );
      }
    } catch (error) {
      // R14: a record left at "failed" blocks this thread for good.
      // The send is never retried.
      const detail = error instanceof Error ? error.message : String(error);
      await updateRecord(message.id, { status: "failed", error: detail });

      console.error(`Sending the reply for ${message.id} failed.`, error);
      await sendAlert(
        "send_failed",
        "A reply could not be sent",
        `The auto-reply job failed to send a reply and will not try again.\n\n` +
          `Subject: ${message.subject}\nFrom: ${message.from}\n\n${detail}\n\n` +
          `Someone needs to answer this email by hand.`,
      );
    }
  }

  console.log(
    `Auto-reply run finished. Looked at ${messageIds.length} messages, ` +
      `sent ${sentThisRun}${settings.dryRun ? " (dry run, nothing left)" : ""}.`,
  );
};
