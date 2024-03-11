import express = require("express");
import reservationRouter = require("./reservation");

export const initRouter = (app: express.Application) => {
  app.use(express.json());

  app.use("/api/reservations/v1", reservationRouter.default);
};
