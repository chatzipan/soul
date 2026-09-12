import moment from "moment-timezone";

import { db } from "../db";
import { SETTINGS_DOC_ID as AUTO_REPLY_DOC_ID } from "../autoReply/constants";
import { getAutoReplySettings } from "../autoReply/settings";
import { AutoReplySettings } from "../types/autoReply";
import { Reservation } from "../types/reservation";
import { DayOfWeek, RestaurantSettings } from "../types/settings";

import express = require("express");

// Create separate routers for public and protected routes
const protectedRouter = express.Router();
const publicRouter = express.Router();

const COLLECTION = "settings";
const SETTINGS_DOC_ID = "global";

const defaultSettings: RestaurantSettings = {
  maxCapacity: 20,
  timeSlotDuration: 60,
  openingDays: {
    [DayOfWeek.Monday]: {
      isOpen: true,
      openingHours: { start: "09:00", end: "17:00" },
      offersDinner: false,
    },
    [DayOfWeek.Tuesday]: {
      isOpen: true,
      openingHours: { start: "09:00", end: "17:00" },
      offersDinner: false,
    },
    [DayOfWeek.Wednesday]: {
      isOpen: true,
      openingHours: { start: "09:00", end: "17:00" },
      offersDinner: false,
    },
    [DayOfWeek.Thursday]: {
      isOpen: true,
      openingHours: { start: "09:00", end: "17:00" },
      offersDinner: true,
    },
    [DayOfWeek.Friday]: {
      isOpen: true,
      openingHours: { start: "09:00", end: "17:00" },
      offersDinner: true,
    },
    [DayOfWeek.Saturday]: {
      isOpen: true,
      openingHours: { start: "09:00", end: "17:00" },
      offersDinner: true,
    },
    [DayOfWeek.Sunday]: {
      isOpen: true,
      openingHours: { start: "09:00", end: "17:00" },
      offersDinner: false,
    },
  },
  recurringBlocks: [],
  singleBlocks: [],
};

// Public routes
publicRouter.get("/opening-hours", async (_, res) => {
  try {
    // Get settings
    const doc = await db.collection(COLLECTION).doc(SETTINGS_DOC_ID).get();
    const settings = doc.data() as RestaurantSettings;

    // Get future reservations
    const now = moment.tz("Europe/Zurich");
    const startOfToday = now.startOf("day").valueOf();

    const reservationsSnapshot = await db
      .collection("reservations")
      .where("date", ">=", startOfToday)
      .where("canceled", "==", false)
      .get();

    const reservations = reservationsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Reservation[];

    // Group reservations by date
    const reservationsByDate = new Map<string, Reservation[]>();

    reservations.forEach((reservation) => {
      const date = moment(reservation.date).format("YYYY-MM-DD");
      if (!reservationsByDate.has(date)) {
        reservationsByDate.set(date, []);
      }
      reservationsByDate.get(date)?.push(reservation);
    });

    // Find blocked slots for each date
    const blockedSlots = [];

    for (const [date, dateReservations] of reservationsByDate.entries()) {
      // Sort reservations by time
      dateReservations.sort((a, b) => {
        const timeA = moment.tz(
          `${date} ${a.time}`,
          "YYYY-MM-DD HH:mm",
          "Europe/Zurich",
        );
        const timeB = moment.tz(
          `${date} ${b.time}`,
          "YYYY-MM-DD HH:mm",
          "Europe/Zurich",
        );
        return timeA.valueOf() - timeB.valueOf();
      });

      // Check each minute of the day for overlapping reservations
      const dayStart = moment.tz(
        `${date} 00:00`,
        "YYYY-MM-DD HH:mm",
        "Europe/Zurich",
      );
      const dayEnd = moment.tz(
        `${date} 23:59`,
        "YYYY-MM-DD HH:mm",
        "Europe/Zurich",
      );

      const currentTime = dayStart.clone();
      let blockStart: moment.Moment | null = null;

      while (currentTime.isBefore(dayEnd)) {
        // Find all reservations that overlap with current time
        const overlappingReservations = dateReservations.filter(
          (reservation) => {
            const resStart = moment.tz(
              `${date} ${reservation.time}`,
              "YYYY-MM-DD HH:mm",
              "Europe/Zurich",
            );
            const resEnd = resStart
              .clone()
              .add(settings.timeSlotDuration, "minutes");
            return currentTime.isBetween(resStart, resEnd, undefined, "[)");
          },
        );

        // Calculate total persons at current time
        const totalPersons = overlappingReservations.reduce(
          (sum, res) => sum + res.persons,
          0,
        );

        if (totalPersons >= settings.maxCapacity) {
          // Start a new block if we haven't started one
          if (!blockStart) {
            blockStart = currentTime.clone();
          }
        } else if (blockStart) {
          // End the current block and add it
          blockedSlots.push({
            date,
            start: blockStart.format("HH:mm"),
            end: currentTime.format("HH:mm"),
          });
          blockStart = null;
        }

        currentTime.add(1, "minute");
      }

      // Don't forget to add the last block if we have one
      if (blockStart) {
        blockedSlots.push({
          date,
          start: blockStart.format("HH:mm"),
          end: currentTime.format("HH:mm"),
        });
      }
    }

    // Add the blocked slots to the settings response
    const settingsWithBlocks = {
      ...settings,
      singleBlocks: [
        // Filter out past single blocks
        ...settings.singleBlocks,
        ...blockedSlots,
      ],
    };

    return res.status(200).json(settingsWithBlocks);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return res.status(500).json("Error fetching settings");
  }
});

