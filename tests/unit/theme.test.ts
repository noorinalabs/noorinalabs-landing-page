import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import {
  STORAGE_KEY,
  getSystemTheme,
  readStoredChoice,
  resolveTheme,
  nextChoice,
  toggleLabel,
  applyChoice,
  initThemeToggle,
  type ThemeChoice,
} from "../../src/scripts/theme";

const distDir = resolve(import.meta.dirname, "../../dist");

function readPage(path: string): string {
  return readFileSync(resolve(distDir, path), "utf-8");
}

/** Stub matchMedia so `system` resolution is deterministic in happy-dom. */
function mockSystemDark(dark: boolean): void {
  window.matchMedia = ((query: string) => ({
    matches: dark && query.includes("dark"),
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

describe("theme model (#116)", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.removeAttribute("data-theme-choice");
  });

  it("cycles light → dark → system → light", () => {
    expect(nextChoice("light")).toBe("dark");
    expect(nextChoice("dark")).toBe("system");
    expect(nextChoice("system")).toBe("light");
  });

  it("resolves system to the OS preference and pins explicit choices", () => {
    mockSystemDark(true);
    expect(resolveTheme("system")).toBe("dark");
    expect(resolveTheme("light")).toBe("light");
    expect(resolveTheme("dark")).toBe("dark");

    mockSystemDark(false);
    expect(resolveTheme("system")).toBe("light");
  });

  it("getSystemTheme follows prefers-color-scheme", () => {
    mockSystemDark(true);
    expect(getSystemTheme()).toBe("dark");
    mockSystemDark(false);
    expect(getSystemTheme()).toBe("light");
  });

  it("defaults to system for unset or garbage stored values", () => {
    expect(readStoredChoice()).toBe("system");
    localStorage.setItem(STORAGE_KEY, "purple");
    expect(readStoredChoice()).toBe("system");
    localStorage.setItem(STORAGE_KEY, "dark");
    expect(readStoredChoice()).toBe("dark");
  });

  it("builds an accessible label naming the next choice", () => {
    expect(toggleLabel("light")).toContain("light");
    expect(toggleLabel("light")).toContain("switch to dark");
    expect(toggleLabel("system")).toContain("switch to light");
  });

  it("applyChoice writes both <html> attributes (resolved + choice)", () => {
    mockSystemDark(true);
    applyChoice("system");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.dataset.themeChoice).toBe("system");

    applyChoice("light");
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(document.documentElement.dataset.themeChoice).toBe("light");
  });
});

describe("initThemeToggle wiring (#116)", () => {
  beforeEach(() => {
    mockSystemDark(false);
    localStorage.clear();
    document.documentElement.dataset.theme = "light";
    document.documentElement.dataset.themeChoice = "system";
    document.body.innerHTML = `<button data-theme-toggle aria-label="Switch color theme"></button>`;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  function btn(): HTMLButtonElement {
    return document.querySelector<HTMLButtonElement>("[data-theme-toggle]")!;
  }

  it("on click: cycles the choice, persists it, and repaints data-theme", () => {
    initThemeToggle();
    // starts at system (default) → click → light
    btn().click();
    expect(localStorage.getItem(STORAGE_KEY)).toBe("light");
    expect(document.documentElement.dataset.themeChoice).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("light");

    // light → dark
    btn().click();
    expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");

    // dark → system (OS=light here) → resolves to light
    btn().click();
    expect(localStorage.getItem(STORAGE_KEY)).toBe("system");
    expect(document.documentElement.dataset.themeChoice).toBe("system");
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("starts the cycle from the persisted choice", () => {
    localStorage.setItem(STORAGE_KEY, "light" satisfies ThemeChoice);
    initThemeToggle();
    btn().click(); // light → dark
    expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");
  });

  it("updates the toggle's accessible label as it cycles", () => {
    initThemeToggle();
    btn().click();
    expect(btn().getAttribute("aria-label")).toContain("light");
    expect(btn().getAttribute("aria-label")).toContain("switch to dark");
  });

  it("is idempotent — a second init does not double-bind the handler", () => {
    initThemeToggle();
    initThemeToggle();
    btn().click(); // a double-bound handler would advance two steps
    expect(localStorage.getItem(STORAGE_KEY)).toBe("light");
  });
});

describe("Header theme-toggle markup (#116)", () => {
  const html = readPage("index.html");

  it("renders the toggle button in the header", () => {
    expect(html).toContain("data-theme-toggle");
  });

  it("ships all three choice icons (light/dark/system)", () => {
    expect(html).toContain("theme-icon-light");
    expect(html).toContain("theme-icon-dark");
    expect(html).toContain("theme-icon-system");
  });

  it("server-renders the no-JS theme defaults on <html>", () => {
    expect(html).toContain('data-theme="light"');
    expect(html).toContain('data-theme-choice="system"');
  });
});
