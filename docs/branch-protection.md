# Branch Protection — noorinalabs-landing-page

Phase-3 end-state criterion #4 (`noorinalabs-main#322`): **CI failures block all
merges** on the default branch (`main`), enforced server-side by GitHub — not
just by team discipline. This document is the canonical ruleset spec for this
repo, mirroring the parent-canonical spec in
`noorinalabs-main/.claude/team/charter/pull-requests.md` § *Org-Wide Branch
Protection*. The W14 end-state rollout applies it here.

## Why this exists

Before W13, the only thing standing between a red CI run and `main` was the
Hook 4 comment-gate (`validate_pr_review`). That single layer is what let the
W11 batch-loop merge evade review
(`feedback_batch_loop_merge_evades_pr_review_hook`). A server-side ruleset
closes that gap: it covers UI merges, external actors, and the loop-evasion
class that a comment-parsing hook cannot.

## The ruleset shape

A **repository ruleset** targeting `~DEFAULT_BRANCH`, `enforcement: active`,
with:

- a `pull_request` rule with **`required_approving_review_count: 0`**,
- a `required_status_checks` rule (strict) requiring this repo's CI gate
  contexts (below),
- `deletion` and `non_fast_forward` protection, and
- a Repository-admin `always` bypass (so the orchestrator can still perform the
  wave→main wrapup merge; admin merges are independently audited by the
  `validate_pr_ci_status` operator-side hook + `ADMIN_MERGE_EXCEPTION`).

### Why 0 required approvals, not 1

GitHub's "require approvals" counts **formal GitHub PR reviews**, which this
team structurally cannot produce: the `gh` auth principal IS the PR author
(`parametrization`), so a formal self-approval 422s
(`feedback_gh_review_self_approve_422`). Our review discipline runs on
**issue-comment verdicts** validated by Hook 4, not formal reviews. A naive
"require 1 approval" rule would therefore **deadlock every merge**. The ruleset
enforces only what it can without breaking us — *a PR must exist* + *CI must be
green* — and leaves reviewer-count enforcement to Hook 4.

### Required check contexts (strict)

landing-page has **unconditional PR CI** (every PR triggers `ci.yml`), so the
ruleset DOES hard-require its gate contexts. The contexts are the job `name:`
values GitHub reports as check-runs:

| Required check context        | Source job (`.github/workflows/ci.yml`) |
| ----------------------------- | --------------------------------------- |
| `Lint, Type Check & Build`    | `jobs.ci`                               |
| `E2E Tests (Playwright)`      | `jobs.e2e`                              |

> The `docs.yml` jobs are intentionally NOT hard-required: that workflow is
> `paths:`-filtered, so a PR that touches no docs/config produces zero
> docs-gate check-runs, and a hard-required-but-never-reported check would
> deadlock those PRs (the same reasoning the parent applies to its own
> path-filtered workflows). The docs gate still blocks merges *when it runs*
> via the `validate_pr_ci_status` hook reading the live `statusCheckRollup`.

The contexts are re-confirmed at apply time, since CI job names can change.

## Application status

**APPLY IS OWNER/ADMIN-GATED — NOT done by this PR.**

This PR delivers the **spec + apply script**. Applying a default-branch ruleset
requires repo-admin privileges and must be timed for a window with no in-flight
default-branch merge (applying it mid-wave, before the wave→main wrapup merge,
can block our own merges). The apply is therefore a **post-merge, owner-run
step**:

```bash
# Owner/admin, from repo root, after this PR merges and the wave wraps up:
scripts/apply-branch-protection.sh
# then read-back-verify:
gh api repos/noorinalabs/noorinalabs-landing-page/rulesets --jq '.[].name'
```

`noorinalabs-main#322` stays OPEN as the org-wide rollout tracker until the
ruleset is live on all 8 default branches.

## Relationship to the operator-side gate

The server-side ruleset is one of two complementary gates:

- **Ruleset (server-side):** covers UI merges, external actors, the
  batch-loop-evasion class.
- **`validate_pr_ci_status` hook (operator-side, parent-canonical):** covers
  `gh pr merge`, reads the live `statusCheckRollup`, blocks on red/pending, and
  requires `ADMIN_MERGE_EXCEPTION="<class>:<rationale>"` for `--admin` (logged
  to the Annunaki audit trail). This repo delegates to the parent hook per the
  dispatcher-style local-hook policy; no repo-local copy is needed.

Neither alone is sufficient — the ruleset's admin bypass would otherwise be
unaudited, and the hook alone doesn't cover non-`gh`-CLI merges.
