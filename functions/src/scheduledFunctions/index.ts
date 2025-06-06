import { onSchedule } from "firebase-functions/v2/scheduler";

import { sendReservationSummary } from "./reservationEmail";
import { sendDailyReminders } from "./sendReminders";

export const sendDailyReservationsSummary = onSchedule(
  {
    schedule: "0 1 * * *", // Run at 1:00 AM every day
    timeZone: "Europe/Zurich", // Adjust to your timezone
    retryCount: 3, // Optional: number of retry attempts if the function fails
  },
  async () => {
    if (process.env.ENVIRONMENT === "dev") {
      return;
    }
    const today = new Date();
    await sendReservationSummary(today);
  },
);

export const sendReservationReminders = onSchedule(
  {
    schedule: "0 10 * * *", // Run at 10:00 (10:00 AM) every day
    timeZone: "Europe/Zurich",
    retryCount: 3,
  },
  async () => {
    // if (process.env.ENVIRONMENT === "dev") {
    //   return;
    // }
    const today = new Date();
    await sendDailyReminders(today);
  },
);
