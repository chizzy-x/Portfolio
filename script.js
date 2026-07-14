const body = document.body;
const header = document.querySelector(".site-header");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");
const toTopBtn = document.getElementById("toTopbtn");
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");
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
const introNameDisplay = document.getElementById("introNameDisplay");
const introNote = document.querySelector(".intro-note");
const isMobile = window.matchMedia("(max-width: 768px)");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

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
    const imageInDelay = 140;
    const dispInDelay = 700;
    const textInDelay = 900;
    const dissolveDelay = 2500;
    const siteRevealDelay = 2840;

    // introText.style.transition = "1.6s"

    // Intro Animations
    if (isMobile.matches) {
        const imageInDelay = 140;
        const loadDelay = 500
        const dispInDelay = 140;
        const dissolveDelay = 3200;
        const siteRevealDelay = 3440;
        const loadAnimation = document.getElementById("load");

        window.setTimeout(() => {
            introOverlay.classList.add("is-image-in");
        }, imageInDelay);

        window.setTimeout(() => {
            introOverlay.classList.add("is-disp-in");
            
        }, dispInDelay);
        window.setTimeout(() =>{
            loadAnimation.style.width = "150px"
        }, loadDelay)
        window.setTimeout(() => {
            introOverlay.classList.add("is-dissolving");
        }, dissolveDelay);

        window.setTimeout(() => {
            introOverlay.classList.add("is-exiting");
            body.classList.remove("intro-active");
            revealHeroContent();
        }, siteRevealDelay);
    } else {
        window.setTimeout(() => {
            const compactWelcome = window.innerWidth <= 560;
            const narrowWelcome = window.innerWidth <= 700;
            const welcomeScale = compactWelcome
                ? Math.min(window.innerWidth * 0.42, 170)
                : narrowWelcome
                    ? Math.min(window.innerWidth * 0.48, 250)
                    : 360;
            const welcomeTracking = compactWelcome ? "0.1em" : narrowWelcome ? "0.14em" : "40px";
            const welcomeOffset = compactWelcome ? "0px" : narrowWelcome ? "-18px" : "-90px";
            const welcomeMarginTop = compactWelcome ? "16px" : narrowWelcome ? "24px" : "40px";

            // introText.style.filter = "brightness(10%)"
            // introNameDisplay.style.letterSpacing = welcomeTracking
            // introText.style.filter = "opacity(10%)"
            // introText.style.transition = " .6s"
            // introNameDisplay.style.transition = "1.6s"
            // introNameDisplay.style.fontSize = "380px"
            // introNameDisplay.style.textAlign = "center"
            // introNameDisplay.style.marginLeft = "-108px"
            // introText.style.marginTop = "800px"
            // introNote.style.filter = "brightness(5%)"
        }, 1500);
    }

    // window.setTimeout(() => {
    //     introNote.style.transition = "1.6s"
    //     introNote.style.filter = "opacity(70%)"
    // }, imageInDelay);


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

    if (prefersReducedMotion) {
        typedIntro.textContent = text;
        typedIntro.classList.add("intro-text-reveal", "is-active");
        return;
    }

    const fragment = document.createDocumentFragment();
    text.split(" ").forEach((word, index, words) => {
        const wordSpan = document.createElement("span");
        wordSpan.className = "intro-word";
        wordSpan.style.setProperty("--word-index", index);
        wordSpan.textContent = word;
        fragment.appendChild(wordSpan);

        if (index < words.length - 1) {
            fragment.appendChild(document.createTextNode(" "));
        }
    });

    typedIntro.textContent = "";
    typedIntro.appendChild(fragment);
    typedIntro.classList.add("intro-text-reveal");

    requestAnimationFrame(() => {
        typedIntro.classList.add("is-active");
    });
}

// Reveal sections on scroll and trigger any matching animations.
function createRevealObserver() {
    const scrollDrivenItems = Array.from(revealItems).filter((item) => !item.closest(".hero"));

    if (prefersReducedMotion) {
        scrollDrivenItems.forEach((item) => {
            item.classList.add("revealed");

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
        item.style.setProperty("--reveal-blur", "9px");
    });

    let frameId = null;

    const update = () => {
        const viewportHeight = window.innerHeight;
        const remainingScroll = document.documentElement.scrollHeight - (window.scrollY + viewportHeight);
        let needsAnotherFrame = false;

        scrollDrivenItems.forEach((item) => {
            const rect = item.getBoundingClientRect();
            const isFooterReveal = Boolean(item.closest(".site-footer"));
            const anchorPoint = rect.top + Math.min(rect.height * 0.18, 84);
            const delayOffset = item.classList.contains("delay-3")
                ? 0.14
                : item.classList.contains("delay-2")
                    ? 0.09
                    : item.classList.contains("delay-1")
                        ? 0.04
                        : 0;

            const start = viewportHeight * 0.96;
            const end = isFooterReveal ? viewportHeight * 0.62 : viewportHeight * 0.44;
            const range = start - end;
            const rawProgress = (start - anchorPoint) / range;
            const shiftedProgress = (rawProgress - delayOffset) / (1 - delayOffset);
            let targetProgress = Math.max(0, Math.min(1, shiftedProgress));

            if (isFooterReveal) {
                const assistDistance = Math.max(140, viewportHeight * 0.22);
                const footerAssist = 1 - Math.max(0, remainingScroll) / assistDistance;
                targetProgress = Math.max(targetProgress, Math.max(0, Math.min(1, footerAssist)));
            }

            const currentProgress = Number(item.dataset.revealProgress || 0);
            let nextProgress = currentProgress + (targetProgress - currentProgress) * 0.17;

            if (isFooterReveal && remainingScroll <= 24) {
                nextProgress = 1;
            }

            if (Math.abs(targetProgress - nextProgress) < 0.002) {
                nextProgress = targetProgress;
            } else {
                needsAnotherFrame = true;
            }

            const renderProgress = 1 - Math.pow(1 - nextProgress, 1.26);
            item.dataset.revealProgress = String(nextProgress);
            item.style.setProperty("--reveal-opacity", renderProgress.toFixed(3));
            item.style.setProperty("--reveal-shift", `${((1 - renderProgress) * 88).toFixed(1)}px`);
            const blurProgress = Math.min(1, renderProgress * 2.3);
            item.style.setProperty("--reveal-blur", `${((1 - blurProgress) * 9).toFixed(1)}px`);

            if (item.classList.contains("display")) {
                item.style.setProperty("--display-scale", (0.9 + renderProgress * 0.1).toFixed(3));
                item.style.setProperty("--display-rotate", `${((1 - renderProgress) * -4.5).toFixed(2)}deg`);
            }

            const counter = item.querySelector("[data-count]");
            if (counter) {
                const total = Number(counter.getAttribute("data-count")) || 0;
                counter.textContent = String(Math.round(total * renderProgress));
            }

            if (item.classList.contains("about-story") && renderProgress > 0.3) {
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
        }
    });
}

// Initialize all visual behavior once the DOM is ready.
function initializePage() {
    setHeaderState();
    createRevealObserver();
    createSectionObserver();
    setupCursorAndSpotlight();
    setupToTopButton();
    setupEvents();
    playIntroSequence();
}

initializePage();
