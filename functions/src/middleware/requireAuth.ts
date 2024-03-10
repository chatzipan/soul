// import express = require("express");

// import { fb } from "..";

// export const requireAuth = async (
//   req: express.Request,
//   res: express.Response,
//   next: express.NextFunction
// ) => {
//   const tokenId = req.get("Authorization")?.split("Bearer ")[1] || "";
//   try {
//     await fb.auth().verifyIdToken(tokenId);
//     next();
//   } catch (e) {
//     res.status(401).send(e);
//     return;
//   }
// };
