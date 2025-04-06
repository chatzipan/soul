import * as fs from "fs";
import * as handlebars from "handlebars";
// @ts-ignore
import * as mjml2html from "mjml";
import * as path from "path";

import { createEmailTransporter } from "../utils/email";

type Data = {
  bookingType: string;
  date: string;
  email: string;
  isToday: boolean;
  firstName: string;
  notes: string;
  lastName: string;
  persons: number;
  telephone: string;
  time: string;
};

export const sendBookingToAdmin = async (data: Data) => {
  const PREFIX = process.env.ENVIRONMENT === "dev" ? "TEST!!! -  " : "";
  const transporter = createEmailTransporter();
  const { email, ...rest } = data;
  const template = fs.readFileSync(
    path.join(__dirname, "./templates/reservation_admin.mjml"),
    "utf8",
  );

  const parsed = handlebars.compile(template);
  const htmlBody = parsed(rest);
  const convertedMjml = mjml2html(htmlBody);

  transporter.sendMail({
    from: `${PREFIX}Soul Bookings <hallo@soulzuerich.ch>`,
    to: ["Soul Team <hallo@soulzuerich.ch>"],
    subject: `${PREFIX}New ${data.bookingType} Reservation for ${data.date}`,
    html: convertedMjml.html,
  });
};
