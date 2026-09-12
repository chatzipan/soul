/**
 * Checks the rule table in src/autoReply/decide.ts.
 *
 * Needs nothing: no API key, no Gmail, no Firestore, no network.
 * Run it with:  npm run build && npm run test:rules
 */
const path = require("path");
const { decide } = require(path.join(__dirname, "../lib/autoReply/decide"));
const moment = require("moment-timezone");

const CUTOFF = 16;

// Pick three real days so the test does not depend on today's date.
const SAT = "2026-09-19";
const SUN = "2026-09-20";
const FRI = "2026-09-18";

const base = {
  category: "plain_table_request",
  reason: "weekend_request",
  language: "en",
  requestedDates: [SAT],
  requestedTime: null,
  partySize: 4,
};
const c = (over) => ({ ...base, ...over });

const cases = [
  // [name, classification, should it reply, which text]
  ["plain table, Sat, 4 people, no time", c({}), true, "en_small"],
  ["plain table, Sat, 20 people, no time", c({ partySize: 20 }), false, null],
  ["plain table, Sat, size unknown", c({ partySize: null }), true, "en_large"],
  ["plain table, Sat, asks for 20:00", c({ requestedTime: "20:00" }), true, "en_small"],
  ["plain table, Sun, German, 2", c({ requestedDates: [SUN], language: "de", partySize: 2 }), true, "de_small"],
  ["event, Sat, 14:00", c({ category: "event_enquiry", requestedTime: "14:00", partySize: 12 }), true, "en_large"],
  ["event, Sat, 16:00 exactly", c({ category: "event_enquiry", requestedTime: "16:00" }), false, null],
  ["event, Sat, 19:00", c({ category: "event_enquiry", requestedTime: "19:00" }), false, null],
  ["event, Sat, no time given", c({ category: "event_enquiry" }), false, null],
  ["14 people, Sat 19:30", c({ partySize: 14, requestedTime: "19:30" }), false, null],
  ["14 people, Sat 12:00", c({ partySize: 14, requestedTime: "12:00" }), true, "en_large"],
  ["14 people, Sat, no time", c({ partySize: 14 }), false, null],
  ["9 people, Sat 19:30", c({ partySize: 9, requestedTime: "19:30" }), true, "en_small"],
  ["Friday only", c({ requestedDates: [FRI] }), false, null],
  ["Friday or Saturday", c({ requestedDates: [FRI, SAT] }), false, null],
  ["no exact date", c({ requestedDates: [] }), false, null],
  ["written in French", c({ language: "other" }), false, null],
  ["classifier said unclear", c({ category: "unclear" }), false, null],
  ["asks a second question", c({ reason: "extra_question" }), false, null],
  ["not a booking at all", c({ category: "not_our_case" }), false, null],
];

console.log("Days used in these cases:");
for (const d of [FRI, SAT, SUN]) {
  console.log(`  ${d} is a ${moment.tz(d, "YYYY-MM-DD", "Europe/Zurich").format("dddd")}`);
}
console.log("");

let failed = 0;
for (const [name, classification, wantSend, wantVariant] of cases) {
  const got = decide(classification, CUTOFF);
  const ok = got.send === wantSend && got.variant === wantVariant;
  if (!ok) failed += 1;

  const outcome = got.send ? `replies (${got.variant})` : `silent (${got.disqualifier})`;
  console.log(`${ok ? "ok  " : "FAIL"}  ${name.padEnd(36)} ${outcome}`);
}

console.log("");
if (failed) {
  console.log(`${failed} of ${cases.length} cases are wrong.`);
  process.exit(1);
}
console.log(`All ${cases.length} cases behave as the spec says.`);
