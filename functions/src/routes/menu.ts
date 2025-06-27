import { updateMenu } from "../utils/menu";

import express = require("express");

const protectedRouter = express.Router();

// Protected routes
protectedRouter.post("/", async (req, res) => {
  try {
    console.log("Updating menu!");
    const result = await updateMenu();
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error updating menu:", error);
    return res.status(500).json({
      message: "Error updating menu",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export const protectedRoutes = protectedRouter;
