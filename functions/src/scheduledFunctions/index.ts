import { onSchedule } from "firebase-functions/v2/scheduler";
import { sendReservationSummary } from "./reservationEmail";

export const sendDailyReservationsSummary = onSchedule(
  {
    schedule: "0 1 * * *", // Run at 1:00 AM every day
    timeZone: "Europe/Zurich", // Adjust to your timezone
    retryCount: 3, // Optional: number of retry attempts if the function fails
  },
  async () => {
    const today = new Date();
    await sendReservationSummary(today);
  }
);
