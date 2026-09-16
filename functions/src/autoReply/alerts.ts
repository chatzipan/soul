import { createEmailTransporter } from "../utils/email";
import { ALERTS_COLLECTION, ALERT_ADDRESS } from "./constants";
import { zurichDay } from "./records";

import { db } from "../db";

/**
 * The kinds of alert the job can raise. R18 lists them.
 * "disabled_reminder" is the once-a-day nudge from R19.
 */
export type AlertKind =
  | "send_failed"
  | "copy_failed"
  | "run_cap_hit"
  | "day_cap_hit"
  | "disabled_reminder"
  | "run_failed";

/**
 * Sends one alert to the owner. Never to the partners (R17).
 *
 * R19 and R20: at most one alert of each kind per day. The guard is a Firestore
 * document per kind and day, created with create(), which fails if the document
 * already exists. That makes "only once" safe even if two runs overlap.
 *
 * There are no summary emails, ever. The group copy after each reply is how
 * the partners see what happened.
 */
export const sendAlert = async (
  kind: AlertKind,
  subject: string,
  body: string,
): Promise<void> => {
  const guard = db.collection(ALERTS_COLLECTION).doc(`${kind}_${zurichDay()}`);

  try {
    await guard.create({ kind, createdAt: Date.now() });
  } catch (error) {
    console.log(`Alert "${kind}" already sent today. Not sending again.`);
    return;
  }

  try {
    await createEmailTransporter().sendMail({
      from: "Soul auto-reply <v.chatzipanagiotis@soulcoffee.info>",
      to: ALERT_ADDRESS,
      subject: `[Soul auto-reply] ${subject}`,
      text: body,
    });
  } catch (error) {
    // An alert that cannot be sent must not take the run down with it.
    console.error("Could not send the alert email.", error);
  }
};
