# noorinalabs-landing-page

Organization landing page — Astro.

The public marketing site for Noorina Labs: a statically generated Astro + Tailwind site whose pages, layouts, and content collections live under `src/`. It is built to static HTML at deploy time and served from an Nginx container.

## Git hooks (required)

This repo mirrors its CI checks locally via [pre-commit](https://pre-commit.com/). After cloning, install BOTH hook stages once:

```bash
pre-commit install                       # commit-stage checks
pre-commit install --hook-type pre-push  # push-stage checks
```

- **Commit stage** runs: gitleaks (secret detection), actionlint (workflow lint), ESLint, Prettier `--check`, and the Dockerfile base-image-pinning lint (`scripts/check_dockerfile_base_pin.py` — every `FROM` must be digest-pinned with the matching distro upgrade; noorinalabs-main#735/#744).
- **Pre-push stage** runs: `astro check` (type check), `npm run build`, and unit tests (`npm test`).

The commit stage stays fast so the commit loop is snappy; the heavier compile, build, and test surface runs at push time, before code leaves the machine. Run `npm ci` once after cloning so `node_modules` is present for the local hooks.

These mirror `.github/workflows/ci.yml` so failures surface locally before a PR (org-wide local⇄CI parity, noorinalabs-main#684). The kind-level mirror is itself enforced by the `Pre-commit ⇄ CI sync-drift gate` job, which fails the build if a check drops from one side. The Playwright E2E suite runs in CI only (not as a local hook). Never bypass with `--no-verify`. If `pre-commit install` "cowardly refuses" because `core.hooksPath` is set — some clones inherited a stale path from a repo rename — run `git config --unset core.hooksPath` first.
