import express = require("express");
import { db } from "..";
import { DayOfWeek, RestaurantSettings } from "../types/settings";

// Create separate routers for public and protected routes
const protectedRouter = express.Router();
const COLLECTION = "settings";
const SETTINGS_DOC_ID = "global";

const defaultSettings: RestaurantSettings = {
  maxCapacity: 20,
  slotDuration: 60,
  openingDays: {
    [DayOfWeek.Monday]: {
      openingHours: { start: "09:00", end: "17:00" },
      isOpen: true,
    },
    [DayOfWeek.Tuesday]: {
      openingHours: { start: "09:00", end: "17:00" },
      isOpen: true,
    },
    [DayOfWeek.Wednesday]: {
      openingHours: { start: "09:00", end: "17:00" },
      isOpen: true,
    },
    [DayOfWeek.Thursday]: {
      openingHours: { start: "09:00", end: "17:00" },
      isOpen: true,
    },
    [DayOfWeek.Friday]: {
      openingHours: { start: "09:00", end: "17:00" },
      isOpen: true,
    },
    [DayOfWeek.Saturday]: {
      openingHours: { start: "09:00", end: "17:00" },
      isOpen: true,
    },
    [DayOfWeek.Sunday]: {
      openingHours: { start: "09:00", end: "17:00" },
      isOpen: true,
    },
  },
};

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

// Export as an object to match the reservation router pattern
export const protectedRoutes = protectedRouter;
