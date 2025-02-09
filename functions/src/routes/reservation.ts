import { format } from "date-fns";

import { db } from "..";
import { Reservation } from "../types/reservation";

import moment = require("moment-timezone");

import nodemailer = require("nodemailer");

import express = require("express");

// Create separate routers for public and protected routes
const protectedRouter = express.Router();
const publicRouter = express.Router();
const COLLECTION = "reservations";

// Configure your email service (example using Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "v.chatzipanagiotis@soulcoffee.info",
    pass: process.env.GMAIL_PASSWORD,
  },
});

const generateCustomerEmail = ({
  firstName,
  lastName,
  date,
  time,
  persons,
}: {
  firstName: string;
  lastName: string;
  date: Date;
  time: string;
  persons: number;
}): string => {
  let content = `<h2>Reservation Confirmed!</h2>`;

  content += `<p>Dear ${firstName} ${lastName},</p>`;
  content += `<p>Thank you for your reservation!</p>`;
  content += `<p>Your reservation for ${persons} guests is confirmed for ${moment(
    date,
  )
    .tz("Europe/Zurich")
    .format("MMMM D, YYYY")} at ${time}.</p>`;

  content += `<p>We look forward to seeing you!</p>`;
  content += `<p>Best regards,</p>`;
  content += `<p>Soul Team</p>`;
  content += `<p>PS: If you have any questions, or need to change / cancel your reservation, please contact us at <a href="mailto:hallo@soulcoffee.info">hallo@soulcoffee.info</a></p>`;
  return content;
};

const generateAdminEmail = ({
  telephone,
  email,
  firstName,
  lastName,
  date,
  time,
  persons,
  notes,
}: {
  firstName: string;
  lastName: string;
  telephone: string;
  email: string;
  date: Date;
  time: string;
  persons: number;
  notes: string;
}): string => {
  let content = `<h2>New Reservation!</h2>`;

  content += `<p>Dear Admin,</p>`;
  content += `<p>A new reservation has been made for ${persons} guests on ${moment(
    date,
  )
    .tz("Europe/Zurich")
    .format("MMMM D, YYYY")} at ${time}.</p>`;

  content += `<p>Please find the reservation details below:</p>`;
  content += `<p>Name: ${firstName} ${lastName}</p>`;
  content += `<p>Date: ${moment(date)
    .tz("Europe/Zurich")
    .format("MMMM D, YYYY")}</p>`;
  content += `<p>Time: ${time}</p>`;
  content += `<p>Persons: ${persons}</p>`;
  content += `<p>Telephone: <a href="tel:${telephone}">${telephone}</a></p>`;
  content += `<p>Email: <a href="mailto:${email}">${email}</a></p>`;
  content += `<p>Notes: ${notes}</p>`;

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
  const writeResult = await db.collection(COLLECTION).add(req.body);

  const PREFIX = process.env.ENVIRONMENT === "dev" ? "TEST!!! -" : "";

  const { firstName, lastName, telephone, email, date, time, persons, notes } =
    req.body as Reservation;
  const isToday =
    format(new Date(date), "yyyy-MM-dd") ===
    moment.tz("Europe/Zurich").format("yyyy-MM-DD");

  const adminEmailContent = generateAdminEmail({
    date: new Date(date),
    persons,
    firstName,
    notes,
    lastName,
    telephone,
    email,
    time,
  });

  const emailContent = generateCustomerEmail({
    date: new Date(date),
    persons,
    firstName,
    lastName,
    time,
  });

  await transporter.sendMail({
    from: "Soul Bookings <hallo@soulcoffee.info>",
    to: [email],
    subject: `${PREFIX}Confirmation of your reservation`,
    html: emailContent,
  });

  await transporter.sendMail({
    from: "Soul Bookings <hallo@soulcoffee.info>",
    to: ["Soul Team <hallo@soulcoffee.info>", "vchatzipan@gmail.com"],
    subject: `${PREFIX}New Reservation for ${
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
