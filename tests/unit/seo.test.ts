import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const distDir = resolve(import.meta.dirname, "../../dist");

function readPage(path: string): string {
  return readFileSync(resolve(distDir, path), "utf-8");
}

describe("SEO — JSON-LD structured data", () => {
  const html = readPage("index.html");

  it("renders Organization schema", () => {
    expect(html).toContain('"@type":"Organization"');
    expect(html).toContain('"name":"Noorina Labs"');
  });

  it("renders WebSite schema", () => {
    expect(html).toContain('"@type":"WebSite"');
  });

  it("includes schema.org context", () => {
    expect(html).toContain('"@context":"https://schema.org"');
  });
});

describe("SEO — Isnad Graph project page JSON-LD", () => {
  const html = readPage("projects/isnad-graph/index.html");

  it("renders SoftwareApplication schema", () => {
    expect(html).toContain('"@type":"SoftwareApplication"');
  });

  it("includes application category", () => {
    expect(html).toContain('"applicationCategory":"EducationalApplication"');
  });

  it("includes free pricing offer", () => {
    expect(html).toContain('"price":"0"');
    expect(html).toContain('"priceCurrency":"USD"');
  });
});

describe("SEO — Open Graph meta tags", () => {
  const pages = [
    { name: "homepage", path: "index.html" },
    { name: "about", path: "about/index.html" },
    { name: "isnad-graph", path: "projects/isnad-graph/index.html" },
  ];

  for (const page of pages) {
    describe(page.name, () => {
      const html = readPage(page.path);

      it("has og:type", () => {
        expect(html).toMatch(/<meta property="og:type" content="[^"]+"/);
      });

      it("has og:title", () => {
        expect(html).toMatch(/<meta property="og:title" content="[^"]+"/);
      });

      it("has og:description", () => {
        expect(html).toMatch(/<meta property="og:description" content="[^"]+"/);
      });

      it("has og:image", () => {
        expect(html).toMatch(/<meta property="og:image" content="[^"]+"/);
      });

      it("has og:url", () => {
        expect(html).toMatch(/<meta property="og:url" content="[^"]+"/);
      });
    });
  }
});

describe("SEO — canonical URLs", () => {
  const pages = [
    { name: "homepage", path: "index.html" },
    { name: "about", path: "about/index.html" },
    { name: "isnad-graph", path: "projects/isnad-graph/index.html" },
  ];

  for (const page of pages) {
    it(`${page.name} has a canonical link`, () => {
      const html = readPage(page.path);
      expect(html).toMatch(/<link rel="canonical" href="[^"]+"/);
    });
  }
});

describe("SEO — meta descriptions", () => {
  const pages = [
    { name: "homepage", path: "index.html" },
    { name: "about", path: "about/index.html" },
    { name: "isnad-graph", path: "projects/isnad-graph/index.html" },
  ];

  for (const page of pages) {
    it(`${page.name} has a meta description`, () => {
      const html = readPage(page.path);
      expect(html).toMatch(/<meta name="description" content="[^"]+"/);
    });
  }
});

describe("SEO — Twitter card meta tags", () => {
  const html = readPage("index.html");

  it("has twitter:card", () => {
    expect(html).toMatch(
      /<meta name="twitter:card" content="summary_large_image"/,
    );
  });

  it("has twitter:title", () => {
    expect(html).toMatch(/<meta name="twitter:title" content="[^"]+"/);
  });

  it("has twitter:description", () => {
    expect(html).toMatch(/<meta name="twitter:description" content="[^"]+"/);
  });

  it("has twitter:image", () => {
    expect(html).toMatch(/<meta name="twitter:image" content="[^"]+"/);
  });
});
