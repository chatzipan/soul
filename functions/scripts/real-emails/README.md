# Real test set

Real customer emails go here, one file each.

**These files are gitignored on purpose.** The repository is public, and
these are real names and real addresses. Never commit them.

## Format

    From: Anna Meier <anna.meier@example.ch>
    Subject: Tisch am Samstag
    Date: 2026-09-15 10:00
    Expect: reply

    Grüezi

    Wir würden gerne am Samstag, 19. September, zu viert essen.

`Date` is when the email arrived. The classifier needs it to work out what
"this Saturday" means. `Expect` is `reply` or `silent`. Write it yourself,
before you run anything. That is what makes this a test.

## Run it

    npm run build
    npm run test:classifier -- scripts/real-emails

Aim for 20 to 30 emails. Include the awkward ones: no date, a weekday, a
question about parking, a supplier, French, a party of 30.

## What the set holds today

18 real emails, taken from the hallo@ inbox in August and September 2026.
All names and addresses were changed to example.com before saving.

    4 expect reply, 14 expect silent

Last run: 18 of 18 matched. The four that get a reply are a Sunday table for
two, a Saturday table for two, a Sunday birthday brunch for eight, and a
Saturday table for sixteen.

Emails worth keeping in the set, because they are the hard ones:

- a student asking for a weekend side job. Full of "Wochenende" and
  "Samstagmorgen". A keyword filter would answer it. The classifier does not.
- a family asking for an outside table on a Wednesday, because their daughter
  is autistic. A weekday and an extra request. Two rules stop it. A person
  must answer that email.
- a table for sixteen where the subject line has the wrong date and the body
  has the right one.

Still missing: an email with no date at all ("this weekend"), an email in
French or Italian, and a weekend event enquiry after 16:00.
