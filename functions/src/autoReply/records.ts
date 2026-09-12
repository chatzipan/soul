import moment from "moment-timezone";

import { db } from "../db";
import { AutoReplyRecord } from "../types/autoReply";
import { RECORDS_COLLECTION, TIMEZONE } from "./constants";

const collection = () => db.collection(RECORDS_COLLECTION);

/** "YYYY-MM-DD" in Europe/Zurich. */
export const zurichDay = (at: number = Date.now()): string =>
  moment(at).tz(TIMEZONE).format("YYYY-MM-DD");

/**
 * R6: a thread that already has a record is never looked at again, whatever
 * the record says. Checked before R7, because our own Cc'd reply makes a
 * handled thread two messages long, so R7 alone would give the right answer
 * for the wrong reason.
 */
export const threadHasRecord = async (threadId: string): Promise<boolean> => {
  const snapshot = await collection()
    .where("threadId", "==", threadId)
    .limit(1)
    .get();

  return !snapshot.empty;
};

/** R16: one document per message looked at, answered or not. */
export const writeRecord = async (
  record: AutoReplyRecord,
): Promise<void> => {
  await collection().doc(record.messageId).set(record);
};

export const updateRecord = async (
  messageId: string,
  fields: Partial<AutoReplyRecord>,
): Promise<void> => {
  await collection().doc(messageId).update(fields);
};

/**
 * R9: how many replies have already gone out today, Europe/Zurich.
 *
 * Counts on a single stored day string rather than a range over a timestamp,
 * so no composite index is needed.
 */
export const countSentToday = async (): Promise<number> => {
  const snapshot = await collection()
    .where("sentDay", "==", zurichDay())
    .count()
    .get();

  return snapshot.data().count;
};
