import moment from "moment-timezone";

import {
  AutoReplyDecision,
  Classification,
  ReplyVariant,
} from "../types/autoReply";
import { TIMEZONE } from "./constants";

const SUNDAY = 0;
const SATURDAY = 6;

/**
 * Party size at or above which two things change:
 * the walk-in invitation is dropped, and the Cutoff starts to apply even to a
 * plain table request. Change this one number to move both.
 */
const LARGE_PARTY = 10;

const isWeekend = (date: string): boolean => {
  const day = moment.tz(date, "YYYY-MM-DD", TIMEZONE).day();
  return day === SATURDAY || day === SUNDAY;
};

const hourOf = (time: string): number => Number(time.split(":")[0]);

const pickVariant = (classification: Classification): ReplyVariant => {
  const language = classification.language === "de" ? "de" : "en";
  const size = classification.partySize;
  // Size unknown counts as large. Telling a company of 30 to walk in is silly,
  // and we would rather under-invite than over-invite.
  const scale = size === null || size >= LARGE_PARTY ? "large" : "small";
  return `${language}_${scale}` as ReplyVariant;
};

const silent = (disqualifier: string): AutoReplyDecision => ({
  send: false,
  disqualifier,
  variant: null,
});

/**
 * The rule table from AUTO_REPLY_SPEC.md section 6.
 *
 * The agent acts only on an email about a Saturday or Sunday date.
 *
 *   Plain Table Request, any time or none  -> auto-reply
 *   Event Enquiry, before the Cutoff       -> auto-reply
 *   Event Enquiry, at or after the Cutoff  -> a human answers
 *   Event Enquiry, no time given           -> a human answers
 *
 * A party of LARGE_PARTY or more is held to the Event Enquiry rules even when
 * the classifier called it a plain table request. Telling the two apart is a
 * judgement, and a table for 14 on a Saturday evening is worth too much to
 * leave to one. Size is a fact in the email, so the check sits here in code
 * rather than in the prompt.
 *
 * Silence is always the safe answer. Every branch that is not certain returns
 * send: false.
 */
export const decide = (
  classification: Classification,
  eventCutoffHour: number,
): AutoReplyDecision => {
  if (classification.language !== "de" && classification.language !== "en") {
    return silent("other_language");
  }

  if (classification.category === "unclear") return silent("unclear");
  if (classification.category === "not_our_case") return silent("not_our_case");

  // The classifier returns "unclear" for this, but the rule is important
  // enough to state twice.
  if (classification.reason === "extra_question") return silent("extra_question");

  if (classification.requestedDates.length === 0) {
    return silent("no_specific_date");
  }

  // A weekday named alongside a weekend day means a person answers.
  if (!classification.requestedDates.every(isWeekend)) {
    return silent("weekday_in_request");
  }

  // An unknown size stays on the light path. Most emails do not state a
  // number, and treating every one of them as an event would answer almost
  // nothing.
  const isLargeParty =
    classification.partySize !== null && classification.partySize >= LARGE_PARTY;

  if (classification.category === "event_enquiry" || isLargeParty) {
    const prefix = isLargeParty && classification.category !== "event_enquiry"
      ? "large_party"
      : "event";

    if (!classification.requestedTime) return silent(`${prefix}_without_time`);

    if (hourOf(classification.requestedTime) >= eventCutoffHour) {
      return silent(`${prefix}_after_cutoff`);
    }
  }

  return {
    send: true,
    disqualifier: "",
    variant: pickVariant(classification),
  };
};
