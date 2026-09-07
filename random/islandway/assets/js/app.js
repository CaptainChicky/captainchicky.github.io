/* ============================================================
   app.js — THE FRUIT ARCHIVE
   Signature animations kept from the original theme:
   · LocomotiveScroll smooth/inertia scrolling
   · GSAP ScrollTrigger parallax (palms + floating fruit + decor)
   · SplitText letter-by-letter heading reveals
   · .reveal image wipe, fade-up copy, scale-in shelf
   · tilt.js 3D hover on specimen cards
   (video / slick sliders / store menu logic removed)
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var hasGsap = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
    var el = document.querySelector("#smooth-content");
    if (!hasGsap || !el) { initTilt(); return; }

    gsap.registerPlugin(ScrollTrigger);

    /* ---- LocomotiveScroll (with graceful fallback) ---- */
    var loco = null;
    if (typeof LocomotiveScroll !== "undefined") {
      try {
        loco = new LocomotiveScroll({ el: el, smooth: true, lerp: 0.09 });
        loco.on("scroll", ScrollTrigger.update);
        ScrollTrigger.scrollerProxy(el, {
          scrollTop: function (v) {
            return arguments.length
              ? loco.scrollTo(v, 0, 0)
              : loco.scroll.instance.scroll.y;
          },
          getBoundingClientRect: function () {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
          },
          pinType: el.style.transform ? "transform" : "fixed"
        });
        ScrollTrigger.addEventListener("refresh", function () { loco.update(); });
      } catch (e) {
        loco = null; /* fall back to native scrolling */
      }
    }

    // triggers use the locomotive element as scroller only when smooth is active
    function scroller() { return loco ? el : undefined; }

    /* pre-hide the scroll-revealed headings so they never flash before their trigger fires */
    gsap.set([
      ".archive-area .section-heading .heading",
      ".field-area .section-heading .heading",
      ".story-area .section-heading .heading"
    ], { autoAlpha: 0 });

    /* ---- parallax palms: drift out + tilt on scroll (smoothed) ---- */
    if (document.querySelector(".hero-palm-left"))
      gsap.to(".hero-palm-left", { x: -420, y: -480, rotation: -10, ease: "none",
        scrollTrigger: { trigger: ".hero-area", scroller: scroller(), start: "top top", end: "bottom 15%", scrub: 1 } });

    if (document.querySelector(".hero-palm-right"))
      gsap.to(".hero-palm-right", { x: 400, y: -460, rotation: 10, ease: "none",
        scrollTrigger: { trigger: ".hero-area", scroller: scroller(), start: "top top", end: "bottom 15%", scrub: 1 } });

    /* ---- fruit cluster: gentle parallax drift, stays fully opaque ---- */
    if (document.querySelector(".hero-imege"))
      gsap.to(".hero-imege", { y: -40, ease: "none",
        scrollTrigger: { trigger: ".hero-area", scroller: scroller(), start: "top top", end: "bottom top", scrub: 1 } });

    /* ---- hero intro on load: headline + copy arrive in sequence ---- */
    if (document.querySelector(".hero-text"))
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from(".hero-text .eyebrow", { y: 20, opacity: 0, duration: 0.6 })
        .from(".hero-text .heading", { y: 32, opacity: 0, duration: 0.8 }, "-=0.30")
        .from(".hero-text .title",   { y: 20, opacity: 0, duration: 0.6 }, "-=0.50")
        .from(".hero-text p",        { y: 18, opacity: 0, duration: 0.6 }, "-=0.45")
        .from(".hero-text .cta-btn", { y: 14, opacity: 0, duration: 0.5 }, "-=0.40");

    /* ---- field-notes decorative shapes parallax ---- */
    if (document.querySelector(".service-shape-left"))
      gsap.to(".service-shape-left", { x: -150, y: 40, ease: "none",
        scrollTrigger: { trigger: ".field-area", scroller: scroller(), start: "top 30%", end: "bottom top", scrub: true } });
    if (document.querySelector(".service-shape-right"))
      gsap.to(".service-shape-right", { x: 150, y: -40, ease: "none",
        scrollTrigger: { trigger: ".field-area", scroller: scroller(), start: "top 30%", end: "bottom top", scrub: true } });

    /* ---- specimen shelf scales in ---- */
    if (document.querySelector(".story-image"))
      gsap.from(".story-image", { scale: 0.72, autoAlpha: 0.4, ease: "power2.out",
        scrollTrigger: { trigger: ".story-area", scroller: scroller(), start: "top 55%", end: "bottom 55%", scrub: true } });

    /* ---- specimen cards rise + fade in, staggered (once) ---- */
    if (document.querySelector(".specimen-grid .col-lg-4")) {
      gsap.set(".specimen-grid .col-lg-4", { autoAlpha: 0, y: 60, scale: 0.96 }); /* hidden up-front → no pre-trigger flash */
      ScrollTrigger.batch(".specimen-grid .col-lg-4", {
        scroller: scroller(), start: "top 92%", once: true,
        onEnter: function (batch) {
          gsap.to(batch, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.1, ease: "power3.out", overwrite: true });
        }
      });
    }

    /* ---- tasting: scene fades in once; spoon DIPS toward the bowl on scroll (scrubbed), stopping with a gap ---- */
    if (document.querySelector(".tasting-scene")) {
      gsap.set(".tasting-scene", { autoAlpha: 0 });
      ScrollTrigger.create({
        trigger: ".taste-area", scroller: scroller(), start: "top 82%", once: true,
        onEnter: function () { gsap.to(".tasting-scene", { autoAlpha: 1, duration: 0.8, ease: "power2.out" }); }
      });
      if (document.querySelector(".taste-spoon-img"))
        gsap.fromTo(".taste-spoon-img",
          { rotation: -3, transformOrigin: "0% 50%" },
          { rotation: 8, transformOrigin: "0% 50%", ease: "none",
            scrollTrigger: { trigger: ".taste-area", scroller: scroller(), start: "top 78%", end: "center 55%", scrub: 1 } });
    }

    /* ---- feature (hand-food) section ---- */
    if (document.querySelector(".feature-area")) {
      var fsc = scroller();
      /* text fades up once (hidden up-front so it can't flash) */
      gsap.set(".feature-text", { autoAlpha: 0, y: 40 });
      ScrollTrigger.create({
        trigger: ".feature-area", scroller: fsc, start: "top 80%", once: true,
        onEnter: function () { gsap.to(".feature-text", { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }); }
      });
      /* hands: scroll-SCRUBBED rise + settle (subtle travel so the arms stay clipped inside the section) */
      if (document.querySelector(".feature-food-left"))
        gsap.fromTo(".feature-food-left", { yPercent: 12, rotation: -4 }, { yPercent: 0, rotation: 0, ease: "none",
          scrollTrigger: { trigger: ".feature-area", scroller: fsc, start: "top 92%", end: "center 55%", scrub: 1 } });
      if (document.querySelector(".feature-food-right"))
        gsap.fromTo(".feature-food-right", { yPercent: 12, rotation: 4 }, { yPercent: 0, rotation: 0, ease: "none",
          scrollTrigger: { trigger: ".feature-area", scroller: fsc, start: "top 92%", end: "center 55%", scrub: 1 } });
      /* transparent palms drift a touch as you pass (parallax, like the original service-shape x-move) */
      if (document.querySelector(".feature-faded-l"))
        gsap.fromTo(".feature-faded-l", { xPercent: -7 }, { xPercent: 5, ease: "none",
          scrollTrigger: { trigger: ".feature-area", scroller: fsc, start: "top bottom", end: "bottom top", scrub: 1 } });
      if (document.querySelector(".feature-faded-r"))
        gsap.fromTo(".feature-faded-r", { xPercent: 7 }, { xPercent: -5, ease: "none",
          scrollTrigger: { trigger: ".feature-area", scroller: fsc, start: "top bottom", end: "bottom top", scrub: 1 } });
    }

    /* ---- field-notes copy fades up (hidden up-front; animates once) ---- */
    gsap.set(".service-text .content-text", { autoAlpha: 0, y: 40 });
    gsap.utils.toArray(".service-text .content-text").forEach(function (t) {
      ScrollTrigger.create({
        trigger: t, scroller: scroller(), start: "top 90%", once: true,
        onEnter: function () { gsap.to(t, { autoAlpha: 1, y: 0, duration: 0.75, ease: "power2.out" }); }
      });
    });

    /* ---- .reveal image wipe (hidden up-front; wipe runs once on enter) ---- */
    document.querySelectorAll(".reveal").forEach(function (wrap) {
      var img = wrap.querySelector("img");
      if (!img) return;
      gsap.set(wrap, { autoAlpha: 0 });
      ScrollTrigger.create({
        trigger: wrap, scroller: scroller(), start: "top 85%", once: true,
        onEnter: function () {
          gsap.timeline()
            .set(wrap, { autoAlpha: 1 })
            .from(wrap, { duration: 1.2, xPercent: -100, ease: "power2.out" })
            .from(img, { duration: 1.2, xPercent: 100, scale: 1.25, ease: "power2.out" }, "<");
        }
      });
    });

    /* ---- SplitText: letter-by-letter heading reveal (plays once on enter) ---- */
    function splitReveal(headingSel, triggerSel) {
      var node = document.querySelector(headingSel);
      if (!node) return;
      if (typeof SplitText === "undefined") { gsap.set(node, { autoAlpha: 1 }); return; }
      try {
        var split = new SplitText(node, { type: "words,chars" });
        ScrollTrigger.create({
          trigger: triggerSel || node, scroller: scroller(), start: "top 85%", once: true,
          onEnter: function () {
            gsap.set(node, { autoAlpha: 1 });
            gsap.from(split.chars, { yPercent: 60, opacity: 0, stagger: 0.025, duration: 0.6, ease: "power3.out" });
          }
        });
      } catch (e) { gsap.set(node, { autoAlpha: 1 }); }
    }
    window.addEventListener("load", function () {
      splitReveal(".archive-area .section-heading .heading", ".archive-area .section-heading");
      splitReveal(".field-area .section-heading .heading", ".field-area .section-heading");
      splitReveal(".story-area .section-heading .heading", ".story-area .section-heading");
      ScrollTrigger.refresh();
      if (loco) loco.update();
    });

    /* ---- smooth in-page anchor links ---- */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (ev) {
        var id = a.getAttribute("href");
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        ev.preventDefault();
        if (loco) loco.scrollTo(target);
        else target.scrollIntoView({ behavior: "smooth" });
      });
    });

    /* ---- keep measurements fresh ---- */
    if (loco) { ScrollTrigger.refresh(); }
    window.addEventListener("resize", function () { if (loco) loco.update(); ScrollTrigger.refresh(); });
    // refresh once more after images decode (heights change)
    var imgs = document.images, left = imgs.length;
    if (left) {
      Array.prototype.forEach.call(imgs, function (im) {
        if (im.complete) { if (--left === 0) done(); }
        else im.addEventListener("load", function () { if (--left === 0) done(); });
      });
    }
    function done() { if (loco) loco.update(); ScrollTrigger.refresh(); }

    initTilt();
  });

  /* ---- tilt.js 3D hover on specimen cards ---- */
  function initTilt() {
    if (typeof jQuery === "undefined" || !jQuery.fn.tilt) return;
    var $cards = jQuery(".et-js-tilt");
    $cards.tilt({
      scale: 1.02, glare: true, maxGlare: 0.25,
      easing: "cubic-bezier(.03,.98,.52,.99)", speed: 900, perspective: 1200
    });
    // Seed a center default. Otherwise, if a card scrolls under a stationary cursor,
    // tilt.js fires mouseenter/leave (no mousemove) and reads mousePositions before it's set → TypeError.
    $cards.each(function () {
      if (this.mousePositions) return;
      var $e = jQuery(this), o = $e.offset() || { left: 0, top: 0 };
      this.mousePositions = { x: o.left + $e.outerWidth() / 2, y: o.top + $e.outerHeight() / 2 };
    });
  }
})();
