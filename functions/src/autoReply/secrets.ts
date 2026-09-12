import { defineSecret } from "firebase-functions/params";

/**
 * The Anthropic API key, kept in Secret Manager through Firebase Functions v2
 * secrets. Set it once with:
 *
 *   firebase use prod && firebase functions:secrets:set ANTHROPIC_API_KEY
 *
 * It is never written to .env and never read from process.env directly.
 */
export const anthropicApiKey = defineSecret("ANTHROPIC_API_KEY");
