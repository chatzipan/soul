import * as fs from "fs";
import * as handlebars from "handlebars";
// @ts-ignore
import * as mjml2html from "mjml";
import * as path from "path";

import { Reservation } from "../types/reservation";
import { createEmailTransporter } from "../utils/email";
import { getEmailPrefix, getFormattedDate } from "./utils";

export const sendBookingToAdmin = async (reservation: Reservation) => {
  const prefix = getEmailPrefix();
  const transporter = createEmailTransporter();
  const template = fs.readFileSync(
    path.join(__dirname, "./templates/reservation_admin.mjml"),
    "utf8",
  );

  const { date, ...rest } = reservation;
  const formattedDate = getFormattedDate(reservation.date);

  const parsed = handlebars.compile(template);
  const htmlBody = parsed({ ...rest, date: formattedDate });
  const convertedMjml = mjml2html(htmlBody);

  transporter.sendMail({
    from: `${prefix}Soul Bookings <hallo@soulzuerich.ch>`,
    to: ["Soul Team <hallo@soulzuerich.ch>"],
    subject: `${prefix}New ${reservation.bookingType} Reservation for ${formattedDate}`,
    html: convertedMjml.html,
  });
};
