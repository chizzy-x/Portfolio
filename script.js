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
const introOverlay = document.getElementById("introOverlay");
const introNameDisplay = document.getElementById("introNameDisplay");
const introGreeting = document.getElementById("introGreeting");
const introNameTarget = document.getElementById("introNameTarget");
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

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

let typedIntroStarted = false;
let activeProjectTrigger = null;
let introFinished = false;

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
    const duration = prefersReducedMotion ? 0 : 1100;
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

// Type the lead sentence in the About section for a subtle story-first reveal.
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
            window.setTimeout(writeCharacter, 24);
        } else {
            typedIntro.classList.remove("typing-caret");
        }
    };

    writeCharacter();
}

// Reveal sections on scroll and trigger any matching animations.
function createRevealObserver() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                if (body.classList.contains("intro-active") && entry.target.closest(".hero")) {
                    return;
                }

                entry.target.classList.add("revealed");

                if (entry.target.classList.contains("skill-item")) {
                    animateSkillBar(entry.target);
                }

                const counter = entry.target.querySelector("[data-count]");
                if (counter) {
                    animateCounter(counter);
                }

                if (entry.target.classList.contains("about-story")) {
                    typeIntroText();
                }

                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.18
        }
    );

    revealItems.forEach((item) => observer.observe(item));
}

// Animate the large intro name into the inline greeting before revealing the page.
function playIntroSequence() {
    if (!introOverlay) {
        revealHeroContent();
        body.classList.remove("intro-active");
        return;
    }

    if (prefersReducedMotion || !introNameDisplay || !introGreeting || !introNameTarget) {
        revealHeroContent();
        body.classList.remove("intro-active");
        introOverlay.classList.add("is-exiting");
        window.setTimeout(() => introOverlay.remove(), 20);
        introFinished = true;
        return;
    }

    introOverlay.classList.add("is-ready");

    window.setTimeout(() => {
        introOverlay.classList.add("is-greeting");

        window.setTimeout(() => {
            const sourceRect = introNameDisplay.getBoundingClientRect();
            const targetRect = introNameTarget.getBoundingClientRect();

            const nameClone = document.createElement("div");
            nameClone.className = "intro-name-clone";
            nameClone.textContent = introNameDisplay.textContent;
            nameClone.style.top = `${sourceRect.top}px`;
            nameClone.style.left = `${sourceRect.left}px`;

            document.body.appendChild(nameClone);
            introNameDisplay.style.opacity = "0";

            const scaleX = targetRect.width / sourceRect.width;
            const scaleY = targetRect.height / sourceRect.height;
            const moveX = targetRect.left - sourceRect.left;
            const moveY = targetRect.top - sourceRect.top;

            requestAnimationFrame(() => {
                nameClone.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scaleX}, ${scaleY})`;
            });

            window.setTimeout(() => {
                introOverlay.classList.add("is-merged");
                nameClone.style.opacity = "0";

                window.setTimeout(() => {
                    nameClone.remove();

                    if (!introFinished) {
                        introFinished = true;
                        revealHeroContent();
                        body.classList.remove("intro-active");
                        introOverlay.classList.add("is-exiting");

                        window.setTimeout(() => {
                            introOverlay.remove();
                        }, 900);
                    }
                }, 260);
            }, 920);
        }, 360);
    }, 260);
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

    // If the about section is already visible on load, start typing immediately.
    const aboutStory = document.querySelector(".about-story");
    if (aboutStory && aboutStory.getBoundingClientRect().top < window.innerHeight * 0.78) {
        typeIntroText();
    }
}

initializePage();
