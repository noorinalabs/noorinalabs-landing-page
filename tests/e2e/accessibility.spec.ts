import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility", () => {
  test("homepage has no critical a11y violations", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    expect(results.violations.filter((v) => v.impact === "critical")).toEqual(
      [],
    );
  });

  test("about page has no critical a11y violations", async ({ page }) => {
    await page.goto("/about");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    expect(results.violations.filter((v) => v.impact === "critical")).toEqual(
      [],
    );
  });

  test("isnad-graph page has no critical a11y violations", async ({ page }) => {
    await page.goto("/projects/isnad-graph");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    expect(results.violations.filter((v) => v.impact === "critical")).toEqual(
      [],
    );
  });

  test("skip-to-content link exists and targets main", async ({ page }) => {
    await page.goto("/");
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toHaveCount(1);
    const main = page.locator("main#main-content");
    await expect(main).toHaveCount(1);
  });

  test("images have alt text", async ({ page }) => {
    await page.goto("/");
    const images = page.locator("img");
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute("alt");
      expect(alt).toBeTruthy();
    }
  });
});
