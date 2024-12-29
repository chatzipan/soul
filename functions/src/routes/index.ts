import express = require("express");
import reservationRouter = require("./reservation");

export const initRouter = (app: express.Application) => {
  app.use(express.json());

  // Mount all routes under the same base path
  app.use("/api/reservations/v1/public", reservationRouter.publicRoutes);
  app.use("/api/reservations/v1", reservationRouter.protectedRoutes);
};
