# Soul Kitchen Bar

The website and backend for Soul Kitchen Bar, a restaurant in Zürich. One repo holds a Gatsby website (`src/`) and Firebase Functions (`functions/`) for reservations, events, and email.

## Language

### Reservations

**Reservation**:
A booked table, held in Firestore. Applies to weekdays only, and only to groups of six or more.
_Avoid_: Booking, table, appointment

**Private Event**:
A booking where the restaurant does something beyond seating a table — a birthday, a team event, a set menu, a buyout. Arranged by email with a person, never through the booking form.
_Avoid_: Special occasion, function, party

**Small Group**:
Fewer than six people. Small groups are never taken as a reservation on any day; they walk in.

**Large Party**:
Ten people or more, **stated in the email**. A Large Party is held to the Event Enquiry rules even when the classifier called it a Plain Table Request: no time given, or a time at or after the Cutoff, and a person answers. A party size that is not stated is not a Large Party.
_Avoid_: Big group, group booking — Small Group already means something else

**Weekend**:
Saturday and Sunday, both full days, treated the same. Friday is a weekday.

**Weekday**:
Monday to Friday. The only days a Reservation can be made for.

**Opening Days**:
The per-weekday settings record in Firestore (`isOpen`, `offersDinner`, `openingHours`). Describes when the restaurant serves, which is not the same as when it takes reservations. Only the **prod** project `soul-web-prod` holds correct values. The exports inside `functions/` are from the dev project and are wrong.

**Opening Hours**:
08:00 to 18:00, every day including Saturday and Sunday. This **is** said to the customer, in the reply and on the website. It is the public fact that stands in place of the Cutoff.

### Email

**Plain Table Request**:
An inbound email asking for a table and nothing more. On a Saturday or Sunday the agent always answers it by itself, whatever time is asked for, or none.
_Avoid_: Normal booking, simple reservation

**Event Enquiry**:
An inbound email asking for a Private Event. The agent answers it by itself **only** when a time is stated and it is before 16:00. At 16:00 or later, or with no time at all, a person answers.
_Avoid_: Special request, occasion booking

Telling an Event Enquiry from a Plain Table Request is a judgement, not a fact. It is the single riskiest decision the classifier makes. A wrong call sends an automatic refusal to a paying event customer.

**Cutoff**:
16:00 on Saturday and Sunday. It decides only whether an Event Enquiry is answered by the agent or left to a person. It has no effect on a Plain Table Request. **It is never written in a reply and never shown on the website.** It is a decision the owner stated, not a value read from Firestore.

**Disqualifier**:
The recorded reason an email was not acted on. It changes nothing the agent does. It exists so the skipped emails can be reviewed later.

**Unclear**:
A category meaning the classifier could not decide. It always means the email is left for a human. It is used instead of a confidence score.

**Shared Address**:
`hallo@soulzuerich.ch`, the address customers write to. Confirmed 2026-09-12 to be a **Google Group** with four member accounts, all on `soulcoffee.info`. A Group has no inbox. No API can read it. The agent never touches it directly; it reads the Bot Mailbox and writes the Shared Address only in the `From` and `Cc` lines.
_Avoid_: Inbox, mailbox, alias — it is none of these

**Bot Mailbox**:
`bot@soulcoffee.info`. A real Workspace user created only for this job, subscribed to the Shared Address group with "Each email". It is the mailbox the agent reads. It holds group mail and nothing else, which is why the Gmail search can stay simple.
_Avoid_: Service account, bot user — the service account is a separate thing that impersonates this mailbox

**Send-As**:
`hallo@soulzuerich.ch` configured as an alternate sending address on the Bot Mailbox. It is why the customer sees the Shared Address and never sees `soulcoffee.info`. Whether Google demands a confirmation email for it is **not confirmed**. Test it first.

**Own Address**:
Either `hallo@soulzuerich.ch` or `bot@soulcoffee.info`. Both, always. Every Auto-Reply is Cc'd to the Shared Address, and the Bot Mailbox is a member of that group, so our own reply arrives back in the mailbox we read. A rule that matches only one of the two lets the agent answer itself.

**Auto-Reply**:
The single message the agent sends by itself, with no human reading it first, in the language the customer wrote in. It states the rule and invites a reply if the customer meant the evening. It never asks a question.
_Avoid_: Draft, canned response, template, refusal

**One Message Per Thread**:
The rule that the agent sends at most one Auto-Reply to any email thread, for the whole life of that thread. If the customer writes back, a person answers.

### Safety

**Dry Run**:
A Firestore flag (`autoReply.dryRun`). The job reads mail, decides, and writes the record, but never sends. The safe way to watch the agent work on real email.
_Avoid_: Test mode, shadow mode, simulation

**Kill Switch**:
A Firestore flag (`autoReply.enabled`). Set to `false` the job does nothing at all. Changing it needs no deploy.

**Go-Live Floor**:
A fixed date in Firestore settings. The agent never answers an email that arrived before it. Stops the first run from replying to the whole old mailbox.

**Record**:
One Firestore document per email the job looked at, answered or not. It holds the decision, the reason, and the status of the send. It is the only place to find out why the agent did something.
_Avoid_: Log, audit trail, history

**Alert**:
An email sent to the owner only, and only when something broke. A failed send, or a cap hit. Never a summary, never to the partners.
_Avoid_: Digest, summary, notification, report

**During The Day**:
The words the **website** uses for the weekend period with no reservations. It is the public stand-in for the Cutoff, which is never printed. A customer cannot tell from the website whether 15:00 counts. It does.
_Avoid_: Daytime, lunch service, before the evening — when writing customer-facing text
