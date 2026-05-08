# Parser-Fixture Coverage Audit — noorinalabs-landing-page
**Audit date:** 2026-05-07
**Auditor:** Nazia Rahman (QA/Performance Engineer)
**Wave:** P3W7
**Meta-issue:** noorinalabs/noorinalabs-main#300
**Charter ref:** `.claude/team/charter/hooks.md` § 5. Parser-Fixture Coverage Requirements

---

## 1. Hook Inventory

**Repo baseline:** `origin/deployments/phase-3/wave-7` at SHA `e8855aded8135fc5549cbaf97d9eb6101f1531c4`

**Total hooks in `.claude/hooks/` (on wave-7 / origin/main):** 0

**Settings.json (`.claude/settings.json`):** 6 PreToolUse Bash hooks, all parent-canonical paths:
- `noorinalabs-main/.claude/hooks/validate_commit_identity.py`
- `noorinalabs-main/.claude/hooks/block_no_verify.py`
- `noorinalabs-main/.claude/hooks/block_git_config.py`
- `noorinalabs-main/.claude/hooks/auto_set_env_test.py`
- `noorinalabs-main/.claude/hooks/validate_labels.py`
- `noorinalabs-main/.claude/hooks/validate_pr_ci_status.py`

**Local `.claude/hooks/` status:** Directory exists in the local working tree (2 stale `.py` files)
but those files are **absent from `origin/main` and `origin/deployments/phase-3/wave-7`**.
They existed in pre-wave-5 commits; PR #79 (issue #78, wave-5) deleted them.
Local `main` checkout simply lags origin by several wave merges (waves 3, 5, 6) — a pull
would remove them. This is local-workspace drift, not an unresolved issue.

**Effective parser-class hooks in this repo: 0** (all execution delegated to parent dispatcher).

| # | Hook (parent-canonical) | Parser-class | Fixtures in parent | Landing-page local fixtures |
|---|------------------------|-------------|-------------------|----------------------------|
| 1 | `validate_commit_identity.py` | YES | YES (tests/test_validate_commit_identity.py) | N/A — no local copy |
| 2 | `block_no_verify.py` | NO (pattern match) | N/A | N/A |
| 3 | `block_git_config.py` | NO (pattern match) | N/A | N/A |
| 4 | `auto_set_env_test.py` | NO (env inject) | N/A | N/A |
| 5 | `validate_labels.py` | YES (shell command parsing) | YES (tests/test_validate_labels.py) | N/A |
| 6 | `validate_pr_ci_status.py` | YES (JSON/API response parsing) | see parent tests/ | N/A |

---

## 2. Parser Classification — Local Scope

Since `origin/wave-7` has no local parser-class hooks, the charter § 5 requirement
("every hook with input parsing MUST have test fixtures") has **no unmet obligations
in this repo at this time**.

The parent-canonical hooks that execute here (`validate_commit_identity`, `validate_labels`,
`validate_pr_ci_status`) are covered by fixtures in the parent repo — the correct location
for those fixtures, since the source lives there.

---

## 3. Astro-Specific Hook Surface Examination

Per the audit brief, the following Astro-specific parser surfaces were examined:

| Surface | Hook exists? | Where it belongs | Notes |
|---------|-------------|-----------------|-------|
| Astro page frontmatter (YAML) validation | NO | This repo | MDX Zod schemas via `astro check` at build time |
| Astro content-collection schema conformance | NO | This repo | Runtime enforcement is Zod + TypeScript compiler, not hooks |
| Build-output manifest / asset-hash map parsing | NO | This repo or CI | `dist/` manifest not currently audited by any hook |
| Content-strategist MDX/markdown input format | NO | This repo | No pre-commit hook validates MDX structure |
| JSON-LD schema structure in `.astro` components | NO | This repo | SEO component generates JSON-LD; no hook validates shape |

**Assessment:** None of these surfaces currently have hooks attempting to parse them.
The charter § 5 requirement only applies to **hooks that exist and parse input**.
Since no hook parses these surfaces, there is no fixture obligation today.

However, these surfaces represent **hook coverage gaps**: if a future hook is added to
validate frontmatter or content-collection MDX, it will need fixtures at that time.

---

## 4. Coverage Gap Summary

### Gap 1: No repo-local test fixture infrastructure

**Severity: MEDIUM** (hygiene / future readiness)

