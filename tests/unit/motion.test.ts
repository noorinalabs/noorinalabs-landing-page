import { describe, it, expect, beforeEach } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { initMotion } from "../../src/scripts/motion";

const distDir = resolve(import.meta.dirname, "../../dist");

function readPage(path: string): string {
  return readFileSync(resolve(distDir, path), "utf-8");
}

describe("Homepage motion markup (#121)", () => {
  const html = readPage("index.html");

  it("marks the hero decorative layer as a parallax target", () => {
    expect(html).toContain("data-parallax");
    expect(html).toContain('data-parallax-speed="0.18"');
  });

  it("opts page sections/cards into scroll-reveal", () => {
    const count = (html.match(/data-reveal/g) ?? []).length;
    // Hero + section titles/intros + cards + stats — a generous lower bound.
    expect(count).toBeGreaterThanOrEqual(8);
  });

  it("emits the reveal class so content is visible by default (gated by motion-ready)", () => {
    expect(html).toMatch(/class="[^"]*\breveal\b[^"]*"/);
  });
});

describe("initMotion reduced-motion guard (#121)", () => {
  beforeEach(() => {
    document.documentElement.className = "";
    // happy-dom lacks IntersectionObserver — stub a no-op so the non-reduced
    // path doesn't bail on the missing-API check.
    (
      globalThis as unknown as { IntersectionObserver: unknown }
    ).IntersectionObserver = class {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    };
  });

  function mockReducedMotion(reduce: boolean): void {
    window.matchMedia = ((query: string) => ({
      matches: reduce && query.includes("reduce"),
      media: query,
      onchange: null,
      addEventListener(): void {},
      removeEventListener(): void {},
      addListener(): void {},
      removeListener(): void {},
      dispatchEvent(): boolean {
        return false;
      },
    })) as typeof window.matchMedia;
  }

  it("does NOT add motion-ready when the user prefers reduced motion", () => {
    mockReducedMotion(true);
    initMotion();
    expect(document.documentElement.classList.contains("motion-ready")).toBe(
      false,
    );
  });

  it("adds motion-ready when motion is allowed", () => {
    mockReducedMotion(false);
    initMotion();
    expect(document.documentElement.classList.contains("motion-ready")).toBe(
      true,
    );
  });
});
