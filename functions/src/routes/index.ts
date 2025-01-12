import express = require("express");
import reservationRouter = require("./reservation");
import settingsRouter = require("./settings");

export const initRouter = (app: express.Application) => {
  app.use(express.json());

  // Mount all routes under the same base path
  app.use("/api/v1/settings", settingsRouter.protectedRoutes);
  app.use("/api/reservations/v1/public", reservationRouter.publicRoutes);
  app.use("/api/reservations/v1", reservationRouter.protectedRoutes);
};
