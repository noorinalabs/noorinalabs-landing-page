/**
 * Team member data for the /team page.
 *
 * This is intentionally a plain, typed array so non-engineers can edit a
 * member's name, title, or bio without touching page markup. To add or remove
 * a member, edit this list — the page renders one card per entry.
 *
 * Pre-launch (#138): this list holds only real, consenting people. The earlier
 * fabricated example members (an invented CTO, Head of Research, etc.) were
 * removed so the launch never presents fictitious staff. Add real teammates
 * here — with their consent — as confirmed bios become available.
 *
 * Photos: every member currently uses a generated monogram placeholder (see
 * `avatarFor` in team.astro). When a real portrait is available, drop it in
 * `public/images/team/` and set the member's `photo` field to its path
 * (e.g. "/images/team/yusuf-french.jpg"); the page prefers `photo` when set.
 */

export interface TeamMember {
  /** Full display name. */
  name: string;
  /** Role / job title (rendered in uppercase). */
  title: string;
  /** Short paragraph bio (2–3 sentences). */
  bio: string;
  /** Optional path to a real portrait under /public; falls back to a monogram. */
  photo?: string;
}

export const team: TeamMember[] = [
  {
    name: "Steven (Yusuf) French",
    title: "Executive Director",
    bio: "Yusuf founded Noorina Labs to build open, rigorous tools for the Islamic scholarly tradition. He sets the organisation's direction and stewards its commitment to scholarship-first, open-by-default work.",
  },
];
