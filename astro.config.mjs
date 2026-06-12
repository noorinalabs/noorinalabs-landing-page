import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  // Canonical origin is the apex host. Per the deploy Caddy routing,
  // `noorinalabs.com` is what serves the landing page; `www.noorinalabs.com`
  // is a 301 redirect to the apex. Pointing `site` at the www host made every
  // canonical link, og:url, sitemap entry, and JSON-LD url emit a redirect hop
  // instead of the served origin (#120).
  site: "https://noorinalabs.com",
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
