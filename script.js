(() => {
  const body = document.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const preloader = document.querySelector(".preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      window.setTimeout(() => preloader.classList.add("loaded"), reduceMotion ? 0 : 520);
    }, { once: true });
  }

  const header = document.querySelector(".site-header");
  const updateHeader = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const toggle = document.querySelector(".menu-toggle");
  const panel = document.querySelector(".mobile-panel");
  const closeMenu = () => {
    if (!toggle || !panel) return;
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    body.classList.remove("menu-open");
  };
  const openMenu = () => {
    if (!toggle || !panel) return;
    toggle.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    body.classList.add("menu-open");
  };
  if (toggle && panel) {
    toggle.addEventListener("click", () => toggle.getAttribute("aria-expanded") === "true" ? closeMenu() : openMenu());
    panel.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  document.querySelectorAll(".nav-dropdown").forEach((dropdown) => {
    document.addEventListener("click", (event) => {
      if (!dropdown.contains(event.target)) dropdown.removeAttribute("open");
    });
  });

  const revealSelectors = [
    ".intro-layout", ".intro-recomendados", ".seed-main", ".service-card", ".method-row",
    ".principles-grid > div", ".metodologia-item", ".bequeer-card", ".one-card", ".area-item",
    ".benefit-item", ".programa", ".recurso-item", ".inspiracion-card", ".proyecto-card",
    ".careers-layout", ".faq-item", ".hook-content", ".hook-visual", ".timeline-step", ".contact-form", ".contact-info"
  ];
  document.querySelectorAll(revealSelectors.join(",")).forEach((element, index) => {
    element.setAttribute("data-reveal", "");
    if (!reduceMotion) element.style.transitionDelay = `${Math.min(index % 6, 5) * 45}ms`;
  });
  if (reduceMotion || !("IntersectionObserver" in window)) {
    document.querySelectorAll("[data-reveal]").forEach((element) => element.classList.add("visible"));
  } else {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -35px 0px" });
    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
  }

  document.querySelectorAll(".faq-question").forEach((question) => {
    question.setAttribute("aria-expanded", "false");
    question.addEventListener("click", () => {
      const item = question.closest(".faq-item");
      const wasActive = item.classList.contains("active");
      document.querySelectorAll(".faq-item.active").forEach((activeItem) => {
        activeItem.classList.remove("active");
        const activeQuestion = activeItem.querySelector(".faq-question");
        if (activeQuestion) activeQuestion.setAttribute("aria-expanded", "false");
      });
      if (!wasActive) {
        item.classList.add("active");
        question.setAttribute("aria-expanded", "true");
      }
    });
  });

  const page = body.dataset.page || "";
  document.querySelectorAll(".nav-link[data-page]").forEach((link) => {
    if (link.dataset.page === page || (page === "index" && link.dataset.page === "services" && window.location.hash === "#servicios")) {
      link.classList.add("active");
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  });
})();
