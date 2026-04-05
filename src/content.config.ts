/**
 * Content collection definitions for the NoorinALabs landing page.
 *
 * Collections use Zod schemas for type-safe frontmatter validation.
 * Astro v6 content collections require explicit loaders.
 */
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/* ------------------------------------------------------------------ */
/*  Shared schema fragments                                           */
/* ------------------------------------------------------------------ */

const ogImageSchema = z
  .object({
    src: z.string().describe("Path or URL to the Open Graph image"),
    alt: z.string().describe("Accessible alt text for the image"),
  })
  .optional();

/* ------------------------------------------------------------------ */
/*  Projects collection                                               */
/* ------------------------------------------------------------------ */

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    /** Display title of the project */
    title: z.string(),

    /** Short description for cards and meta tags (<=160 chars recommended) */
    description: z.string(),

    /** Open Graph / social sharing image */
    ogImage: ogImageSchema,

    /** Ordered list of key features shown on the project page */
    features: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
          icon: z.string().optional().describe("Icon identifier from the design system"),
        }),
      )
      .default([]),

    /** Primary call-to-action */
    cta: z
      .object({
        label: z.string(),
        href: z.string().url(),
      })
      .optional(),

    /** ISO 8601 date string — used for ordering and sitemap */
    publishDate: z.coerce.date(),

    /** Draft entries are excluded from production builds */
    draft: z.boolean().default(false),
  }),
});

/* ------------------------------------------------------------------ */
/*  Pages collection                                                  */
/* ------------------------------------------------------------------ */

const pages = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    /** Page title — used in <title> and <h1> */
    title: z.string(),

    /** Meta description for SEO (<=160 chars recommended) */
    description: z.string(),

    /** Open Graph / social sharing image */
    ogImage: ogImageSchema,

    /** ISO 8601 date string */
    publishDate: z.coerce.date(),

    /** Draft entries are excluded from production builds */
    draft: z.boolean().default(false),
  }),
});

/* ------------------------------------------------------------------ */
/*  Export                                                             */
/* ------------------------------------------------------------------ */

export const collections = { projects, pages };
