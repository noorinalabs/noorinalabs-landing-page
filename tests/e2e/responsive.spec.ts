import { test, expect } from "@playwright/test";

test.describe("Responsive behavior", () => {
  test("hero section is visible on all viewports", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator(".hero");
    await expect(hero).toBeVisible();
  });

  test("navigation landmark is visible", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator('nav[aria-label="Primary navigation"]');
    await expect(nav).toBeVisible();
  });

  test("mobile-nav: toggle button visible only on small viewports", async ({
    page,
  }, testInfo) => {
    await page.goto("/");
    const toggle = page.locator("[data-nav-toggle]");
    const viewportWidth = page.viewportSize()?.width ?? 0;
    if (viewportWidth < 640) {
      await expect(toggle).toBeVisible();
    } else {
      await expect(toggle).toBeHidden();
    }
  });

  test("mobile-nav: list hidden by default on small viewports, visible on desktop", async ({
    page,
  }) => {
    await page.goto("/");
    const list = page.locator("#primary-nav");
    const viewportWidth = page.viewportSize()?.width ?? 0;
    if (viewportWidth < 640) {
      await expect(list).toBeHidden();
    } else {
      await expect(list).toBeVisible();
    }
  });

  test("mobile-nav: toggle opens and closes the menu (mobile only)", async ({
    page,
  }, testInfo) => {
    test.skip(
      (page.viewportSize()?.width ?? 0) >= 640,
      "toggle is hidden above 640px",
    );
    await page.goto("/");
    const toggle = page.locator("[data-nav-toggle]");
    const list = page.locator("#primary-nav");

    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(list).toBeHidden();

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(list).toBeVisible();

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(list).toBeHidden();
  });

  test("mobile-nav: Escape key closes the menu (mobile only)", async ({
    page,
  }) => {
    test.skip(
      (page.viewportSize()?.width ?? 0) >= 640,
      "toggle is hidden above 640px",
    );
    await page.goto("/");
    const toggle = page.locator("[data-nav-toggle]");
    const list = page.locator("#primary-nav");

    await toggle.click();
    await expect(list).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(list).toBeHidden();
  });

  test("mobile-nav: clicking a link closes the menu (mobile only)", async ({
    page,
  }) => {
    test.skip(
      (page.viewportSize()?.width ?? 0) >= 640,
      "toggle is hidden above 640px",
    );
    await page.goto("/about");
    const toggle = page.locator("[data-nav-toggle]");
    const list = page.locator("#primary-nav");

    await toggle.click();
    await expect(list).toBeVisible();

    await list.locator('a[href="/"]').click();
    await page.waitForURL("**/");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  test("footer is visible", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator('footer[role="contentinfo"]');
    await expect(footer).toBeVisible();
  });

  test("capability cards are rendered", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator(".capability-card");
    await expect(cards).toHaveCount(5);
  });

  test("partnership cards are rendered", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator(".partnership-card");
    await expect(cards).toHaveCount(3);
  });
});
