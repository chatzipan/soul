import { onRequest } from "firebase-functions/v2/https";

import { sendDailyReminders } from "./scheduledFunctions/sendReminders";

export const testReminder = onRequest(async (req, res) => {
  const testDate = new Date();
  try {
    await sendDailyReminders(testDate);
    res.status(200).send("Reservation summary sent successfully");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error sending reservation summary");
  }
});
