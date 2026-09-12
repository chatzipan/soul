/**
 * Runs one real email, or a whole folder of them, through the classifier and
 * the rule table. Prints what the job would decide and the exact reply.
 *
 * It never touches Gmail and never sends anything. The only thing it needs is
 * an Anthropic API key. Put it in functions/.env.secret.local:
 *
 *   ANTHROPIC_API_KEY=sk-ant-...
 *
 * That file is gitignored, and Firebase never reads or deploys it. An exported
 * shell variable wins over it if you have both.
 *
 *   npm run build
 *   npm run test:classifier                      # the sample folder
 *   npm run test:classifier -- path/to/mail.txt  # one file
 *   npm run test:classifier -- path/to/folder    # your own test set
 *
 * File format. Headers, a blank line, then the email as the customer wrote it:
 *
 *   From: Anna Meier <anna@example.ch>
 *   Subject: Tisch für Samstag
 *   Date: 2026-09-15 10:00
 *   Expect: reply
 *
 *   Grüezi, wir möchten am Samstag zu viert kommen...
 *
 * Date and Expect are optional. Expect is "reply" or "silent", and turns the
 * folder into the test set that issue #14 asks for.
 */
const fs = require("fs");
const path = require("path");

const lib = (name) => require(path.join(__dirname, "../lib", name));
const { classifyEmail } = lib("autoReply/classify");
const { decide } = lib("autoReply/decide");
const { buildRawReply } = lib("autoReply/buildRawReply");
const { getReplyText } = lib("email/autoReplyTexts");
const { addressOf } = lib("autoReply/gmail");
const { DEFAULT_EVENT_CUTOFF_HOUR } = lib("autoReply/constants");

/**
 * Reads functions/.env.secret.local, if it is there. Deliberately not
 * functions/.env: that file is uploaded with the deploy, so a key in it would
 * end up in the deployed function's config.
 */
const loadLocalSecrets = () => {
  const file = path.join(__dirname, "../.env.secret.local");
  if (!fs.existsSync(file)) return;

  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const at = trimmed.indexOf("=");
    if (at < 1) continue;

    const name = trimmed.slice(0, at).trim();
    const value = trimmed.slice(at + 1).trim().replace(/^["']|["']$/g, "");

    // An exported shell variable wins.
    if (!process.env[name]) process.env[name] = value;
  }
};

loadLocalSecrets();

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("ANTHROPIC_API_KEY is not set. Nothing to do.");
  console.error("");
  console.error("Put it in functions/.env.secret.local:");
  console.error("  ANTHROPIC_API_KEY=sk-ant-...");
  console.error("");
  console.error("Or export it in this shell:");
  console.error("  export ANTHROPIC_API_KEY=sk-ant-...");
  process.exit(1);
}

const parseEmail = (file) => {
  const raw = fs.readFileSync(file, "utf8");
  const split = raw.indexOf("\n\n");
  const headerBlock = split === -1 ? "" : raw.slice(0, split);
  const body = split === -1 ? raw : raw.slice(split + 2);

  const headers = {};
  for (const line of headerBlock.split("\n")) {
    const at = line.indexOf(":");
    if (at > 0) headers[line.slice(0, at).trim().toLowerCase()] = line.slice(at + 1).trim();
  }

  const from = headers.from || "Test Customer <customer@example.ch>";
  const receivedAt = headers.date ? Date.parse(headers.date) : Date.now();

  return {
    expect: (headers.expect || "").toLowerCase(),
    message: {
      id: path.basename(file),
      threadId: `thread-${path.basename(file)}`,
      rfcMessageId: `<${path.basename(file)}@example.ch>`,
      references: null,
      from,
      fromAddress: addressOf(from),
      to: "hallo@soulzuerich.ch",
      subject: headers.subject || "(no subject)",
      receivedAt: Number.isNaN(receivedAt) ? Date.now() : receivedAt,
      bodyText: body.trim(),
    },
  };
};

const collect = (target) => {
  const stat = fs.statSync(target);
  if (stat.isFile()) return [target];
  return fs
    .readdirSync(target)
    .filter((name) => name.endsWith(".txt"))
    .sort()
    .map((name) => path.join(target, name));
};

const run = async () => {
  const target = process.argv[2] || path.join(__dirname, "sample-emails");
  const files = collect(target);
  const results = [];

  for (const file of files) {
    const { message, expect } = parseEmail(file);
    console.log("=".repeat(72));
    console.log(`FILE     ${path.basename(file)}`);
    console.log(`SUBJECT  ${message.subject}`);
    console.log(`FROM     ${message.from}`);
    console.log("");

    let classification;
    try {
      classification = await classifyEmail(message);
    } catch (error) {
      console.log(`  classifier failed: ${error.message}\n`);
      results.push({ file, expect, got: "error", ok: false });
      continue;
    }

    const decision = decide(classification, DEFAULT_EVENT_CUTOFF_HOUR);
    const got = decision.send ? "reply" : "silent";

    console.log("  category      ", classification.category);
    console.log("  reason        ", classification.reason);
    console.log("  language      ", classification.language);
    console.log("  dates         ", classification.requestedDates.join(", ") || "(none)");
    console.log("  time          ", classification.requestedTime || "(none)");
    console.log("  party size    ", classification.partySize === null ? "(not said)" : classification.partySize);
    console.log("");
    console.log(`  DECISION       ${decision.send ? `REPLY, text ${decision.variant}` : `SILENT, because ${decision.disqualifier}`}`);

    if (expect) {
      const ok = got === expect;
      console.log(`  EXPECTED       ${expect}  -> ${ok ? "ok" : "MISMATCH"}`);
      results.push({ file, expect, got, ok });
    }

    if (decision.send) {
      const text = getReplyText(decision.variant);
      console.log("\n  --- the reply the customer would get ---");
      console.log(text.split("\n").map((line) => `  ${line}`).join("\n"));

      const mime = Buffer.from(buildRawReply(message, text), "base64url").toString("utf8");
      console.log("\n  --- headers ---");
      console.log(mime.split("\r\n\r\n")[0].split("\r\n").map((line) => `  ${line}`).join("\n"));
    }
    console.log("");
  }

  if (results.length) {
    const wrong = results.filter((r) => !r.ok);
    console.log("=".repeat(72));
    console.log(`${results.length - wrong.length} of ${results.length} emails matched what you expected.`);
    for (const r of wrong) {
      console.log(`  MISMATCH  ${path.basename(r.file)}: expected ${r.expect}, got ${r.got}`);
    }
    if (wrong.length) process.exit(1);
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
