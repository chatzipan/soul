import * as moment from "moment-timezone";

import { db } from "..";
import { Reservation } from "../types/reservation";
import { createEmailTransporter } from "../utils/email";

export const sendReservationSummary = async (date: Date) => {
  const COLLECTION = "reservations";

  const transporter = createEmailTransporter();

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

    console.log(
      "Number of Reservations for the specified date:",
      reservations.length,
    );

    const emailContent = generateEmailContent(reservations, new Date(start));

    await transporter.sendMail({
      from: "Soul Bookings <hallo@soulzuerich.ch>",
      to: ["Soul Team <hallo@soulzuerich.ch>", "vchatzipan@gmail.com"],
      subject: `Reservations for ${moment(date)
        .tz("Europe/Zurich")
        .startOf("day")
        .format("MMMM D, YYYY")}`,
      html: emailContent,
    });

    console.log("Reservation summary email sent successfully.");
  } catch (error) {
    console.error("Error sending reservation summary:", error);
    throw error;
  }
};

const generateEmailContent = (reservations: any[], date: Date): string => {
  let content = `<h2><u>Reservations for today, ${moment(date)
    .tz("Europe/Zurich")
    .startOf("day")
    .format("MMMM D, YYYY")}:</u></h2>`;

  if (reservations.length === 0) {
    content += "<p>No reservations for today.</p>";
    return content;
  }

  content += "<ul>";

  reservations.forEach((reservation) => {
    const time = moment(new Date(reservation.date))
      .tz("Europe/Zurich")
      .format("HH:mm");
    const name =
      reservation.firstName +
      (reservation.lastName ? " " + reservation.lastName : "");

    content += `<li>
      ${time} - ${name} - 
      ${reservation.persons} people
      ${
        reservation.email
          ? ` - <a href="mailto:${reservation.email}">${reservation.email}</a>`
          : ""
      }
      ${
        reservation.telephone
          ? ` - <a href="tel:${reservation.telephone}">${reservation.telephone}</a>`
          : ""
      }
      ${reservation.notes ? ` - ${reservation.notes}` : ""}
    </li>`;
  });

  content += "</ul>";
  return content;
};
