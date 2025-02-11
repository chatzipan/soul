import * as nodemailer from "nodemailer";

export const createEmailTransporter = () => {
  const password = process.env.GMAIL_PASSWORD;

  if (!password) {
    throw new Error("GMAIL_PASSWORD environment variable is not set");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "v.chatzipanagiotis@soulcoffee.info",
      pass: password,
    },
  });
};
