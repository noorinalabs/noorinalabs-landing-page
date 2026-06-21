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

## Shell environment

The development shell is **zsh** (not bash). Write zsh-safe terminal commands and avoid bash-only idioms (`declare -A`, `${!arr[@]}`, unquoted `?`/`*` globs such as `…?ref=main` URLs). Prefer POSIX-portable constructs; use `bash -c '...'` explicitly when bash is genuinely required. Canonical do/don't list: org `docs/TOOLCHAIN.md` "Shell environment" section + `ontology/conventions.md` in `noorinalabs-main`.

## Team

| Role                    | Name                   | Level          | File                                 |
| ----------------------- | ---------------------- | -------------- | ------------------------------------ |
| Project Lead            | Marcia Vasquez-Paredes | Senior Manager | `roster/project_lead_marcia.md`      |
| UX/Visual Designer      | Cedric Novak           | Senior         | `roster/ux_designer_cedric.md`       |
| Frontend Engineer       | Kofi Mensah-Williams   | Senior         | `roster/frontend_engineer_kofi.md`   |
| Content Strategist      | Anika Diop-Sarr        | Senior         | `roster/content_strategist_anika.md` |
| QA/Performance Engineer | Nazia Rahman           | Senior         | `roster/qa_engineer_nazia.md`        |

## Team Workflow

> **Cross-repo session-team note:** The team structure described below is the **per-repo team** — operative when a session is opened isolated in this repo for repo-only work.
>
> When work is orchestrated from the parent `noorinalabs-main` (the common case — wave kickoff, cross-repo features, wave-coordinated bug fixes), all spawned agents — regardless of which repo they edit — join the single `noorinalabs` session team. The per-repo roster below still governs **commit identity, domain ownership, and reviewer pairing**, but the team-creation surface lives in the orchestrator session, not here.
>
> See `noorinalabs-main/CLAUDE.md` § "Session team architecture" and `noorinalabs-main/.claude/team/charter/agents.md` § "Single-Leader Constraint" for the delegation pattern.

See the org-level charter at `noorinalabs-main/.claude/team/charter.md` and this repo's charter at `.claude/team/charter.md`.

**All work MUST be executed through the simulated team structure.** No work begins without the Project Lead spawning the appropriate team members.

- **Charter & rules:** `.claude/team/charter.md`
- **Active roster:** `.claude/team/roster/` (one file per team member)
- **Roster lookup (hooks):** `.claude/team/roster.json`
- **Feedback log:** `.claude/team/feedback_log.md`

## Status

Project not yet scaffolded. Team roster and charter established. Ready for PRD and initial scaffolding phase.

## Project Memory

Project memory is **version-controlled in this repo** at `.claude/memory/`, not in the user-space auto-memory directory. This makes the accumulated state **transferable**: a developer who pulls a branch gets the memory with it, with zero per-machine setup. The index below is auto-loaded into every session via the committed import line at the end of this section.

`MEMORY.md` is the always-loaded index (one line per memory); the individual topic files in `.claude/memory/*.md` are read on demand when a line looks relevant. To record a memory, create or edit `.claude/memory/<kebab-slug>.md` with the standard frontmatter (`name`, `description`, `metadata.type`), add a one-line pointer to `MEMORY.md`, and **commit it** so it travels with the branch.

> `.claude/memory/**` is excluded from the markdown/cspell/lychee linters (dense append-only note prose with names, SHAs, and `[[wikilinks]]`). The Stop-hook `session_handoff.md` is gitignored (per-session, machine-local churn).

@.claude/memory/MEMORY.md
