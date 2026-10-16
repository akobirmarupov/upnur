/* Upnur — umumiy skript: menyu, animatsiyalar, raqamlar, faktlar */
(function () {
  "use strict";
  var doc = document, body = doc.body;

  // Ustoz Elite havolalari bitta joydan (config.js)
  var cfg = window.UPNUR_CONFIG || {};
  if (cfg.ELITE_BOT) {
    doc.querySelectorAll("[data-elite]").forEach(function (a) { a.href = cfg.ELITE_BOT; });
  }

  // Header: pastga tushganda oq fonli bo'ladi
  var header = doc.querySelector(".header");
  function onScroll() {
    var y = window.scrollY || 0;
    if (header) header.classList.toggle("is-solid", y > 20);
    var mcta = doc.querySelector(".mobile-cta");
    if (mcta) mcta.classList.toggle("is-shown", y > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobil menyu
  var burger = doc.querySelector(".burger");
  if (burger) {
    burger.addEventListener("click", function () {
      var open = body.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    doc.querySelectorAll(".mobile-menu a").forEach(function (a) {
      a.addEventListener("click", function () { body.classList.remove("menu-open"); });
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { body.classList.remove("menu-open"); burger.setAttribute("aria-expanded", "false"); }
    });
  }

  // Ko'rinishga kirganda paydo bo'lish
  var revealEls = doc.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  // Raqamlar sanog'i: <b data-count="3870" data-suffix="+">
  var counters = doc.querySelectorAll("[data-count]");
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count")), suffix = el.getAttribute("data-suffix") || "";
    var start = null, dur = 1600;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("ru-RU").replace(/,/g, " ") + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window && counters.length) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); co.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  }

  // Qiziqarli faktlar: aylantirish va saralash
  doc.querySelectorAll(".fact").forEach(function (card) {
    function flip() { card.classList.toggle("is-flipped"); }
    card.addEventListener("click", flip);
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); }
    });
  });
  doc.querySelectorAll(".filter").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cat = btn.getAttribute("data-filter");
      doc.querySelectorAll(".filter").forEach(function (b) { b.classList.toggle("is-active", b === btn); });
      doc.querySelectorAll(".fact").forEach(function (f) {
        f.classList.toggle("is-hidden", cat !== "all" && f.getAttribute("data-cat") !== cat);
      });
    });
  });

  // Yil
  doc.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Bosh sahifa: haqiqiy yomg'ir videosi — ko'rinmay qolganda to'xtaydi (batareya va CPU tejaladi)
  var video = doc.querySelector(".hero--rain .rain-video");
  if (video) {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { video.removeAttribute("autoplay"); video.pause(); }
    else if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
        else video.pause();
      }).observe(video);
    }
  }
})();