`.claude/hooks/` (as it will exist after local main is pulled) will be empty.
If a hook is ever added locally, there is no `tests/` scaffold to receive its fixtures.
Filing a tracking issue to establish the scaffold before the next hook lands here.

### Gap 2: No Astro-specific hooks (and therefore no fixture obligation)

**Severity: INFORMATIONAL**

The surfaces listed in § 3 have no hooks. The charter § 5 obligation is contingent
on a hook existing. Filing a backlog issue to consider hook coverage for the most
risky surface: build-output manifest integrity (SHA drift in hashed assets).

### Gap 3: `settings.json` uses individual hook entries instead of `dispatcher.py`

**Severity: LOW** (pre-existing; tracked by parent #78 scope, partially)

Six separate PreToolUse Bash entries instead of one dispatcher registration.
Missing PostToolUse, Agent, SendMessage, Skill, Edit, Write matchers.
Hook 15 (`enforce_librarian_consulted`) does not fire in sessions opened here.
This was flagged in issue #78 body; #78 is closed as "completed" but the
`settings.json` matcher coverage portion was not addressed in PR #79 (PR #79
only deleted the stale `.py` files). Filing as a fresh issue.

---

## 5. Pattern G Observations

No in-wave parser fixes were applicable (no parser-class hooks exist locally in
this repo on wave-7). The Pattern G discipline for this repo is therefore:

- **Proactive shape documentation**: the input-shape tables in § 6 below
  pre-document the known shapes for any future hook added to this repo
- **Scaffold readiness**: backport issue for `tests/` directory + fixture runner

---

## 6. Shape Coverage Matrix (QA-discipline pre-documentation)

For the most likely future local hook candidate — frontmatter YAML validation — the
full input-shape space is documented here so fixtures can be written against it:

### Astro page frontmatter shape space

| Shape | Description | Edge case class |
|-------|-------------|-----------------|
| Valid minimal `---\ntitle: X\n---` | Happy path | Baseline |
| Empty frontmatter `---\n---` | No keys | Empty-block |
| Frontmatter-absent (no `---` delimiter) | Plain markdown | Missing-delimiter |
| BOM-prefixed file (`\xEF\xBB\xBF---\n...`) | UTF-8 with BOM | Encoding |
| Multi-doc YAML `---\n...\n---\n...\n---` | Two YAML docs | Multi-doc |
| Frontmatter with `draft: true` | Should be excluded from build | Flag-field |
| Missing required field (`title` absent) | Schema violation | Required-missing |
| Numeric title (`title: 42`) | Wrong type | Type-coercion |
| Frontmatter with YAML anchors (`&anchor`, `*anchor`) | YAML extension | Anchor-alias |
| Deeply nested YAML value | Complex structure | Depth |
| Unicode in field value (`title: "كتاب"`) | RTL/Arabic content | Unicode |
| Quoted string with embedded newline | Folded scalar | String-escape |
| Trailing whitespace after `---` delimiter | Tokenizer edge | Whitespace |
| Windows line endings (`\r\n`) | CRLF | Line-ending |

### Content-collection MDX shape space

| Shape | Description | Edge case class |
|-------|-------------|-----------------|
| Valid MDX with frontmatter + body | Happy path | Baseline |
| MDX with JSX component usage | Component embedding | JSX-in-MDX |
| MDX with `export` statement | ESM export | ES-module |
| Empty body (frontmatter only) | Minimal content | Empty-body |
| MDX with code fence containing `---` | Embedded delimiter | False-frontmatter |
| MDX `draft: true` file | Should be filtered | Draft-flag |
| Malformed YAML frontmatter | Parse failure | Error-path |
| File without `.mdx` extension in collection dir | Wrong-extension | Collection-membership |

---

## 7. Backport Issues Filed

| Issue # | Title | Severity | Labels |
|---------|-------|----------|--------|
| [#84](https://github.com/noorinalabs/noorinalabs-landing-page/issues/84) | establish `.claude/hooks/tests/` fixture scaffold for future local hooks | MEDIUM | p3-wave-7, tech-debt |
| [#85](https://github.com/noorinalabs/noorinalabs-landing-page/issues/85) | `settings.json` missing PostToolUse/Edit/Write/Stop matchers — hook-15 and ontology-tracker don't fire | LOW | p3-wave-7, tech-debt |
| [#86](https://github.com/noorinalabs/noorinalabs-landing-page/issues/86) | backlog — evaluate hook coverage for Astro build-output manifest integrity | INFORMATIONAL | p3-wave-7, tech-debt |
