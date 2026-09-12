# Reading and replying to a shared Workspace mailbox from a Firebase Cloud Function

Research notes, September 2026.

**Question.** How can a Firebase Cloud Function (Node 18, `firebase-functions` v5) read the
shared address `hallo@soulzuerich.ch` and send a reply inside the same email thread?

**Short answer.** Use a service account with domain-wide delegation against a *real* mailbox,
poll on a schedule, and reply with `threadId` plus correct `References`/`In-Reply-To` headers.
First find out whether `hallo@soulzuerich.ch` is a mailbox or a Google Group - if it is a
Group, no API can read it and a bot mailbox must join the group. Full reasoning in section 6.

All claims below are cited to Google's own documentation or to the RFC. Anything I could not
confirm from a primary source is marked UNCONFIRMED.

---

## 0. What this repo already does

Facts gathered from the code, not from the internet.

| Fact | Where |
| --- | --- |
| Sends mail with `nodemailer` over Gmail SMTP, app password | `functions/src/utils/email.ts` |
| SMTP login is `v.chatzipanagiotis@soulcoffee.info` | `functions/src/utils/email.ts` |
| Sends with `from: "Soul Bookings <hallo@soulzuerich.ch>"` | `functions/src/email/sendBookingToAdmin.ts:27` |
| App password sits in plain text in `functions/.env.default` | gitignored, untracked - confirmed |
| Functions already use the v2 API (`onSchedule`, `onRequest`) | `functions/src/scheduledFunctions/index.ts` |
| No `defineSecret` anywhere yet; secrets come from `.env` files | `grep` over `functions/src` |
| `googleapis` is **not** a dependency of `functions/` | `functions/package.json` |

**The important one.** The repo already uses domain-wide delegation successfully:

```js
// scripts/upload-google-menu.js
const client = new JWT({
  email: keys.client_email,          // elite-bird-404121@appspot.gserviceaccount.com
  key: keys.private_key,
  scopes: ["...cloud-platform", "...business.manage"],
  subject: "v.chatzipanagiotis@soulzuerich.ch",   // impersonation
});
```

So a service account in project `elite-bird-404121`, client ID `100330965103331607232`,
is already trusted by the `soulzuerich.ch` Workspace domain to impersonate a user.
Adding Gmail scopes to that existing Admin console entry is a small change, not a new setup.

Firebase projects: dev/default `elite-bird-404121`, prod `soul-web-prod` (`functions/.firebaserc`).
DWD is currently set up for the **dev** project's service account only.

**Note on `From`.** The code already sends as `hallo@soulzuerich.ch` while logged in as
`v.chatzipanagiotis@soulcoffee.info`. Gmail rewrites the `From` header to the authenticated
user unless the address is a *verified send-as alias* on that account. Since these mails
apparently arrive showing `hallo@`, the alias is probably already verified there. Worth
confirming - it removes a whole step from the reply work. See section 6.

---

## 1. Gmail API with OAuth 2.0 and a stored refresh token

### 1.1 Scopes

