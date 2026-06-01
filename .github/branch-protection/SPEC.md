# Branch Protection — noorinalabs-landing-page (P3 end-state #4, main#322)

Phase-3 end-state criterion #4 (`noorinalabs-main#322`): **CI failures block all
merges** on every repo's default branch, org-wide — enforced server-side by
GitHub, not only by the Hook 4 comment-gate. This directory carries the
canonical ruleset for this repo's `main`:

| File | Purpose |
|------|---------|
| `ruleset-main.json` | The repository ruleset payload (GitHub REST `/rulesets`). |
| `apply-ruleset.sh`  | Owner/admin-gated apply + read-back-verify. Idempotent (create-or-update). |
| `SPEC.md`           | This document — the shape and the why. |

This is landing-page's adoption of the parent-canonical spec
(`noorinalabs-main` charter `pull-requests.md` § *Org-Wide Branch Protection +
Admin-Merge Exceptions*), modeled on the W13 live pilot
(`noorinalabs-data-acquisition`, ruleset id `17091263`) and the user-service
W14 adoption. landing-page is the last of the 8 repos to carry the spec dir.

## Application status

The **spec + apply script** land in this PR (W15, `Refs noorinalabs-main#322`).
The actual **apply is owner/admin-gated** and is a **post-merge step**:

1. Creating a repository ruleset requires repo-admin permission, which the agent
   `gh` principal (`parametrization`) does not hold for this purpose.
2. Applying default-branch protection while a wave-branch PR is in flight can
   block our own merges, so the apply runs from a window with **no in-flight
   default-branch merge** — post-wave-wrapup is the safe window.

So #322 is **met for this repo only when the owner (or the org-rollout step,
TPM Wanjiku Mwangi this wave) has run `apply-ruleset.sh` and read-back-verified
the ruleset on `main`.** `#322` stays OPEN as the org-wide rollout tracker until
all 8 default branches carry the protection.

## The ruleset shape (and why)

A **repository ruleset** targeting `~DEFAULT_BRANCH`, `enforcement: active`:

- **`pull_request` with `required_approving_review_count: 0`** — the load-bearing
  decision. GitHub's "require approvals" counts **formal** GitHub PR reviews,
  which our team structurally cannot produce: the `gh` auth principal IS the PR
  author (`parametrization`), so a formal self-approval **422s**, and our review
  discipline runs on **issue-comment verdicts** validated by Hook 4
  (`validate_pr_review`), not formal reviews. A naive "require 1 approval" rule
  would **deadlock every merge**. Reviewer-count enforcement stays with Hook 4.
- **`required_status_checks` (strict)** — landing-page has **unconditional PR CI**
  (no `paths:` filter on `ci.yml`), so the ruleset hard-requires its gate
  **job-name** contexts:

  | Context | Source job |
  |---------|-----------|
  | `Lint, Type Check & Build` | `ci.yml` → `ci` (eslint + tsc + Astro build) |
  | `E2E Tests (Playwright)` | `ci.yml` → Playwright E2E |

  **Deliberately NOT required:**
  - The `docs.yml` gates — `Markdown lint`, `Spellcheck (cspell)`,
    `Internal link-check (lychee)`, `Config — Workflow actionlint`,
    `Config — YAML/JSON syntax`, `Pre-commit ⇄ CI sync-drift gate` — because
    `docs.yml` is **`paths:`-filtered**. Requiring a path-filtered check would
    deadlock any PR that does not touch the matched paths (the check never
    reports, so a strict ruleset waits forever). The docs gates stay advisory
    for source-only PRs; they still run-and-block whenever docs/config change.
  - `Build & Push Docker Image` — that is `deploy.yml`-only, not a PR gate.

  **Re-confirm all contexts at apply time** against live check-runs — job names
  can change:
  `gh api repos/<repo>/commits/<default-sha>/check-runs --jq '.check_runs[].name'`.
- **`deletion` + `non_fast_forward`** — no force-push / branch-delete on `main`.
- **`bypass_actors`: Repository-admin (`actor_id: 5`, `bypass_mode: always`)** —
  keeps the orchestrator's `--admin` wave→main wrapup merges and the charter
  single-reviewer / doc-sweep / emergency exceptions working. The GitHub-side
  bypass is mirrored on the operator side by the hook-validated
  `ADMIN_MERGE_EXCEPTION` gate (`validate_pr_ci_status`), which **audits** every
  `--admin` merge to the Annunaki trail — defense in depth: the ruleset covers
  UI/external/batch-loop merges, the hook covers `gh pr merge` and names the
  exceptions.

## How to apply (owner / org-rollout)

```bash
# From a window with NO in-flight default-branch merge (post-wave-wrapup):
.github/branch-protection/apply-ruleset.sh            # create or update
DRY_RUN=1 .github/branch-protection/apply-ruleset.sh  # preview only

# Then read-back-verify the detail (contexts + bypass actor):
gh api repos/noorinalabs/noorinalabs-landing-page/rulesets \
  --jq '.[] | select(.name|startswith("Protect main")) | .id'
gh api repos/noorinalabs/noorinalabs-landing-page/rulesets/<id>
```
