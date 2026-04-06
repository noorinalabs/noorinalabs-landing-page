# CLAUDE.md — noorinalabs-landing-page

This file provides guidance to Claude Code when working in the landing page repository.

## Project Overview

**noorinalabs-landing-page** is the organization landing page for Noorina Labs, serving as the public-facing entry point for the suite of Islamic scholarly research tools. The site introduces Noorina Labs' mission, showcases projects (starting with the Isnad Graph), and provides navigation to the platform.

## Tech Stack

- **Framework:** Astro or Next.js (TBD — likely Astro for static-first marketing site)
- **Design System:** `@noorinalabs/design-system` (shared package — tokens, components, typography)
- **Styling:** Follows design system conventions (Tailwind CSS or CSS Modules)
- **Content:** MDX or Markdown (content as code, version-controlled)
- **SEO:** Structured data (JSON-LD), meta tags, sitemap, Open Graph
- **Performance targets:** Core Web Vitals — LCP < 2.5s, CLS < 0.1, INP < 200ms
- **Accessibility:** WCAG 2.2 AA minimum
- **Deployment:** Static hosting (Vercel, Cloudflare Pages, or similar)

## Team

| Role | Name | Level | File |
|------|------|-------|------|
| Project Lead | Marcia Vasquez-Paredes | Senior Manager | `roster/project_lead_marcia.md` |
| UX/Visual Designer | Cedric Novak | Senior | `roster/ux_designer_cedric.md` |
| Frontend Engineer | Kofi Mensah-Williams | Senior | `roster/frontend_engineer_kofi.md` |
| Content Strategist | Anika Diop-Sarr | Senior | `roster/content_strategist_anika.md` |
| QA/Performance Engineer | Nazia Rahman | Senior | `roster/qa_engineer_nazia.md` |

## Team Workflow

See the org-level charter at `noorinalabs-main/.claude/team/charter.md` and this repo's charter at `.claude/team/charter.md`.

**All work MUST be executed through the simulated team structure.** No work begins without the Project Lead spawning the appropriate team members.

- **Charter & rules:** `.claude/team/charter.md`
- **Active roster:** `.claude/team/roster/` (one file per team member)
- **Roster lookup (hooks):** `.claude/team/roster.json`
- **Feedback log:** `.claude/team/feedback_log.md`

## Status

Project not yet scaffolded. Team roster and charter established. Ready for PRD and initial scaffolding phase.
