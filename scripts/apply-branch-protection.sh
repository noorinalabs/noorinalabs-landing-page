#!/usr/bin/env bash
# Apply the canonical branch-protection ruleset to noorinalabs-landing-page.
#
# Phase-3 end-state criterion #4 (noorinalabs-main#322). This script is the
# OWNER/ADMIN-RUN apply step — it is NOT run in CI and NOT run by the PR that
# delivers it (see docs/branch-protection.md § Application status). It creates
# a repository ruleset on the default branch (`main`) that:
#   - requires a PR before merge (0 required approvals — see the spec for why),
#   - hard-requires this repo's CI gate contexts (strict),
#   - blocks branch deletion and non-fast-forward pushes,
#   - grants Repository-admin an `always` bypass (so the orchestrator can still
#     run the wave->main wrapup merge; admin merges are independently audited by
#     the validate_pr_ci_status hook + ADMIN_MERGE_EXCEPTION).
#
# Usage:
#   scripts/apply-branch-protection.sh            # create (fails if it exists)
#   DRY_RUN=1 scripts/apply-branch-protection.sh  # print the payload, do not apply
#
# Re-confirm the required check contexts against the live default-branch
# check-runs before applying — CI job names can change:
#   gh pr checks <any-open-pr> --repo noorinalabs/noorinalabs-landing-page
#
# Read-back-verify after applying:
#   gh api repos/noorinalabs/noorinalabs-landing-page/rulesets --jq '.[].name'

set -euo pipefail

REPO="noorinalabs/noorinalabs-landing-page"
RULESET_NAME="default-branch-protection"

# Required check contexts — must match the ci.yml job `name:` values GitHub
# reports as check-runs. Keep in lockstep with docs/branch-protection.md.
read -r -d '' PAYLOAD <<'JSON' || true
{
  "name": "default-branch-protection",
  "target": "branch",
  "enforcement": "active",
  "conditions": {
    "ref_name": {
      "include": ["~DEFAULT_BRANCH"],
      "exclude": []
    }
  },
  "bypass_actors": [
    {
      "actor_id": 5,
      "actor_type": "RepositoryRole",
      "bypass_mode": "always"
    }
  ],
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    {
      "type": "pull_request",
      "parameters": {
        "required_approving_review_count": 0,
        "dismiss_stale_reviews_on_push": false,
        "require_code_owner_review": false,
        "require_last_push_approval": false,
        "required_review_thread_resolution": false
      }
    },
    {
      "type": "required_status_checks",
      "parameters": {
        "strict_required_status_checks_policy": true,
        "required_status_checks": [
          { "context": "Lint, Type Check & Build" },
          { "context": "E2E Tests (Playwright)" }
        ]
      }
    }
  ]
}
JSON

if [[ "${DRY_RUN:-0}" == "1" ]]; then
  echo "DRY_RUN — would POST this ruleset to repos/${REPO}/rulesets:"
  echo "${PAYLOAD}"
  exit 0
fi

# Refuse to create a duplicate — fail loudly if a ruleset by this name exists.
existing="$(gh api "repos/${REPO}/rulesets" --jq \
  ".[] | select(.name == \"${RULESET_NAME}\") | .id" 2>/dev/null || true)"
if [[ -n "${existing}" ]]; then
  echo "ERROR: ruleset '${RULESET_NAME}' already exists (id ${existing}) on ${REPO}." >&2
  echo "Edit it in place with: gh api -X PUT repos/${REPO}/rulesets/${existing} --input -" >&2
  exit 1
fi

echo "Creating ruleset '${RULESET_NAME}' on ${REPO} (default branch)..."
echo "${PAYLOAD}" | gh api -X POST "repos/${REPO}/rulesets" --input -

echo
echo "Done. Read-back-verify:"
gh api "repos/${REPO}/rulesets" --jq '.[] | "\(.id) \(.name) [\(.enforcement)]"'
