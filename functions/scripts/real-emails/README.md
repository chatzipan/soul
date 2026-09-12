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
