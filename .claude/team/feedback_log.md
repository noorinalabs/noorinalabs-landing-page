# Team Feedback Log

Track all feedback events here. Format:

```
## [DATE] — [FROM] → [TO] — Severity: [minor/moderate/severe]
[Feedback content]
[Action taken, if any]
```

---

## Retrospective: Phase 1 (Waves 1+2) — 2026-04-05

### Team Performance

- **7 PRs merged** across 2 waves (PRs #8-#13, #15), plus 1 integration PR (#14)
- **7 issues closed** (#1-#7), plus 1 tech-debt issue created (#16)
- **CI health:** 3 failures on `deployments/phase1/wave-1` branch before fix; 2 failures on Nazia's SEO branch; all resolved. Final merge to main passed CI after PR #15 fix.
- **Total elapsed time:** ~2.5 hours from first PR (#8, 22:24) to final merge (#14, 00:42)
- **Peer reviews:** 0 formal GitHub reviews on any PR (charter violation — charter requires at least 1 peer review per PR)

### Per-Engineer Assessments

### Kofi Mensah-Williams

- PRs: #10 (scaffolding), #13 (hero/homepage)
- CI failures: 1 cancelled run on #13 branch
- Must-fix items received: 0
- Tech-debt items created: 0
- Assessment: Good quality output — scaffolding was clean with correct Astro 6 + Tailwind 4 setup; hero section received strong praise (pure CSS patterns, design tokens, accessibility, responsive typography, Arabic i18n). However, last to deliver in both waves. Scaffolding (#10) was blocking for others in Wave 1. Hero (#13) was the last Wave 2 PR merged.
- Severity: minor (delivery timing, not quality)

### Anika Diop-Sarr

- PRs: #9 (content architecture), #11 (about + projects pages)
- CI failures: 0
- Must-fix items received: 0
- Tech-debt items created: 0
- Assessment: Excellent delivery across both waves. Style guide with Arabic transliteration standards was outstanding. MDX content was real, substantive copy — not placeholder text. Layout hierarchy (Base > Page > Project) was well-architected. First or early delivery in both waves. Proactively added sitemap and lighthouse deps that helped Nazia's work.
- Severity: none

### Nazia Rahman

- PRs: #8 (CI/CD), #12 (SEO/performance), #15 (CI fix)
- CI failures: 2 on SEO branch (ESLint --ext flag incompatible with flat config); 3 on deployment branch (Prettier formatting + Node 20 vs 22)
- Must-fix items received: 0
- Tech-debt items created: 1 (#16 — unit tests, Playwright E2E, CI enforcement)
- Assessment: Strong infrastructure delivery. CI pipeline was first PR merged. SEO implementation (JSON-LD, sitemap, Lighthouse script) was clean. Quickly produced the CI fix PR (#15) addressing Node 22 + Prettier formatting when the integration PR failed. The ESLint --ext flag issue was a known risk from Kofi's flat config choice, not Nazia's fault. The Node 20 → 22 gap should have been caught earlier — the team should have verified Astro 6's requirements before writing CI.
- Severity: none

### Cedric Novak

- PRs: none (no design PRs in Phase 1)
- Assessment: No signal — Cedric was assigned on issues #3 and #5 but no design-specific PRs were created. Design work may have been implicit in Kofi's implementation. Will monitor in future phases.
- Severity: none

### Top 3 Going Well

1. **Content quality** — Anika's style guide, MDX content, and layout architecture set a strong foundation. Real copy from day one, not Lorem Ipsum.
2. **Quick CI remediation** — Nazia identified and fixed the CI failures (Node 22 + Prettier) rapidly after PR #14 exposed them.
3. **Merge conflict resolution** — Integration of 6 PRs into the deployment branch was handled smoothly despite overlapping files (BaseLayout, astro.config, package-lock).

### Top 3 Pain Points

1. **No peer reviews on any PR** — Charter requires at least 1 peer review per PR. All 7 PRs were merged with only the Project Lead's review comment. This is a clear charter violation.
2. **CI not verified before presenting integration PR** — PR #14 was presented to the user with failing CI. The user caught the Prettier and Node version issues. The team should have run CI validation before declaring the wave complete.
3. **Kofi consistently last to deliver** — In Wave 1, scaffolding (#10) was a blocker merged after both Nazia (#8) and Anika (#9). In Wave 2, hero (#13) was the last PR. While quality was good, this pattern creates risk for future waves with tighter sequencing.

### Proposed Process Changes

1. **Mandatory CI green-check before wave completion** — No wave may be declared complete or integration PR presented until CI passes on the deployment branch. Rationale: User caught failing CI on PR #14; the team should have caught this first.
2. **Enforce peer review requirement** — Each PR must have at least 1 GitHub review (not just a comment) from a peer before merge to the deployment branch. Rationale: Charter section "Code Review & Peer Review" was violated on all 7 PRs.
3. **Blocking work prioritized first** — When a task is on the critical path (e.g., scaffolding), the assigned engineer should be spawned first and given priority. Rationale: Kofi's scaffolding was blocking Anika and Nazia in Wave 1.

## [2026-04-05] — Marcia Vasquez-Paredes → Kofi Mensah-Williams — Severity: minor

Kofi was last to deliver in both Wave 1 (scaffolding, which was blocking) and Wave 2 (hero section). Quality was good — scaffolding was clean and hero section received strong praise. But delivery timing creates risk when others depend on his output. Monitoring going forward.

## [2026-04-05] — Marcia Vasquez-Paredes → Anika Diop-Sarr — Severity: none (positive)

Outstanding Phase 1 performance. Content architecture and style guide set the tone for the entire project. Real, substantive copy from day one. Proactive dependency management (adding sitemap/lighthouse deps for Nazia). Trust increased to 4.

## [2026-04-05] — Marcia Vasquez-Paredes → Nazia Rahman — Severity: none (positive)

Strong Phase 1 performance. CI/CD was first PR merged. Quick turnaround on the CI fix. SEO infrastructure was clean. Proactively created tech-debt tracking issue. Trust increased to 4.
