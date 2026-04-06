import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const distDir = resolve(import.meta.dirname, "../../dist");

function readPage(path: string): string {
  return readFileSync(resolve(distDir, path), "utf-8");
}

describe("Homepage (index.html)", () => {
  const html = readPage("index.html");

  it("renders the hero heading", () => {
    expect(html).toContain("Illuminating Fourteen Centuries");
    expect(html).toContain("Islamic Scholarship");
  });

  it("renders the hero subtitle", () => {
    expect(html).toContain(
      "The Islamic scholarly tradition represents over fourteen centuries",
    );
  });

  it("renders the four pillars", () => {
    expect(html).toContain("Open Research");
    expect(html).toContain("Global Reach");
    expect(html).toContain("Source-Neutral");
    expect(html).toContain("Community-Built");
  });

  it("renders hero call-to-action links", () => {
    expect(html).toContain('href="/projects/isnad-graph"');
    expect(html).toContain("Explore the Isnad Graph");
    expect(html).toContain('href="/about"');
    expect(html).toContain("Learn About Us");
  });

  it("renders the guiding principle", () => {
    expect(html).toContain("illuminates");
    expect(html).toContain("does not arbitrate");
  });

  it("renders The Problem section with stats", () => {
    expect(html).toContain("The Problem");
    expect(html).toContain("1.9B");
    expect(html).toContain("14+");
    expect(html).toContain("cross-tradition graph tools");
  });

  it("renders the Isnad Graph capabilities", () => {
    expect(html).toContain("Cross-Collection Search");
    expect(html).toContain("Graph Explorer");
    expect(html).toContain("Cross-Tradition Comparison");
    expect(html).toContain("Historical Context");
    expect(html).toContain("Collection-Level Analysis");
  });

  it("renders the Why Now section", () => {
    expect(html).toContain("Why Now");
    expect(html).toContain("Computational Tools Have Matured");
    expect(html).toContain("Open Data Is Available");
    expect(html).toContain("Institutional Appetite Is Growing");
  });

  it("renders the Partnership section", () => {
    expect(html).toContain("Partner With Us");
    expect(html).toContain("Research Partnership");
    expect(html).toContain("Institutional License");
    expect(html).toContain("Grant & Philanthropic");
  });

  it("renders the contact email", () => {
    expect(html).toContain("info@noorinalabs.com");
  });
});
