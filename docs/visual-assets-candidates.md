# Candidate Visual Assets — Owner Selection (lp#139)

**Status:** Awaiting owner decision · **Wave:** P5W5 (pre-launch polish) · **Author:** Cédric Novák
**Issue:** [noorinalabs-landing-page#139](https://github.com/noorinalabs/noorinalabs-landing-page/issues/139)
**Sibling:** [lp#138](https://github.com/noorinalabs/noorinalabs-landing-page/issues/138) (fake/placeholder staff sweep) · **Predecessor:** lp#37 (source + integrate visual assets)

---

## Purpose

The landing page currently ships **zero imagery** — the only binary asset in the repo is
`public/favicon.svg`. Every surface today is color + type only, drawn entirely from the
`@noorinalabs/design-system` semantic tokens (warm **parchment / sienna / ink** palette,
shared with the isnad-graph product app — see `src/styles/global.css`).

This document assembles **concrete, license-cleared candidate images across four creative
directions** so the owner can compare actual pictures before committing to one. Per the owner
note of 2026-06-16 ("gather samples of each"), this is a **selection artifact, not a final
integration** — nothing here is wired into the site and no image binaries are committed.

> **All thumbnails below are hot-linked to their source CDN** (metmuseum.org /
> upload.wikimedia.org) so they render inline in the GitHub preview of this file. They are
> previews for comparison only — see [how a direction gets implemented](#how-a-direction-gets-implemented)
> for what actually happens after sign-off.

### Licensing policy applied here

Only **CC0 / public-domain / no-attribution-required** sources, per the issue constraint.
Every Met item below was confirmed `isPublicDomain: true` via the Met Collection API and each
image URL was verified to return HTTP 200. Wikimedia items were filtered to `CC0` / `Public
domain` license tags via the Commons `imageinfo` API. **Excluded on purpose:** Freepik,
Vecteezy, Noun Project (attribution/paid), and any CC-BY / CC-BY-SA Commons photo.

| Source | License | Attribution required? | Verification |
|---|---|---|---|
| The Met Open Access | CC0 1.0 | No | API `isPublicDomain` flag + per-URL HTTP 200 |
| Wikimedia Commons (filtered) | CC0 / PD | No | `imageinfo.extmetadata.LicenseShortName` |
| rawpixel CC0 collection | CC0 1.0 | No | Collection-level (see Direction D) |
| Unsplash | Unsplash License | No (encouraged, not required) | Owner to confirm at pick time |

---

## TL;DR recommendation

| | Direction | Best for | Risk | Cédric's lean |
|---|---|---|---|---|
| **A** | Manuscripts & calligraphy | Hero backdrop, OG image, "scholarly source" credibility | Folios are busy → text-contrast care needed | High fit |
| **B** | Geometric / arabesque tilework | Section dividers, card accents, repeating motif, favicon family | Can read decorative/generic if overused | **Highest fit** — tessellates, recolors to brand, lowest contrast risk |
| **C** | Architecture (domes / muqarnas / tile panels) | Full-bleed hero photography, emotional weight | Photographic → heavier payload, art-direction per crop | High fit |
| **D** | Parchment texture | Subtle page/section background under A–C | Weakest as a stand-alone "image"; best generated in CSS | Use as a **texture layer**, not a standalone direction |

My recommendation: pick **B as the primary motif system** and **C for one hero photograph**,
with **D rendered in CSS** as the underlying paper tone. A's folios make an excellent OG/share
image. But this is the owner's call — all four are viable and license-clean.

---

## Direction A · Manuscripts & Calligraphy

Illuminated Qur'anic/poetic folios and Arabic calligraphy. Strongest *thematic* tie to the
mission (isnad / hadith scholarship over manuscript sources). Best used as a **hero backdrop
(low-opacity, behind type)** and as the **Open Graph share image**.

Source pool: The Met Open Access (CC0), plus — for the owner's wider browsing — NYPL Digital
Collections Arabic manuscripts ([NYPL search](https://digitalcollections.nypl.org/search/index?keywords=arabic%20manuscript),
public domain) and the Public Domain Review's Islamic scientific manuscripts collection
([Public Domain Review](https://publicdomainreview.org/collection/)).

| Thumb | Item | Origin / date | License | Source |
|---|---|---|---|---|
| <img src="https://images.metmuseum.org/CRDImages/is/web-large/DP234083.jpg" width="150" alt="Illuminated folio The Concourse of the Birds from the Mantiq al-Tayr"> | "The Concourse of the Birds", Folio 11r, *Mantiq al-Tayr* | Iran, ca. 1600 | CC0 | [Met 451725](https://www.metmuseum.org/art/collection/search/451725) |
| <img src="https://images.metmuseum.org/CRDImages/is/web-large/DP231356.jpg" width="150" alt="Illuminated calligraphy page from the Shah Jahan Album"> | Page of Calligraphy Illuminated…, *Shah Jahan Album* | India, ca. 1610–45 | CC0 | [Met 451287](https://www.metmuseum.org/art/collection/search/451287) |
| <img src="https://images.metmuseum.org/CRDImages/is/web-large/DP160115.jpg" width="150" alt="Carved panel with early Kufic inscription"> | Carved Panel (early Kufic) | probably Egypt, 8th c. | CC0 | [Met 449211](https://www.metmuseum.org/art/collection/search/449211) |

Direct full-res URLs: `DP234083.jpg`, `DP231356.jpg`, `DP160115.jpg` under
`https://images.metmuseum.org/CRDImages/is/web-large/`.

**Pros:** unmatched thematic authority; rich color that already harmonizes with sienna/gold.
**Cons:** dense compositions → must sit behind a scrim or be cropped; folio aspect ratios are
portrait, awkward for wide heroes.

---

## Direction B · Geometric / Arabesque Tilework (recommended primary)

Star-tiles and tessellating geometry. **The most flexible direction:** a single tile motif can
become a repeating section divider, a card-corner accent, a watermark, and a favicon family —
and the simplest shapes can be re-drawn as SVG and recolored to the exact brand tokens (no
raster needed). Lowest text-contrast risk of any direction.

| Thumb | Item | Origin / date | License | Source |
|---|---|---|---|---|
| <img src="https://images.metmuseum.org/CRDImages/is/web-large/sf17-143-1a.jpg" width="120" alt="Twelve-pointed star-shaped luster tile"> | Twelve-Pointed Star-Shaped Tile | Iran, 1442–43 CE | CC0 | [Met 446971](https://www.metmuseum.org/art/collection/search/446971) |
| <img src="https://images.metmuseum.org/CRDImages/is/web-large/DP231256.jpg" width="120" alt="Eight-pointed star-shaped tile"> | Eight-Pointed Star-Shaped Tile | Iran, 13th c. | CC0 | [Met 444459](https://www.metmuseum.org/art/collection/search/444459) |
| <img src="https://images.metmuseum.org/CRDImages/is/web-large/sf32-41-1.jpg" width="120" alt="Carved star-shaped tile"> | Carved Star Tile | Iran, early 13th c. | CC0 | [Met 448665](https://www.metmuseum.org/art/collection/search/448665) |
| <img src="https://images.metmuseum.org/CRDImages/is/web-large/DP221326.jpg" width="120" alt="Tile from an inscriptional frieze"> | Tile from an Inscriptional Frieze | Iran, 1308 CE | CC0 | [Met 446203](https://www.metmuseum.org/art/collection/search/446203) |
| <img src="https://images.metmuseum.org/CRDImages/is/web-large/wb-20.120.73.JPG" width="120" alt="Three tiles with Lajvardina glaze"> | Three Tiles with 'Lajvardina' Glaze | Iran, 13th–14th c. | CC0 | [Met 447168](https://www.metmuseum.org/art/collection/search/447168) |

Direct full-res URLs under `https://images.metmuseum.org/CRDImages/is/web-large/`:
`sf17-143-1a.jpg`, `DP231256.jpg`, `sf32-41-1.jpg`, `DP221326.jpg`, `wb-20.120.73.JPG`.

For the owner's wider browsing: Wikimedia category
[Islamic geometric patterns](https://commons.wikimedia.org/wiki/Category:Islamic_geometric_patterns)
(filter to PD/CC0).

**Pros:** tessellates; recolors to brand; can become resolution-independent SVG; works in both
light and dark themes for free. **Cons:** decorative motifs can read generic if over-applied —
use sparingly as accent, not wallpaper.

---

## Direction C · Architecture (domes / muqarnas / tile panels)

Photographic weight — domes, muqarnas vaulting, and wall-scale Iznik tile panels. Best as a
**single full-bleed hero photograph** behind the headline, or a section banner. The Met's
wall-scale tile panels (below, CC0) bridge B and C; the Wikimedia photos give true architectural
depth.

| Thumb | Item | Origin / date | License | Source |
|---|---|---|---|---|
| <img src="https://images.metmuseum.org/CRDImages/is/web-large/LC-17_190_2085.jpg" width="150" alt="Wall-scale Iznik tile panel"> | Tile Panel (Iznik, wall-scale) | Turkey, 16th c. | CC0 | [Met 447015](https://www.metmuseum.org/art/collection/search/447015) |
| <img src="https://images.metmuseum.org/CRDImages/is/web-large/LC-23_12_3.jpg" width="150" alt="Syrian tile panel"> | Tile Panel | Syria, mid-16th c. | CC0 | [Met 447625](https://www.metmuseum.org/art/collection/search/447625) |
| <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Dome_of_Jamh_Mosque%2C_Yazd%2C_Iran.jpg/500px-Dome_of_Jamh_Mosque%2C_Yazd%2C_Iran.jpg" width="150" alt="Dome of the Jameh Mosque in Yazd"> | Dome of the Jameh Mosque, Yazd | Iran (photo) | CC0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Dome_of_Jamh_Mosque,_Yazd,_Iran.jpg) |
| <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Abu_Hanifa_Mosque_muqarnas.jpg/500px-Abu_Hanifa_Mosque_muqarnas.jpg" width="150" alt="Muqarnas vaulting in the Abu Hanifa Mosque"> | Abu Hanifa Mosque muqarnas | Iraq (photo) | CC0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Abu_Hanifa_Mosque_muqarnas.jpg) |
| <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Varamin_mosque_dome_interior.jpg/500px-Varamin_mosque_dome_interior.jpg" width="150" alt="Interior of the Varamin Mosque dome"> | Varamin Mosque dome interior | Iran (photo) | Public domain | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Varamin_mosque_dome_interior.jpg) |

For the owner's wider browsing (photographic, **Unsplash License — free, no attribution**):
Unsplash [mosque photos](https://unsplash.com/s/photos/mosque) and
[dome interior photos](https://unsplash.com/s/photos/dome-interior), plus
Pexels [mosque photos](https://www.pexels.com/search/mosque/).

**Pros:** highest emotional impact; great for a single arresting hero. **Cons:** photographic →
heaviest payload (needs aggressive optimization, see below); each crop is an art-direction
decision; busy frames demand a scrim for headline legibility.

---

## Direction D · Parchment / Paper Texture

Not really a standalone "picture" direction — it is the **substrate** the other three sit on,
and the brand is *already* parchment-toned. **Strong recommendation: render this in CSS**
(layered `radial-gradient` plus a tiny tiling SVG noise) rather than shipping a raster. That
gives zero added payload, perfect theme-flip behavior, and **no license surface at all**.

If the owner prefers a real scanned-paper raster, the cleanest CC0 sources are:

- **rawpixel CC0 old-paper / parchment** collection:
  [rawpixel public-domain old paper](https://www.rawpixel.com/search/old%20paper?free=public-domain)
  (filter to *Public domain*; CC0).
- **Unsplash** [parchment photos](https://unsplash.com/s/photos/parchment) and
  [old paper photos](https://unsplash.com/s/photos/old-paper)
  (Unsplash License — free, no attribution).

> Wikimedia was searched for CC0/PD parchment textures and did not yield clean, usable
> backgrounds (results were scanned documents, not seamless textures) — hence the CSS-first
> recommendation. **No external parchment binary is proposed for download** until the owner
> picks this direction.

**Pros (CSS route):** weightless, theme-aware, zero license risk, infinitely tileable.
**Cons:** a real scan has organic character a gradient cannot fully fake — a judgment call.

---

## Decision items for the owner

1. **Pick a primary direction** (A / B / C / D) — or a combination (e.g. *B motif + C hero +
   D CSS texture*, which is my recommendation).
2. **Confirm the licensing line.** Met/Wikimedia items here are CC0/PD (no attribution). If you
   want to additionally use Unsplash photos (Direction C/D wider pool), confirm the Unsplash
   License is acceptable — it requires no attribution but is not CC0.
3. **Attribution stance:** even where *not required*, do we want a small "Imagery: The
   Metropolitan Museum of Art (Open Access)" credit in the footer? (Goodwill, not obligation.)
4. **Hero treatment:** full-bleed photo (C) vs. type-forward with a low-opacity motif (A/B)?
   This drives the performance budget.

Once you pick, I will open the follow-on integration issue (or fold into lp#37) and wire it.

---

## How a direction gets implemented

(For context — **not part of this PR**; this PR only adds this selection doc.)

1. **No hot-linking in production.** Hot-links above are for *this comparison only*. Chosen
   images get downloaded once, the CC0/PD provenance recorded, and committed under
   `src/assets/` (Astro-optimized) — never hot-linked from museum CDNs at runtime.
2. **Optimization:** Astro `<Image>` / `astro:assets` → AVIF plus WebP with responsive
   `srcset`; target a small per-hero payload after compression. Keeps the static-site
   performance budget.
3. **Accessibility:** every content image gets meaningful `alt`; decorative motifs (Direction B
   accents, Direction D texture) are `alt=""` / CSS backgrounds. WCAG 2.2 AA contrast preserved
   — headline text over imagery always gets a scrim/overlay token.
4. **Theme-awareness:** motifs (B) and texture (D) must read correctly in both light and dark
   (`prefers-color-scheme` plus `[data-theme]`); SVG motifs use `currentColor`/DS tokens so they
   flip for free. Coordinates with lp#116 (dark-mode toggle).
5. **Provenance ledger:** committed assets carry a sidecar (or `docs/` ledger) noting source
   URL, museum object ID, and CC0/PD license per image.

---

## Verification notes (provenance of this doc)

- Met candidates pulled via the Met Collection API (`departmentId=14`, Islamic Art), filtered
  to `isPublicDomain: true` with a present `primaryImageSmall`.
- Every embedded image URL in this document was checked to return **HTTP 200** with a non-empty
  body at authoring time (2026-06-16).
- Wikimedia candidates filtered to `LicenseShortName` in {CC0, Public domain} via the Commons
  `imageinfo` API; thumbnails verified HTTP 200.
- **No image binaries were downloaded or committed** — per the issue's "do not commit
  large/licensed binaries without flagging; STOP for owner approval" instruction.
