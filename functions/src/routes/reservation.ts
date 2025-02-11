import { format } from "date-fns";
import * as moment from "moment-timezone";

import { db } from "..";
import { Reservation } from "../types/reservation";
import { createEmailTransporter } from "../utils/email";

import express = require("express");

// Create separate routers for public and protected routes
const protectedRouter = express.Router();
const publicRouter = express.Router();
const COLLECTION = "reservations";

const generateCustomerEmail = ({
  date,
  firstName,
  isToday,
  lastName,
  notes,
  time,
  persons,
}: {
  date: Date;
  firstName: string;
  lastName: string;
  isToday: boolean;
  notes: string;
  persons: number;
  time: string;
}): string => {
  let content = `<h2>Reservation Confirmed!</h2>`;

  content += `<p>Dear ${firstName} ${lastName},</p>`;
  content += `<p>Thank you for your reservation!</p>`;
  content += `<p>Your reservation for <b>${persons}</b> guests is confirmed for <b>${
    isToday ? "Today" : moment(date).tz("Europe/Zurich").format("MMMM D, YYYY")
  }</b> at <b>${time}</b>.</p>`;

  if (notes) {
    content += `<p>Notes: <b>${notes}</b></p>`;
  }

  content += `<p>We look forward to seeing you!</p>`;
  content += `<br />`;
  content += `<p>Best regards,</p>`;
  content += `<p>Soul Team</p>`;
  content += `<p>PS: If you have any questions, or need to change / cancel your reservation, please contact us at <a href="mailto:hallo@soulcoffee.info">hallo@soulcoffee.info</a></p>`;
  return content;
};

const generateAdminEmail = ({
  bookingType,
  telephone,
  email,
  firstName,
  lastName,
  date,
  time,
  persons,
  notes,
  isToday,
}: {
  firstName: string;
  lastName: string;
  telephone: string;
  email: string;
  date: Date;
  time: string;
  persons: number;
  notes: string;
  bookingType: string;
  isToday: boolean;
}): string => {
  let content = `<h2>New ${bookingType} Reservation!</h2>`;

  content += `<p>Dear Admin,</p>`;
  content += `<p>A new <b>${bookingType}</b> reservation has been made for <b>${
    isToday ? "TODAY" : moment(date).tz("Europe/Zurich").format("MMMM D, YYYY")
  }</b> at <b>${time}</b> for <b>${persons}</b> guests.</p>`;

  content += `<p>Please find the reservation details below:</p>`;
  content += `<p>Name: <b>${firstName} ${lastName}</b></p>`;
  content += `<p>Date: <b>${moment(date)
    .tz("Europe/Zurich")
    .format("MMMM D, YYYY")}</b></p>`;
  content += `<p>Time: <b>${time}</b></p>`;
  content += `<p>Persons: <b>${persons}</b></p>`;
  content += `<p>Telephone: <a href="tel:${telephone}">${telephone}</a></p>`;
  content += `<p>Email: <a href="mailto:${email}">${email}</a></p>`;

  if (notes) {
    content += `<p>Notes: <b>${notes}</b></p>`;
  }

  return content;
};

// Public routes
publicRouter.get("/events", async (_, res) => {
  try {
    const allEntries: Reservation[] = [];
    const querySnapshot = await db.collection(COLLECTION).get();
    querySnapshot.forEach((doc) =>
      allEntries.push({ ...doc.data(), id: doc.id } as Reservation),
    );

    return res
      .status(200)
      .json(allEntries.filter((reservation) => reservation.isOwnEvent));
  } catch (error) {
    return res.status(500).json("We found an error fetching your request!");
  }
});

publicRouter.post("/", async (req, res) => {
  try {
    const { bookingType, ...rest } = req.body as Reservation & {
      bookingType: string;
    };
    const writeResult = await db.collection(COLLECTION).add(rest);
    console.log("process.env.ENVIRONMENT", process.env.ENVIRONMENT);
    console.log("process.env.ENV", process.env.ENV);
    const PREFIX = process.env.ENVIRONMENT === "dev" ? "TEST!!! -" : "";
    // Use the shared email configuration
    const transporter = createEmailTransporter();

    const {
      firstName,
      lastName,
      telephone,
      email,
      date,
      time,
      persons,
      notes,
    } = req.body as Reservation;
    const isToday =
      format(new Date(date), "yyyy-MM-dd") ===
      moment.tz("Europe/Zurich").format("yyyy-MM-DD");

    const adminEmailContent = generateAdminEmail({
      bookingType,
      date: new Date(date),
      email,
      isToday,
      firstName,
      notes,
      lastName,
      persons,
      telephone,
      time,
    });

    const emailContent = generateCustomerEmail({
      date: new Date(date),
      persons,
      firstName,
      lastName,
      isToday,
      notes,
      time,
    });

    transporter.sendMail({
      from: "Soul Bookings <hallo@soulcoffee.info>",
      to: [email],
      subject: `${PREFIX}Confirmation of your reservation`,
      html: emailContent,
    });

    transporter.sendMail({
      from: "Soul Bookings <hallo@soulcoffee.info>",
      to: ["Soul Team <hallo@soulcoffee.info>", "vchatzipan@gmail.com"],
      subject: `${PREFIX}New ${bookingType} Reservation for ${
        isToday
          ? "Today"
          : moment(date).tz("Europe/Zurich").format("MMMM D, YYYY")
      }`,
      html: adminEmailContent,
    });

    return res.json({
      id: writeResult.id,
      success: true,
    });
  } catch (error) {
    console.error("Error creating reservation:", error);
    return res.status(500).json("We found an error processing your request!");
  }
});

// Protected routes
protectedRouter.get("/", async (_, res) => {
  try {
    const allEntries: Reservation[] = [];
    const querySnapshot = await db.collection(COLLECTION).get();
    querySnapshot.forEach((doc) =>
      allEntries.push({ ...doc.data(), id: doc.id } as Reservation),
    );

    return res.status(200).json(allEntries);
  } catch (error) {
    return res.status(500).json("We found an error fetching your request!");
  }
});

protectedRouter.get("/:id", (req, res) =>
  db
    .collection(COLLECTION)
    .doc(req.params.id)
    .get()
    .then((doc) => res.status(200).json(doc.data()))
    .catch(() =>
      res.status(500).json("We found an error fetching your request!"),
    ),
);

protectedRouter.post("/", async (req, res) => {
  const writeResult = await db.collection(COLLECTION).add(req.body);

  return res.json({
    id: writeResult.id,
    success: true,
  });
});

protectedRouter.put("/:id", (req, res) =>
  db
    .collection(COLLECTION)
    .doc(req.params.id)
    .update(req.body)
    .then(() => res.status(200).json("Updated"))
    .catch(() =>
      res.status(500).json("We found an error updating your request!"),
    ),
);

protectedRouter.delete("/:id", (req, res) =>
  db
    .collection(COLLECTION)
    .doc(req.params.id)
    .delete()
    .then(() => res.status(200).json("Deleted"))
    .catch(() =>
      res.status(500).json("We found an error deleting your request!"),
    ),
);

export const publicRoutes = publicRouter;
export const protectedRoutes = protectedRouter;
