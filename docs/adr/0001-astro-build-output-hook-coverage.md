# ADR-0001: Local hook coverage for Astro build-output manifest integrity

## Status: Accepted — defer (no local hook)

## Context

The P3W7 parser-fixture audit (`noorinalabs/noorinalabs-main#300`) flagged that
the Astro build output (`dist/`) is not validated by any Claude Code hook.
Astro's Vite pipeline emits content-hashed assets under `dist/_astro/`, and
HTML pages reference those assets by their hashed filenames. Drift between
the build manifest and the deployed assets — e.g., a stale page referencing
`/_astro/foo.HASH-A.js` when only `/_astro/foo.HASH-B.js` exists — would
produce production 404s.

Issue #86 asks: do we need a local Claude Code hook (analogous to the parent
canonical hooks under `noorinalabs-main/.claude/hooks/`) to guard against
such drift?

## Existing guards

The build-and-ship path already has multiple layers between the developer's
edit and a production miss:

1. **Astro static site generation.** All pages are pre-rendered at build
   time (`dist/index.html`, `dist/about/index.html`, etc.). HTML contains
   literal `<script src="/_astro/...">` tags pointing at hashed filenames
   that Vite emits in the same build. Manifest and assets are produced as
   one atomic build output; they cannot drift relative to each other within
   a single build.

2. **Content-addressed asset hashing.** Vite emits assets as
   `<name>.<hash>.<ext>` where the hash is derived from the file's bytes.
   A modified asset gets a new hash and a new filename; an unmodified asset
   keeps its filename. There is no "manifest pointer" that can become stale
   independently of the assets.

3. **CI build gate (`ci.yml`).** Every PR and every push to
   `main` / `deployments/**` runs `npm run build` end-to-end, plus
   `astro check`, `eslint`, `prettier --check`, vitest, and Playwright E2E.
   A broken build fails the gate and blocks merge.

4. **Docker multi-stage build (`Dockerfile`).** The image build re-runs
   `npm run build` inside a clean `node:22-alpine` stage and copies the
   resulting `dist/` directly into the nginx image. The deployed artifact
   is the build output of the source SHA being deployed; there is no
   intermediate artifact-store step where `dist/` could be tampered with
   or substituted.

5. **Image-tag Contract v6 (deploy pipeline, landing-page#71).** Deploys
   pull image tags `sha-<short>` / `stg-<short>` / `prod-<short>` keyed
   to the source commit, so the deployed container is reproducibly tied
   to the SHA whose build emitted its `dist/`.

## The drift modes a local hook could close

A local hook running inside the Claude Code session (i.e., on developer
machines, not in CI) could in principle catch:

- **A.** A developer manually edits a hashed file in `dist/_astro/`
  outside the build (so `dist/index.html` references a hash that no
  longer matches the file's bytes).
- **B.** A developer commits `dist/` to git (it should not be committed)
  and the committed manifest drifts from re-built assets.
- **C.** A developer ships a partial `dist/` (some files missing) to a
  non-CI deploy path.

## Why these modes do not warrant a local hook

- **Mode A** has no realistic vector. Developers do not hand-edit
  `dist/_astro/*.HASH.js`. The Claude Code agent never edits build
  output (Edit/Write are pointed at source). Even if it did, the next
  `npm run build` regenerates the manifest from source — by the time
  the artifact reaches deploy, it is the build's output, not the edited
  file.

- **Mode B** is prevented by `.gitignore`. `dist/` is ignored
  (verified — `git status` shows `dist/` is untracked even after a
  full build). Committing `dist/` would require deliberate force-add,
  which is not part of any documented workflow and which would be
  caught at PR review.

- **Mode C** cannot happen on the deploy path. The Dockerfile's stage 1
  runs `npm ci && npm run build` on the full source tree. The deployed
  `dist/` is whatever that build emitted, end of story. There is no
  developer-machine `dist/` upload path.

In short: the failure modes a local hook would catch are either prevented
upstream (CI rebuild, `.gitignore`, Dockerfile) or are not realistic given
how Astro and Docker compose. A hook would be defense-in-depth against a
class of failure that has no documented vector.

## Charter alignment

Per `noorinalabs-main/.claude/team/charter/hooks.md` § 5 (and the proposed
sub-clause in main#311), landing-page is **dispatcher-style**: it has zero
committed `.claude/hooks/` files, delegating all hook execution to the
parent canonical via `settings.json`. Adding a build-output validation
hook would either:

- Move landing-page out of dispatcher-style (reintroducing copy-resident
  hook files that W5 #79 deleted); or
- Sit in the parent canonical, where it would have to scan an arbitrary
  child repo's `dist/` — a layering violation.

Neither is desirable for a defense-in-depth gate against a non-realistic
threat.

## Decision

Do not implement a local Claude Code hook for Astro build-output
manifest integrity. Existing guards (Astro SSG atomicity, content-hashed
assets, CI build gate, Docker multi-stage build, image-tag Contract v6)
are sufficient. Issue #86 is closed as backlog → won't fix.

## Trigger conditions for revisiting

Reopen this decision if any of the following becomes true:

1. The deploy path begins shipping a `dist/` artifact built on a
   developer machine rather than re-built in CI / Docker (e.g., a
   "publish from local" workflow).
2. `dist/` becomes a tracked artifact in git (e.g., for GitHub Pages or
   a similar static-host that requires committing build output).
3. A production incident traces back to a manifest/asset hash mismatch
   that the existing layers failed to catch.
4. Astro changes its build output to use a manifest file separate from
   the HTML (e.g., a `manifest.json` consumed at runtime by client JS),
   creating a real drift surface.

## Consequences

- **Accepted:** No new hook code, no new fixtures, no charter change for
  landing-page beyond the dispatcher-children sub-clause already proposed
  in main#311.
- **Accepted:** The audit gap noted in main#300 § 3 is documented as
  evaluated-and-deferred rather than left as an open hook coverage TODO.
- **Trade-off:** If a future deploy-pipeline change introduces one of the
  trigger conditions above, the absence of a hook means we rely on
  monitoring (404 alerts) rather than build-time prevention. Acceptable
  given the low probability and existing CI coverage.

## References

- Issue: noorinalabs/noorinalabs-landing-page#86
- Meta-issue (P3W7 audit): noorinalabs/noorinalabs-main#300
- Charter sub-clause (P3W8): noorinalabs/noorinalabs-main#311
- Sibling ADR (data-acquisition dispatcher status): noorinalabs/noorinalabs-data-acquisition#44
- W5 dispatcher-style migration (PR): noorinalabs/noorinalabs-landing-page#79
- Charter: `noorinalabs-main/.claude/team/charter/hooks.md` § 5
