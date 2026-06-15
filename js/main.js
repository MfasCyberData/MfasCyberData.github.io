/* Portfolio — project filtering + footer year. No dependencies. */

(function () {
  "use strict";

  /* Project category filters (deep-linkable via #data / #hybrid / #security) */
  var filters = document.querySelectorAll(".filter");
  var cards = document.querySelectorAll(".card[data-category]");

  function applyFilter(target) {
    filters.forEach(function (b) {
      var active = b.getAttribute("data-filter") === target;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-pressed", String(active));
    });
    cards.forEach(function (card) {
      var match = target === "all" || card.getAttribute("data-category") === target;
      card.classList.toggle("is-hidden", !match);
    });
  }

  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = btn.getAttribute("data-filter");
      applyFilter(target);
      if (history.replaceState) {
        history.replaceState(null, "", target === "all" ? "#projects" : "#" + target);
      }
    });
  });

  var initial = location.hash.replace("#", "");
  if (["data", "hybrid", "security"].indexOf(initial) !== -1) {
    applyFilter(initial);
  }

  /* Copy email. mailto needs a configured mail client; this always works.
     navigator.clipboard requires a secure context (https or localhost),
     so we fall back to execCommand under file:// or http. */
  function legacyCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "absolute";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) { /* last resort below */ }
    document.body.removeChild(ta);
  }

  document.querySelectorAll(".copy-email").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var email = btn.getAttribute("data-email");
      var done = function () {
        var original = "Copy email";
        btn.textContent = "Copied ✓";
        setTimeout(function () { btn.textContent = original; }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(done, function () {
          legacyCopy(email);
          done();
        });
      } else {
        legacyCopy(email);
        done();
      }
    });
  });

  /* Footer year */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* Nav scroll-spy: highlight the link for the section in view */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.site-nav nav a[href^="#"]'));
  var spied = navLinks
    .map(function (a) {
      var el = document.getElementById(a.getAttribute("href").slice(1));
      return el ? { link: a, el: el } : null;
    })
    .filter(Boolean);

  if (spied.length && "IntersectionObserver" in window) {
    var current = null;
    var setActive = function (el) {
      current = el;
      spied.forEach(function (s) { s.link.classList.toggle("is-current", s.el === current); });
    };
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) current = e.target; });
      spied.forEach(function (s) { s.link.classList.toggle("is-current", s.el === current); });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    spied.forEach(function (s) { obs.observe(s.el); });

    // Short final sections (e.g. Contact) may never enter the detection band;
    // force the last link active once the page is scrolled to the bottom.
    window.addEventListener("scroll", function () {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
        setActive(spied[spied.length - 1].el);
      }
    }, { passive: true });
  }
})();
