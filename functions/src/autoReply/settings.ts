import { db } from "../db";
import { AutoReplySettings } from "../types/autoReply";
import {
  DEFAULT_EVENT_CUTOFF_HOUR,
  SETTINGS_COLLECTION,
  SETTINGS_DOC_ID,
} from "./constants";

/**
 * Safe defaults. A missing settings document must never mean "send mail".
 */
const defaults: AutoReplySettings = {
  enabled: false,
  dryRun: true,
  goLiveDate: null,
  eventCutoffHour: DEFAULT_EVENT_CUTOFF_HOUR,
};

/** Accepts a Firestore Timestamp, a number of milliseconds, or a date string. */
const toMillis = (value: unknown): number | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  if (typeof value === "object" && "toMillis" in (value as object)) {
    return (value as { toMillis: () => number }).toMillis();
  }
  return null;
};

export const getAutoReplySettings = async (): Promise<AutoReplySettings> => {
  const doc = await db
    .collection(SETTINGS_COLLECTION)
    .doc(SETTINGS_DOC_ID)
    .get();

  if (!doc.exists) {
    console.warn(
      `settings/${SETTINGS_DOC_ID} does not exist. Falling back to disabled.`,
    );
    return defaults;
  }

  const data = doc.data() || {};

  return {
    enabled: data.enabled === true,
    // Anything other than an explicit false keeps the job from sending.
    dryRun: data.dryRun !== false,
    goLiveDate: toMillis(data.goLiveDate),
    eventCutoffHour:
      typeof data.eventCutoffHour === "number"
        ? data.eventCutoffHour
        : DEFAULT_EVENT_CUTOFF_HOUR,
  };
};
