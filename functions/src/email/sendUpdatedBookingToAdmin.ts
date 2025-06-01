import * as fs from "fs";
import * as handlebars from "handlebars";
// @ts-ignore
import * as mjml2html from "mjml";
import * as path from "path";

import { Reservation } from "../types/reservation";
import { createEmailTransporter } from "../utils/email";
import { getEmailPrefix, getFormattedDate } from "./utils";

export const sendUpdatedBookingToAdmin = async (
  oldReservation: Reservation,
  newReservation: Reservation,
) => {
  const prefix = getEmailPrefix();
  const transporter = createEmailTransporter();
  const template = fs.readFileSync(
    path.join(__dirname, "./templates/reservation_admin_updated.mjml"),
    "utf8",
  );

  const parsed = handlebars.compile(template);
  const htmlBody = parsed({
    oldFirstName: oldReservation.firstName,
    oldLastName: oldReservation.lastName,
    oldDate: getFormattedDate(oldReservation.date),
    oldTime: oldReservation.time,
    oldPersons: oldReservation.persons,
    oldNotes: oldReservation.notes,
    newFirstName: newReservation.firstName,
    newLastName: newReservation.lastName,
    newDate: getFormattedDate(newReservation.date),
    newTime: newReservation.time,
    newPersons: newReservation.persons,
    newNotes: newReservation.notes,
  });

  const convertedMjml = mjml2html(htmlBody);

  transporter.sendMail({
    from: `${prefix}Soul Bookings <hallo@soulzuerich.ch>`,
    to: ["Soul Team <hallo@soulzuerich.ch>"],
    subject: `${prefix}Reservation updated for ${getFormattedDate(newReservation.date)}`,
    html: convertedMjml.html,
  });
};
