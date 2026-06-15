import { describe, it, expect } from "vitest";
import { PROD_ISNAD_URL, isnadAppUrlFromHostname } from "../../src/lib/isnad";

describe("isnadAppUrlFromHostname", () => {
  it("returns the prod isnad URL for noorinalabs.com", () => {
    expect(isnadAppUrlFromHostname("noorinalabs.com")).toBe(
      "https://isnad.noorinalabs.com",
    );
  });

  it("strips a leading www. before constructing the URL", () => {
    expect(isnadAppUrlFromHostname("www.noorinalabs.com")).toBe(
      "https://isnad.noorinalabs.com",
    );
  });

  it("returns the stg isnad URL for stg.noorinalabs.com", () => {
    expect(isnadAppUrlFromHostname("stg.noorinalabs.com")).toBe(
      "https://isnad.stg.noorinalabs.com",
    );
  });

  it("falls back to PROD_ISNAD_URL for an empty hostname", () => {
    expect(isnadAppUrlFromHostname("")).toBe(PROD_ISNAD_URL);
  });

  it("PROD_ISNAD_URL is the canonical production URL", () => {
    expect(PROD_ISNAD_URL).toBe("https://isnad.noorinalabs.com");
  });
});
