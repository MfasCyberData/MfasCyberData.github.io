(function () {
  "use strict";

  var locale = (document.documentElement.lang || "en").toLowerCase();
  var navToggle = document.querySelector(".nav-toggle");
  var mainNav = document.getElementById("main-nav");

  function closeNavigation() {
    if (!navToggle || !mainNav) return;
    mainNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNavigation);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNavigation();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) closeNavigation();
    });
  }

  document.querySelectorAll(".copy-email").forEach(function (button) {
    button.addEventListener("click", function () {
      var email = button.getAttribute("data-email") || "";
      var original = button.textContent;
      var successText = locale.indexOf("fr") === 0 ? "Copié ✓" : "Copied ✓";

      function showSuccess() {
        button.textContent = successText;
        window.setTimeout(function () { button.textContent = original; }, 1800);
      }

      function fallbackCopy() {
        var textarea = document.createElement("textarea");
        textarea.value = email;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        try { document.execCommand("copy"); } catch (error) { /* no-op */ }
        document.body.removeChild(textarea);
        showSuccess();
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(showSuccess, fallbackCopy);
      } else {
        fallbackCopy();
      }
    });
  });

  document.querySelectorAll("#year").forEach(function (year) {
    year.textContent = String(new Date().getFullYear());
  });

  function makeScrollSpy(linkSelector, sectionSelector) {
    var links = Array.prototype.slice.call(document.querySelectorAll(linkSelector));
    var sections = Array.prototype.slice.call(document.querySelectorAll(sectionSelector));
    if (!links.length || !sections.length || !("IntersectionObserver" in window)) return;

    function activate(id) {
      links.forEach(function (link) {
        link.classList.toggle("is-current", link.getAttribute("href") === "#" + id);
      });
    }

    var currentId = sections[0].id;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) currentId = entry.target.id;
      });
      activate(currentId);
    }, { rootMargin: "-28% 0px -62% 0px", threshold: 0 });

    sections.forEach(function (section) { observer.observe(section); });
  }

  makeScrollSpy('.site-nav nav > a[href^="#"]', 'main section[id]');
  makeScrollSpy('.case-toc nav a[href^="#"]', '.case-section[id]');
})();