// Protected routes
protectedRouter.get("/", async (_, res) => {
  try {
    const doc = await db.collection(COLLECTION).doc(SETTINGS_DOC_ID).get();
    const data = doc.data() as RestaurantSettings;

    if (!doc.exists) {
      // Return default settings if no settings document exists
      return res.status(200).json(defaultSettings);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return res.status(500).json("Error fetching settings");
  }
});

protectedRouter.put("/", async (req, res) => {
  try {
    const docRef = db.collection(COLLECTION).doc(SETTINGS_DOC_ID);
    const doc = await docRef.get();

    if (!doc.exists) {
      await docRef.set(req.body);
    } else {
      await docRef.update(req.body);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating settings:", error);
    return res.status(500).json("Error updating settings");
  }
});

/**
 * The weekend auto-reply job's own settings. A different document from the
 * restaurant settings above, on purpose: these are safety switches, not
 * opening hours. See AUTO_REPLY_SPEC.md section 9.
 */
protectedRouter.get("/auto-reply", async (_, res) => {
  try {
    // The same reader the job itself uses, so the screen shows exactly what
    // the job sees, defaults included.
    return res.status(200).json(await getAutoReplySettings());
  } catch (error) {
    console.error("Error fetching auto-reply settings:", error);
    return res.status(500).json("Error fetching auto-reply settings");
  }
});

protectedRouter.put("/auto-reply", async (req, res) => {
  try {
    const body = req.body || {};
    const update: Partial<AutoReplySettings> = {};

    // Only these four fields can be written. Anything else is ignored.
    if (typeof body.enabled === "boolean") {
      update.enabled = body.enabled;
    }

    if (typeof body.dryRun === "boolean") {
      update.dryRun = body.dryRun;
    }

    if (body.goLiveDate === null || typeof body.goLiveDate === "number") {
      update.goLiveDate = body.goLiveDate;
    }

    if (
      typeof body.eventCutoffHour === "number" &&
      Number.isInteger(body.eventCutoffHour) &&
      body.eventCutoffHour >= 0 &&
      body.eventCutoffHour <= 23
    ) {
      update.eventCutoffHour = body.eventCutoffHour;
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json("Nothing valid to update");
    }

    const docRef = db.collection(COLLECTION).doc(AUTO_REPLY_DOC_ID);
    const doc = await docRef.get();

    if (!doc.exists) {
      await docRef.set(update);
    } else {
      await docRef.update(update);
    }

    return res.status(200).json(await getAutoReplySettings());
  } catch (error) {
    console.error("Error updating auto-reply settings:", error);
    return res.status(500).json("Error updating auto-reply settings");
  }
});

export const protectedRoutes = protectedRouter;
export const publicRoutes = publicRouter;
