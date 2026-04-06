import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const distDir = resolve(import.meta.dirname, "../../dist");

function readPage(path: string): string {
  return readFileSync(resolve(distDir, path), "utf-8");
}

describe("BaseLayout", () => {
  const html = readPage("index.html");

  it("renders valid HTML5 document", () => {
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain('<html lang="en" dir="ltr">');
    expect(html).toContain('<meta charset="utf-8">');
    expect(html).toContain("viewport");
  });

  it("renders title with site suffix", () => {
    expect(html).toContain("<title>Home | NoorinALabs</title>");
  });

  it("renders meta description", () => {
    expect(html).toMatch(/<meta name="description" content="[^"]+"/);
  });

  it("renders canonical link", () => {
    expect(html).toMatch(/<link rel="canonical" href="[^"]+"/);
  });

  it("renders favicon link", () => {
    expect(html).toContain('href="/favicon.svg"');
  });
});

describe("PageLayout", () => {
  const html = readPage("index.html");

  it("renders header with banner role", () => {
    expect(html).toContain('role="banner"');
  });

  it("renders main content area", () => {
    expect(html).toContain('id="main-content"');
    expect(html).toContain("<main");
  });

  it("renders footer with contentinfo role", () => {
    expect(html).toContain('role="contentinfo"');
  });
});

describe("ProjectLayout", () => {
  const html = readPage("projects/isnad-graph/index.html");

  it("renders project hero with title", () => {
    expect(html).toContain('id="project-title"');
  });

  it("renders project description", () => {
    expect(html).toContain("computational hadith analysis platform");
  });

  it("renders features grid when features are provided", () => {
    expect(html).toContain('aria-label="Key features"');
  });
});
