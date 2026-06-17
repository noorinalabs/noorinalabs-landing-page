import { test, expect, type Page } from "@playwright/test";

/*
 * Dark-mode toggle (#116)
 * =======================
 * The header toggle cycles data-theme-choice light → dark → system and writes
 * the resolved light|dark to <html data-theme>, which is the only thing the
 * design system's [data-theme] token blocks read. These tests pin the OS
 * preference (emulateMedia) so `system` is deterministic, then assert that
 * flipping the toggle actually re-resolves the DS colour tokens and that the
 * choice survives navigation.
 */

const toggle = "[data-theme-toggle]";

/** Resolved value of a DS colour token on <html> — empty if tokens don't resolve. */
async function bgToken(page: Page): Promise<string> {
  return page.evaluate(() =>
    getComputedStyle(document.documentElement)
      .getPropertyValue("--color-background")
      .trim(),
  );
}

async function choice(page: Page): Promise<string | null> {
  return page.evaluate(
    () => document.documentElement.dataset.themeChoice ?? null,
  );
}

async function resolved(page: Page): Promise<string | null> {
  return page.evaluate(() => document.documentElement.dataset.theme ?? null);
}

/** Click the toggle until data-theme-choice reaches the target (max one full cycle). */
async function cycleTo(page: Page, target: string): Promise<void> {
  for (let i = 0; i < 3 && (await choice(page)) !== target; i++) {
    await page.locator(toggle).click();
  }
  expect(await choice(page)).toBe(target);
}

test.describe("Dark-mode toggle (#116)", () => {
  test.use({ colorScheme: "light" });

  test("no flash: data-theme + DS tokens resolve on first load", async ({
    page,
  }) => {
    await page.goto("/");
    // The pre-paint inline init must have set both attributes.
    expect(await resolved(page)).toMatch(/^(light|dark)$/);
    expect(await choice(page)).toBe("system");
    // Memory regression guard: tokens are EMPTY unless data-theme is set.
    expect(await bgToken(page)).not.toBe("");
  });

  test("toggle flips the resolved theme and re-resolves DS colour tokens", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator(toggle)).toBeVisible();

    await cycleTo(page, "light");
    const bgLight = await bgToken(page);
    expect(await resolved(page)).toBe("light");

    await cycleTo(page, "dark");
    const bgDark = await bgToken(page);
    expect(await resolved(page)).toBe("dark");

    // The actual painted colour token must differ between light and dark.
    expect(bgDark).not.toBe(bgLight);
    expect(bgLight).not.toBe("");
    expect(bgDark).not.toBe("");
  });

  test("choice persists across navigation (localStorage)", async ({ page }) => {
    await page.goto("/");
    await cycleTo(page, "dark");
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe(
      "dark",
    );

    await page.goto("/team");
    // No flash on the next page either — dark is applied pre-paint.
    expect(await resolved(page)).toBe("dark");
    expect(await choice(page)).toBe("dark");
  });

  test("system mode tracks the OS preference", async ({ page }) => {
    await page.goto("/");
    await cycleTo(page, "system");
    expect(await resolved(page)).toBe("light"); // colorScheme: light

    await page.emulateMedia({ colorScheme: "dark" });
    // The matchMedia change listener re-resolves without a reload.
    await expect.poll(() => resolved(page)).toBe("dark");
    expect(await choice(page)).toBe("system"); // choice itself unchanged
  });
});
