(() => {
  const body = document.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* PRELOADER */
  const preloader = document.querySelector(".preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      window.setTimeout(() => preloader.classList.add("loaded"), reduceMotion ? 0 : 1300);
    }, { once: true });
  }

  /* HEADER — ocultar al bajar, mostrar al subir */
  const header = document.querySelector(".site-header");
  let lastScrollY = window.scrollY;
  const updateHeader = () => {
    if (!header) return;
    const currentScrollY = window.scrollY;
    if (currentScrollY <= 40) {
      header.classList.remove("is-scrolled", "is-hidden");
      lastScrollY = currentScrollY;
      return;
    }
    header.classList.add("is-scrolled");
    if (!body.classList.contains("menu-open")) {
      if (currentScrollY > lastScrollY) header.classList.add("is-hidden");
      else header.classList.remove("is-hidden");
    }
    lastScrollY = currentScrollY;
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* MOBILE MENU */
  const toggle = document.querySelector(".menu-toggle");
  const panel = document.querySelector(".mobile-panel");
  const closeMenu = () => {
    if (!toggle || !panel) return;
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú");
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    body.classList.remove("menu-open");
    if (header) header.classList.remove("is-hidden");
  };
  const openMenu = () => {
    if (!toggle || !panel) return;
    toggle.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Cerrar menú");
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    body.classList.add("menu-open");
    if (header) header.classList.remove("is-hidden");
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

  /* MENÚS DESPLEGABLES */
  document.querySelectorAll(".nav-dropdown").forEach((dropdown) => {
    document.addEventListener("click", (event) => {
      if (!dropdown.contains(event.target)) dropdown.removeAttribute("open");
    });
  });

  /* SCROLL REVEAL CON STAGGER */
  const revealSelectors = [
    ".intro-layout", ".intro-recomendados", ".seed-main", ".service-card", ".method-row",
    ".principles-grid > div", ".metodologia-item", ".bequeer-card", ".one-card", ".area-item",
    ".benefit-item", ".programa", ".recurso-item", ".inspiracion-card", ".proyecto-card",
    ".careers-layout", ".faq-item", ".hook-content", ".hook-visual", ".timeline-step",
    ".contact-form", ".contact-info", ".cta-box", ".testimonio"
  ];
  document.querySelectorAll(revealSelectors.join(",")).forEach((element, index) => {
    element.setAttribute("data-reveal", "");
    if (!reduceMotion) element.style.transitionDelay = `${Math.min(index % 6, 5) * 80}ms`;
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
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
  }

  /* FAQ ACCORDION */
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

  /* HERO PARALLAX — restaurado de la versión original */
  const hero = document.querySelector(".hero, .bk2-hero, .careers-hero, .cide-hero, .inspiracion-hero, .metodologia-hero, .ov-hero, .recomendados-hero");
  const heroContent = hero?.querySelector(".hero-content, .break-title, .hero-desc, h1");
  let ticking = false;
  const updateHeroParallax = () => {
    if (!hero || !heroContent || reduceMotion || window.innerWidth <= 800) return;
    const scrollPosition = window.scrollY;
    if (scrollPosition < window.innerHeight) {
      heroContent.style.transform = `translate3d(0, ${scrollPosition * 0.12}px, 0)`;
    } else {
      heroContent.style.transform = "";
    }
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeroParallax);
      ticking = true;
    }
  }, { passive: true });

  /* CARD HOVER — restaurado de la versión original y extendido a las tarjetas del sitio */
  const interactiveCards = document.querySelectorAll(
    ".service-card, .metodologia-item, .bequeer-card, .one-card, .area-item, .benefit-item, .programa, .recurso-item, .inspiracion-card, .proyecto-card"
  );
  interactiveCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      if (reduceMotion || window.innerWidth <= 800) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - y) * 4;
      const rotateY = (x - 0.5) * 4;
      card.style.transform = `translateY(-7px) perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  /* ACTIVE NAVIGATION */
  const page = body.dataset.page || "";
  document.querySelectorAll(".nav-link[data-page]").forEach((link) => {
    if (link.dataset.page === page || (page === "index" && link.dataset.page === "services" && window.location.hash === "#servicios")) {
      link.classList.add("active");
    }
  });

  /* SMOOTH INTERNAL LINKS */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  });
})();
