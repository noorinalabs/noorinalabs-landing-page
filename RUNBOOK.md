# noorinalabs-landing-page — Operational Runbook

Operational reference for the public org landing page (`https://noorinalabs.com`). Covers local development, build, deploy, rollback, common failures, and escalation.

For repo overview, tech stack, and team roster see [`CLAUDE.md`](./CLAUDE.md). For the org-level deploy stack see [`noorinalabs-deploy`](https://github.com/noorinalabs/noorinalabs-deploy).

---

## 1. Service identity

| Field | Value |
|---|---|
| Service name | `landing` (compose service in `noorinalabs-deploy/compose/docker-compose.prod.yml`) |
| Container name | `noorinalabs-landing-1` |
| Image | `ghcr.io/noorinalabs/noorinalabs-landing-page` |
| Production URL | `https://noorinalabs.com` (Caddy → `landing:80`) |
| Tech stack | Astro 6.1 (static SSG) + Tailwind 4 + IBM Plex / Noto Naskh Arabic; nginx-alpine runtime |
| Local dev port | `4321` |
| Health endpoint | `GET /` returning 200 (used by the Docker `healthcheck` in compose) |
| Image-tag contract | v6 — `sha-<short>`, `latest`, `stg-<short>`, `stg-latest` written by this repo; `prod-<short>` and `prod-latest` written by `noorinalabs-deploy/.github/workflows/promote.yml` only |

---

## 2. Local development

### 2.1 Prerequisites

- Node.js **22.x** (matches CI in `.github/workflows/ci.yml`)
- npm with access to the `@noorinalabs` GitHub Packages scope. Set `NODE_AUTH_TOKEN` to a GitHub PAT with `read:packages` so `npm ci` can install `@noorinalabs/design-system`:
  ```bash
  export NODE_AUTH_TOKEN=ghp_xxx
  npm config set @noorinalabs:registry https://npm.pkg.github.com
  ```
- (Optional) Docker for local container parity testing.

### 2.2 Common commands

| Task | Command |
|---|---|
| Install dependencies | `npm ci` |
| Run dev server (HMR) | `npm run dev` → http://localhost:4321 |
| Production build | `npm run build` → static output in `dist/` |
| Preview production build | `npm run preview` |
| Lint (ESLint + Prettier check) | `npm run lint` |
| Format-fix | `npm run format` |
| Type-check (Astro) | `npx astro check` |
| Unit tests (Vitest) | `npm test` |
| E2E tests (Playwright) | `npm run test:e2e` |
| Lighthouse local | `npm run dev` then `npm run lighthouse` (separate shell) |

### 2.3 Local container parity

```bash
docker build --secret id=npm_token,env=NODE_AUTH_TOKEN -t landing-local .
docker run --rm -p 8080:80 landing-local
# verify
curl -sf http://localhost:8080/ >/dev/null && echo OK
```

The Dockerfile is two-stage: `node:22-alpine` builds, `nginx:alpine` serves `dist/`. The runtime is read-only with tmpfs mounts (see `compose/docker-compose.prod.yml`). Anything that requires writing to disk at request time will fail — keep the site fully static.

---

## 3. CI

| Workflow | File | Triggers | Purpose |
|---|---|---|---|
| CI | `.github/workflows/ci.yml` | `push` / `pull_request` to `main` and `deployments/**` | ESLint, Prettier, `astro check`, build, Vitest unit tests; Playwright E2E in a follow-up job |
| Publish to GHCR | `.github/workflows/deploy.yml` | `workflow_run` (CI succeeded on `main`) or `workflow_dispatch` | Build + push image to GHCR with v6 tags. **Publish only — does not deploy.** Production rollout flows through `noorinalabs-deploy` (see §4). |

The publish workflow only runs when the upstream `CI` workflow's `workflow_run` conclusion is `success`, so a red CI on `main` blocks the build automatically.

---

## 4. Deploy to production

Landing-page deploy is a two-stage flow split across two repos:

- **This repo** publishes container images to GHCR. It does NOT SSH-deploy from push (the legacy push-time `deploy` job was removed in [#77](https://github.com/noorinalabs/noorinalabs-landing-page/issues/77) / PR #82, 2026-05-06 — it had been a leftover from the original one-VPS topology and started timing out against `vars.VPS_HOST` once W10 split stg/prod, see deploy#86 / main#212).
- **`noorinalabs-deploy`** owns the SSH deploy. Stg fans in via `deploy-stg.yml`'s `repository_dispatch` handler; prod is promoted via `promote.yml` → `deploy-prod.yml`.

### 4.1 Normal path (auto on merge to `main`)

1. PR merges to `main`.
2. `CI` workflow runs (lint + types + build + unit + E2E). On green:
3. `Publish to GHCR` workflow's `build-and-push` job builds with `docker/build-push-action@v6` (single-platform `linux/amd64` with `provenance=true`, which produces an OCI image index — required for the multi-arch parity check in `noorinalabs-deploy/.github/workflows/promote.yml`). Tags pushed:
   - `sha-<short>` (immutable per-push)
   - `latest` (mutable pointer)
   - `stg-<short>` (immutable, stg namespace)
   - `stg-latest` (moving pointer to most-recent stg-)
4. **Stg rollout** is handled by `noorinalabs-deploy/.github/workflows/deploy-stg.yml` via the `deploy-noorinalabs-landing-page` `repository_dispatch` event. That workflow SSHes into the stg VPS, pulls `stg-latest`, and recreates the `landing` service. (Landing-page itself does not dispatch — the fan-in is configured upstream in deploy-stg.)
5. **Prod rollout** is gated and explicit; see §4.3.

### 4.2 Manual trigger (publish only)

GitHub UI → Actions → **Publish to GHCR** → **Run workflow** on `main`. This rebuilds + pushes images but does NOT roll out to any VPS. To force a prod rollout from a manually-published build, use the `noorinalabs-deploy` flow (§4.3) or the legacy single-VPS workflow (§4.4) explicitly.

### 4.3 Promotion to prod via `noorinalabs-deploy`

Landing-page is part of the centralized `promote.yml` flow in `noorinalabs-deploy`:

- Default promotion set: `api,frontend,user-service,landing`.
- Promotion retags the resolved `stg-<short>` image as `prod-<short>` + `prod-latest` and auto-dispatches `deploy-prod.yml`. Landing-page does NOT push `prod-*` tags itself.
- `deploy-prod.yml` accepts a per-service `landing_tag` input (prod-* shape; defaults to `prod-latest`), exports it to the VPS as `LANDING_IMAGE_TAG`, then `docker compose ... pull api frontend landing user-service` + `up -d --force-recreate`.
- Stg-verify gate (`promote.yml` § stg-verify) hard-blocks promotion unless the latest `verify-deploy.yml` run was `success` within `stg_verify_max_age_hours` (default 24h).

### 4.4 Legacy single-VPS path

`noorinalabs-deploy/.github/workflows/deploy-landing-page.yml` is **manual-only** and deprecated since P2W10 (deploy#84). Only use as a break-glass rollback to the legacy single VPS until `deploy#86` decommission. Not the default path.

---

## 5. Rollback

### 5.1 Centralized (preferred)

Use `noorinalabs-deploy/.github/workflows/rollback.yml`:

- GitHub UI → `noorinalabs-deploy` → Actions → **Rollback** → **Run workflow**.
- Inputs:
  - `image_tag` — fallback tag (e.g. `sha-a1b2c3d`) used as default for every service.
  - `landing_image_tag` — *optional* per-service override for landing (independently tagged via `LANDING_IMAGE_TAG`). Leave blank to use `image_tag`.
  - Service selector — pick `landing` to limit the rollback to landing only.

The workflow updates `LANDING_IMAGE_TAG` in `/opt/noorinalabs-deploy/.env`, pulls, and recreates the service.

### 5.2 Find a known-good tag

```bash
# From a workstation:
gh api -X GET /orgs/noorinalabs/packages/container/noorinalabs-landing-page/versions \
  --paginate --jq '.[] | {tags: .metadata.container.tags, created_at}' | head -40
# Or list recent stg-* tags:
gh api /orgs/noorinalabs/packages/container/noorinalabs-landing-page/versions \
  --paginate --jq '.[].metadata.container.tags[]' | grep '^stg-' | head -10
```

Pick a `sha-<short>` (or `prod-<short>` if rolling back to a prior promoted build) that you know was healthy on prod.

### 5.3 Hot manual rollback on VPS (break-glass)

If GitHub Actions is unavailable:

```bash
ssh deploy@$VPS_HOST
cd /opt/noorinalabs-deploy
# Edit .env: set LANDING_IMAGE_TAG=sha-a1b2c3d (the known-good short)
docker login ghcr.io -u <gh-user>
docker compose -p noorinalabs -f compose/docker-compose.prod.yml --env-file .env pull landing
docker compose -p noorinalabs -f compose/docker-compose.prod.yml --env-file .env up -d landing
docker inspect --format='{{.State.Health.Status}}' noorinalabs-landing-1
```

Open a follow-up PR to `noorinalabs-deploy` immediately so the manual `.env` edit is reflected in source control — the next deploy will `git reset --hard` the VPS checkout and clobber it otherwise.

---

## 6. Common failure modes

### 6.1 Publish-time SSH-deploy job (resolved 2026-05-06)

Historical note for context. From P2W10 through 2026-05-06 this workflow contained a `deploy: Deploy to VPS` job that SSH'd into `vars.VPS_HOST` after the build. It had been a leftover from the original (`a32a249`) one-VPS topology and started failing 2026-05-04 once the W10 stg/prod split made that target unreachable from the publish workflow's role. Tracked as [landing-page#77](https://github.com/noorinalabs/noorinalabs-landing-page/issues/77), resolved by PR #82 (merged 2026-05-07T02:41:20Z) — the `deploy` job was deleted; the workflow renamed `Deploy` → `Publish to GHCR`.

**Why this matters for triage today:** if you encounter a stuck or failing landing-page deploy, do NOT look in this workflow's run history for the SSH step — it no longer exists. Real deploys live in:

- `noorinalabs-deploy/.github/workflows/deploy-stg.yml` (stg fan-in, `repository_dispatch` event `deploy-noorinalabs-landing-page`)
- `noorinalabs-deploy/.github/workflows/deploy-prod.yml` (prod, gated by `promote.yml`)
- `noorinalabs-deploy/.github/workflows/deploy-landing-page.yml` (legacy single-VPS, manual only — see §4.4; tracking decom: deploy#86)

For a current "site is down / new image didn't take effect" triage path, see §6.5.

### 6.2 `npm ci` fails with `401 Unauthorized` for `@noorinalabs/design-system`

The build needs a token with `read:packages` scope on the `@noorinalabs` GH Packages registry.

- CI: ensure the workflow has `permissions: { packages: read }` and uses `secrets.GH_PACKAGES_TOKEN` as `NODE_AUTH_TOKEN`.
- Dockerfile: pass via build secret — `docker build --secret id=npm_token,env=NODE_AUTH_TOKEN .` (the Dockerfile's `RUN --mount=type=secret,id=npm_token` writes a temporary `.npmrc`).
- Local: `export NODE_AUTH_TOKEN=<PAT with read:packages>`.

### 6.3 `astro check` type errors block CI

Run locally: `npx astro check`. Fix the reported file/line. Common cause: content-collection schema (`src/content/**/*.mdx`) doesn't match the Zod schema declared in the matching `_schema.ts` / `config.ts`.

### 6.4 Playwright E2E flakes

E2E job runs `--project=desktop-chromium` only. Re-run the failed job once. If it fails twice with the same trace, treat it as a real regression — pull the `playwright-report` artifact (retained 14 days) and read the trace.

### 6.5 Caddy returns 502 / 503 for `noorinalabs.com` (current deploy triage)

This is the live path — start here when the public site is unhealthy.

1. **Container present?** `docker ps --filter name=noorinalabs-landing-1`. If absent, the deploy never landed — check the most recent `noorinalabs-deploy` deploy-prod / deploy-stg run for the rollout that should have started it.
2. **Container health?**
   ```bash
   ssh deploy@$VPS_HOST
   docker inspect noorinalabs-landing-1 --format='{{json .State.Health}}' | jq
   docker compose -p noorinalabs -f /opt/noorinalabs-deploy/compose/docker-compose.prod.yml logs --tail=200 landing
   ```
   Common failures: image pull error (GHCR creds), compose env-file drift, or the curl `/` probe failing inside the container.
3. **Caddy network reachability:** `docker network inspect noorinalabs_default | jq '.[0].Containers'` should list both `landing` and `caddy`. If not, `docker compose ... up -d caddy landing` to recreate.
4. **Stale Caddy upstream:** Caddy may cache the prior backend address after a `landing` recreate. The current `noorinalabs-deploy` deploy-stg / deploy-prod rollouts handle this with their own `restart caddy` / `--force-recreate` step; if you do a manual VPS rollback (§5.3) you must restart Caddy yourself: `docker compose -p noorinalabs -f compose/docker-compose.prod.yml --env-file .env restart caddy`.

### 6.6 nginx 404 for a route that exists in `src/pages/`

Static-only — every page must exist as a file under `dist/` after build. If `npm run build` didn't emit it (check `ls dist/`), the page is failing build-time rendering. `npm run build -- --verbose` will surface the per-page error.

### 6.7 OCI image-index parity check fails in `promote.yml`

`promote.yml` requires the manifest mediaType `application/vnd.oci.image.index.v1+json`. This is only produced when `docker/build-push-action@v6` is invoked with `provenance: true` (currently set on the **Build and push** step in `.github/workflows/deploy.yml`). If it changes to `provenance: false`, the parity check fails. Verify with:

```bash
docker buildx imagetools inspect --raw ghcr.io/noorinalabs/noorinalabs-landing-page:stg-latest | jq -r .mediaType
```

### 6.8 `latest` and `stg-latest` drift

The image-tag-invariants check (`noorinalabs-deploy/.github/workflows/image-tag-invariants.yml`) requires every push to main to emit four tags. If the **Extract metadata** step's tag list in `.github/workflows/deploy.yml` is edited and one is dropped, this gate will fail and block downstream promotions. Re-add the missing tag pattern; do not bypass.

---

## 7. Escalation

This is a **public marketing site, not a load-bearing API**. Outage severity is moderate (no user data lost, no auth flow blocked) but visibility is high (front door of the org).

| Severity | Definition | Response |
|---|---|---|
| **SEV-3 (default)** | Site returns 5xx, or a deploy is stuck and re-runs aren't clearing it | Open / update the relevant issue, attempt rollback (§5), tag the on-call. No after-hours page. |
| **SEV-2** | Site has been down >30 min during business hours, OR brand-impacting content defaced | On-call paged. Roll back via §5.1. File post-incident issue. |
| **SEV-1** | Site serving compromised content (malicious script, XSS, etc.) | Immediate rollback via §5.3 break-glass. Page on-call + Security Engineer (`noorinalabs-deploy` roster: Nino Kavtaradze). File security incident issue. |

**Roster (this repo, see `CLAUDE.md`):**
- Project Lead — Marcia Vasquez-Paredes (incident comms / decision authority for content + brand)
- Frontend Engineer — Kofi Mensah-Williams (build, deploy workflow, Astro/nginx)
- UX/Visual Designer — Cedric Novak (visual regressions)
- Content Strategist — Anika Diop-Sarr (content correctness, copy reverts)
- QA/Performance Engineer — Nazia Rahman (CI/E2E/Lighthouse triage)

**Cross-repo escalation:**
- VPS / Caddy / compose / promotion → `noorinalabs-deploy` roster (Bereket Tadesse manager; SREs Lucas Ferreira & Aisha Idrissi)
- Design-system upstream blocking install → `noorinalabs-design-system` roster

---

## 8. References

- Image-tag Contract v6 canonical: [isnad-graph#815 comment 4301538921](https://github.com/noorinalabs/noorinalabs-isnad-graph/issues/815#issuecomment-4301538921)
- Stg fan-in: `noorinalabs-deploy/.github/workflows/deploy-stg.yml` (`repository_dispatch` event `deploy-noorinalabs-landing-page`)
- Prod promotion: `noorinalabs-deploy/.github/workflows/promote.yml` → `deploy-prod.yml` (per-service `landing_tag` input)
- Rollback workflow: `noorinalabs-deploy/.github/workflows/rollback.yml`
- Legacy single-VPS deploy (deprecated, manual-only break-glass): `noorinalabs-deploy/.github/workflows/deploy-landing-page.yml` — decom tracked in deploy#86
- Production compose: `noorinalabs-deploy/compose/docker-compose.prod.yml` (`landing` service)
- Caddy routing: `noorinalabs-deploy/caddy/Caddyfile` (`{$BASE_DOMAIN}` block)
- Resolved publish-workflow regression: [#77](https://github.com/noorinalabs/noorinalabs-landing-page/issues/77) / PR #82 (2026-05-06)
