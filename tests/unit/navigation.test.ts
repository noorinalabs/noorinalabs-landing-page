import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const distDir = resolve(import.meta.dirname, "../../dist");

function readPage(path: string): string {
  return readFileSync(resolve(distDir, path), "utf-8");
}

describe("Navigation", () => {
  const html = readPage("index.html");

  it("renders the site logo linking to home", () => {
    expect(html).toContain('aria-label="NoorinALabs home"');
    expect(html).toContain("NoorinALabs");
  });

  it("renders primary navigation links", () => {
    expect(html).toContain('aria-label="Primary navigation"');
    expect(html).toContain(">Home</");
    expect(html).toContain(">About</");
    expect(html).toContain(">Projects</");
  });

  it("renders footer with project links", () => {
    expect(html).toContain("Isnad Graph");
  });

  it("renders footer with organization links", () => {
    expect(html).toContain('href="https://github.com/noorinalabs"');
    expect(html).toContain("GitHub");
  });

  it("renders footer copyright", () => {
    expect(html).toContain("NoorinALabs. All rights reserved.");
  });

  it("includes skip-to-content link", () => {
    expect(html).toContain('href="#main-content"');
    expect(html).toContain("Skip to main content");
  });
});
