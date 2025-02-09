import { db } from "..";
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
    },
    [DayOfWeek.Tuesday]: {
      isOpen: true,
      openingHours: { start: "09:00", end: "17:00" },
    },
    [DayOfWeek.Wednesday]: {
      isOpen: true,
      openingHours: { start: "09:00", end: "17:00" },
    },
    [DayOfWeek.Thursday]: {
      isOpen: true,
      openingHours: { start: "09:00", end: "17:00" },
    },
    [DayOfWeek.Friday]: {
      isOpen: true,
      openingHours: { start: "09:00", end: "17:00" },
    },
    [DayOfWeek.Saturday]: {
      isOpen: true,
      openingHours: { start: "09:00", end: "17:00" },
    },
    [DayOfWeek.Sunday]: {
      isOpen: true,
      openingHours: { start: "09:00", end: "17:00" },
    },
  },
  recurringBlocks: [],
  singleBlocks: [],
};

// Public routes
publicRouter.get("/opening-hours", async (_, res) => {
  try {
    const doc = await db.collection(COLLECTION).doc(SETTINGS_DOC_ID).get();
    const data = doc.data() as RestaurantSettings;
    return res.status(200).json(data);
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

export const protectedRoutes = protectedRouter;
export const publicRoutes = publicRouter;
