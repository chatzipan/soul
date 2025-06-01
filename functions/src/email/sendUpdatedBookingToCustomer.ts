import * as fs from "fs";
import * as handlebars from "handlebars";
// @ts-ignore
import * as mjml2html from "mjml";
import * as path from "path";

import { Reservation } from "../types/reservation";
import { createEmailTransporter } from "../utils/email";
import { getEmailPrefix, getFormattedDate, getHost } from "./utils";

export const sendUpdatedBookingToCustomer = async (
  oldReservation: Reservation,
  newReservation: Reservation,
  id: string,
) => {
  const prefix = getEmailPrefix();
  const host = getHost();
  const cancelUrl = `${host}/reservations/cancel/${id}`;
  const editUrl = `${host}/reservations/edit/${id}`;
  const transporter = createEmailTransporter();
  const template = fs.readFileSync(
    path.join(__dirname, "./templates/reservation_customer_updated.mjml"),
    "utf8",
  );

  const parsed = handlebars.compile(template);
  const htmlBody = parsed({
    firstName: newReservation.firstName,
    lastName: newReservation.lastName,
    oldDate: getFormattedDate(oldReservation.date),
    oldTime: oldReservation.time,
    oldPersons: oldReservation.persons,
    oldNotes: oldReservation.notes,
    newDate: getFormattedDate(newReservation.date),
    newTime: newReservation.time,
    newPersons: newReservation.persons,
    newNotes: newReservation.notes,
    cancelUrl,
    editUrl,
  });

  const convertedMjml = mjml2html(htmlBody);

  transporter.sendMail({
    from: `${prefix}Soul Bookings <hallo@soulzuerich.ch>`,
    to: [newReservation.email],
    subject: `${prefix}Your reservation has been updated`,
    html: convertedMjml.html,
  });
};
