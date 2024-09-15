import { onRequest } from "firebase-functions/v2/https";
import { sendReservationSummary } from "./scheduledFunctions/reservationEmail";

export const testSendReservationSummary = onRequest(async (req, res) => {
  const testDate = req.query.date
    ? new Date(req.query.date as string)
    : new Date();

  try {
    await sendReservationSummary(testDate);
    res.status(200).send("Reservation summary sent successfully");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error sending reservation summary");
  }
});
