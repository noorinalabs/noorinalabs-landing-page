# Page Routes

Documented route structure for the Noorina Labs landing page.

---

## Route Map

| Route                   | Source                                 | Layout          | Collection | Description                                                          |
| ----------------------- | -------------------------------------- | --------------- | ---------- | -------------------------------------------------------------------- |
| `/`                     | `src/pages/index.astro`                | `PageLayout`    | —          | Homepage: hero, mission statement, project showcase cards            |
| `/team`                 | `src/pages/team.astro`                 | `PageLayout`    | —          | The Team: member bio cards (data in `src/data/team.ts`)              |
| `/about`                | _redirect_                             | —               | —          | Redirects to `/team` (configured in `astro.config.mjs`)              |
| `/projects/isnad-graph` | `src/pages/projects/isnad-graph.astro` | `ProjectLayout` | `projects` | Project feature page: renders `src/content/projects/isnad-graph.mdx` |

---

## Routing Strategy

- **Static generation.** All routes are pre-rendered at build time (`output: "static"` in Astro config).
- **Content-driven routes.** `/projects/isnad-graph` is backed by an MDX entry in the `projects` content collection; its page (`isnad-graph.astro`) renders the matching entry through `ProjectLayout`. `/team` is data-driven (`src/data/team.ts`), and `/about` redirects to `/team`.
- **No client-side routing.** Standard anchor navigation between pages — no SPA behavior.

---

## Layout Hierarchy

```
BaseLayout.astro
  └── HTML shell (<html>, <head>, <body>)
  └── Global meta / OG tags
  └── Skip-to-content link

  PageLayout.astro (extends BaseLayout)
    └── Site header + primary navigation
    └── <main> content area
    └── Site footer + secondary links

    ProjectLayout.astro (extends PageLayout)
      └── Hero section (title, description, CTA)
      └── Feature grid (from frontmatter)
      └── MDX body content
```

---

## Navigation Structure

### Header Navigation

| Label    | Href         | Notes                                           |
| -------- | ------------ | ----------------------------------------------- |
| Home     | `/`          | Always visible                                  |
| The Team | `/team`      | Member bio cards                                |
| Projects | `/#projects` | Scrolls to project showcase section on homepage |

### Footer Links

**Projects column:**
| Label | Href | Notes |
|-------|------|-------|
| Isnad Graph | `https://isnad.noorinalabs.com` | The live product (app) |
| About the Isnad Graph | `/projects/isnad-graph` | The project feature page on this site |

**Organization column:**
| Label | Href |
|-------|------|
| The Team | `/team` |
| GitHub | `https://github.com/noorinalabs` |

---

## Future Routes (Planned)

These routes are anticipated but not yet implemented:

| Route              | Description                                           |
| ------------------ | ----------------------------------------------------- |
| `/projects/[slug]` | Additional project pages as new tools launch          |
| `/blog`            | Devlog or research notes (content collection: `blog`) |
| `/ar/...`          | Arabic-language mirror (i18n expansion)               |
