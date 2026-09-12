import { initRouter } from "./routes";

import https = require("firebase-functions/v2/https");
import { getAuth } from "firebase-admin/auth";
import express = require("express");

// Side effect: starts the Firebase app before anything reads Firestore.
import "./db";

export { sendDailyReservationsSummary } from "./scheduledFunctions";
export { sendReservationReminders } from "./scheduledFunctions";
export { processIncomingEmails } from "./scheduledFunctions";

const app = express();

/**
 * Nothing but cloud functions may be exported from this file. firebase-functions
 * walks every other export looking for nested function groups, and a rich object
 * such as the Firestore client sends it into infinite recursion. See src/db.ts.
 */
const requireAuth = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  if (req.path.includes("/public")) {
    return next();
  }

  const tokenId = req.get("Authorization")?.split("Bearer ")[1] || "";

  try {
    await getAuth().verifyIdToken(tokenId);
    next();
  } catch (e) {
    res.status(401).send(e);
    return;
  }
};

// Apply auth middleware globally but with public route exclusion
app.use(requireAuth);

// Initialize routes
initRouter(app);

const supportedOrigins = [
  "http://localhost:8000",
  "https://develop.soulzuerich.ch",
  "https://soulzuerich.ch",
];

// Expose Express API as a single Cloud Function:
const api = https.onRequest(
  {
    cors: supportedOrigins,
    memory: "1GiB",
  },
  app,
);

export { api };
