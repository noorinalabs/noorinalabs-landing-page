/**
 * Team member data for the /team page.
 *
 * This is intentionally a plain, typed array so non-engineers can edit a
 * member's name, title, or bio without touching page markup. The page renders
 * one card per entry.
 *
 * Pre-launch (#138): the page must never present fictitious staff. The list
 * holds two kinds of entry:
 *   - a real, consenting person (`name` + `bio`), and
 *   - an *open role* (`open: true`, role title only) — a position that exists
 *     on the roadmap but is not yet filled. Open roles carry NO invented name,
 *     bio, or photo; the card shows the role title and a "to be announced"
 *     status with a neutral silhouette avatar.
 *
 * The earlier seven cards listed one real person and six fabricated people
 * (an invented CTO, Head of Research, etc.). The fabricated identities were
 * replaced by honest open-role cards. When a role is filled, convert its entry
 * to a real member — add the person's `name` and `bio` (with their consent) and
 * drop the `open` flag.
 *
 * Photos: filled members use a generated monogram placeholder (see `avatarFor`
 * in team.astro). When a real portrait is available, drop it in
 * `public/images/team/` and set the member's `photo` field to its path
 * (e.g. "/images/team/yusuf-french.jpg"); the page prefers `photo` when set.
 */

/** A real, consenting team member with a published name and bio. */
export interface FilledMember {
  /** Full display name. */
  name: string;
  /** Role / job title (rendered in uppercase). */
  title: string;
  /** Short paragraph bio (2–3 sentences). */
  bio: string;
  /** Optional path to a real portrait under /public; falls back to a monogram. */
  photo?: string;
  open?: false;
}

/** A role that exists on the roadmap but is not yet filled — no person attached. */
export interface OpenRole {
  /** Role / job title shown on the card. */
  title: string;
  /** Marks this entry as an unfilled position (renders "to be announced"). */
  open: true;
}

export type TeamMember = FilledMember | OpenRole;

export const team: TeamMember[] = [
  {
    name: "Steven (Yusuf) French",
    title: "Executive Director",
    bio: "Yusuf founded Noorina Labs to build open, rigorous tools for the Islamic scholarly tradition. He sets the organisation's direction and stewards its commitment to scholarship-first, open-by-default work.",
  },
  // Open roles: real positions we are growing into, not yet filled. No invented
  // names, photos, or bios — each card advertises the opening honestly.
  { title: "Chief Technology Officer", open: true },
  { title: "Head of Research", open: true },
  { title: "Lead Data Scientist", open: true },
  { title: "Head of Product", open: true },
  { title: "Community Director", open: true },
  { title: "Senior Engineer", open: true },
];
