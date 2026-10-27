(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* Mobile navigation */
  var toggle = document.querySelector(".menu-toggle");
  var drawer = document.querySelector(".nav-mobile");
  var backdrop = document.querySelector(".mobile-backdrop");

  function setNavOpen(open) {
    if (!toggle || !drawer) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.classList.toggle("nav-open", open);
    if (backdrop) {
      backdrop.classList.toggle("is-visible", open);
      backdrop.setAttribute("aria-hidden", open ? "false" : "true");
    }
    if (open) {
      trapFocus(drawer);
    } else if (toggle) {
      toggle.focus();
    }
  }

  if (toggle && drawer) {
    drawer.setAttribute("aria-hidden", "true");

    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      setNavOpen(!expanded);
    });

    if (backdrop) {
      backdrop.addEventListener("click", function () {
        setNavOpen(false);
      });
    }

    drawer.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setNavOpen(false);
      });
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && toggle && toggle.getAttribute("aria-expanded") === "true") {
      setNavOpen(false);
    }
  });

  /* Simple focus trap for mobile drawer */
  var trapContainer = null;
  function trapFocus(container) {
    trapContainer = container;
    var focusable = container.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length) focusable[0].focus();
  }

  document.addEventListener(
    "focusin",
    function (e) {
      if (
        trapContainer &&
        document.body.classList.contains("nav-open") &&
        !trapContainer.contains(e.target) &&
        toggle &&
        e.target !== toggle
      ) {
        e.stopPropagation();
        var focusable = trapContainer.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length) focusable[0].focus();
      }
    },
    true
  );

  /* Scroll reveal */
  if (!prefersReducedMotion) {
    var reveals = document.querySelectorAll(".reveal");
    if (reveals.length && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      reveals.forEach(function (el) {
        io.observe(el);
      });
    } else {
      reveals.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Active link in policy sidebar on scroll */
  var policyBlocks = document.querySelectorAll(".policy-block[id]");
  var policyNavLinks = document.querySelectorAll(".policy-nav a[href^='#']");
  if (policyBlocks.length && policyNavLinks.length && "IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.getAttribute("id");
          policyNavLinks.forEach(function (a) {
            a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
          });
        });
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: 0 }
    );
    policyBlocks.forEach(function (block) {
      navObserver.observe(block);
    });
  }

  var waBase = "https://wa.me/237659432516";

  /* Multi-step quote form (devis) */
  var devisForm = document.getElementById("devis-form");
  var devisStatus = document.getElementById("devis-form-status");

  function setDevisStatus(kind, message) {
    if (!devisStatus) return;
    devisStatus.hidden = false;
    devisStatus.className = "form-status is-" + kind;
    devisStatus.textContent = message;
  }

  function clearDevisStatus() {
    if (!devisStatus) return;
    devisStatus.hidden = true;
    devisStatus.textContent = "";
    devisStatus.className = "form-status";
  }

  function showDevisStep(step) {
    if (!devisForm) return;
    devisForm.querySelectorAll(".devis-step-panel").forEach(function (panel) {
      var n = parseInt(panel.getAttribute("data-step"), 10);
      var active = n === step;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
    devisForm.querySelectorAll("[data-step-indicator]").forEach(function (el) {
      var n = parseInt(el.getAttribute("data-step-indicator"), 10);
      el.classList.toggle("is-active", n === step);
    });
  }

  function validateDevisStep(step) {
    if (!devisForm) return false;
    var panel = devisForm.querySelector('.devis-step-panel[data-step="' + step + '"]');
    if (!panel) return true;
    var fields = panel.querySelectorAll("input, select, textarea");
    for (var i = 0; i < fields.length; i++) {
      var field = fields[i];
      if (field.type === "checkbox" && step !== 3) continue;
      if (!field.checkValidity()) {
        field.reportValidity();
        return false;
      }
    }
    return true;
  }

  if (devisForm) {
    var devisStep = 1;
    devisForm.querySelectorAll("[data-devis-next]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (!validateDevisStep(devisStep)) return;
        clearDevisStatus();
        devisStep = Math.min(3, devisStep + 1);
        showDevisStep(devisStep);
      });
    });
    devisForm.querySelectorAll("[data-devis-prev]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        clearDevisStatus();
        devisStep = Math.max(1, devisStep - 1);
        showDevisStep(devisStep);
      });
    });

    devisForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validateDevisStep(3)) return;
      var lang = devisForm.getAttribute("data-lang") || "fr";
      var submitBtn = document.getElementById("devis-submit");
      if (submitBtn) submitBtn.disabled = true;
      setDevisStatus(
        "loading",
        lang === "en"
          ? "Sending to Netlify Forms… (no success is guaranteed until the backend is configured.)"
          : "Envoi vers Netlify Forms… (aucun succès garanti tant que le backend n’est pas configuré.)"
      );

      var name = document.getElementById("qv-name");
      var phone = document.getElementById("qv-phone");
      var need = document.getElementById("qv-type");
      var message = document.getElementById("qv-message");
      var lines =
        lang === "en"
          ? [
              "Hello UPUW — quote request:",
              "Name: " + (name ? name.value : ""),
              "Phone: " + (phone ? phone.value : ""),
              "Need: " + (need ? need.options[need.selectedIndex].text : ""),
              "Details: " + (message ? message.value : ""),
            ]
          : [
              "Bonjour UPUW — demande de devis :",
              "Nom : " + (name ? name.value : ""),
              "Téléphone : " + (phone ? phone.value : ""),
              "Besoin : " + (need ? need.options[need.selectedIndex].text : ""),
              "Détails : " + (message ? message.value : ""),
            ];
      var waText = encodeURIComponent(lines.join("\n"));

      var fd = new FormData(devisForm);
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: new URLSearchParams(fd).toString(),
      })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          setDevisStatus(
            "neutral",
            lang === "en"
              ? "Request posted to Netlify (HTTP OK). Confirm delivery in the Netlify dashboard — not a guaranteed receipt."
              : "Requête POST acceptée par Netlify (HTTP OK). Confirmez la réception dans le tableau de bord Netlify — ce n’est pas un accusé garanti."
          );
        })
        .catch(function () {
          setDevisStatus(
            "error",
            lang === "en"
              ? "Could not reach Netlify Forms (local preview or missing config). Use WhatsApp or try again on deploy."
              : "Impossible de joindre Netlify Forms (preview locale ou config manquante). Utilisez WhatsApp ou réessayez après déploiement."
          );
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
          window.open(waBase + "?text=" + waText, "_blank", "noopener,noreferrer");
        });
    });
  }

  /* Procurement form → WhatsApp */
  var procureForm = document.getElementById("procure-form");
  if (procureForm) {
    procureForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (typeof procureForm.reportValidity === "function" && !procureForm.reportValidity()) {
        return;
      }
      var lang = procureForm.getAttribute("data-lang") || "fr";
      var name = document.getElementById("pf-name");
      var phone = document.getElementById("pf-phone");
      var product = document.getElementById("pf-product");
      var qty = document.getElementById("pf-qty");
      var note = document.getElementById("pf-note");

      var lines =
        lang === "en"
          ? [
              "Hello UPUW,",
              "I would like a quote / procurement request:",
              "Name / company: " + (name ? name.value : ""),
              "Phone: " + (phone ? phone.value : ""),
              "Product: " + (product ? product.options[product.selectedIndex].text : ""),
              "Estimated quantity: " + (qty ? qty.value : ""),
            ]
          : [
              "Bonjour UPUW,",
              "Je souhaite une demande de devis / approvisionnement :",
              "Nom / entreprise : " + (name ? name.value : ""),
              "Téléphone : " + (phone ? phone.value : ""),
              "Produit : " + (product ? product.options[product.selectedIndex].text : ""),
              "Quantité estimée : " + (qty ? qty.value : ""),
            ];

      if (note && note.value.trim()) {
        lines.push(lang === "en" ? "Note: " + note.value : "Note : " + note.value);
      }

      var text = encodeURIComponent(lines.join("\n"));

      /* Netlify Forms: POST required because submit is intercepted above */
      var fd = new FormData(procureForm);
      fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: new URLSearchParams(fd).toString(),
      })
        .catch(function () {
          /* still open WhatsApp if Netlify is unreachable */
        })
        .finally(function () {
          window.open(waBase + "?text=" + text, "_blank", "noopener,noreferrer");
        });
    });
  }

  /* Fr/En switch: remember choice for automatic redirect on next visit to / */
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (!a) return;
    var hreflang = a.getAttribute("hreflang");
    if (hreflang === "fr" || hreflang === "en") {
      try {
        localStorage.setItem("upuw-lang", hreflang);
      } catch (err) {}
      return;
    }
    if (a.closest(".mobile-lang")) {
      var lang = a.getAttribute("lang");
      if (lang === "fr" || lang === "en") {
        try {
          localStorage.setItem("upuw-lang", lang);
        } catch (err2) {}
      }
    }
  });
})();
