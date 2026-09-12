import { ReplyVariant } from "../types/autoReply";

/**
 * The four auto-reply texts. Plain text, no HTML, no MJML, no logo banner.
 * See AUTO_REPLY_SPEC.md section 7.
 *
 * Rules this text obeys:
 * - 16:00 is never written. The public facts are: no bookings on any day,
 *   open 08:00 to 18:00 every day. The weekend is named only as the reason,
 *   because the job answers weekend requests.
 * - The opening hours sentence is what makes one text correct for every
 *   requested time.
 * - The last line before the sign-off is the customer's way back in if the
 *   classifier called an event a plain table. Do not make it a brush-off.
 * - Never link the booking form. It is disabled on purpose.
 *
 * German conventions: "Reservation" not "Reservierung", "ss" not "ß",
 * "Grüezi" alone, "streng" for busy.
 */

const EN_FOOTER = `Best regards,
Soul Team

—
This reply was sent automatically. If you answer, a person from our team will
read it.`;

const DE_FOOTER = `Freundliche Grüsse
Soul Team

—
Diese Antwort wurde automatisch versendet. Wenn Sie antworten, meldet sich
jemand von uns persönlich.`;

/** Fewer than 10 people. Invites a walk-in. */
const EN_SMALL = `Hello,

Thank you for your message.

We don't take bookings. Saturday and Sunday are our busiest days, and we keep
the tables free for guests who come by spontaneously. We are open every day
from 08:00 to 18:00, so you are very welcome to come by without a booking, and
we will find you a table as soon as we can.

If that doesn't work for you, just write back and we will take it from there.

${EN_FOOTER}`;

/** 10 or more, or size unknown. Telling a company of 30 to walk in is silly. */
const EN_LARGE = `Hello,

Thank you for your message.

We don't take bookings. Saturday and Sunday are our busiest days, and we keep
the tables free for guests who come by spontaneously. We are open every day
from 08:00 to 18:00.

If you had a particular time or occasion in mind, please write back with the
details and the number of guests, and we will see what we can do.

${EN_FOOTER}`;

const DE_SMALL = `Grüezi

Vielen Dank für Ihre Nachricht.

Wir nehmen keine Reservationen an. Samstag und Sonntag sind unsere strengsten
Tage, und wir halten die Tische für spontane Gäste frei. Wir sind täglich von
08:00 bis 18:00 Uhr geöffnet. Kommen Sie gerne ohne Reservation vorbei, wir
finden so schnell wie möglich einen Tisch für Sie.

Falls das für Sie nicht passt, schreiben Sie uns einfach zurück, dann schauen
wir weiter.

${DE_FOOTER}`;

const DE_LARGE = `Grüezi

Vielen Dank für Ihre Nachricht.

Wir nehmen keine Reservationen an. Samstag und Sonntag sind unsere strengsten
Tage, und wir halten die Tische für spontane Gäste frei. Wir sind täglich von
08:00 bis 18:00 Uhr geöffnet.

Falls Sie eine bestimmte Zeit oder einen besonderen Anlass im Sinn haben,
schreiben Sie uns bitte mit den Details und der Personenzahl zurück, dann
schauen wir, was möglich ist.

${DE_FOOTER}`;

const texts: Record<ReplyVariant, string> = {
  en_small: EN_SMALL,
  en_large: EN_LARGE,
  de_small: DE_SMALL,
  de_large: DE_LARGE,
};

export const getReplyText = (variant: ReplyVariant): string => texts[variant];
