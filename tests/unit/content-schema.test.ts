import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const contentDir = resolve(import.meta.dirname, "../../src/content");

describe("Content collection — projects/isnad-graph.mdx", () => {
  const raw = readFileSync(
    resolve(contentDir, "projects/isnad-graph.mdx"),
    "utf-8",
  );

  it("has a title in frontmatter", () => {
    expect(raw).toMatch(/^title:\s*.+/m);
  });

  it("has a description in frontmatter", () => {
    expect(raw).toMatch(/^description:\s*.+/m);
  });

  it("has a publishDate in frontmatter", () => {
    expect(raw).toMatch(/^publishDate:\s*.+/m);
  });

  it("has features array", () => {
    expect(raw).toMatch(/^features:/m);
  });
});

describe("Content collection — pages/about.mdx", () => {
  const raw = readFileSync(resolve(contentDir, "pages/about.mdx"), "utf-8");

  it("has a title in frontmatter", () => {
    expect(raw).toMatch(/^title:\s*.+/m);
  });

  it("has a description in frontmatter", () => {
    expect(raw).toMatch(/^description:\s*.+/m);
  });

  it("has a publishDate in frontmatter", () => {
    expect(raw).toMatch(/^publishDate:\s*.+/m);
  });
});

describe("Content config (content.config.ts)", () => {
  const raw = readFileSync(
    resolve(contentDir, "../content.config.ts"),
    "utf-8",
  );

  it("defines projects collection", () => {
    expect(raw).toContain("defineCollection");
    expect(raw).toContain("projects");
  });

  it("defines pages collection", () => {
    expect(raw).toContain("pages");
  });

  it("exports collections", () => {
    expect(raw).toContain("export const collections");
  });

  it("uses Zod schemas for validation", () => {
    expect(raw).toContain("z.object");
    expect(raw).toContain("z.string()");
  });

  it("projects schema has required fields", () => {
    expect(raw).toContain("title: z.string()");
    expect(raw).toContain("description: z.string()");
    expect(raw).toContain("publishDate: z.coerce.date()");
  });
});
