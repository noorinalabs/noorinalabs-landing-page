# Page Routes

Documented route structure for the NoorinALabs landing page.

---

## Route Map

| Route                   | Source                               | Layout          | Collection | Description                                                          |
| ----------------------- | ------------------------------------ | --------------- | ---------- | -------------------------------------------------------------------- |
| `/`                     | `src/pages/index.astro`              | `PageLayout`    | —          | Homepage: hero, mission statement, project showcase cards            |
| `/about`                | `src/pages/about.astro`              | `PageLayout`    | `pages`    | Mission page: renders `src/content/pages/about.mdx`                  |
| `/projects/isnad-graph` | `src/pages/projects/[...slug].astro` | `ProjectLayout` | `projects` | Project feature page: renders `src/content/projects/isnad-graph.mdx` |

---

## Routing Strategy

- **Static generation.** All routes are pre-rendered at build time (`output: "static"` in Astro config).
- **Content-driven routes.** `/about` and `/projects/*` are backed by MDX entries in content collections. The `[...slug].astro` dynamic route generates pages from the `projects` collection.
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
| About    | `/about`     |                                                 |
| Projects | `/#projects` | Scrolls to project showcase section on homepage |

### Footer Links

**Projects column:**
| Label | Href |
|-------|------|
| Isnad Graph | `/projects/isnad-graph` |

**Organization column:**
| Label | Href |
|-------|------|
| About | `/about` |
| GitHub | `https://github.com/noorinalabs` |

---

## Future Routes (Planned)

These routes are anticipated but not yet implemented:

| Route              | Description                                           |
| ------------------ | ----------------------------------------------------- |
| `/projects/[slug]` | Additional project pages as new tools launch          |
| `/blog`            | Devlog or research notes (content collection: `blog`) |
| `/ar/...`          | Arabic-language mirror (i18n expansion)               |
