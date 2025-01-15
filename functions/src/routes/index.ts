import express = require("express");
import reservationRouter = require("./reservation");
import settingsRouter = require("./settings");

export const initRouter = (app: express.Application) => {
  app.use(express.json());

  app.use("/api/v1/settings", settingsRouter.protectedRoutes);
  app.use("/api/public/v1/settings", settingsRouter.publicRoutes);

  app.use("/api/v1/public/reservations", reservationRouter.publicRoutes);
  app.use("/api/v1/reservations", reservationRouter.protectedRoutes);
};
