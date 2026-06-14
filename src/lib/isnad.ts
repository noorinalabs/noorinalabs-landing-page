/**
 * Isnad app URL utilities (#136).
 *
 * The landing page is built-once-promoted: the same Docker image runs on staging
 * and production. Build-time env vars cannot differentiate environments, so the
 * correct isnad app URL must be derived at runtime from window.location.hostname.
 *
 * Derivation rule: isnad URL = "https://isnad." + hostname with leading "www."
 * stripped. Falls back to PROD_ISNAD_URL for empty hostnames.
 *
 * Domain mapping (from deploy verify-deploy.yml + env/*.env):
 *   prod: noorinalabs.com / www.noorinalabs.com → https://isnad.noorinalabs.com
 *   stg:  stg.noorinalabs.com                  → https://isnad.stg.noorinalabs.com
 */

/** Production isnad app URL — used as the static-HTML default so the page is
 *  correct for crawlers, no-JS users, and production visitors before the runtime
 *  rewrite script fires. Staging is noindex (lp#63), so stg crawls don't matter. */
export const PROD_ISNAD_URL = "https://isnad.noorinalabs.com";

/**
 * Derive the isnad app URL for a given hostname.
 *
 * @param hostname - e.g. window.location.hostname; empty string falls back to prod.
 * @returns Absolute URL to the isnad app for that environment.
 *
 * @example
 * isnadAppUrlFromHostname("noorinalabs.com")     // "https://isnad.noorinalabs.com"
 * isnadAppUrlFromHostname("www.noorinalabs.com") // "https://isnad.noorinalabs.com"
 * isnadAppUrlFromHostname("stg.noorinalabs.com") // "https://isnad.stg.noorinalabs.com"
 * isnadAppUrlFromHostname("")                    // "https://isnad.noorinalabs.com"
 */
export function isnadAppUrlFromHostname(hostname: string): string {
  if (!hostname) return PROD_ISNAD_URL;
  const bare = hostname.replace(/^www\./, "");
  return `https://isnad.${bare}`;
}
