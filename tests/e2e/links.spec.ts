import { test, expect } from "@playwright/test";

test.describe("Link validation", () => {
  test("no broken internal links on homepage", async ({ page }) => {
    await page.goto("/");
    const links = page.locator('a[href^="/"]');
    const count = await links.count();

    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute("href");
      if (!href || href === "#main-content") continue;

      const response = await page.request.get(href);
      expect(
        response.ok(),
        `Broken link: ${href} returned ${response.status()}`,
      ).toBe(true);
    }
  });

  test("no broken internal links on about page", async ({ page }) => {
    await page.goto("/about");
    const links = page.locator('a[href^="/"]');
    const count = await links.count();

    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute("href");
      if (!href || href === "#main-content") continue;

      const response = await page.request.get(href);
      expect(
        response.ok(),
        `Broken link: ${href} returned ${response.status()}`,
      ).toBe(true);
    }
  });
});

test.describe("OG meta tags on all pages", () => {
  const pages = [
    { name: "homepage", url: "/" },
    { name: "about", url: "/about" },
    { name: "isnad-graph", url: "/projects/isnad-graph" },
  ];

  for (const p of pages) {
    test(`${p.name} has required OG meta tags`, async ({ page }) => {
      await page.goto(p.url);

      const ogTitle = page.locator('meta[property="og:title"]');
      await expect(ogTitle).toHaveCount(1);

      const ogDesc = page.locator('meta[property="og:description"]');
      await expect(ogDesc).toHaveCount(1);

      const ogImage = page.locator('meta[property="og:image"]');
      await expect(ogImage).toHaveCount(1);

      const ogType = page.locator('meta[property="og:type"]');
      await expect(ogType).toHaveCount(1);
    });
  }
});
