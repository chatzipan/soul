# Weekend reservation auto-reply — build specification

**Status**: deployed to prod on 2026-09-12, switched on in dry run. The manual setup in section 2 is done. See section 11c for what is verified and what is not.
Two of the three open items are now decided. See section 12.
**Source**: [map #3](https://github.com/chatzipan/soul/issues/3) and its closed tickets. Every decision here was made and recorded there. Nothing needs re-asking.
**Vocabulary**: `CONTEXT.md` at the repo root. Terms in **bold** on first use are defined there.

---

## 1. The problem

Soul Kitchen Bar does not take reservations on Saturday and Sunday. The website says so. Customers email `hallo@soulzuerich.ch` asking anyway, roughly **1 to 2 times per week**.

Today a partner answers each one by hand. The owner wants that burden gone, without leaving mail unanswered.

This spec builds a scheduled job that reads the mail, spots those requests, and sends one reply in the customer's language. It also changes one block of website copy.

**It auto-sends.** There is no human approval step. That was chosen deliberately, with the risk understood.

---

## 2. Manual setup, before any code runs

All of this is admin console and DNS work. None of it can be done from the repo.

### 2.1 The bot mailbox — required

`hallo@soulzuerich.ch` is a **Google Group**. A Group has no inbox. No Google API can read one, and domain-wide delegation cannot impersonate one. So the job reads a real user mailbox that is subscribed to the group.

1. Create the Workspace user **`bot@soulcoffee.info`**. Needs a licence.
2. Add it to the `hallo@soulzuerich.ch` group.
3. Set its subscription to **"Each email"**. Not digest, not "no email".
4. Confirm the group's posting permission lets it post.
5. Add `hallo@soulzuerich.ch` as a **"Send mail as"** address on that mailbox.

**Step 5 works. Confirmed by the owner on 2026-09-12.** A test mail sent from the Bot Mailbox with `hallo@soulzuerich.ch` chosen as the From address arrived showing `hallo@soulzuerich.ch`. This was the one unproven step in the whole setup. The fallback below is no longer needed.

Fallback, kept only as a record of what the alternative was: send from `bot@soulcoffee.info`. The customer would then see a domain they never wrote to.

### 2.2 Domain-wide delegation — required

The job runs in the **prod** Firebase project `soul-web-prod`.

1. Create a service account in `soul-web-prod`.
2. Admin console → Security → Access and data control → API controls → Domain-wide delegation → add its client ID.
3. Scope: `https://www.googleapis.com/auth/gmail.modify`. This one scope covers read, send and labels. Nothing narrower works; nothing wider is needed.
4. Impersonate (`sub`): **`bot@soulcoffee.info`**. Must be a real user's primary address.

The **dev** project `elite-bird-404121` gets no Gmail scope. Nothing running in dev can read or send real customer mail.

Allow up to 24 hours for a new delegation entry to take effect. Requires super admin.

Prefer **no downloaded JSON key**. Grant the Cloud Function's own service account `roles/iam.serviceAccountTokenCreator` on the delegated service account and use `signJwt`. See `research/gmail-access.md` section 2.3.

5. **Enable two APIs** in `soul-web-prod`. Neither is on by default:
   - IAM Service Account Credentials: <https://console.cloud.google.com/apis/library/iamcredentials.googleapis.com?project=soul-web-prod>
   - Gmail: <https://console.cloud.google.com/apis/library/gmail.googleapis.com?project=soul-web-prod>

Step 5 is easy to miss and nothing warns you until the job actually runs. `signJwt` lives in the first API and the inbox read needs the second. Missing either one fails the whole run:

    IAM Service Account Credentials API has not been used in project
    947435703401 before or it is disabled.

    Gmail API has not been used in project 947435703401 before or it is
    disabled.

Both happened on 2026-09-12, one after the other, at the first dry runs. Allow a few minutes after enabling for each to take effect.

The other two APIs the job needs, Secret Manager and Cloud Scheduler, are switched on by the deploy itself.

**Useful detail about the order of failures.** The Gmail API error can only appear after the JWT has been signed and exchanged for an access token. So seeing it is proof that domain-wide delegation is set up correctly. A broken delegation fails earlier, with `unauthorized_client`.

### 2.3 The partners — required

The partners must **stop answering weekend reservation enquiries**.

This is the only thing preventing a double answer, and it is an agreement between people, not a rule in code. A partner replying by hand writes straight to the customer from their own address. No copy comes back to the group, so the job cannot see it, and rule R7 will not catch it.

Also ask them to press **Reply all** rather than Reply on any weekend mail they do answer, keeping `hallo@soulzuerich.ch` on the thread. That makes R7 work. It is requested, never relied on. No rule assumes it happened.

Members: `alexandros@soulcoffee.info`, `dimhal@soulcoffee.info`, `n.chalimourdas@soulcoffee.info`, `v.chatzipanagiotis@soulcoffee.info`.

### 2.4 Email authentication — wanted, not required

Neither `soulzuerich.ch` nor `soulcoffee.info` has SPF, DKIM or DMARC. DNS for both is at Netlify.

- **SPF**, both domains: TXT at `@`, value `v=spf1 include:_spf.google.com ~all`.
- **DKIM**, both domains: generate in Admin console → Apps → Google Workspace → Gmail → Authenticate email. 2048-bit, selector `google`. Publish at `google._domainkey`, then click **Start authentication**.
- **DMARC**: dropped. At `p=none` it changes nothing about delivery.

**This does not block go-live.** Mail from these domains already reaches customers without it, and the auto-reply is a reply inside a thread the customer started, which is the easiest case for a spam filter. See [#16](https://github.com/chatzipan/soul/issues/16).

---

## 3. The runtime change

`functions/package.json` pins Node 18, decommissioned 2025-10-30. Nothing in `functions/` can deploy until this is fixed. It ships in the **same deploy** as this feature, by the owner's decision.

### `functions/package.json`

| Field | From | To |
| --- | --- | --- |
| `engines.node` | `"18"` | `"22"` |
| `firebase-functions` | `^5.0.1` | `^7.3.2` |
| `firebase-admin` | `^11.8.0` | `^14.4.0` |
| `chrome-aws-lambda` | `^10.1.0` | **remove** |
| `playwright` | `^1.53.1` | **remove** |
| `eslint`, `@typescript-eslint` | 8 / 5 | unchanged |

Node 22, not 24: both are decommissioned on 2028-10-31, so 24 buys nothing. Node 20 is decommissioned 2026-10-30.

`functions.config()` is never called and every import is already from `firebase-functions/v2/...`, so `firebase-functions` v7 needed no code change.

**`firebase-admin` v14 was not as quiet as this spec first claimed.** Three things broke and were fixed:

| What broke | Fix |
| --- | --- |
| `admin.firestore()` and `admin.auth()` no longer exist on the root export | `getFirestore()` from `firebase-admin/firestore`, `getAuth()` from `firebase-admin/auth`, in `src/index.ts` |
| `firebase-functions` v7 types need `esModuleInterop` | added to `functions/tsconfig.json` |
| `esModuleInterop` then broke `import * as moment` in five files | changed to `import moment from "moment-timezone"` |

Also removed: **`firebase-functions-test`**. It was a devDependency with no tests using it, and even its newest version (3.5.0) caps at `firebase-admin` v13, so it blocked the install.

v14 requires Node 22 or higher.

### `functions/tsconfig.json`

`"target": "es2017"` → `"es2022"`. `module` stays `commonjs`.

### `functions/src/utils/menu/index.ts`

Delete the `playwright` import, the `chrome-aws-lambda` require, the `chromium.launch(...)` call and both `await browser.close()` calls. Keep everything else. The browser is launched and closed without ever opening a page — every line that used it is already commented out.

### Local

Install **Node 22**. The machine is on 20.11.1 and npm already warns.

### Check after deploy

Open soulzuerich.ch. The opening hours and the events list must both render. Both are fetched from the `api` Express function at page load. If it breaks, the page shows a spinner forever.

---

## 4. The job

One new scheduled function, **`processIncomingEmails`**.

**New file**: `functions/src/scheduledFunctions/processIncomingEmails.ts`
**Export from**: `functions/src/scheduledFunctions/index.ts`, then `functions/src/index.ts`

```ts
export const processIncomingEmails = onSchedule(
  {
    schedule: "*/15 * * * *",
    timeZone: "Europe/Zurich",
    retryCount: 0,
    timeoutSeconds: 300,
    memory: "512MiB",
  },
  async () => { /* ... */ },
);
```

Region stays `us-central1`, matching the existing functions.

`retryCount: 0` on purpose. The next run 15 minutes later is the retry. A Cloud Scheduler retry would risk a second send.

### Finding mail

Gmail query: **`in:inbox newer_than:4d`**.

Four days, not three, even though R4 refuses anything older than three. The extra day is margin: without it a message crossing the three-day line between runs would drop out of the search and never be recorded as skipped.

No `historyId`, no `users.watch` push. Polling was chosen because a stored `historyId` goes stale and returns 404, and a push subscription lapses silently unless renewed every 7 days.

The mailbox holds group mail and nothing else, so no `to:` filter is needed.

### Cost

96 runs per day. A quiet run costs 5 Gmail quota units against 6,000 per minute per mailbox. Roughly 480 units per day. Not a concern.

---

## 5. Per-message pipeline

**The order matters.** Do not reorder.

| Step | Check | On match |
| --- | --- | --- |
| 1 | `autoReply.enabled` is `false` | **Stop the whole run** (R1) |
| 2 | A Firestore record already exists for this thread | Skip silently (R6) |
| 3 | Sent from an **Own Address** — `hallo@soulzuerich.ch` **or** `bot@soulcoffee.info` | Skip silently (R3) |
| 4 | Message is **younger than 15 minutes** | Skip, **write NO record** |
| 5 | Message is older than 3 days | Record as skipped (R4) |
| 6 | Message arrived before `autoReply.goLiveDate` | Record as skipped (R5) |
| 7 | Thread holds more than one message | Record as skipped (R7) |
| 8 | — | Classify, apply the rule table in section 6 |
| 9 | 3 already sent this run, or 5 already today | **Stop the run**, alert (R8, R9) |
| 10 | — | Write record `sending`, send, set `sent` (R10, R13) |

**Step 4 is the one skip that writes no record.** A record there would match R6 on the next run and block that message forever. This is the easiest thing in the whole spec to get wrong.

**Step 2 before step 7** matters: our own Cc'd reply makes a handled thread two messages long, so R7 alone would give the right answer for the wrong reason.

The customer waits **15 to 30 minutes**, day and night.

---

## 6. Classification

One call to **`claude-opus-5`** with structured outputs. The model only **labels** the email. Our own code picks the reply. The model never writes prose.

There is **no confidence number** — the model documentation does not support a calibrated one. An explicit `unclear` category does that job, and it always means a human answers.

### What the model returns

| Field | Values |
| --- | --- |
| `category` | `plain_table_request`, `event_enquiry`, `not_our_case`, `unclear` |
| `reason` | `weekday_request`, `no_specific_date`, `mixed_days`, `extra_question`, `not_a_booking`, `other_language`, `supplier`, `spam`, `other` |
| `language` | `de`, `en`, `other` |
| `requestedDates` | list of specific calendar dates, empty if none can be pinned |
| `requestedTime` | time of day, or null |
| `partySize` | number, or null |

`reason` never changes what the job does. It exists so the skipped mail can be reviewed later.

### The rule

The agent acts **only** on an email about a Saturday or Sunday date.

| Kind | Party size | Time asked for | Action |
| --- | --- | --- | --- |
| **Plain Table Request** | under 10, or not stated | any, or none | **Auto-reply** |
| **Plain Table Request** | **10 or more** | before 16:00 | **Auto-reply** |
| **Plain Table Request** | **10 or more** | 16:00 or later | Human answers |
| **Plain Table Request** | **10 or more** | none given | Human answers |
| **Event Enquiry** | any | before 16:00 | **Auto-reply** |
| **Event Enquiry** | any | 16:00 or later | Human answers |
| **Event Enquiry** | any | none given | Human answers |

**A stated party of 10 or more is held to the Event Enquiry rules**, whatever the classifier called it. A table for 14 on a Saturday evening is worth too much to leave to a judgement. Party size is a plain fact in the email, so this check sits in `decide.ts`, not in the prompt.

A size that is **not stated** stays on the light path. Most emails do not give a number, and treating every one of them as an event would answer almost nothing.

The agent also stays silent when:

- no specific calendar date can be pinned ("this weekend" is not enough)
- a weekday is named alongside a weekend day ("Friday or Saturday")
- there is a second question in the email (menu, parking, dietary)
- `language` is `other`
- it is not a booking request ("are you open on Saturdays?" is a question about hours)
- `category` is `unclear`

`partySize` picks which of two wordings is sent. It never decides whether to send.

### The 16:00 **Cutoff**

- Stored as `eventCutoffHour` on `settings/autoReply`, defaulting to **16** in code when the field is missing. So it can be changed without a deploy, and a missing value cannot silently change the behaviour.
- It is a **decision the owner stated**, not a value read from `recurringBlocks`. Do **not** wire it to `recurringBlocks` without first checking the **prod** project. Prod `recurringBlocks` has never been read. The dev values are wrong.
- It affects **only** Event Enquiries. It has no effect on a Plain Table Request.
- **It is never written in a reply and never shown on the website.**

### The main risk

Telling an **Event Enquiry** from a **Plain Table Request** is a judgement, not a fact. "We are 14 people and would like to eat together on Saturday evening" sits between the two. A wrong call sends an automatic refusal to a paying event customer.

This is the single riskiest decision in the design and the main thing [the test set](https://github.com/chatzipan/soul/issues/14) must cover.

**It has now been seen, not just predicted.** On the sample set, "Wir sind 14 Personen und würden am Samstag gerne zusammen essen, so ab 19:30" was labelled a Plain Table Request, because it names no event word. The classifier was following the prompt, which says a large group wanting to eat together is a hint and not proof. The owner's call was that it must not be answered automatically.

The fix is the size rule above, in code. The prompt was left alone on purpose: a rule the model cannot get wrong beats a rule it has to judge.

---

## 7. The reply

Plain text. **No HTML, no MJML, no logo banner.** The existing templates in `functions/src/email/templates/` are not used here.

- `From: Soul Zürich <hallo@soulzuerich.ch>`
- `Subject:` `Re: ` plus the customer's subject, unchanged. R11 requires a matching subject to stay in the thread.
- `Cc: hallo@soulzuerich.ch` (R12)
- Signed `Soul Team`

Four texts. The only difference between the size variants is the walk-in line — telling a company of 30 to walk in is silly.

### English, under 10 people

```
Hello,

Thank you for your message.

We don't take bookings. Saturday and Sunday are our busiest days, and we keep
the tables free for guests who come by spontaneously. We are open every day
from 08:00 to 18:00, so you are very welcome to come by without a booking, and
we will find you a table as soon as we can.

If that doesn't work for you, just write back and we will take it from there.

Best regards,
Soul Team

—
This reply was sent automatically. If you answer, a person from our team will
read it.
```

### German, under 10 people

```
Grüezi

Vielen Dank für Ihre Nachricht.

Wir nehmen keine Reservationen an. Samstag und Sonntag sind unsere strengsten
Tage, und wir halten die Tische für spontane Gäste frei. Wir sind täglich von
08:00 bis 18:00 Uhr geöffnet. Kommen Sie gerne ohne Reservation vorbei, wir
finden so schnell wie möglich einen Tisch für Sie.

Falls das für Sie nicht passt, schreiben Sie uns einfach zurück, dann schauen
wir weiter.

Freundliche Grüsse
Soul Team

—
Diese Antwort wurde automatisch versendet. Wenn Sie antworten, meldet sich
jemand von uns persönlich.
```

### 10 or more, or size unknown

Same as above, but **drop the walk-in sentence** and replace the last line before the sign-off:

- **EN**: `If you had a particular time or occasion in mind, please write back with the details and the number of guests, and we will see what we can do.`
- **DE**: `Falls Sie eine bestimmte Zeit oder einen besonderen Anlass im Sinn haben, schreiben Sie uns bitte mit den Details und der Personenzahl zurück, dann schauen wir, was möglich ist.`

### Rules the text obeys

- **16:00 is never written.** The public facts are: no bookings Saturday and Sunday, open 08:00 to 18:00 every day.
- The opening-hours sentence is what makes one text correct for every requested time. A customer asking for 20:00 reads "08:00 to 18:00" and understands. A customer asking for 11:00 reads it and it is simply true.
- **The last line is load-bearing.** It is the customer's way back in if the classifier called an event a plain table. Do not make it sound like a brush-off.
- **Never link the booking form.** It is disabled on purpose.
- The reply states it was sent automatically, and promises a person will read any answer.

### German conventions

`Reservation`, never `Reservierung`. `ss`, never `ß`. `Grüezi` alone, not `Sehr geehrte Damen und Herren`. `streng` for busy is normal Swiss German.

---

## 8. Safety rules

All twenty are testable. **R3 is corrected** from its original wording.

### Before the run

| # | Rule |
| --- | --- |
| R1 | Read `autoReply.enabled`. If `false`, stop. Do nothing else. |
| R2 | Read `autoReply.dryRun`. If `true`, do every step except the Gmail send. |

### Which messages are looked at

| # | Rule |
| --- | --- |
| R3 | Skip any message sent from an **Own Address**. That is `hallo@soulzuerich.ch` **and** `bot@soulcoffee.info`, both, always. Every reply is Cc'd to the group and the bot mailbox is a group member, so our own reply lands back in the mailbox we read. A rule matching only one of the two lets the agent answer itself. |
| R4 | Skip any message that arrived more than **3 days** ago. |
| R5 | Skip any message that arrived before `autoReply.goLiveDate`. |
| R6 | Skip any thread that already has a Firestore record, whatever its status. |
| R7 | Skip any thread that holds more than one message. |

R6 is checked before R7.

R7 no longer defends against a double answer — a partner's reply never reaches the thread the agent reads. It still stops a second reply to the same customer and stops the agent answering its own Cc'd copy.

### Caps

| # | Rule |
| --- | --- |
| R8 | Stop the run after **3** replies. Alert. |
| R9 | Stop the run if **5** replies have already gone out today, Europe/Zurich. Alert. |

### Sending

| # | Rule |
| --- | --- |
| R10 | Write the Firestore record with status `sending` **before** calling Gmail send. |
| R11 | Send with `threadId`, `In-Reply-To`, `References` **and** a matching `Subject`. All four are required to stay in the thread. |
| R12 | Cc `hallo@soulzuerich.ch` on every reply. This is also how the partners find out. |
| R13 | On success set `sent`. On failure set `failed` and alert. |
| R14 | A record at `sending` or `failed` blocks that thread for good. **Never retry a send.** |
| R15 | Add the Gmail label after a successful send. If the label fails, ignore it. |

### The record

| # | Rule |
| --- | --- |
| R16 | One Firestore document per message **looked at**, not per reply. Skipped messages are recorded too, with the reason. The one exception is the under-15-minutes skip, which writes nothing. |

### Alerts

| # | Rule |
| --- | --- |
| R17 | Alerts go to the owner only. **Never to the partners.** |
| R18 | Alert on: a failed send, R8 hit, R9 hit. |
| R19 | While `enabled` is `false`, at most **one** reminder per day. |
| R20 | At most one alert of each kind per day. |

**No summary emails, ever.** The Cc is how the partners see what happened.

### Deliberately not alerted

An `unclear` email, or an Event Enquiry at or after 16:00, gets nothing. No reply, no label, no alert. It sits in the mailbox and a partner reads it, exactly as today.

---

## 9. Data

### Settings — `settings/autoReply`

| Field | Type | Meaning |
| --- | --- | --- |
| `enabled` | boolean | **Kill Switch**. `false` stops everything, no deploy needed. |
| `dryRun` | boolean | Decide and record, never send. |
| `goLiveDate` | timestamp | **Go-Live Floor**. Nothing older is ever answered. Stops the first run replying to the whole old mailbox. |

Both flags change behaviour without a deploy. That is the point of them.

**There is a screen for this**: Admin → Settings → **Auto Reply**. It shows the state in plain words at the top — off, dry run, or live — and holds all four fields. The kill switch is the first thing on it, so stopping the job does not mean hunting through the Firebase console.

The screen reads through `GET /api/v1/settings/auto-reply`, which calls the same settings reader the job uses. So what you see is what the job sees, defaults included. `PUT` accepts only these four fields and ignores anything else.

### Record — one document per message looked at

Fields: thread id, message id, sender, subject, arrival time, language, category, reason, decision, reply text, status, timestamps.

Status is one of `skipped`, `sending`, `sent`, `failed`.

**It keeps the full text of the customer's email.** Review this after three months and stop keeping bodies once the classifier is trusted.

### Secrets

The Anthropic API key lives in **Firebase Functions v2 secrets**, which is Secret Manager underneath. Declared as `ANTHROPIC_API_KEY` in `src/autoReply/secrets.ts` and bound to the function through `secrets: [anthropicApiKey]`.

Set it once, before the first deploy:

```
cd functions && firebase use prod && firebase functions:secrets:set ANTHROPIC_API_KEY
```

It is never written to a `.env` file and never read from `process.env` directly.

Domain-wide delegation itself can be keyless — see section 2.2.

### Alert address

**`v.chatzipanagiotis@soulcoffee.info`.**

Note: earlier tickets wrote `v.chatzipanagiotis@soulzuerich.ch`. That address does not exist. All four real accounts are on `soulcoffee.info`.

---

## 10. The website change

**Only `src/components/home/Contact.tsx` changes.** Replace the reservations block with:

> **Reservations:**
> - We don't take reservations. Just come in and we will find you a table.
> - For a special occasion or a weekend evening, please email us. We will make you an offer.

The old page split guests by party size ("less than 6 people"). That rule no
longer exists. Nobody books a table, on any day. The owner confirmed this on
2026-09-12.

This also fixes a live typo. The page currently renders `please email us., and we'll tailor an offer` — a full stop inside the link, followed by a comma.

The commented-out "book here" link **stays commented out**. The booking form is disabled on purpose.

`src/components/home/Events.tsx` is **not** changed. Emails from that page carry no time, and an Event Enquiry with no time always goes to a human, so that page cannot cause a wrong automatic refusal.

The website never says 16:00 either. **"During the day"** is the public stand-in for the Cutoff.

**Accepted seam**: the website says "not during the day"; the reply says "no bookings on Saturday and Sunday" flat. The opening-hours line in the reply explains the difference. If customers complain, change the reply, not the website.

---

## 11. Rollout

Steps 3 to 6 are all on the **Admin → Settings → Auto Reply** screen.

1. Do the manual setup in section 2. **Test the send-as address first.**
2. Deploy the job on its own: `firebase deploy --only functions:processIncomingEmails --project soul-web-prod`. It needs the secret to exist first. The job starts off: a missing `settings/autoReply` document reads as `enabled: false`.

   **Never run a plain `firebase deploy --only functions` against prod.** See "How the two projects are really set up" below.
3. Turn **Run the job** on, leave **Dry run** on. Watch the Firestore records on real mail for several days. Nothing is sent.
4. Read every record. Check the classification against what a partner would have done.
5. Press **Set to now** on the Go-live floor, and save.
6. Turn **Dry run** off.
7. Watch the Cc'd replies arriving in the group.

The caps (3 per run, 5 per day) mean a bad classifier cannot send more than 5 wrong replies before it stops and alerts.

### Go-live conditions

1. `hallo@soulzuerich.ch` proven to work as a sending address on `bot@soulcoffee.info`.
2. The partners told to stop answering weekend reservation enquiries.
3. The classifier measured against real emails ([#14](https://github.com/chatzipan/soul/issues/14)).

---

## 11b. How the two projects are really set up

Found on 2026-09-12, while deploying. It is not what the code suggests.

| Function | dev `elite-bird-404121` | prod `soul-web-prod` |
| --- | --- | --- |
| `api` | yes | yes, and this is the one soulzuerich.ch calls |
| `sendDailyReservationsSummary` | yes | **no** |
| `sendReservationReminders` | yes | **no** |

The two scheduled jobs exist only in the dev project. That is where the
reminder emails to customers are sent from.

Two consequences:

1. **A full `firebase deploy --only functions` against prod would create
   `sendReservationReminders` there.** Its dev guard is commented out, so it
   runs in every environment. Customers would then get two reminder emails,
   one from each project. Always deploy prod one function at a time.

2. `sendDailyReservationsSummary` returns early when `ENVIRONMENT` is `dev`,
   and it exists only in dev. So it runs nowhere. Nobody receives that daily
   summary today.

Also on that day: `testReminder` and `testSendReservationSummary` were deleted
from both projects. They were unauthenticated HTTP endpoints that sent real
mail to customers. `api` moved from nodejs18, decommissioned since
2025-10-30, to nodejs22.

---

## 11c. What is verified, and what is not

State on 2026-09-12, evening.

### Done and proven

| Thing | How it was proven |
| --- | --- |
| Bot Mailbox exists, in the group, "Each email" | Owner did it in the admin console |
| Send-as `hallo@soulzuerich.ch` | Test mail arrived showing `hallo@soulzuerich.ch`. See section 2.1 |
| Partners told to stop answering | Owner told them |
| `ANTHROPIC_API_KEY` in Secret Manager | Version 2 in `soul-web-prod`. Version 1 was an empty write and is unused |
| `processIncomingEmails` deployed | `state: ACTIVE`, revision `processincomingemails-00001-jam`, nodejs22, runs as `947435703401-compute@developer.gserviceaccount.com` |
| The kill switch | First run logged "settings/autoReply does not exist. Falling back to disabled." and stopped |
| The classifier | 18 real emails in `functions/scripts/real-emails`, 18 of 18 matched what the owner expected |

### Not yet proven

**Domain-wide delegation.** `run.ts` checks `settings.enabled` first and returns
before `getGmailClient()` is ever called. So every run so far has stopped
before touching Gmail. Nothing has tested the service account, the `signJwt`
call, or the Gmail scope.

The first dry run with `enabled: true` is what tests it. A failure there shows
as `unauthorized_client`, which for the first 24 hours after adding the
delegation entry usually just means "not ready yet, wait".

### The deploy commands that work

Always the alias `prod`, never `soul-web-prod`. Firebase loads
`.env.<alias>` (`firebase-tools/lib/functions/env.js:166`), and
`AUTO_REPLY_DELEGATED_SA` lives in `.env.prod`.

    firebase deploy --only functions:processIncomingEmails --project prod

Setting the secret needs `--data-file -`. The interactive prompt cannot be
answered from a non-interactive shell, and answering it blind writes an empty
value.

---

## 12. Open items

One thing is still open. The other two were decided while building.

1. **The classifier has not been measured.** [#14](https://github.com/chatzipan/soul/issues/14). This is the last real unknown, and it is the one thing that could still change the rules in section 6.

Decided while building:

- **Where the Cutoff is stored** — `settings/autoReply.eventCutoffHour`, default 16 in code. Section 6.
- **Where the Anthropic API key lives** — Firebase Functions v2 secrets. Section 9.

### Judgement calls made while building

These were not in the spec. They are small, and each one is written down here so it can be overruled.

| Call | Why |
| --- | --- |
| The 10-or-more texts keep the "open 08:00 to 18:00" sentence and drop only the walk-in invitation | Section 7 calls the opening hours line load-bearing. Dropping the whole sentence would have removed it. |
| Every reply carries `Auto-Submitted: auto-replied` and `X-Auto-Response-Suppress: All` | RFC 3834. Stops our reply from setting off someone's out-of-office, which would set off ours. |
| A classifier failure writes **no** record | A record would match R6 and block a real customer for good over a temporary API error. The next run retries. A send failure still writes `failed` and is never retried, as R14 says. |
| A dry run counts against the 3-per-run cap but writes no `sentDay` | So a dry run shows the real behaviour without eating into a live day's allowance. |
| The `To` and `From` display names are RFC 2047 encoded | A customer called "Jürg Müller" would otherwise put raw 8-bit bytes in a header. |
| No `temperature` on the Claude call | `claude-opus-5` rejects it with a 400. Found by running the classifier on real text. Steadiness comes from the fixed tool schema and `tool_choice`. |
| A stated party of 10 or more follows the Event Enquiry rules | Section 6. Decided after the sample set showed the classifier calling a 14-person Saturday evening booking a plain table request. |

### Known and accepted

- The whole design rests on four people not answering weekend reservation emails. Nothing enforces it and nothing reports it if the habit slips.
- A human reply from a partner's own mailbox cannot be detected. No API fixes this.
- `POST /api/v1/menu` cannot work in production — it writes to a path above the deployed folder, on a read-only filesystem. Found while deciding the runtime, deliberately not fixed. Needs its own ticket.

---

## 13. Files

### Changed

| File | Change |
| --- | --- |
| `functions/package.json` | Node 22, `firebase-functions` 7, `firebase-admin` 14, browser and test packages removed, Gmail and Anthropic SDKs added |
| `functions/tsconfig.json` | target `es2022`, `esModuleInterop` on |
| `functions/src/index.ts` | modular `firebase-admin` imports, exports the job |
| `functions/src/scheduledFunctions/index.ts` | exports the job |
| `functions/src/utils/menu/index.ts` | the unused browser launch removed |
| `functions/src/routes/reservation.ts`, `routes/settings.ts`, `email/utils.ts`, `scheduledFunctions/reservationEmail.ts`, `scheduledFunctions/sendReminders.ts` | `import moment from` instead of `import * as moment` |
| `src/components/home/Contact.tsx` | the reservations copy, and the live `email us., and` typo |
| `functions/src/routes/settings.ts` | `GET` and `PUT /auto-reply` |
| `src/services/settings.ts` | calls for those two |
| `src/components/admin/settings/Settings.tsx` | the fourth tab |

### New

| File | What it holds |
| --- | --- |
| `functions/src/types/autoReply.ts` | every type the job uses |
| `functions/src/autoReply/constants.ts` | addresses, caps, query, collection names |
| `functions/src/autoReply/settings.ts` | reads `settings/autoReply`, defaults to off |
| `functions/src/autoReply/secrets.ts` | the `ANTHROPIC_API_KEY` secret |
| `functions/src/autoReply/gmail.ts` | keyless delegated auth, read, send, label |
| `functions/src/autoReply/classify.ts` | the one Claude call |
| `functions/src/autoReply/decide.ts` | the rule table from section 6 |
| `functions/src/autoReply/buildRawReply.ts` | the MIME message, R11 and R12 |
| `functions/src/autoReply/records.ts` | the Firestore records, R6 and R9 |
| `functions/src/autoReply/alerts.ts` | alerts, R17 to R20 |
| `functions/src/autoReply/run.ts` | the pipeline from section 5, in order |
| `functions/src/email/autoReplyTexts.ts` | the four reply texts |
| `functions/src/scheduledFunctions/processIncomingEmails.ts` | the schedule |
| `functions/scripts/testRules.js` | checks the rule table, needs nothing |
| `functions/scripts/testClassifier.js` | runs real emails through the classifier, needs only the API key |
| `functions/scripts/sample-emails/` | ten sample emails with expected answers |
| `src/hooks/useAutoReplySettings.ts` | the query and the save |
| `src/components/admin/settings/AutoReply.tsx` | the Auto Reply tab |
