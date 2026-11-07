(() => {
    "use strict";

    // =====================================
    // 1. CONFIGURATION
    // =====================================

    const CONFIG = {
        email: "mayureshiya@gmail.com", // Add your real email
        whatsapp: "", // Example: 919876543210
        github: "https://github.com/",
        linkedin: "https://www.linkedin.com/"
    };

    // =====================================
    // 2. SELECTOR HELPERS
    // =====================================

    const $ = (selector, root = document) =>
        root.querySelector(selector);

    const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

    // =====================================
    // 3. PRELOADER
    // =====================================

    const preloader = $("#preloader");

    const hidePreloader = () => {
        preloader && preloader.classList.add("done")
    };

    if (document.readyState === "complete") {
        setTimeout(hidePreloader, 180);
    } else {
        window.addEventListener("load", () => {
            setTimeout(hidePreloader, 180);
        }, { once: true });
    }

    setTimeout(hidePreloader, 2200);

    // =====================================
    // 4. CURRENT YEAR
    // =====================================

    const year = $("#yr");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    // =====================================
    // 5. MOBILE NAVIGATION
    // =====================================

    const menu = $("#menu");
    const nav = $("#nav");

    if (menu && nav) {
        menu.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("open");

            menu.setAttribute("aria-expanded", String(isOpen));
            menu.textContent = isOpen ? "×" : "☰";
        });

        $$("a", nav).forEach(link => {
            link.addEventListener("click", () => {
                nav.classList.remove("open");
                menu.setAttribute("aria-expanded", "false");
                menu.textContent = "☰";
            });
        });
    }

    // =====================================
    // 6. THEME TOGGLE
    // =====================================

    const themeButton = document.createElement("button");

    themeButton.className = "theme-toggle";
    themeButton.type = "button";
    themeButton.setAttribute("aria-label", "Toggle light and dark theme");

    const updateThemeLabel = () => {
        themeButton.textContent =
            document.body.classList.contains("light") ?
            "◑ Dark" :
            "◐ Light";
    };

    try {
        if (localStorage.getItem("mayank-theme") === "light") {
            document.body.classList.add("light");
        }
    } catch (error) {
        console.warn("Theme storage unavailable.", error);
    }

    updateThemeLabel();

    themeButton.addEventListener("click", () => {
        document.body.classList.toggle("light");

        try {
            localStorage.setItem(
                "mayank-theme",
                document.body.classList.contains("light") ?
                "light" :
                "dark"
            );
        } catch (error) {
            console.warn("Theme could not be saved.", error);
        }

        updateThemeLabel();
    });

    if (nav) {
        nav.append(themeButton);
    }

    // =====================================
    // 7. GUJARATI / ENGLISH SWITCH
    // =====================================

    const languageButton = document.createElement("button");

    languageButton.className = "theme-toggle";
    languageButton.type = "button";
    languageButton.textContent = "ગુજરાતી";
    languageButton.setAttribute("aria-label", "Switch language");

    const translations = {
        "Home": "હોમ",
        "About": "વિશે",
        "Work": "પ્રોજેક્ટ્સ",
        "Contact": "સંપર્ક",
        "Explore my work": "મારું કામ જુઓ",
        "Let's talk": "વાત કરીએ",
        "More about me": "મારા વિશે વધુ",
        "View all projects": "બધા પ્રોજેક્ટ્સ જુઓ",
        "Let's build something": "ચાલો કંઈક બનાવીએ",
        "Contact me": "મારો સંપર્ક કરો"
    };

    let gujarati = false;

    languageButton.addEventListener("click", () => {
        gujarati = !gujarati;

        const elements = [
            ...$$("[data-translate]"),
            ...(nav ? $$("a", nav) : [])
        ];

        elements.forEach(element => {
            const original =
                element.dataset.en || element.textContent.trim();

            element.dataset.en = original;

            element.textContent = gujarati ?
                (translations[original] || original) :
                original;
        });

        languageButton.textContent =
            gujarati ? "English" : "ગુજરાતી";
    });

    if (nav) {
        nav.append(languageButton);
    }

    // =====================================
    // 8. SCROLL PROGRESS & BACK TO TOP
    // =====================================

    const progress = $(".bar");
    const topButton = $("#top");

    const onScroll = () => {
        const max =
            document.documentElement.scrollHeight - window.innerHeight;

        const percentage =
            max > 0 ? (window.scrollY / max) * 100 : 0;

        if (progress) {
            progress.style.width = `${percentage}%`;
        }

        if (topButton) {
            topButton.classList.toggle("show", window.scrollY > 420);
        }
    };

    window.addEventListener("scroll", onScroll, {
        passive: true
    });

    onScroll();

    topButton && topButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // =====================================
    // 9. REVEAL ON SCROLL
    // =====================================

    const revealItems = $$(".rv");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealItems.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        revealItems.forEach(element => {
            element.classList.add("in");
        });
    }

    // =====================================
    // 10. TYPING ANIMATION
    // =====================================

    const role = $("#role");

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (role && !reducedMotion) {
        const words = [
            "Web Developer",
            "Frontend Developer",
            "Creative Learner"
        ];

        let word = 0;
        let char = 0;
        let deleting = false;

        const type = () => {
            const current = words[word];

            char += deleting ? -1 : 1;
            role.textContent = current.slice(0, char);

            let delay = deleting ? 42 : 85;

            if (!deleting && char === current.length) {
                deleting = true;
                delay = 1300;
            } else if (deleting && char === 0) {
                deleting = false;
                word = (word + 1) % words.length;
                delay = 350;
            }

            setTimeout(type, delay);
        };

        type();
    } else if (role) {
        role.textContent = "Web Developer";
    }

    // =====================================
    // 11. COUNTER ANIMATION
    // =====================================

    const counters = $$("[data-n]");

    if ("IntersectionObserver" in window) {
        const counterObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const element = entry.target;
                const target = Number(element.dataset.n) || 0;

                const start = performance.now();
                const duration = 900;

                const frame = now => {
                    const p = Math.min(
                        (now - start) / duration,
                        1
                    );

                    element.textContent = Math.round(
                        target * (1 - Math.pow(1 - p, 3))
                    );

                    if (p < 1) {
                        requestAnimationFrame(frame);
                    }
                };

                requestAnimationFrame(frame);
                counterObserver.unobserve(element);
            });
        }, { threshold: 0.5 });

        counters.forEach(element => {
            counterObserver.observe(element);
        });
    } else {
        counters.forEach(element => {
            element.textContent = element.dataset.n || "0";
        });
    }

    // =====================================
    // 12. PROJECT SEARCH AND FILTER
    // =====================================

    const cards = $$(".card");
    const filterButtons = $$(".filters [data-f]");
    const search = $("#projectSearch");

    let activeFilter = "all";

    const filterProjects = () => {
        const term = (search && search.value || "").trim().toLowerCase();

        let visible = 0;

        cards.forEach(card => {
            const categoryMatch =
                activeFilter === "all" ||
                card.dataset.c === activeFilter;

            const searchableText = `
                ${card.dataset.t || ""}
                ${card.dataset.d || ""}
                ${card.dataset.s || ""}
                ${card.textContent || ""}
            `.toLowerCase();

            const textMatch = searchableText.includes(term);
            const show = categoryMatch && textMatch;

            card.classList.toggle("hide", !show);

            if (show) visible++;
        });

        const noResults = $("#noResults");

        if (noResults) {
            noResults.hidden = visible !== 0;
        }
    };

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(item => {
                item.classList.remove("on");
            });

            button.classList.add("on");
            activeFilter = button.dataset.f || "all";

            filterProjects();
        });
    });

    search && search.addEventListener("input", filterProjects);

    // =====================================
    // 13. PROJECT DETAILS MODAL
    // =====================================

    const modal = $("#modal");

    const PROJECT_LINKS = {
        "Business landing page": { github: "", live: "" },
        "To-do app": { github: "", live: "" },
        "Weather dashboard": { github: "", live: "" },
        "Restaurant website": { github: "", live: "" },
        "Personal blog": { github: "", live: "" },
        "Calculator": { github: "", live: "" }
    };

    const setText = (selector, value) => {
        const element = $(selector);

        if (element) {
            element.textContent = value;
        }
    };

    const openProject = card => {
        if (!modal) return;

        const image = $("img", card);

        setText("#mt", card.dataset.t || "Project");
        setText("#ms", card.dataset.s || "");
        setText("#md", card.dataset.d || "");

        const modalImage = $("#mi");

        if (modalImage && image) {
            modalImage.src = image.currentSrc || image.src;
            modalImage.alt = image.alt || "Project preview";
        }

        const links = PROJECT_LINKS[card.dataset.t] || {};

        const github = $("#projectGithub");
        const live = $("#projectLive");

        if (github) {
            github.hidden = !links.github;

            if (links.github) {
                github.href = links.github;
            }
        }

        if (live) {
            live.hidden = !links.live;

            if (links.live) {
                live.href = links.live;
            }
        }

        modal.classList.add("open");
        document.body.classList.add("modal-open");

        $("#x") && $("#x").focus();
    };

    cards.forEach(card => {
        card.addEventListener("click", event => {
            if (
                event.target instanceof Element &&
                event.target.closest("a, button")
            ) {
                return;
            }

            openProject(card);
        });

        card.addEventListener("keydown", event => {
            if (
                (event.key === "Enter" || event.key === " ") &&
                (event.target === card)
            ) {
                event.preventDefault();
                openProject(card);
            }
        });
    });

    const closeModal = () => {
        modal && modal.classList.remove("open");
        document.body.classList.remove("modal-open");
    };

    $("#x") && $("#x").addEventListener("click", closeModal);

    modal && modal.addEventListener("click", event => {
        if (event.target === modal) {
            closeModal();
        }
    });

    window.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeModal();
        }
    });

    // =====================================
    // 14. CONTACT FORM
    // =====================================

    const form = $("#f");
    const emailText = $("#emailText");

    if (emailText) {
        emailText.textContent = CONFIG.email || "Email not configured";
    }

    if (form) {
        form.addEventListener("submit", event => {
            event.preventDefault();

            const nameField = form.elements.namedItem("n");
            const emailField = form.elements.namedItem("e");
            const messageField = form.elements.namedItem("m");

            if (!nameField || !emailField || !messageField ||
                typeof nameField.value !== "string" ||
                typeof emailField.value !== "string" ||
                typeof messageField.value !== "string"
            ) {
                console.error(
                    'Form requires fields named "n", "e" and "m".'
                );
                return;
            }

            const name = nameField.value.trim();
            const email = emailField.value.trim();
            const message = messageField.value.trim();

            const validEmail =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            [
                [nameField, Boolean(name)],
                [emailField, validEmail],
                [messageField, Boolean(message)]
            ].forEach(([field, valid]) => {
                field.classList.toggle("bad", !valid);
                field.setAttribute("aria-invalid", String(!valid));
            });

            const status = $("#msg");

            if (!name || !validEmail || !message) {
                if (status) {
                    status.textContent =
                        "Please enter your name, a valid email and your message.";
                }
                return;
            }

            if (!CONFIG.email || !CONFIG.email.includes("@")) {
                if (status) {
                    status.textContent =
                        "Please configure your email in js/main.js first.";
                }
                return;
            }

            const subject = `Portfolio enquiry from ${name}`;

            const body =
                `${message}\n\nFrom: ${name}\nReply to: ${email}`;

            if (status) {
                status.textContent = "Opening your email application...";
            }

            window.location.href =
                `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        });
    }

    // =====================================
    // 15. CUSTOM CURSOR
    // =====================================

    const cursor = $("#cur");

    const desktopPointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    if (cursor && desktopPointer && !reducedMotion) {
        window.addEventListener("mousemove", event => {
            cursor.style.left = `${event.clientX}px`;
            cursor.style.top = `${event.clientY}px`;
        }, { passive: true });

        document.addEventListener("mouseover", event => {
            const target = event.target;

            const interactive =
                target instanceof Element &&
                target.closest("a, button, .card, input, textarea");

            cursor.classList.toggle("big", Boolean(interactive));
        });
    } else {
        cursor && cursor.remove();
    }

    // =====================================
    // 16. 3D CARD TILT
    // =====================================

    if (desktopPointer && !reducedMotion) {
        cards.forEach(card => {
            card.addEventListener("mousemove", event => {
                const rect = card.getBoundingClientRect();

                if (!rect.width || !rect.height) return;

                const x =
                    (event.clientX - rect.left) / rect.width - 0.5;

                const y =
                    (event.clientY - rect.top) / rect.height - 0.5;

                card.style.transform =
                    `perspective(800px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-4px)`;
            });

            card.addEventListener("mouseleave", () => {
                card.style.removeProperty("transform");
            });
        });
    }

    // =====================================
    // 17. WHATSAPP BUTTON
    // =====================================

    const digits = (CONFIG.whatsapp || "").replace(/\D/g, "");

    if (digits.length >= 10) {
        const waURL =
            `https://wa.me/${digits}?text=${encodeURIComponent(
                "Hello Mayank, I would like to discuss a website project."
            )}`;

        const float = document.createElement("a");

        float.id = "whatsappFloat";
        float.href = waURL;
        float.target = "_blank";
        float.rel = "noopener noreferrer";
        float.textContent = "☏";

        float.setAttribute(
            "aria-label",
            "Chat with me on WhatsApp"
        );

        document.body.append(float);

        const contactWA = $("#whatsappContact");

        if (contactWA) {
            contactWA.href = waURL;
            contactWA.hidden = false;
            contactWA.target = "_blank";
            contactWA.rel = "noopener noreferrer";
        }
    }

    // =====================================
    // 18. LOCAL VISITOR COUNTER
    // =====================================

    try {
        const storageKey = "mayank-portfolio-visits";

        const count =
            Number(localStorage.getItem(storageKey) || 0) + 1;

        localStorage.setItem(storageKey, String(count));

        const footer = $("footer");

        if (footer && !$(".analytics-note", footer)) {
            const stats = document.createElement("div");

            stats.className = "analytics-note";
            stats.textContent =
                `Your visits on this browser: ${count} · Local counter only`;

            footer.append(stats);
        }
    } catch (error) {
        console.warn("Visitor counter unavailable.", error);
    }

    // =====================================
    // 19. SERVICE ENQUIRY PREFILL
    // =====================================

    const serviceParam =
        new URLSearchParams(window.location.search).get("service");

    const serviceMessage = $("#message");

    if (serviceParam && serviceMessage && !serviceMessage.value) {
        serviceMessage.value =
            `I'm interested in: ${serviceParam}. Please share the next steps.`;
    }

    // =====================================
    // 20. SOCIAL MEDIA LINKS
    // =====================================

    $$('a[href="https://github.com/"]').forEach(link => {
        link.href = CONFIG.github;
    });

    $$('a[href="https://www.linkedin.com/"]').forEach(link => {
        link.href = CONFIG.linkedin;
    });

    // =====================================
    // FINISHED
    // =====================================

    console.log("Mayank Reshiya Portfolio loaded successfully!");

})();