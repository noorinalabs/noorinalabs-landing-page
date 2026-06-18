/*
 * Theme runtime (#116)
 * ====================
 * Drives the header dark-mode toggle (src/components/ThemeToggle.astro). The
 * pre-paint inline init in BaseLayout.astro already set both attributes on
 * <html> before first paint (no FOUC); this module only makes the toggle
 * interactive and keeps `system` mode live.
 *
 * Model (mirrors isnad-graph's useTheme — frontend/src/hooks/useTheme.ts):
 *   - choice   ∈ {light, dark, system}  — the user's selection, persisted in
 *               localStorage under `theme`, reflected on <html data-theme-choice>.
 *   - resolved ∈ {light, dark}          — what is actually painted, written to
 *               <html data-theme>; this is the only thing the design system's
 *               `[data-theme]` token blocks read. `system` resolves via the OS
 *               `prefers-color-scheme`.
 *
 * Tri-state so a user who never touched the toggle (or who explicitly wants to
 * follow the OS) keeps tracking `prefers-color-scheme`, while an explicit
 * light/dark choice pins the theme across navigation and sessions.
 */

export type ThemeChoice = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

/** localStorage key. Kept as `theme` to match the existing BaseLayout init. */
export const STORAGE_KEY = "theme";

/** The cycle order the toggle steps through on each activation. */
const CYCLE: readonly ThemeChoice[] = ["light", "dark", "system"];

/** The OS preference, defensively returning `light` when matchMedia is absent. */
export function getSystemTheme(): ResolvedTheme {
  return typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Read the persisted choice, defaulting to `system` for unset/garbage values. */
export function readStoredChoice(): ThemeChoice {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    /* localStorage unavailable — fall through to the default */
  }
  return "system";
}

/** Resolve a choice to the concrete theme that gets painted. */
export function resolveTheme(choice: ThemeChoice): ResolvedTheme {
  return choice === "system" ? getSystemTheme() : choice;
}

/** The next choice in the light → dark → system → light cycle. */
export function nextChoice(choice: ThemeChoice): ThemeChoice {
  return CYCLE[(CYCLE.indexOf(choice) + 1) % CYCLE.length];
}

/** Human-readable accessible name for the toggle in its current state. */
export function toggleLabel(choice: ThemeChoice): string {
  return `Color theme: ${choice}. Activate to switch to ${nextChoice(choice)}.`;
}

/**
 * Apply a choice: write both <html> attributes and reflect the state onto the
 * toggle button (if present). Does NOT persist — callers decide when to write
 * localStorage so a live OS change in `system` mode doesn't rewrite storage.
 */
export function applyChoice(
  choice: ThemeChoice,
  button?: HTMLElement | null,
): void {
  const root = document.documentElement;
  root.dataset.theme = resolveTheme(choice);
  root.dataset.themeChoice = choice;
  if (button) {
    button.setAttribute("aria-label", toggleLabel(choice));
    button.setAttribute("title", toggleLabel(choice));
  }
}

/** Persist the choice, swallowing storage failures (private mode, etc.). */
function persistChoice(choice: ThemeChoice): void {
  try {
    localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    /* persistence unavailable — the in-session attribute change still holds */
  }
}

/**
 * Wire up the header toggle. Safe to call once per page load. Idempotent: if no
 * toggle is on the page (or it has already been initialised) it is a no-op.
 */
export function initThemeToggle(): void {
  const button = document.querySelector<HTMLButtonElement>(
    "[data-theme-toggle]",
  );
  if (!button || button.dataset.themeReady === "true") return;
  button.dataset.themeReady = "true";

  // The inline init already painted the correct theme; sync the button's label
  // to the current choice without re-touching the attributes mid-load.
  let choice = readStoredChoice();
  button.setAttribute("aria-label", toggleLabel(choice));
  button.setAttribute("title", toggleLabel(choice));

  button.addEventListener("click", () => {
    choice = nextChoice(choice);
    persistChoice(choice);
    applyChoice(choice, button);
  });

  // Keep `system` live: when the OS flips, re-resolve without rewriting storage
  // (storage still holds `system`, so the choice itself is unchanged).
  if (typeof window.matchMedia === "function") {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", () => {
      if (choice === "system") applyChoice(choice, button);
    });
  }
}
