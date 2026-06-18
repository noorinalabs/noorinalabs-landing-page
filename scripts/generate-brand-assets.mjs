#!/usr/bin/env node
/**
 * generate-brand-assets.mjs — render the landing page's brand-derived raster
 * assets from vector sources.
 *
 * What it produces (all under public/):
 *   - apple-touch-icon.png            180×180  iOS home-screen icon
 *   - icon-192.png / icon-512.png     PWA / web-manifest icons (maskable-safe)
 *   - favicon-32x32.png / -16x16.png  PNG favicon fallbacks for older browsers
 *   - images/og/default.png           1200×630 default Open Graph / social card
 *   - images/og/isnad-graph.png       1200×630 Isnad Graph project social card
 *
 * These are direction-INDEPENDENT, brand-derived assets: they reuse the
 * eight-point-star mark and navy/gold palette already shipped in favicon.svg
 * (#69). The photographic / illustrative imagery for the page body (hero,
 * section illustrations, project showcase) is deliberately NOT generated here —
 * that is blocked on the owner's creative-direction pick in lp#139.
 *
 * Re-run with:  npm run assets:brand
 * Text is rendered with the metric-compatible system fonts available in CI
 * (Liberation/DejaVu) so output is reproducible without bundling font binaries.
 */
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = resolve(ROOT, "public");

/* Brand anchors — kept as literal hex (mirrors favicon.svg) so rendering does
 * not depend on CSS-variable availability. */
const NAVY_900 = "#16213e";
const NAVY_800 = "#1e2d54";
const NAVY_700 = "#27396e";
const GOLD = "#d4a22e";
const GOLD_LIGHT = "#e6bd5c";
const PAPER = "#f7f4ed";

const SANS = "'Liberation Sans', 'DejaVu Sans', 'Arial', sans-serif";
const SERIF = "'Liberation Serif', 'DejaVu Serif', 'Georgia', serif";

/* The eight-point star mark, authored in a 0..32 coordinate space (identical
 * geometry to favicon.svg). `markGroup` re-places it at any size/position. */
const STAR_PATH =
  "M16 4 18.4 9.9 24 7.5 21.6 13.4 27.5 16 21.6 18.6 24 24.5 18.4 22.1 16 28 " +
  "13.6 22.1 8 24.5 10.4 18.6 4.5 16 10.4 13.4 8 7.5 13.6 9.9Z";

/** Render the star mark at (cx,cy) with the given on-canvas diameter. */
function markGroup(
  cx,
  cy,
  size,
  { fill = GOLD, holeFill = NAVY_900, opacity = 1, hole = true } = {},
) {
  const scale = size / 32;
  const x = cx - size / 2;
  const y = cy - size / 2;
  const center = hole
    ? `<circle cx="16" cy="16" r="3.1" fill="${holeFill}"/>`
    : "";
  return `
    <g transform="translate(${x} ${y}) scale(${scale})" opacity="${opacity}">
      <path d="${STAR_PATH}" fill="${fill}"/>
      ${center}
    </g>`;
}

/**
 * Greedy word-wrap. Returns the wrapped lines as an array. Width is estimated
 * from an average glyph-width factor (no font metrics needed for the small set
 * of layout-stable headline strings rendered here).
 */
