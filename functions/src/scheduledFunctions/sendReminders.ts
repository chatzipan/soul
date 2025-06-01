import * as moment from "moment-timezone";

import { db } from "..";
import { sendBookingToCustomer } from "../email/sendBookingToCustomer";
import { Reservation } from "../types/reservation";

export const sendDailyReminders = async (date: Date) => {
  const COLLECTION = "reservations";

  // Get tomorrow's date range using the same logic as reservationEmail.ts

  const start = moment(date)
    .tz("Europe/Zurich")
    .startOf("day")
    .toDate()
    .getTime();

  const end = moment(start).add(1, "days").toDate().getTime();

  try {
    const snapshot = await db
      .collection(COLLECTION)
      .where("date", ">", start)
      .where("date", "<", end)
      .get();

    const reservations = (
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Reservation[]
    ).filter((reservation) => !reservation.canceled);

    console.log("Number of reservations for tomorrow:", reservations.length);

    // Send individual reminder emails
    for (const reservation of reservations) {
      if (!reservation.email) {
        console.log(
          `Skipping reminder for reservation ${reservation.id} - no email provided`,
        );
        continue;
      }

      try {
        await sendBookingToCustomer(reservation, reservation.id, true);
        console.log(`Reminder sent to ${reservation.email}`);
      } catch (error) {
        console.error(
          `Failed to send reminder to ${reservation.email}:`,
          error,
        );
      }
    }

    console.log("All reminders sent successfully.");
  } catch (error) {
    console.error("Error sending reminders:", error);
    throw error;
  }
};
