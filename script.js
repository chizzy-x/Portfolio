// Project details for the modal popup.
const projects = {
    aurora: {
        title: "Aurora Commerce",
        visualClass: "visual-aurora",
        description:
            "A premium storefront concept focused on mood, motion, and conversion. The experience uses rich layering, ambient glow, and polished transitions to make browsing feel cinematic without hurting performance.",
        features: [
            "Immersive hero-to-product storytelling",
            "Animated product reveal states",
            "Responsive product grid and cart journey",
            "High-contrast UI tuned for dark mode",
            "Micro-interactions that guide attention"
        ],
        tech: ["HTML", "CSS", "JavaScript", "Responsive UI", "Motion Design"],
        live: "#",
        source: "#"
    },
    atlas: {
        title: "Atlas Metrics",
        visualClass: "visual-atlas",
        description:
            "A data dashboard built for fast scanning and clear hierarchy. The interface mixes crisp panels, animated counters, and restrained glow accents so the information feels sharp instead of overwhelming.",
        features: [
            "Live KPI cards with animated updates",
            "Color-coded data grouping for easier scanning",
            "Modular panel layout for desktop and mobile",
            "Smooth transitions between chart states",
            "Visual emphasis on priority metrics"
        ],
        tech: ["JavaScript", "Dashboards", "Interaction Design", "Accessibility"],
        live: "#",
        source: "#"
    },
    lumen: {
        title: "Lumen Studio",
        visualClass: "visual-lumen",
        description:
            "An editorial-style portfolio for a creative studio. The layout leans into pace, whitespace, and typography so each section feels curated while still staying easy to navigate on any screen size.",
        features: [
            "Scroll-led storytelling with section pacing",
            "Editorial typography and layered backgrounds",
            "Project spotlights with modal deep dives",
            "Mobile-first responsive refinement",
            "Elegant contact pathway for client outreach"
        ],
        tech: ["Portfolio Design", "CSS Animation", "Frontend Architecture", "Brand UI"],
        live: "#",
        source: "#"
    }
};

const body = document.body;
const header = document.querySelector(".site-header");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");
const toTopBtn = document.getElementById("toTopbtn");
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");
const projectCards = document.querySelectorAll(".project-card");
const modal = document.getElementById("projectModal");
const modalContent = document.getElementById("modalContent");
const modalClose = document.getElementById("modalClose");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const submitButton = contactForm.querySelector(".submit-button");
const typedIntro = document.getElementById("typedIntro");
const heroTitle = document.querySelector("[data-split]");
const spotlight = document.getElementById("spotlight");
const cursorDot = document.getElementById("cursorDot");
const cursorRing = document.getElementById("cursorRing");
const heroStage = document.querySelector(".hero-stage");
const floatingPanels = document.querySelectorAll(".stage-float");
const introOverlay = document.getElementById("introOverlay");
const introShell = document.querySelector(".intro-shell");
const introText = document.querySelector(".intro-text");
const introImg = document.getElementById("introImg");
const introDisp = document.querySelector(".intro-disp");
const introDispRight = document.getElementById("disp-right");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

let activeProjectTrigger = null;
let typedIntroStarted = false;

// Split the hero heading into words so we can animate them in a staggered way.
function splitHeroTitle() {
    if (!heroTitle) {
        return;
    }

    if (heroTitle.dataset.splitReady === "true") {
        return;
    }

    heroTitle.dataset.splitReady = "true";

    const text = heroTitle.textContent.trim();
    const words = text.split(" ");
    heroTitle.textContent = "";
    heroTitle.setAttribute("aria-label", text);

    words.forEach((word, index) => {
        const wordSpan = document.createElement("span");
        wordSpan.className = "word";
        wordSpan.style.setProperty("--word-index", index);
        wordSpan.textContent = word;
        heroTitle.appendChild(wordSpan);

        if (index < words.length - 1) {
            heroTitle.appendChild(document.createTextNode(" "));
        }
    });

    // Start the staggered entrance once the spans exist in the DOM.
    requestAnimationFrame(() => {
        heroTitle.classList.add("is-ready");
    });
}

function revealHeroContent() {
    document.querySelectorAll(".hero .reveal").forEach((item) => {
        item.classList.add("revealed");
    });

    splitHeroTitle();
}

