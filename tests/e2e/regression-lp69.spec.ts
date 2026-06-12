import { test, expect } from "@playwright/test";

/*
 * Regression coverage for landing-page#69 (lp#113).
 *
 * lp#69 reported four distinct "polish" symptom classes that all shipped a
 * green CI because none of the existing axe / links / responsive suites
 * intersect them. PR #112 fixed all four, but added no assertions — so a
 * recurrence of any symptom would ship green again.
 *
 * Each test below asserts the *specific* symptom (not a tautology) and is
 * written to FAIL against the pre-#112 tree:
 *   1. Favicon present + a real SVG document (was 404 — no asset in public/)
 *   2. .btn-primary computed background is brand gold, not the design-system
 *      primary-orange (the import-order cascade bug)
 *   3. Project feature icons render as inline <svg>, not the literal icon name
 *      ("graph", "user", …) as text
 *   4. Subroutes ship their per-component CSS (ProjectLayout / about.astro had
 *      no <style> block, so component styles were absent)
 */

test.describe("lp#69 regression — visible polish symptom classes", () => {
  // Symptom 3: favicon referenced in <head> but the asset was missing → 404.
  test("favicon link resolves to a valid SVG document (#69 symptom 3)", async ({
    page,
  }) => {
    await page.goto("/");

    const icon = page.locator('link[rel="icon"]');
    await expect(icon).toHaveCount(1);
    await expect(icon).toHaveAttribute("type", "image/svg+xml");

    const href = await icon.getAttribute("href");
    expect(href, "favicon link must declare an href").toBeTruthy();

    const res = await page.request.get(href!);
    expect(res.status(), `favicon ${href} should return 200, not 404`).toBe(
      200,
    );
    expect(res.headers()["content-type"]).toContain("svg");

    const body = (await res.text()).trimStart();
    expect(
      body.startsWith("<svg"),
      "favicon body must be an <svg> document, not an error page",
    ).toBe(true);
  });

  // Symptom 4: design-system .btn-primary loaded *after* global.css and won the
  // cascade at equal specificity → brand-gold buttons rendered DS orange. The
  // fix swaps the import order so the LP brand rule wins. We assert the computed
  // background equals the brand --color-gold-500 token (resolved through a probe
  // so both values serialize in the same colour space). If the DS rule wins
  // again, the computed background is orange and this comparison fails.
  test(".btn-primary renders brand gold, not design-system orange (#69 symptom 4)", async ({
    page,
  }) => {
    await page.goto("/");

    const btn = page.locator(".btn-primary").first();
    await expect(btn).toBeVisible();

    const { btnBg, goldToken } = await btn.evaluate((el) => {
      const probe = document.createElement("span");
      probe.style.backgroundColor = "var(--color-gold-500)";
      document.body.appendChild(probe);
      const gold = getComputedStyle(probe).backgroundColor;
      probe.remove();
      return {
        btnBg: getComputedStyle(el).backgroundColor,
        goldToken: gold,
      };
    });

    expect(
      btnBg,
      `.btn-primary background ${btnBg} must equal brand gold ${goldToken} (DS orange means the cascade regressed)`,
    ).toBe(goldToken);
  });

  // Symptom 2: feature icons rendered as literal text ("graph", "user", …)
  // because the DS Icon component is React-only and the raw name was emitted.
  // The fix renders an inline <svg> via Icon.astro.
  test("project feature icons render as inline SVG, not literal text (#69 symptom 2)", async ({
    page,
  }) => {
    await page.goto("/projects/isnad-graph");

    const icons = page.locator(".feature-icon");
    const count = await icons.count();
    expect(count, "project page must render feature icons").toBeGreaterThan(0);

    // Every icon wrapper contains an inline <svg> …
    await expect(icons.locator("svg")).toHaveCount(count);

    // … and none leaks its raw icon name as text content.
    for (let i = 0; i < count; i++) {
      const text = await icons
        .nth(i)
        .evaluate((el) => (el.textContent ?? "").trim());
      expect(
        text,
        `feature-icon #${i} leaked literal text "${text}" (icon rendered as text, not SVG)`,
      ).toBe("");
    }
  });

  // Symptom 1: ProjectLayout and about.astro shipped no <style> block, so
  // /projects/[slug] and /about rendered with their component CSS missing. We
  // assert a component-only computed property on each route — values that can
  // only come from the per-component <style> blocks added in #112.
  test("subroutes ship their per-component CSS (#69 symptom 1)", async ({
    page,
  }) => {
    // /projects/[slug] — ProjectLayout's scoped .feature-card styling.
    await page.goto("/projects/isnad-graph");

    const card = page.locator(".feature-card").first();
    await expect(card).toBeVisible();

    const cardStyle = await card.evaluate((el) => {
      const s = getComputedStyle(el);
      return { paddingTop: s.paddingTop, borderTopStyle: s.borderTopStyle };
    });
    expect(
      parseFloat(cardStyle.paddingTop),
      ".feature-card must have component padding (ProjectLayout CSS present)",
    ).toBeGreaterThan(0);
    expect(
      cardStyle.borderTopStyle,
      ".feature-card must have a component border (ProjectLayout CSS present)",
    ).not.toBe("none");

    // /about — about.astro's scoped .about-page wrapper styling.
    await page.goto("/about");

    const about = page.locator(".about-page");
    await expect(about).toHaveCount(1);

    const maxWidth = await about.evaluate(
      (el) => getComputedStyle(el).maxWidth,
    );
    expect(
      maxWidth,
      ".about-page must have a component max-width (about.astro CSS present)",
    ).not.toBe("none");
  });
});
