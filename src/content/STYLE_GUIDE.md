# Content Style Guide

Guidelines for writing content across the Noorina Labs landing page. Every
contributor — human or AI — should follow these conventions to maintain a
consistent, respectful, and accessible voice.

---

## Tone of Voice

**Scholarly but accessible.** We write for an audience that ranges from hadith
researchers to curious first-time visitors. Our tone balances academic precision
with warmth and clarity.

| Do                                   | Don't                                      |
| ------------------------------------ | ------------------------------------------ |
| Explain technical terms on first use | Assume readers know Arabic terminology     |
| Use clear, direct sentences          | Use jargon-heavy or overly formal language |
| Show respect for Islamic tradition   | Treat religious sources casually           |
| Invite the reader in                 | Lecture or gatekeep                        |

### Key Principles

1. **Respectful.** Islamic sciences carry deep significance. Use honorifics
   where appropriate (e.g., "the Prophet Muhammad, peace be upon him") and treat
   scholarly traditions with reverence.
2. **Precise.** Prefer specific language over vague claims. "Maps 40,000 chains
   of narration" is better than "covers lots of hadith data."
3. **Inviting.** Write as if welcoming someone into a library, not guarding the
   door. Assume good faith and genuine curiosity.
4. **Honest.** Do not overstate capabilities. If a feature is in progress, say
   so. Credibility is earned through transparency.

---

## Heading Hierarchy

Every page must follow a strict heading hierarchy for accessibility and SEO.

- **h1** — One per page. Set by the layout's `title` prop; do not add a second
  `<h1>` in MDX body content.
- **h2** — Major sections within the page body.
- **h3** — Subsections within an h2 block.
- **h4–h6** — Use sparingly. If you need h4+, consider restructuring.

In MDX files, start body headings at `##` (h2) since `#` (h1) is reserved for
the page title rendered by the layout.

---

## Call-to-Action (CTA) Conventions

- Each project page has **one primary CTA** defined in frontmatter (`cta.label`
  and `cta.href`).
- CTA labels should be action-oriented and specific: "Explore the Isnad Graph"
  rather than "Click here" or "Learn more."
- Secondary CTAs within body content use standard Markdown links — keep them
  descriptive (not "here" or "this link").

---

## Alt Text Guidelines

All images must have meaningful `alt` text.

- **Describe what the image shows**, not what it is. "Screenshot of the graph
  view showing connected narrator nodes" rather than "graph screenshot."
- **Decorative images** (purely visual, no informational content) use an empty
  alt attribute (`alt=""`).
- **Open Graph images** have their alt text set in frontmatter via the
  `ogImage.alt` field.
- Keep alt text concise — aim for one sentence or less.

---

## Internationalization (i18n) Readiness

The site launches in English, but the architecture supports future
multilingual expansion.

### Guidelines for i18n-Ready Content

1. **Keep content in MDX files**, not hardcoded in components. String extraction
   is simpler when content lives in clearly defined collections.
2. **Avoid idioms and culturally specific humor** that may not translate well.
3. **Use the `lang` attribute** on any inline element that switches language —
   e.g., `<span lang="ar">إسناد</span>` for Arabic terms.
4. **Design for text expansion.** German and Arabic text can be 30–40% longer
   than English. Layouts should accommodate variable-length strings.
5. **Use Unicode.** All files are UTF-8. Arabic, transliterated, and diacritical
   characters are welcome — no ASCII approximations.
6. **Dates and numbers** should use locale-aware formatting when rendered
   dynamically (e.g., `Intl.DateTimeFormat`).

### Future i18n Architecture (Planned)

When multilingual support is implemented, content will be organized as:

```
src/content/
  pages/
    en/
      about.mdx
    ar/
      about.mdx
  projects/
    en/
      isnad-graph.mdx
    ar/
      isnad-graph.mdx
```

Until then, all content lives at the collection root without a locale prefix.

---

## Arabic Terms and Transliteration

- On first use, provide the Arabic term followed by a brief English definition:
  _isnad_ (chain of narration).
- Use standard academic transliteration where practical (e.g., _hadith_, not
  _hadeeth_).
- Wrap Arabic-script text in `<span lang="ar">` for correct directionality.

---

## Formatting Conventions

- **Bold** for emphasis — use sparingly.
- _Italics_ for Arabic transliterations and foreign terms.
- Use ordered lists (`1.`) for sequential steps; unordered lists (`-`) for
  non-sequential items.
- One sentence per line in MDX source for cleaner diffs.
