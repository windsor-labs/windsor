/* =========================================================
   WINDSOR
   INTERACTIONS
========================================================= */


/* =========================================================
   PRELOADER
========================================================= */

window.addEventListener("load", () => {

    const preloader = document.querySelector(".preloader");

    if (!preloader) {
        return;
    }

    setTimeout(() => {
        preloader.classList.add("loaded");
    }, 1300);

});


/* =========================================================
   HEADER
========================================================= */

const header = document.querySelector(".header");

function updateHeader() {

    if (!header) {
        return;
    }

    if (window.scrollY > 40) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

}

window.addEventListener("scroll", updateHeader, {
    passive: true
});

updateHeader();


/* =========================================================
   MOBILE MENU
========================================================= */

const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-menu a");

function closeMobileMenu() {

    if (!mobileMenu || !menuButton) {
        return;
    }

    mobileMenu.classList.remove("active");
    document.body.classList.remove("menu-active");

    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menú");

}

if (menuButton && mobileMenu) {

    menuButton.addEventListener("click", () => {

        const isActive =
            mobileMenu.classList.toggle("active");

        document.body.classList.toggle(
            "menu-active",
            isActive
        );

        menuButton.setAttribute(
            "aria-expanded",
            String(isActive)
        );

        menuButton.setAttribute(
            "aria-label",
            isActive
                ? "Cerrar menú"
                : "Abrir menú"
        );

    });

}

mobileLinks.forEach(link => {

    link.addEventListener("click", closeMobileMenu);

});


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        closeMobileMenu();
    }

});


/* =========================================================
   FAQ ACCORDION
========================================================= */

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

    const question =
        item.querySelector(".faq-question");

    if (!question) {
        return;
    }

    question.setAttribute(
        "aria-expanded",
        "false"
    );

    question.addEventListener("click", () => {

        const isActive =
            item.classList.contains("active");

        faqItems.forEach(otherItem => {

            otherItem.classList.remove("active");

            const otherQuestion =
                otherItem.querySelector(".faq-question");

            if (otherQuestion) {
                otherQuestion.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }

        });

        if (!isActive) {

            item.classList.add("active");

            question.setAttribute(
                "aria-expanded",
                "true"
            );

        }

    });

});


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements = document.querySelectorAll(
    ".intro-layout, " +
    ".seed-main, " +
    ".service-card, " +
    ".method-row, " +
    ".principles-grid > div, " +
    ".cide-cards article, " +
    ".careers-layout, " +
    ".faq-item, " +
    ".hook-grid, " +
    ".hook-content, " +
    ".hook-visual"
);

revealElements.forEach(element => {
    element.setAttribute("data-reveal", "");
});


const prefersReducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


if ("IntersectionObserver" in window && !prefersReducedMotion) {

    const revealObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.08,
                rootMargin: "0px 0px -40px 0px"
            }
        );


    document
        .querySelectorAll("[data-reveal]")
        .forEach(element => {

            revealObserver.observe(element);

        });

} else {

    document
        .querySelectorAll("[data-reveal]")
        .forEach(element => {

            element.classList.add("visible");

        });

}


/* =========================================================
   STAGGERED CARD ANIMATIONS
========================================================= */

const cardGroups = [

    document.querySelectorAll(".service-card"),

    document.querySelectorAll(".cide-cards article"),

    document.querySelectorAll(".principles-grid > div"),

    document.querySelectorAll(".method-row")

];


cardGroups.forEach(group => {

    group.forEach((element, index) => {

        if (!prefersReducedMotion) {

            element.style.transitionDelay =
                `${index * 0.08}s`;

        }

    });

});


/* =========================================================
   HERO PARALLAX
========================================================= */

const hero = document.querySelector(".hero");
const heroContent = document.querySelector(".hero-content");

let ticking = false;

function updateHeroParallax() {

    if (
        !hero ||
        !heroContent ||
        prefersReducedMotion ||
        window.innerWidth <= 800
    ) {
        return;
    }

    const scrollPosition = window.scrollY;

    if (scrollPosition < window.innerHeight) {

        heroContent.style.transform =
            `translate3d(0, ${scrollPosition * 0.12}px, 0)`;

    } else {

        heroContent.style.transform = "";

    }

    ticking = false;

}

window.addEventListener("scroll", () => {

    if (!ticking) {

        window.requestAnimationFrame(
            updateHeroParallax
        );

        ticking = true;

    }

}, {
    passive: true
});


/* =========================================================
   SERVICE CARD MOUSE MOVEMENT
========================================================= */

const serviceCards =
    document.querySelectorAll(".service-card");


serviceCards.forEach(card => {

    card.addEventListener("mousemove", event => {

        if (
            prefersReducedMotion ||
            window.innerWidth <= 800
        ) {
            return;
        }

        const rect =
            card.getBoundingClientRect();

        const x =
            (event.clientX - rect.left) /
            rect.width;

        const y =
            (event.clientY - rect.top) /
            rect.height;

        const rotateX =
            (0.5 - y) * 4;

        const rotateY =
            (x - 0.5) * 4;

        card.style.transform =
            `translateY(-10px)
             perspective(800px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)`;

    });


    card.addEventListener("mouseleave", () => {

        card.style.transform = "";

    });

});


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections =
    document.querySelectorAll(
        "main section[id]"
    );

const navLinks =
    document.querySelectorAll(
        ".desktop-nav a"
    );


if (
    "IntersectionObserver" in window &&
    sections.length
) {

    const navObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    navLinks.forEach(link => {

                        link.classList.remove(
                            "active"
                        );

                        if (
                            link.getAttribute(
                                "href"
                            ) ===
                            `#${entry.target.id}`
                        ) {

                            link.classList.add(
                                "active"
                            );

                        }

                    });

                });

            },
            {
                threshold: 0.25,
                rootMargin: "-10% 0px -60% 0px"
            }
        );


    sections.forEach(section => {
        navObserver.observe(section);
    });

}


/* =========================================================
   CLOSE MENU WHEN RESIZING
========================================================= */

window.addEventListener("resize", () => {

    if (window.innerWidth > 800) {
        closeMobileMenu();
    }

});


/* =========================================================
   SMOOTH INTERNAL LINKS
========================================================= */

document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

        link.addEventListener("click", event => {

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior:
                    prefersReducedMotion
                        ? "auto"
                        : "smooth",
                block: "start"
            });

        });

    });
