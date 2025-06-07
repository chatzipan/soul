import * as fs from "fs";
import * as handlebars from "handlebars";
// @ts-ignore
import * as mjml2html from "mjml";
import * as path from "path";

import { Reservation } from "../types/reservation";
import { createEmailTransporter } from "../utils/email";
import { getEmailPrefix, getFormattedDate, getHost } from "./utils";

export const sendBookingToCustomer = async (
  reservation: Reservation,
  id: string,
  isReminder: boolean = false,
) => {
  const prefix = getEmailPrefix();
  const host = getHost();
  const cancelUrl = `${host}/reservations/cancel/${id}`;
  const editUrl = `${host}/reservations/edit/${id}`;
  const transporter = createEmailTransporter();
  const template = fs.readFileSync(
    path.join(
      __dirname,
      "./templates",
      isReminder ? "reservation_reminder.mjml" : "reservation_customer.mjml",
    ),
    "utf8",
  );

  const { date, ...rest } = reservation;
  const formattedDate = getFormattedDate(reservation.date);

  const parsed = handlebars.compile(template);
  const htmlBody = parsed({ ...rest, cancelUrl, date: formattedDate, editUrl });
  const convertedMjml = mjml2html(htmlBody);

  transporter.sendMail({
    from: `${prefix}Soul Bookings <hallo@soulzuerich.ch>`,
    to: [reservation.email],
    subject: isReminder
      ? `${prefix}Reminder: Your Reservation Tomorrow`
      : `${prefix}Confirmation of your reservation`,
    html: convertedMjml.html,
  });
};