function playIntroSequence() {
    if (!introOverlay || !introShell || !introText || !introImg || !introDisp || !introDispRight) {
        body.classList.remove("intro-active");
        revealHeroContent();
        return;
    }

    if (prefersReducedMotion) {
        introOverlay.classList.add("is-exiting");
        body.classList.remove("intro-active");
        revealHeroContent();

        window.setTimeout(() => {
            introOverlay.remove();
        }, 20);

        return;
    }

    // const imageInDelay = 140;
    // const dispInDelay = 1420;
    // const textInDelay = 2840;
        const imageInDelay = 6000;   
    // const imageInDelay = 3000;  
    const dispInDelay = 3200;
    const textInDelay = 140;
    const dissolveDelay = 4780;
    const siteRevealDelay = 5840;

    
    window.setTimeout(() => {
        introText.style.filter = "brightness(10%)"
        introText.style.filter = "opacity(10%)"
        introText.style.transition = "1.6s"
    },  2000)

    window.setTimeout(() => {
        introOverlay.classList.add("is-image-in");
    }, imageInDelay);

    window.setTimeout(() => {
        introOverlay.classList.add("is-disp-in");
    }, dispInDelay);

    window.setTimeout(() => {
        introOverlay.classList.add("is-text-in");
    }, textInDelay);

    window.setTimeout(() => {
        introOverlay.classList.add("is-dissolving");
    }, dissolveDelay);

    window.setTimeout(() => {
        introOverlay.classList.add("is-exiting");
        body.classList.remove("intro-active");
        revealHeroContent();
    }, siteRevealDelay);

    window.setTimeout(() => {
        introOverlay.remove();
    }, siteRevealDelay + 950);
}

function toggleMenu(forceState) {
    const shouldOpen = typeof forceState === "boolean"
        ? forceState
        : !navMenu.classList.contains("is-open");

    navMenu.classList.toggle("is-open", shouldOpen);
    navToggle.classList.toggle("is-open", shouldOpen);
    navToggle.setAttribute("aria-expanded", String(shouldOpen));
}

function setActiveLink(id) {
    navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("is-active", isActive);
    });
}

function setHeaderState() {
    header.classList.toggle("scrolled", window.scrollY > 16);
}

// Animate each skill bar only once when it scrolls into view.
function animateSkillBar(item) {
    if (item.dataset.animated === "true") {
        return;
    }

    const level = item.getAttribute("data-level");
    const fill = item.querySelector(".skill-fill");

    if (fill) {
        fill.style.width = `${level}%`;
        item.dataset.animated = "true";
    }
}

