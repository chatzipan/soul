import * as fs from "fs";
import * as handlebars from "handlebars";
// @ts-ignore
import * as mjml2html from "mjml";
import * as path from "path";

import { Reservation } from "../types/reservation";
import { createEmailTransporter } from "../utils/email";
import { getFormattedDate } from "./utils";

export const sendBookingToCustomer = async (
  reservation: Reservation,
  id: string,
) => {
  const PREFIX = ["dev", "local"].includes(process.env.ENVIRONMENT || "")
    ? "TEST!!! -  "
    : "";

  const host =
    process.env.ENVIRONMENT === "local"
      ? "http://localhost:8000"
      : process.env.ENVIRONMENT === "dev"
        ? "https://develop.soulzuerich.ch"
        : "https://soulzuerich.ch";
  const cancelUrl = `${host}/reservations/cancel/${id}`;
  const editUrl = `${host}/reservations/edit/${id}`;
  const transporter = createEmailTransporter();
  const template = fs.readFileSync(
    path.join(__dirname, "./templates/reservation_customer.mjml"),
    "utf8",
  );

  const { date, ...rest } = reservation;
  const formattedDate = getFormattedDate(reservation.date);

  const parsed = handlebars.compile(template);
  const htmlBody = parsed({ ...rest, cancelUrl, date: formattedDate, editUrl });
  const convertedMjml = mjml2html(htmlBody);

  transporter.sendMail({
    from: `${PREFIX}Soul Bookings <hallo@soulzuerich.ch>`,
    to: [reservation.email],
    subject: `${PREFIX}Confirmation of your reservation`,
    html: convertedMjml.html,
  });
};
