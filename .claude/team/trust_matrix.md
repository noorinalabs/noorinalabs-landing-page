# Trust Identity Matrix — noorinalabs-landing-page

All team members maintain a trust score for every other team member they interact with.

## Scale

| Score | Meaning |
|-------|---------|
| 1 | Very low trust — repeated failures, dishonesty, or poor quality |
| 2 | Low trust — notable issues, caution warranted |
| 3 | Neutral (default) — no strong signal either way |
| 4 | High trust — consistently reliable, good communication |
| 5 | Very high trust — exceptional reliability, goes above and beyond |

## Rules

- **Default:** Every pair starts at **3**.
- **Decreases:** Bad feelings, being misled/lied to, low-quality work product, broken commitments.
- **Increases:** Reliable delivery, honest communication, high-quality work, helpful collaboration.
- **Updates:** This file is updated on the `CEO/0000-Trust_Matrix` branch whenever a trust-relevant interaction occurs. Changes should include a brief log entry explaining the adjustment.
- **Scope:** Trust is directional — A's trust in B may differ from B's trust in A.

## Matrix

Rows = the team member rating. Columns = the team member being rated.

| Rater ↓ \ Rated → | Marcia | Kofi | Anika | Nazia | Cedric |
|--------------------|--------|------|-------|-------|--------|
| **Marcia**         | —      | 3    | 4     | 4     | 3      |
| **Kofi**           | 3      | —    | 3     | 3     | 3      |
| **Anika**          | 3      | 3    | —     | 3     | 3      |
| **Nazia**          | 3      | 3    | 3     | —     | 3      |
| **Cedric**         | 3      | 3    | 3     | 3     | —      |

## Change Log

| Date | Rater | Rated | Old | New | Reason |
|------|-------|-------|-----|-----|--------|
| 2026-04-05 | Marcia | Anika | 3 | 4 | Phase 1: Outstanding content quality — style guide, MDX architecture, About/Projects pages. First to deliver in both waves. Substantive real copy, not placeholder text. |
| 2026-04-05 | Marcia | Nazia | 3 | 4 | Phase 1: Solid CI/CD pipeline, SEO infrastructure, and quick CI fix (Node 22 + Prettier). First to deliver in Wave 1. Proactive on tooling. |
| 2026-04-05 | Marcia | Kofi | 3 | 3 | Phase 1: Good quality output (scaffolding, hero section praised by reviewer) but last to deliver in both waves. Scaffolding was blocking in Wave 1; hero was last in Wave 2. No trust change — quality offsets lateness, but monitoring. |
