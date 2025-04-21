import * as fs from "fs";
import * as handlebars from "handlebars";
// @ts-ignore
import * as mjml2html from "mjml";
import * as path from "path";

import { createEmailTransporter } from "../utils/email";

type Data = {
  date: string;
  email: string;
  persons: number;
  firstName: string;
  lastName: string;
  notes: string;
  time: string;
  id: string;
};

export const sendBookingToCustomer = async (data: Data) => {
  const PREFIX = process.env.ENVIRONMENT === "dev" ? "TEST!!! -  " : "";
  const host =
    process.env.ENVIRONMENT === "local"
      ? "http://localhost:8000"
      : process.env.ENVIRONMENT === "dev"
        ? "https://develop.soulzuerich.ch"
        : "https://soulzuerich.ch";
  const cancelUrl = `${host}/reservations/cancel/${data.id}`;
  const transporter = createEmailTransporter();
  const { email, ...rest } = data;
  const template = fs.readFileSync(
    path.join(__dirname, "./templates/reservation_customer.mjml"),
    "utf8",
  );

  const parsed = handlebars.compile(template);
  const htmlBody = parsed({ ...rest, cancelUrl });
  const convertedMjml = mjml2html(htmlBody);

  transporter.sendMail({
    from: `${PREFIX}Soul Bookings <hallo@soulzuerich.ch>`,
    to: [email],
    subject: `${PREFIX}Confirmation of your reservation`,
    html: convertedMjml.html,
  });
};
