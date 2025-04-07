import { format } from "date-fns";
import * as moment from "moment-timezone";

import { db } from "..";
import { sendBookingToAdmin } from "../email/sendBookingToAdmin";
import { sendBookingToCustomer } from "../email/sendBookingToCustomer";
import { Reservation } from "../types/reservation";

import express = require("express");

// Create separate routers for public and protected routes
const protectedRouter = express.Router();
const publicRouter = express.Router();
const COLLECTION = "reservations";

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

// Get a single reservation by ID
publicRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection(COLLECTION).doc(id).get();

    if (!doc.exists) {
      return res.status(404).json("Reservation not found");
    }

    return res.status(200).json({ ...doc.data(), id: doc.id });
  } catch (error) {
    console.error("Error fetching reservation:", error);
    return res.status(500).json("We found an error fetching your request!");
  }
});

// Cancel a reservation
publicRouter.post("/cancel", async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json("Reservation ID is required");
    }

    const docRef = db.collection(COLLECTION).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json("Reservation not found");
    }

    await docRef.update({ canceled: true });

    return res
      .status(200)
      .json({ success: true, message: "Reservation canceled successfully" });
  } catch (error) {
    console.error("Error canceling reservation:", error);
    return res.status(500).json("We found an error processing your request!");
  }
});

publicRouter.post("/", async (req, res) => {
  try {
    const { bookingType, ...rest } = req.body as Reservation & {
      bookingType: string;
    };
    const writeResult = await db.collection(COLLECTION).add(rest);

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

    const formattedDate = isToday
      ? "Today"
      : moment(new Date(date)).tz("Europe/Zurich").format("MMMM D, YYYY");

    sendBookingToCustomer({
      date: formattedDate,
      email,
      firstName,
      lastName,
      notes,
      persons,
      time,
    });

    sendBookingToAdmin({
      bookingType,
      date: formattedDate,
      email,
      isToday,
      firstName,
      notes,
      lastName,
      persons,
      telephone,
      time,
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
protectedRouter.get("/", async (req, res) => {
  try {
    const { dateFrom, dateUntil } = req.query;
    const dateFromNumber = dateFrom ? parseInt(dateFrom as string) : undefined;
    const dateUntilNumber = dateUntil
      ? parseInt(dateUntil as string)
      : undefined;

    const query = dateFromNumber
      ? db.collection(COLLECTION).where("date", ">=", dateFromNumber)
      : dateUntilNumber
        ? db.collection(COLLECTION).where("date", "<=", dateUntilNumber)
        : db.collection(COLLECTION).orderBy("date");

    const allEntries: Reservation[] = [];
    const querySnapshot = await query.get();
    querySnapshot.forEach((doc) =>
      allEntries.push({ ...doc.data(), id: doc.id } as Reservation),
    );

    return res.status(200).json(allEntries);
  } catch (error) {
    console.error("Error fetching reservations:", error);
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
