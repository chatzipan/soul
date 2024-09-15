import https = require("firebase-functions/v2/https");
import admin = require("firebase-admin");
import express = require("express");

import { initRouter } from "./routes";

export { sendDailyReservationsSummary } from "./scheduledFunctions";
export { testSendReservationSummary } from "./testFunctions";

admin.initializeApp();

const app = express();
export const db = admin.firestore();

export const requireAuth = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const tokenId = req.get("Authorization")?.split("Bearer ")[1] || "";
  try {
    await admin.auth().verifyIdToken(tokenId);
    next();
  } catch (e) {
    res.status(401).send(e);
    return;
  }
};

app.use(requireAuth);

// Handle API endpoint routes
initRouter(app);

const supportedOrigins = [
  "http://localhost:8000",
  "https://develop.soulzuerich.ch",
  "https://soulzuerich.ch",
];

// Expose Express API as a single Cloud Function:
exports.api = https.onRequest({ cors: supportedOrigins }, app);