function animateCounter(element) {
    if (element.dataset.animated === "true") {
        return;
    }

    const target = Number(element.getAttribute("data-count"));
    const duration = prefersReducedMotion ? 0 : 1900;
    const startTime = performance.now();

    const update = (currentTime) => {
        const progress = duration === 0 ? 1 : Math.min((currentTime - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.round(target * eased);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
            element.dataset.animated = "true";
        }
    };

    requestAnimationFrame(update);
}

function typeIntroText() {
    if (!typedIntro || typedIntroStarted) {
        return;
    }

    typedIntroStarted = true;
    const text = typedIntro.textContent.trim();
    typedIntro.textContent = "";
    typedIntro.classList.add("typing-caret");

    if (prefersReducedMotion) {
        typedIntro.textContent = text;
        typedIntro.classList.remove("typing-caret");
        return;
    }

    let index = 0;

    const writeCharacter = () => {
        typedIntro.textContent += text.charAt(index);
        index += 1;

        if (index < text.length) {
            window.setTimeout(writeCharacter, 34);
        } else {
            typedIntro.classList.remove("typing-caret");
        }
    };

    writeCharacter();
}

// Reveal sections on scroll and trigger any matching animations.
function createRevealObserver() {
    const scrollDrivenItems = Array.from(revealItems).filter((item) => !item.closest(".hero"));

    if (prefersReducedMotion) {
        scrollDrivenItems.forEach((item) => {
            item.classList.add("revealed");

            if (item.classList.contains("skill-item")) {
                animateSkillBar(item);
            }

            const counter = item.querySelector("[data-count]");
            if (counter) {
                animateCounter(counter);
            }
        });

        typeIntroText();
        return;
    }

    scrollDrivenItems.forEach((item) => {
        item.classList.add("is-scrubbed");
        item.style.setProperty("--reveal-opacity", "0");
        item.style.setProperty("--reveal-shift", "88px");
        item.style.setProperty("--reveal-blur", "8px");
    });

    let frameId = null;

    const update = () => {
        const viewportHeight = window.innerHeight;
        let needsAnotherFrame = false;

        scrollDrivenItems.forEach((item) => {
            const rect = item.getBoundingClientRect();
            const anchorPoint = rect.top + Math.min(rect.height * 0.28, 120);
            const delayOffset = item.classList.contains("delay-3")
                ? 0.18
                : item.classList.contains("delay-2")
                    ? 0.12
                    : item.classList.contains("delay-1")
                        ? 0.06
                        : 0;

            const start = viewportHeight * 0.94;
            const end = viewportHeight * 0.32;
            const range = start - end;
            const rawProgress = (start - anchorPoint) / range;
            const shiftedProgress = (rawProgress - delayOffset) / (1 - delayOffset);
            const targetProgress = Math.max(0, Math.min(1, shiftedProgress));

            const currentProgress = Number(item.dataset.revealProgress || 0);
            let nextProgress = currentProgress + (targetProgress - currentProgress) * 0.17;

            if (Math.abs(targetProgress - nextProgress) < 0.002) {
                nextProgress = targetProgress;
            } else {
                needsAnotherFrame = true;
            }

            item.dataset.revealProgress = String(nextProgress);
            item.style.setProperty("--reveal-opacity", nextProgress.toFixed(3));
            item.style.setProperty("--reveal-shift", `${((1 - nextProgress) * 88).toFixed(1)}px`);
            const blurProgress = Math.min(1, nextProgress * 2.15);
            item.style.setProperty("--reveal-blur", `${((1 - blurProgress) * 8).toFixed(1)}px`);

            if (item.classList.contains("display")) {
                item.style.setProperty("--display-scale", (0.9 + nextProgress * 0.1).toFixed(3));
                item.style.setProperty("--display-rotate", `${((1 - nextProgress) * -4.5).toFixed(2)}deg`);
            }

            if (item.classList.contains("skill-item")) {
                const fill = item.querySelector(".skill-fill");
                const level = Number(item.getAttribute("data-level")) || 0;

                if (fill) {
                    fill.style.width = `${(level * nextProgress).toFixed(1)}%`;
                }
            }

            const counter = item.querySelector("[data-count]");
            if (counter) {
                const total = Number(counter.getAttribute("data-count")) || 0;
                counter.textContent = String(Math.round(total * nextProgress));
            }

            if (item.classList.contains("about-story") && nextProgress > 0.32) {
                typeIntroText();
            }
        });

        if (needsAnotherFrame) {
            frameId = requestAnimationFrame(update);
        } else {
            frameId = null;
        }
    };

    const requestUpdate = () => {
        if (frameId !== null) {
            return;
        }

        frameId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    requestUpdate();
}


function createSectionObserver() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveLink(entry.target.id);
                }
            });
        },
        {
            rootMargin: "-35% 0px -45% 0px",
            threshold: 0.1
        }
    );

    sections.forEach((section) => observer.observe(section));
}

// Build modal markup from the selected project data.
function populateModal(projectKey) {
    const project = projects[projectKey];

    if (!project) {
        return;
    }

    modalContent.innerHTML = `
        <div class="modal-visual ${project.visualClass}" aria-hidden="true"></div>
        <div>
            <p class="section-kicker">Case Study</p>
            <h3 class="modal-title" id="modalTitle">${project.title}</h3>
        </div>
        <p class="modal-description">${project.description}</p>
        <div class="modal-section">
            <h4>Highlights</h4>
            <ul class="modal-list">
                ${project.features.map((feature) => `<li>${feature}</li>`).join("")}
            </ul>
        </div>
        <div class="modal-section">
            <h4>Stack</h4>
            <div class="modal-tech">
                ${project.tech.map((item) => `<span>${item}</span>`).join("")}
            </div>
        </div>
        <div class="modal-links">
            <a href="${project.live}" data-placeholder-link>Live Preview</a>
            <a href="${project.source}" data-placeholder-link>Source Notes</a>
        </div>
    `;
}

function openModal(projectKey, trigger) {
    populateModal(projectKey);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");
    activeProjectTrigger = trigger || null;
}

