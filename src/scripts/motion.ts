/*
 * Motion runtime (#121)
 * =====================
 * Drives the scroll-reveal + parallax primitives defined in
 * src/styles/motion.css. The CSS does all the visual work (and consumes the
 * design system's motion tokens); this module only toggles state.
 *
 * Reduced-motion first: if the user prefers reduced motion, OR the required
 * browser APIs are missing, we bail immediately and never add `.motion-ready`,
 * so every `.reveal` element stays in its visible final state and no scroll
 * listener is attached.
 */

/** Wire up scroll-reveal + parallax. Safe to call once per page load. */
export function initMotion(): void {
  const root = document.documentElement;

  const prefersReducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
    // Leave content visible; no motion-ready class, no observers/listeners.
    return;
  }

  // Tells motion.css to apply the pre-reveal hidden state + parallax transforms.
  root.classList.add("motion-ready");

  initScrollReveal();
  initParallax();
}

/** Reveal each `[data-reveal]` element once, the first time it enters view. */
function initScrollReveal(): void {
  const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (targets.length === 0) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target); // reveal once, then stop watching
        }
      }
    },
    // Trigger a touch before the element is fully in view for a natural feel.
    { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
  );

  for (const el of targets) observer.observe(el);
}

/**
 * Drift each `[data-parallax]` layer at a fraction of scroll. `data-parallax-speed`
 * (0–1, default 0.2) controls subtlety; smaller is gentler. Updates are
 * batched into a single rAF per scroll burst and only ever touch `transform`
 * (via a CSS custom property), so the work stays off the main layout path.
 */
function initParallax(): void {
  const layers = Array.from(
    document.querySelectorAll<HTMLElement>("[data-parallax]"),
  );
  if (layers.length === 0) return;

  const speeds = layers.map((el) => {
    const raw = Number.parseFloat(el.dataset.parallaxSpeed ?? "");
    return Number.isFinite(raw) ? raw : 0.2;
  });

  let ticking = false;

  const update = (): void => {
    const y = window.scrollY;
    for (let i = 0; i < layers.length; i++) {
      // Negative offset: the layer recedes (moves slower than the page).
      const offset = -(y * speeds[i]);
      layers[i].style.setProperty(
        "--parallax-offset",
        `${offset.toFixed(1)}px`,
      );
    }
    ticking = false;
  };

  const onScroll = (): void => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  };

  update(); // set initial offsets (handles a non-zero scroll on load)
  window.addEventListener("scroll", onScroll, { passive: true });
}