function wrapLines(text, { maxWidth, fontSize, factor }) {
  const charW = fontSize * factor;
  const maxChars = Math.max(1, Math.floor(maxWidth / charW));
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Render an array of lines as <tspan>s from baseline `y`, advancing `lineHeight`. */
function tspans(lines, { x, y, lineHeight }) {
  return lines
    .map(
      (l, i) =>
        `<tspan x="${x}" y="${y + i * lineHeight}">${escapeXml(l)}</tspan>`,
    )
    .join("");
}

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Build a 1200×630 Open Graph card SVG. */
function ogCardSvg({ eyebrow, title, subtitle }) {
  const W = 1200;
  const H = 630;
  const PAD = 80;

  // Title (serif) — wrap, then lay the subtitle out beneath the actual block.
  const TITLE_SIZE = 64;
  const TITLE_LH = 76;
  const TITLE_TOP = 292;
  const titleLines = wrapLines(title, {
    maxWidth: W - 2 * PAD,
    fontSize: TITLE_SIZE,
    factor: 0.5,
  });

  const SUB_SIZE = 29;
  const SUB_LH = 40;
  const subTop = TITLE_TOP + titleLines.length * TITLE_LH + 30;
  const subLines = wrapLines(subtitle, {
    maxWidth: W - 2 * PAD,
    fontSize: SUB_SIZE,
    factor: 0.52,
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${NAVY_900}"/>
      <stop offset="0.5" stop-color="${NAVY_800}"/>
      <stop offset="1" stop-color="${NAVY_700}"/>
    </linearGradient>
    <pattern id="weave" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <path d="M0 30 H60 M30 0 V60" stroke="${GOLD}" stroke-width="1" opacity="0.10"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#weave)"/>

  <!-- faint oversized mark, bleeding off the right edge -->
  ${markGroup(1090, 140, 470, { opacity: 0.07, hole: false })}

  <!-- top: mark + wordmark -->
  ${markGroup(PAD + 28, 96, 64)}
  <text x="${PAD + 76}" y="108" font-family="${SANS}" font-size="34" font-weight="700"
        letter-spacing="6" fill="${PAPER}">NOORINA LABS</text>

  <!-- gold rule -->
  <rect x="${PAD}" y="156" width="120" height="4" rx="2" fill="${GOLD}"/>

  <!-- eyebrow -->
  <text x="${PAD}" y="224" font-family="${SANS}" font-size="26" font-weight="600"
        letter-spacing="4" fill="${GOLD_LIGHT}">${escapeXml(eyebrow.toUpperCase())}</text>

  <!-- title -->
  <text font-family="${SERIF}" font-size="${TITLE_SIZE}" font-weight="700" fill="${PAPER}">
    ${tspans(titleLines, { x: PAD, y: TITLE_TOP, lineHeight: TITLE_LH })}
  </text>

  <!-- subtitle -->
  <text font-family="${SANS}" font-size="${SUB_SIZE}" fill="#c9d2e6">
    ${tspans(subLines, { x: PAD, y: subTop, lineHeight: SUB_LH })}
  </text>

  <!-- footer domain -->
  <text x="${PAD}" y="592" font-family="${SANS}" font-size="24" font-weight="600"
        letter-spacing="2" fill="${GOLD}">noorinalabs.com</text>
</svg>`;
}

/** Build a square icon SVG (solid navy field + centred mark, maskable-safe). */
function iconSvg(size, { rounded = false } = {}) {
  const radius = rounded ? Math.round(size * 0.2) : 0;
  // Mark fills ~56% of the canvas → stays inside the maskable safe zone (80%).
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="${NAVY_900}"/>
  ${markGroup(size / 2, size / 2, size * 0.56)}
</svg>`;
}

async function png(svg, outPath, { width, height, palette = true } = {}) {
  // Render the SVG supersampled (2×) for crisp anti-aliasing, then downscale to
  // the exact target dimensions.
  const buf = Buffer.from(svg);
  const out = resolve(PUBLIC, outPath);
  await mkdir(dirname(out), { recursive: true });
  await sharp(buf, { density: 144 })
    .resize(width, height, { fit: "fill" })
    .png({ compressionLevel: 9, palette })
    .toFile(out);
  return out;
}

async function main() {
  const jobs = [];

  // App / favicon icons (square; sized to exact pixel dimensions)
  const icons = [
    ["apple-touch-icon.png", 180],
    ["icon-512.png", 512],
    ["icon-192.png", 192],
    ["favicon-32x32.png", 32],
    ["favicon-16x16.png", 16],
  ];
  for (const [name, size] of icons) {
    jobs.push(png(iconSvg(size), name, { width: size, height: size }));
  }

  // Open Graph social cards (1200×630; full-colour, not palette-quantised, so
  // the navy gradient stays smooth)
  const og = { width: 1200, height: 630, palette: false };
  jobs.push(
    png(
      ogCardSvg({
        eyebrow: "Islamic scholarly research",
        title: "Illuminating Fourteen Centuries of Islamic Scholarship",
        subtitle:
          "Open computational tools to make the Islamic scholarly tradition navigable, searchable, and accessible to all.",
      }),
      "images/og/default.png",
      og,
    ),
  );
  jobs.push(
    png(
      ogCardSvg({
        eyebrow: "A Noorina Labs project",
        title: "Isnad Graph",
        subtitle:
          "A computational hadith analysis platform that maps chains of narration as an interactive, searchable graph.",
      }),
      "images/og/isnad-graph.png",
      og,
    ),
  );

  const written = await Promise.all(jobs);
  for (const f of written) {
    process.stdout.write(`  wrote ${f.replace(ROOT + "/", "")}\n`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