function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    body.classList.remove("modal-open");
    modalContent.innerHTML = "";

    if (activeProjectTrigger) {
        activeProjectTrigger.focus();
        activeProjectTrigger = null;
    }
}

// Make each project card keyboard friendly and clickable.
function setupProjects() {
    projectCards.forEach((card) => {
        const projectKey = card.getAttribute("data-project");
        const trigger = card.querySelector(".project-trigger");
        const projectTitle = projects[projectKey]?.title || "project";

        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");
        card.setAttribute("aria-label", `Open details for ${projectTitle}`);

        const openCardModal = () => openModal(projectKey, trigger || card);

        card.addEventListener("click", (event) => {
            if (event.target.closest(".project-trigger")) {
                openCardModal();
                return;
            }

            openCardModal();
        });

        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openCardModal();
            }
        });
    });

    modalClose.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
        if (event.target.hasAttribute("data-close-modal")) {
            closeModal();
        }

        if (event.target.matches("[data-placeholder-link]")) {
            event.preventDefault();
        }
    });
}

// Frontend-only form feedback so the page still feels complete without a backend.
function setupForm() {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const name = String(formData.get("name") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const message = String(formData.get("message") || "").trim();

        formStatus.className = "form-status";

        if (!name || !email || !message) {
            formStatus.textContent = "Please fill in your name, email, and message.";
            formStatus.classList.add("is-error");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            formStatus.textContent = "Please enter a valid email address.";
            formStatus.classList.add("is-error");
            return;
        }

        submitButton.classList.add("is-loading");
        submitButton.querySelector("span").textContent = "Sending...";
        formStatus.textContent = "";

        window.setTimeout(() => {
            submitButton.classList.remove("is-loading");
            submitButton.querySelector("span").textContent = "Send Message";
            formStatus.textContent = "Message sent. Thanks for reaching out.";
            formStatus.classList.add("is-success");
            contactForm.reset();
        }, prefersReducedMotion ? 0 : 900);
    });
}

// Enhance the experience on desktop with a soft spotlight and custom cursor.
function setupToTopButton() {
    if (!toTopBtn) {
        return;
    }

    const handleScroll = () => {
        if (window.scrollY > 500) {
            toTopBtn.classList.add("is-visible");
        } else {
            toTopBtn.classList.remove("is-visible");
        }
    };

    toTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
}

function setupCursorAndSpotlight() {
    if (!supportsFinePointer || prefersReducedMotion) {
        return;
    }

    body.classList.add("has-cursor");

    let lastX = 0;
    let lastY = 0;
    let frameId = null;

    window.addEventListener("mousemove", (event) => {
        lastX = event.clientX;
        lastY = event.clientY;

        if (frameId) {
            return;
        }

        frameId = requestAnimationFrame(() => {
            const clientX = lastX;
            const clientY = lastY;
            
            cursorDot.style.transform = `translate(${clientX}px, ${clientY}px) translate(-50%, -50%)`;
            cursorRing.style.transform = `translate(${clientX}px, ${clientY}px) translate(-50%, -50%)`;
            spotlight.style.transform = `translate(${clientX}px, ${clientY}px) translate(-50%, -50%)`;

            if (heroStage) {
                const xRatio = (clientX / window.innerWidth - 0.5) * 16;
                const yRatio = (clientY / window.innerHeight - 0.5) * 16;

                heroStage.style.transform = `translate3d(${xRatio * -0.25}px, ${yRatio * -0.25}px, 0)`;

                floatingPanels.forEach((panel, index) => {
                    const factor = index === 0 ? 0.55 : 0.8;
                    panel.style.transform = `translate3d(${xRatio * factor}px, ${yRatio * factor}px, 0)`;
                });
            }

            frameId = null;
        });
    });
}

function setupEvents() {
    navToggle.addEventListener("click", () => toggleMenu());

    navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => toggleMenu(false));
    });

    window.addEventListener("scroll", setHeaderState, { passive: true });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            toggleMenu(false);

            if (modal.classList.contains("is-open")) {
                closeModal();
            }
        }
    });
}

// Initialize all visual behavior once the DOM is ready.
function initializePage() {
    setHeaderState();
    createRevealObserver();
    createSectionObserver();
    setupProjects();
    setupForm();
    setupCursorAndSpotlight();
    setupToTopButton();
    setupEvents();
    playIntroSequence();
}

initializePage();
