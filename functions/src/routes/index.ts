import express = require("express");
import reservationRouter = require("./reservation");
import settingsRouter = require("./settings");
import menuRouter = require("./menu");

export const initRouter = (app: express.Application) => {
  app.use(express.json());

  app.use("/api/v1/settings", settingsRouter.protectedRoutes);
  app.use("/api/v1/reservations", reservationRouter.protectedRoutes);
  app.use("/api/v1/menu", menuRouter.protectedRoutes);

  app.use("/api/v1/public/settings", settingsRouter.publicRoutes);
  app.use("/api/v1/public/reservations", reservationRouter.publicRoutes);
};
