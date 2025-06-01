import { format } from "date-fns";
import * as moment from "moment-timezone";

import { db } from "..";
import { sendBookingToAdmin } from "../email/sendBookingToAdmin";
import { sendBookingToCustomer } from "../email/sendBookingToCustomer";
import { sendCancelledBookingToAdmin } from "../email/sendCancelledBookingToAdmin";
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

publicRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const currentReservation = await db
    .collection(COLLECTION)
    .doc(id)
    .get()
    .then((doc) => doc.data());
  const { bookingType, ...rest } = req.body as Reservation & {
    bookingType: string;
  };
  console.log("currentReservation", currentReservation);

  await db.collection(COLLECTION).doc(id).update(rest);

  console.log("updatedReservation", req.body);
  return res.status(200).json("Updated");
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
    const data = doc.data() as Reservation;

    const isToday =
      format(new Date(data.date), "yyyy-MM-dd") ===
      moment.tz("Europe/Zurich").format("yyyy-MM-DD");

    const formattedDate = isToday
      ? "Today"
      : moment(new Date(data.date)).tz("Europe/Zurich").format("MMMM D, YYYY");

    sendCancelledBookingToAdmin({
      date: formattedDate,
      email: data.email,
      isToday,
      firstName: data.firstName,
      notes: data.notes,
      lastName: data.lastName,
      persons: data.persons,
      telephone: data.telephone,
      time: data.time,
    });

    return res
      .status(200)
      .json({ success: true, message: "Reservation canceled successfully" });
  } catch (error) {
    console.error("Error canceling reservation:", error);
    return res.status(500).json("We found an error processing your request!");
  }
});

// Create a reservation via our Homepage
publicRouter.post("/", async (req, res) => {
  try {
    const writeResult = await db
      .collection(COLLECTION)
      .add(req.body as Reservation);

    sendBookingToCustomer(req.body as Reservation, writeResult.id);

    sendBookingToAdmin(req.body as Reservation);

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
