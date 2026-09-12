import { onSchedule } from "firebase-functions/v2/scheduler";

import { runAutoReply } from "../autoReply/run";
import { anthropicApiKey } from "../autoReply/secrets";

/**
 * Reads the Bot Mailbox every 15 minutes and answers weekend reservation
 * requests by itself. See AUTO_REPLY_SPEC.md section 4.
 *
 * retryCount is 0 on purpose. The next run 15 minutes later is the retry.
 * A Cloud Scheduler retry would risk sending a second reply.
 */
export const processIncomingEmails = onSchedule(
  {
    schedule: "*/15 * * * *",
    timeZone: "Europe/Zurich",
    retryCount: 0,
    timeoutSeconds: 300,
    memory: "512MiB",
    secrets: [anthropicApiKey],
  },
  async () => {
    if (process.env.ENVIRONMENT === "dev") {
      return;
    }

    await runAutoReply();
  },
);
