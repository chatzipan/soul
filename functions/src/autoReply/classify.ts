import Anthropic from "@anthropic-ai/sdk";
import moment from "moment-timezone";

import { Classification } from "../types/autoReply";
import { CLASSIFIER_MODEL, TIMEZONE } from "./constants";
import { InboundMessage } from "./gmail";
import { anthropicApiKey } from "./secrets";

/**
 * The model only labels the email. Our own code picks the reply.
 * The model never writes prose a customer reads.
 *
 * There is no confidence number. An explicit "unclear" category does that job,
 * and it always means a human answers. See AUTO_REPLY_SPEC.md section 6.
 */
const TOOL_NAME = "record_classification";

const inputSchema = {
  type: "object" as const,
  properties: {
    category: {
      type: "string",
      enum: [
        "plain_table_request",
        "event_enquiry",
        "not_our_case",
        "unclear",
      ],
      description: "What the email is asking for.",
    },
    reason: {
      type: "string",
      enum: [
        "weekend_request",
        "weekday_request",
        "no_specific_date",
        "mixed_days",
        "extra_question",
        "not_a_booking",
        "other_language",
        "supplier",
        "spam",
        "other",
      ],
      description: "Why you chose that category.",
    },
    language: {
      type: "string",
      enum: ["de", "en", "other"],
      description: "The language the customer wrote in.",
    },
    requestedDates: {
      type: "array",
      items: { type: "string" },
      description:
        "Every specific calendar date the email asks about, as YYYY-MM-DD. " +
        "Empty when no exact date can be pinned down.",
    },
    requestedTime: {
      type: "string",
      description:
        "The time of day asked for, as HH:mm in 24 hour form. " +
        "Empty string when no time is stated.",
    },
    partySize: {
      type: "integer",
      description: "Number of guests. 0 when the email does not say.",
    },
  },
  required: [
    "category",
    "reason",
    "language",
    "requestedDates",
    "requestedTime",
    "partySize",
  ],
};

const buildPrompt = (message: InboundMessage): string => {
  const received = moment(message.receivedAt).tz(TIMEZONE);

  return `You label incoming email for Soul Kitchen Bar, a restaurant in Zürich.

The restaurant does not take table reservations on Saturday or Sunday. It is
open every day from 08:00 to 18:00. Customers email anyway. Your job is to say
what each email is, so that a separate piece of code can decide what happens.
You never write a reply.

This email arrived on ${received.format("dddd, D MMMM YYYY")} at
${received.format("HH:mm")} in Zürich. Use that date to work out what any
relative day means, such as "this Saturday" or "next weekend".

Categories:

- plain_table_request: the customer asks for a table and nothing more.
- event_enquiry: the customer asks for something beyond seating a table. A
  birthday, a team event, a company apéro, a set menu, hiring the whole place,
  a wine tasting. Wanting a large group to eat together is a hint, not proof.
- not_our_case: not a request to book anything. A supplier, spam, a job
  application, a question about opening hours, a review.
- unclear: you cannot tell, OR the email asks anything else besides the
  booking. A question about the menu, parking, allergies, prices or access all
  count. Use reason "extra_question" for that case.

Rules you must follow:

- Only put a date in requestedDates when you can pin an exact calendar day.
  "This weekend" alone is not enough, so leave the list empty and use reason
  "no_specific_date".
- If the customer names both a weekday and a weekend day, list both dates and
  use reason "mixed_days".
- If the email is not written in German or English, set language to "other"
  and reason to "other_language".
- Never guess. "unclear" is always the safe answer.

The email:

From: ${message.from}
Subject: ${message.subject}

${message.bodyText.slice(0, 6000)}`;
};

const toTime = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return /^\d{1,2}:\d{2}$/.test(trimmed) ? trimmed : null;
};

const toDates = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is string =>
      typeof item === "string" && /^\d{4}-\d{2}-\d{2}$/.test(item.trim()),
  );
};

export const classifyEmail = async (
  message: InboundMessage,
): Promise<Classification> => {
  const client = new Anthropic({ apiKey: anthropicApiKey.value() });

  const response = await client.messages.create({
    model: CLASSIFIER_MODEL,
    max_tokens: 1024,
    // No temperature: claude-opus-5 rejects it. Determinism comes from the
    // fixed tool schema and tool_choice, not from a sampling setting.
    tools: [
      {
        name: TOOL_NAME,
        description: "Record how you labelled this email.",
        input_schema: inputSchema,
      },
    ],
    tool_choice: { type: "tool", name: TOOL_NAME },
    messages: [{ role: "user", content: buildPrompt(message) }],
  });

  const block = response.content.find(
    (item) => item.type === "tool_use" && item.name === TOOL_NAME,
  );

  if (!block || block.type !== "tool_use") {
    throw new Error("The classifier returned no structured answer.");
  }

  const raw = block.input as Record<string, unknown>;
  const partySize = typeof raw.partySize === "number" ? raw.partySize : 0;

  return {
    category: raw.category as Classification["category"],
    reason: raw.reason as Classification["reason"],
    language: raw.language as Classification["language"],
    requestedDates: toDates(raw.requestedDates),
    requestedTime: toTime(raw.requestedTime),
    partySize: partySize > 0 ? partySize : null,
  };
};
