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
    expect(html).toContain("Open Tools for");
    expect(html).toContain("Islamic Scholarly Research");
  });

  it("renders the hero subtitle", () => {
    expect(html).toContain(
      "NoorinALabs brings computational analysis to the Islamic scholarly",
    );
  });

  it("renders hero call-to-action links", () => {
    expect(html).toContain("Explore the Isnad Graph");
    expect(html).toContain('href="/about"');
    expect(html).toContain("Learn About Us");
  });

  it("renders the What We Do section", () => {
    expect(html).toContain("What We Do");
    expect(html).toContain("knowledge verification in human history");
  });

  it("renders the blockquote", () => {
    expect(html).toContain("Imam Muhammad ibn Sirin");
  });

  it("renders the Featured Project section", () => {
    expect(html).toContain("Featured Project");
    expect(html).toContain("The Isnad Graph");
    expect(html).toContain("computational hadith analysis platform");
  });

  it("renders the project card features list", () => {
    expect(html).toContain(
      "Interactive graph visualization of narrator networks",
    );
    expect(html).toContain(
      "Biographical profiles with teacher-student relationships",
    );
    expect(html).toContain(
      "Cross-collection search across major hadith sources",
    );
  });

  it("renders the Why NoorinALabs value propositions", () => {
    expect(html).toContain("Why NoorinALabs");
    expect(html).toContain("Open Source");
    expect(html).toContain("Scholarly Rigor");
    expect(html).toContain("Accessible to All");
    expect(html).toContain("Community Driven");
  });
});
