/**
 * Team member data for the /team page.
 *
 * This is intentionally a plain, typed array so non-engineers can edit a
 * member's name, title, or bio without touching page markup. To add or remove
 * a member, edit this list — the page renders one card per entry.
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
  {
    name: "Dr. Amina Bello",
    title: "Chief Technology Officer",
    bio: "Amina leads engineering across the platform, from the graph database to the public web. She has spent her career building reliable systems for research data and cares deeply about making complex sources approachable.",
  },
  {
    name: "Dr. Khalid Al-Rashidi",
    title: "Head of Research",
    bio: "Khalid bridges the classical hadith sciences and computational method, ensuring every feature is grounded in published academic scholarship. He works closely with external reviewers to keep the work faithful to its sources.",
  },
  {
    name: "Priya Krishnan",
    title: "Lead Data Scientist",
    bio: "Priya designs the models and pipelines that turn raw narration data into an explorable graph. Her focus is transparency — methods that scholars can inspect, question, and reproduce.",
  },
  {
    name: "Omar Çelik",
    title: "Head of Product",
    bio: "Omar shapes how researchers and students actually use the tools, translating scholarly needs into clear, accessible interfaces. He believes good design should meet people wherever they are in their learning.",
  },
  {
    name: "Fatima Zahra El Amrani",
    title: "Community Director",
    bio: "Fatima Zahra builds the relationships that make Noorina Labs a community effort, working with scholars, institutions, and contributors around the world. She leads outreach, partnerships, and our open-collaboration programmes.",
  },
  {
    name: "Daniel Okafor",
    title: "Senior Engineer",
    bio: "Daniel works across the data acquisition and ingestion stack, keeping sources flowing cleanly into the platform. He has a particular love for the unglamorous work that makes everything else dependable.",
  },
];