From the Gmail API scope reference
(<https://developers.google.com/workspace/gmail/api/auth/scopes>) and the restricted-scope
list (<https://support.google.com/cloud/answer/13464325>):

| Purpose | Scope | Google's class |
| --- | --- | --- |
| Read messages and threads | `https://www.googleapis.com/auth/gmail.readonly` | Restricted |
| Read + send + change labels | `https://www.googleapis.com/auth/gmail.modify` | Restricted |
| Send only | `https://www.googleapis.com/auth/gmail.send` | Sensitive |
| Manage label objects only | `https://www.googleapis.com/auth/gmail.labels` | Non-sensitive |
| Headers and labels, no body | `https://www.googleapis.com/auth/gmail.metadata` | Restricted |
| Everything, including delete | `https://mail.google.com/` | Restricted |

What we need per call:

- `users.messages.list`, `users.messages.get`, `users.threads.get` - needs `gmail.readonly`.
- `users.messages.send` - `gmail.send` is enough on its own.
- `users.messages.modify` (attach a "handled" label to a message) - needs `gmail.modify`.
  `gmail.labels` only lets you create and list the label objects, not attach them.

**Minimum set: `gmail.modify` alone.** It covers read, send and labels in one scope. Asking
for `gmail.readonly` + `gmail.send` + `gmail.labels` does not avoid a restricted scope,
because attaching a label still needs `gmail.modify`. Do not use `https://mail.google.com/`;
it adds permanent delete and buys nothing.

### 1.2 Getting a refresh token for a headless job

From <https://developers.google.com/identity/protocols/oauth2/web-server>:

- Add `access_type=offline` to the authorization URL. Without it Google returns only an
  access token, no refresh token.
- Add `prompt=consent`. If the client already has a grant, a repeat authorization may not
  issue a new refresh token.
- Use a **Web application** OAuth client with a registered redirect URI. That is the client
  type Google's web-server flow documents.
- Google explicitly says to store the refresh token "in a secure, long-lived location that is
  accessible between different invocations of your application". That is Secret Manager.

The OAuth Playground (<https://developers.google.com/oauthplayground/>) is a Google-run tool
and is a legitimate way to do the one-time consent, **but only if you switch it to use your
own client ID and secret** (gear icon, "Use your own OAuth credentials"). With its default
shared credentials the tokens are thrown away after 24 hours.
UNCONFIRMED: I found no Google page that explicitly states Playground-issued tokens follow
the normal expiry rules. It is the common understanding, not a documented guarantee.

### 1.3 When a refresh token stops working

From <https://developers.google.com/identity/protocols/oauth2> and
<https://support.google.com/cloud/answer/15549945>:

1. The user revokes access.
2. The token is unused for **6 months**.
3. The user **changes their password** - and this applies specifically to tokens with Gmail
   scopes. This is the one that will bite us.
4. Too many refresh tokens for the same account and client. The current page says **100 per
   account per OAuth client**; issuing a new one silently evicts the oldest.
   UNCONFIRMED: older sources say 50. Re-read the page before quoting the number.
5. Time-limited access granted by the user runs out.
6. A Workspace admin marks a requested scope "Restricted" in the Admin console. The error is
   `admin_policy_enforced`.
7. **The app's publishing status is "Testing" - then the refresh token expires after 7 days.**
   Only apps asking purely for name/email/profile are exempt.

**How to escape the 7-day rule.** It is tied to *publishing status*, not to User Type. Set the
OAuth consent screen to **"In production"**. An Internal app can be published to production
without any Google review. Then only rules 1-6 remain.

### 1.4 Verification for restricted scopes

From <https://developers.google.com/identity/protocols/oauth2/production-readiness/restricted-scope-verification>
and the API Services User Data Policy (<https://developers.google.com/terms/api-services-user-data-policy>):

- An **External** app using `gmail.readonly` or `gmail.modify` in production needs brand
  verification and then a **yearly third-party security assessment (CASA)**. Google says the
  process "can potentially take several weeks" and must be redone at least every 12 months.
- An **Internal** app - User Type = Internal, usable only by members of your own Workspace or
  Cloud Identity organisation - is **exempt from brand verification and from CASA**.

So: make the app Internal to `soulzuerich.ch`, publish it to production, and the restricted
Gmail scopes cost nothing and need no audit. This is the standard route for internal
automation. It also means the OAuth client must live in a Cloud project that belongs to that
Workspace organisation.

### 1.5 Quotas

From <https://developers.google.com/workspace/gmail/api/reference/quota>:

- Per project: 1,200,000 quota units per minute, and a daily threshold of 80,000,000 units.
- Per mailbox per project: 6,000 quota units per minute.
- Cost per call: `messages.list` 5, `messages.get` 20, `threads.get` 40, `messages.modify` 5,
  `labels.list` 1, `getProfile` 1, `messages.send` **100**.

A poll every few minutes plus a handful of replies is nowhere near these limits.

Workspace *sending* limits are separate and live at <https://support.google.com/a/answer/166852>
(roughly 2,000 messages a day for paid editions).
PARTIALLY UNCONFIRMED: the exact recipient and per-day numbers were not read verbatim.

### 1.6 Failure modes - the silent ones matter

- The token endpoint returns **`invalid_grant`** when the refresh token is expired or revoked.
- The Gmail API returns **HTTP 401 `authError` / "Invalid Credentials"** for a bad access
  token (<https://developers.google.com/workspace/gmail/api/guides/handle-errors>).
- **This is the trap.** Google's client libraries refresh automatically on a 401. When the
  *refresh token itself* is dead, that refresh fails with `invalid_grant`. If our function
  catches the error and just logs it, the job keeps running on schedule and simply stops
  replying to anyone - forever, with no visible signal. Nobody notices until a customer
  complains. Any implementation must alert loudly on `invalid_grant`.
- Change detection: `users.watch` + Cloud Pub/Sub push exists, but the watch must be renewed
  at least every 7 days or notifications stop silently
  (<https://developers.google.com/workspace/gmail/api/guides/push>). Plain polling with
  `users.history.list` and a stored `historyId` avoids that second 7-day timer. For a
  scheduled Cloud Function, poll.

### 1.7 Storing the token

From <https://firebase.google.com/docs/functions/config-env>:

- `defineSecret()` from `firebase-functions/params` is backed by Cloud Secret Manager. Bind it
  per function with the `secrets: [...]` option and read it with `.value()`.
- Secret Manager payload limit is 64 KiB, far more than a refresh token needs.
- Rotation: `firebase functions:secrets:set NAME` creates a new version, then **redeploy**.
  Function instances read secrets only at cold start, so warm instances keep the old value
  until they are recycled.
- Free tier covers 6 active secret versions and 10,000 accesses a month.
  UNCONFIRMED: exact prices beyond the free tier were not read verbatim.

---

## 2. Gmail API with a service account and domain-wide delegation

### 2.1 What it does

A service account can act as a Workspace user. You put the user's address in the `sub` claim
of the JWT used to get an access token. Google's words: "To obtain an access token that grants
an application delegated access to a resource, include the email address of the user in the
JWT claim set as the value of the `sub` field"
(<https://developers.google.com/identity/protocols/oauth2/service-account>).

Google also states that "domain-wide delegation impersonates a user and is therefore
considered user authentication". Access is limited by both the impersonated user's own rights
and the scopes the admin allowed
(<https://developers.google.com/workspace/cloud-search/docs/guides/delegation>).

In `google-auth-library` for Node this is the `subject` option - exactly what
`scripts/upload-google-menu.js` already does in this repo.

**No user interaction, ever. No refresh token. Nothing expires after 7 days.** That is the
key difference from section 1.

### 2.2 What the admin must configure

Click path (<https://support.google.com/a/answer/162106>):

> Admin console → Security → Access and data control → API controls →
> Domain-wide delegation → Manage Domain Wide Delegation

You must be a super admin. If multi-party approval is on, a second super admin approves.

In the dialog:

- **Client ID** - the *numeric* ID of the service account, not its email address. For the
  account this repo already uses that is `100330965103331607232`.
- **Scopes** - a comma-separated list of full URLs, for example
  `https://www.googleapis.com/auth/gmail.modify`

Changes "can take up to 24 hours but typically happen more quickly" (same page).

Because the entry for `100330965103331607232` already exists for the Business Profile
scopes, the admin only has to **add** the Gmail scope to it. Note that a DWD entry lists all
scopes together, so the admin edits the existing row rather than creating a new one.

### 2.3 Doing it without a downloaded key

Google documents this directly. From the IAM best practices for service account keys
(<https://docs.cloud.google.com/iam/docs/best-practices-for-managing-service-account-keys>):

> When using domain-wide delegation, avoid service account keys and use the `signJwt` API instead.

The pattern: the Cloud Function runs as its own attached service account. Give that identity
`roles/iam.serviceAccountTokenCreator` on the DWD-enabled service account. The function builds
the JWT with the right `sub`, calls IAM `signJwt` to sign it, and exchanges the signed JWT for
an access token. **No private key is ever downloaded or stored.** That removes the whole
secret-storage and rotation problem.

This is worth doing. The repo currently keeps three service account JSON keys on disk
(`elite.json`, `google_cloud_keys.json`, `google_cloud_keys_prod.json`).

### 2.4 Google's position in 2026

DWD itself is not deprecated. Static JSON keys effectively are.

From <https://docs.cloud.google.com/resource-manager/docs/secure-by-default-organizations>:
"Secure-by-default organization policies are enforced for all organizations created on or
after May 3, 2024." Those defaults include `constraints/iam.disableServiceAccountKeyCreation`
and `constraints/iam.disableServiceAccountKeyUpload`. New organisations cannot create service
account keys at all unless someone turns the policy off. Older projects are not changed
retroactively - which is why the existing `elite.json` still works.

The IAM guidance ranks the alternatives above keys: Workload Identity Federation, attached
service accounts, impersonation.

### 2.5 It cannot impersonate a Group

This is stated in Google's own error table
(<https://developers.google.com/identity/protocols/oauth2/service-account>). The
`unauthorized_client` error is caused by, among other things, "a service account was
authorized using the client email address rather than the client ID (numeric) in the Admin
console, **or a Google Group was used for authorization**."

The `sub` must be a real user who has a mailbox and has accepted the Workspace terms. So if
`hallo@soulzuerich.ch` is a Group, DWD cannot read it. See section 4.

### 2.6 Failure modes

| Error | Cause | Fix |
| --- | --- | --- |
| `unauthorized_client` | DWD not set up for this client ID or scope; email used instead of numeric ID; a Group was used | Re-authorize with the numeric client ID; wait up to 24h |
| `invalid_grant: Invalid email or User ID` | The `sub` is not a real user in the domain | Point `sub` at a real user's primary address |
| `invalid_grant: Invalid JWT` | Clock skew, or token lifetime over 65 minutes | Sync clock |

UNCONFIRMED: whether an *alias* address works as `sub`. Google's docs say "email address of
the user". Use the user's primary address to be safe.

Quotas are the same Gmail API quotas as section 1.5.

---

## 3. IMAP with an app password

### 3.1 Does it still work?

Yes, but only because of one carve-out.

Google removed **password-only (basic) authentication** for IMAP, POP, SMTP, CalDAV, CardDAV
and Google Sync - the "less secure apps" family. New LSA connections were blocked from
**15 June 2024**, and the final cutover was **14 March 2025**, after which those protocols
"cease functioning with legacy passwords"
(<https://workspaceupdates.googleblog.com/2023/09/winding-down-google-sync-and-less-secure-apps-support.html>,
<https://knowledge.workspace.google.com/admin/sync/transition-from-less-secure-apps-to-oauth>).

The carve-out is explicit in that same page: users will "no longer use a password for access
(**with the exception of app passwords**)".

So app passwords still work for IMAP. Conditions:

- **2-Step Verification must be on** for the account
  (<https://knowledge.workspace.google.com/admin/security/how-2-step-verification-works-with-legacy-apps>).
- Only the user can create an app password. An admin cannot make one for them.
- If the org **requires security keys** as the 2SV method, app passwords stop working:
  "You can't require users to use a security key for 2SV and also let them use app passwords
  to sign in to legacy apps" (same page). That is a real way this breaks without warning.

UNCONFIRMED: whether a standalone admin switch exists to block app passwords on its own,
separate from security-key enforcement.

No end-of-life date has been announced for app-password IMAP. Google still steers developers
to OAuth (XOAUTH2) and treats app passwords as a fallback for apps that cannot do OAuth.

### 3.2 This also affects what the repo does today

The LSA shutdown list includes **SMTP**, which is what `functions/src/utils/email.ts` uses.
The existing sending works only because of the same app-password exception. It is not
specially safe. If someone turns on security-key 2SV for
`v.chatzipanagiotis@soulcoffee.info`, or that account's app password is revoked, **the
existing reservation emails stop too**. That is a live risk in the current code, independent
of this research.

### 3.3 Limits

From <https://knowledge.workspace.google.com/admin/gmail/gmail-bandwidth-limits>:

- IMAP download: 2,500 MB per day
- IMAP upload: 500 MB per day
- POP download: 1,250 MB per day

Going over "triggers a safeguard that temporarily stops IMAP uploads"; suspensions are
"typically about 1 hour but can extend to 24 hours".

UNCONFIRMED: the often-quoted limit of 15 simultaneous IMAP connections per account. Not
found on a primary page.

### 3.4 Why not to use it here

- It is tied to one human's personal account and their 2SV settings.
- It gives no thread IDs, no labels API, no `history.list`. Threading and state must be
  rebuilt by hand from raw headers.
- It needs a second library and a second credential, when the repo already has a working
  Google auth pattern.
- It is the only option here that Google actively describes as a fallback.

---

## 4. If `hallo@` is a Google Group

### 4.1 No API reads a Group's mail

This is the hard finding. Checked all four candidate APIs:

- **Gmail API** - every resource is under `users.*`. There is no Groups resource at all
  (<https://developers.google.com/workspace/gmail/api/reference/rest>).
- **Groups Settings API** - settings and metadata only: who can post, archiving on/off,
  moderation rules (<https://developers.google.com/workspace/admin/groups-settings/concepts>).
  No message content.
- **Cloud Identity Groups API** - group lifecycle and *membership* only
  (<https://docs.cloud.google.com/identity/docs/groups>). No message endpoints.
- **Groups Migration API** - write only. It "lets you store group email messages in the cloud
  and make them available in the group's archive" through `archive.insert`, which "inserts a
  new mail into the archive"
  (<https://developers.google.com/workspace/admin/groups-migration/v1/guides/overview>).
  It imports mail *into* a group. There is no method to read mail *out*.

UNCONFIRMED as an explicit statement: Google never publishes a sentence saying "you cannot
read group messages by API". The conclusion comes from the complete absence of any such
endpoint across all four references. The evidence is strong but it is an argument from
absence.

**Collaborative Inbox** does not change this. It is a Groups UI feature - conversation history
plus take/assign
(<https://support.google.com/a/users/answer/167430>). There is no API to read or assign those
conversations.

### 4.2 The workaround: a real mailbox subscribed to the group

Create a real Workspace user, for example `bot@soulzuerich.ch`, and make it a member of the
group. Then point the Gmail API (via DWD or OAuth) at *that user's* mailbox.

What the admin configures:

1. **Membership** - Admin console → Directory → Groups → [group] → Members → add the user
   (<https://support.google.com/a/answer/166149>).
2. **Posting rights** - the group's "who can post" setting must let this member post, if we
   ever want to reply *to the group*
   (<https://support.google.com/groups/answer/2464975>).
3. **Delivery setting** - this is the one people forget. Each member's subscription controls
   whether group mail reaches their inbox. It must be set to **"Each email"**, meaning "each
   email sent to the group will appear in their inbox immediately after it is sent"
   (<https://support.google.com/groups/answer/9792489>). Digest or "No email" would break the
   whole design.

**Licensing.** That bot account is a real user and needs a paid Workspace seat. Aliases and
groups are free and consume no licence; user accounts do
(<https://support.google.com/a/answer/1727173>). UNCONFIRMED: the exact per-seat price.

**Caveat on threading.** Mail that reaches the bot mailbox through a group arrives as a copy.
Replying from that mailbox still works, and the `References` header survives forwarding, so
threading in the customer's client is fine. See section 5.

### 4.3 If it is an alias instead

If `hallo@` is an alternate address on a real user, mail "automatically routes to the user's
primary email account's inbox"
(<https://knowledge.workspace.google.com/admin/users/add-or-delete-an-alternate-email-address-email-alias>).
Then there is a real mailbox to read, and DWD works - but target the user's **primary**
address as `sub`, not the alias.

### 4.4 How to find out which it is, in five minutes

An admin can settle this quickly:

1. **Directory → Groups**, search `hallo@soulzuerich.ch`. Found → it is a Group.
2. **Directory → Users**, search it. Resolves to a person's primary address → real mailbox.
3. **Directory → Users → [user] → Add Alternate Emails**. Listed there → it is an alias on
   that user.
4. The **Inspect groups** tool at the top of the Groups list does "Check membership" or "List
   all groups for a member" for any address in one search
   (<https://support.google.com/a/answer/10316346>).

Do this first. It decides everything else.

## 5. Reply mechanics

### 5.1 Replying into the same thread

Google states the rule word for word, on both the threads guide and the messages reference
(<https://developers.google.com/workspace/gmail/api/guides/threads>,
<https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages>):

> To add a message or draft to a thread, the following criteria must be met:
> 1. The requested `threadId` must be specified as part of the `messages` resource you supply
>    with your request.
> 2. The `References` and `In-Reply-To` headers must be set in compliance with the RFC 2822
>    standard.
> 3. The `Subject` headers must match.

**All three are required.** Passing `threadId` alone is not enough - this is the mistake
people make. Google's page still says "RFC 2822"; that RFC is obsolete, so use RFC 5322 for
the header semantics.

RFC 5322 section 3.6.4 (<https://www.rfc-editor.org/rfc/rfc5322.html>):

> The "In-Reply-To:" field will contain the contents of the "Message-ID:" field of the message
> to which this one is a reply (the "parent message").

> The "References:" field will contain the contents of the parent's "References:" field
> (if any), followed by the contents of the parent's "Message-ID:" field (if any).

So, concretely, for each reply:

```
In-Reply-To: <parent Message-ID>
References:  <parent's References ...> <parent Message-ID>
Subject:     (same as the parent)
```

plus `threadId` in the request body.

The `threadId` is Gmail-only. Outlook and Apple Mail thread purely on the RFC 5322 chain. So
`References` is what makes the customer's own mail client show it as one conversation. Both
matter, for different readers.

UNCONFIRMED: whether Gmail's "Subject headers must match" tolerates an added `Re:` prefix.
Safest is to echo the parent subject unchanged.

### 5.2 Sending as `hallo@soulzuerich.ch`

The Gmail API models allowed From addresses as `users.settings.sendAs`
(<https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.settings.sendAs>).
Relevant fields: `sendAsEmail`, `verificationStatus` (`accepted` = ready to use, `pending` =
waiting for the owner to confirm), `isPrimary`, `isDefault`.

On `create()`
(<https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.settings.sendAs/create>):

> If ownership verification is required for the alias, a message will be sent to the email
> address and the resource's verification status will be set to `pending`; otherwise, the
> resource will be created with verification status set to `accepted`.

And, importantly:

> This method is only available to service account clients that have been delegated
> domain-wide authority.

**That is a strong argument for path 2.** Only a DWD service account can create a send-as
alias by API. With an OAuth user token you cannot; a human must do it in Gmail settings.

You do not write an arbitrary `From` into the raw MIME and hope. Gmail rewrites or rejects a
`From` that is not a verified send-as address of the authenticated user.
UNCONFIRMED: the exact rejection error. The commonly reported
`553 5.7.1 Sender address rejected: not owned by user` appears only in third-party threads,
not on a Google page.

Practical step: call `users.settings.sendAs.list` on the target mailbox first and check
whether `hallo@soulzuerich.ch` is present with `verificationStatus: accepted`. Given the repo
already sends with that `From` over SMTP, it probably is - on
`v.chatzipanagiotis@soulcoffee.info` at least.

If `hallo@` is a **Group**, sending as it is still possible but needs a group setting: posting
must allow "Anyone on the web", and Google notes that if that option is missing, "your
administrator might need to enable 'Group owners can allow incoming email from outside the
organization for your domain'" (<https://support.google.com/mail/answer/22370>).

### 5.3 Do the partners see our reply?

**Mostly no, unless we make them.**

Forwarding only re-delivers *inbound* mail that matches the forward rule. It does not mirror
what the mailbox sends. A reply sent from the shared mailbox reaches only its actual
addressees. Partners whose copies arrive by forwarding will not get the reply through that
same path.

So: **Cc the group or the shared address on every automated reply.** Otherwise partners see
the customer's question and never see that it was already answered, and someone answers twice.

PARTIALLY CONFIRMED. This follows from Google's documented forwarding and group behaviour, but
no single Google page walks through this exact scenario.

### 5.4 Labels

Labels live under `users.{userId}.labels`, and `labelIds` is a field on a `Message` in one
mailbox (<https://developers.google.com/workspace/gmail/api/guides/labels>). The whole
resource model is scoped to a single user.

A label we apply in the shared mailbox is therefore **invisible** to every other mailbox and to
anyone who received a forwarded copy. Labels are fine as our own private "handled" marker.
They are useless as a signal to the partners. If partners need to see the state, the Cc in
5.3 is the mechanism, not labels.

CONFIRMED from the API structure; Google has no single sentence saying "labels are never
shared".

### 5.5 Detecting that a human already replied

This is the weakest point of the whole design, and it should be stated plainly.

If a partner replies from their own personal mailbox and does not Cc the shared address or the
group, **that reply does not exist as far as we are concerned.** No Gmail API surfaces a
message that was never delivered to the mailbox we can read. There is no workaround.

What we *can* see in the shared mailbox:

- messages actually delivered to it (To, Cc, or via the group/alias),
- our own messages in `SENT`,
- so, through `users.threads.get`, the full message list of the thread as that mailbox knows it.

Workable rule: fetch the thread and treat **any message in it that we did not send ourselves,
and that is newer than the customer's original** as "a human has replied - do nothing".

To make that rule actually fire, the shared address has to be on the replies. Two supporting
measures:

- Ask partners to reply-all, so the shared address or group stays in the thread.
- Cc the shared address on our own replies (5.3), which also keeps our reply in the thread we
  later read back.

Even then this is best-effort. A delay before auto-replying (for example, act only on mail
older than N minutes) reduces the chance of racing a human. Design for the possibility that a
customer occasionally gets two answers, and make the auto-reply worded so that a following
human reply does not read as a contradiction.

### 5.6 Noticing new mail

Two options.

**Polling with `users.history.list`**
(<https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.history/list>).
Store `historyId`, pass it as `startHistoryId`, filter with `historyTypes[]`
(`messageAdded`, `messageDeleted`, `labelAdded`, `labelRemoved`). Note: "A `historyId` is
typically valid for at least a week, but in some rare circumstances may be valid for only a
few hours". A stale one returns **404**, and the app must then do a full resync. Max 500
results per page.

**Push with `users.watch` + Cloud Pub/Sub**
(<https://developers.google.com/workspace/gmail/api/guides/push>). Needs a Pub/Sub topic, and
publish rights on it granted to `gmail-api-push@system.gserviceaccount.com`. Then:

> You must call the `watch` method at least once every 7 days or you'll stop receiving updates
> for the user.

Google recommends calling it daily.

**Take polling.** The repo already runs scheduled functions (`onSchedule`). A cron poll adds
no new infrastructure and no second 7-day timer that can silently lapse. Push is an
optimisation we do not need for a restaurant inbox.

---

## 6. Recommendation

**Use a service account with domain-wide delegation, keyless, against a real mailbox.
Poll on a schedule. Reply with `threadId` + `References`/`In-Reply-To` + matching `Subject`,
sending as the `hallo@` send-as alias, and Cc the shared address so partners see it.**

Why, in order of weight:

1. **Nothing expires.** The OAuth path carries the 7-day refresh-token rule in Testing status,
   the 6-month idle rule, the 100-token eviction, and - worst here - **refresh tokens with
   Gmail scopes die when the user changes their password**. A restaurant partner changing a
   password would silently stop all auto-replies. DWD has no refresh token and no such rule.
2. **The repo already does it.** `scripts/upload-google-menu.js` already uses
   `JWT({ subject })` against this same Workspace domain, and the service account
   `100330965103331607232` already has a DWD entry. The admin edits one row to add a Gmail
   scope. Compare with the OAuth path, which needs a consent screen, a one-time browser flow,
   a stored token, and a plan for re-minting it.
3. **`sendAs.create` is DWD-only.** Google says that method "is only available to service
   account clients that have been delegated domain-wide authority". If the send-as alias needs
   to be created or checked programmatically, only this path can do it.
4. **No secret to store or rotate**, if the keyless `signJwt` pattern is used - which Google
   explicitly recommends: "When using domain-wide delegation, avoid service account keys and
   use the `signJwt` API instead." No `defineSecret`, no Secret Manager rotation, no key on
   disk. That also fits Google's secure-by-default policy blocking key creation for newer
   organisations.
5. **No verification work.** Restricted Gmail scopes via DWD are authorised by our own admin.
   No CASA assessment, no brand verification. (The OAuth path can also avoid this by being an
   Internal app published to production - but that is more moving parts for the same result.)

Rejected:

- **OAuth + refresh token** - works, but every failure mode is silent and time-based. It is the
  right choice only if DWD is refused by the admin.
- **IMAP + app password** - depends on one person's 2SV settings, breaks if the org enforces
  security keys, and gives no threads, labels or history. It is Google's stated fallback, not
  its recommendation.

**The blocking unknown:** all of this needs a real mailbox. If `hallo@soulzuerich.ch` turns out
to be a Google Group, **no API can read it** (section 4.1), and DWD cannot even impersonate it -
Google lists "a Google Group was used for authorization" as a cause of `unauthorized_client`.
In that case the fix is a licensed bot user added to the group with delivery set to
"Each email", and we read *that* mailbox instead. The rest of the design is unchanged.

Suggested shape:

- `onSchedule` function, every 5 minutes.
- Auth: `google-auth-library` `JWT`/`GoogleAuth` with `subject` set to the target mailbox.
- Add `googleapis` to `functions/package.json` - it is currently only a root dependency.
- Scope: `https://www.googleapis.com/auth/gmail.modify` (one restricted scope covers read,
  send and labels).
- Poll `users.history.list`, handle the 404 resync case.
- Skip a thread if it already carries a message we did not send.
- Reply, Cc the shared address, then `users.messages.modify` to add our own "handled" label.
- Alert loudly on any auth error. This job fails quietly by nature.

Separately, and not part of this feature: the SMTP app password in `functions/.env.default` is
plain text on disk and is the single point of failure for all existing mail (section 3.2).
Worth moving to `defineSecret`, or retiring once the Gmail API path exists.

---

## 7. What to ask the Workspace admin for

1. **What is `hallo@soulzuerich.ch`?** A Group, a user, or an alias on a user? Checks in
   section 4.4 - Directory → Groups, then Directory → Users, then that user's alternate
   emails. **Answer this first; it decides the rest.**
2. **If it is a Group:** create a licensed user, for example `bot@soulzuerich.ch`, add it as a
   member, and set its subscription to **"Each email"**. Confirm the group's "who can post"
   allows it to reply.
3. **Add a Gmail scope to the existing domain-wide delegation entry.**
   Admin console → Security → Access and data control → API controls →
   Domain-wide delegation → Manage Domain Wide Delegation.
   - Client ID: `100330965103331607232` (already listed for the Business Profile scopes)
   - Add: `https://www.googleapis.com/auth/gmail.modify`
   - Requires a super admin. Allow up to 24 hours to take effect.
4. **Confirm which mailbox we may impersonate** as `sub` - it must be a real user's **primary**
   address, not an alias.
5. **Confirm `hallo@soulzuerich.ch` is a verified send-as alias** on that mailbox
   (Gmail → Settings → Accounts → "Send mail as", status must be usable). If it is a Group
   address, the group posting permission in section 5.2 is needed instead.
6. **Ask the partners to reply-all**, keeping the shared address on the thread. Without this we
   cannot tell that a human already answered (section 5.5).
7. **Production project.** DWD is currently configured for the dev project's service account
   (`elite-bird-404121`). Decide whether prod (`soul-web-prod`) uses the same service account
   or needs its own DWD entry.
8. **Preferably, no new JSON key.** Grant the Cloud Function's service account
   `roles/iam.serviceAccountTokenCreator` on the delegated service account so we can use
   `signJwt` instead of storing a key (section 2.3).

---

## Open items

Flagged where they appear. The ones that could change a decision:

- Whether an **alias** works as the DWD `sub` (assume no; use the primary address).
- Whether a same-domain send-as alias skips the confirmation email. Google documents that
  verification is conditional but not the exact condition. Test it.
- Whether Gmail's "Subject headers must match" tolerates a `Re:` prefix.
- Google publishes no explicit "you cannot read Group messages by API" sentence. The
  conclusion rests on that endpoint being absent from all four relevant APIs.
- Exact Workspace sending limits, Secret Manager prices, and the IMAP simultaneous-connection
  cap were not read verbatim from primary pages.
