(() => {
    const themeKey = "footmain-theme";
    const menu = document.getElementById("side-menu");
    const menuToggle = document.getElementById("menu-toggle");
    const menuClose = document.getElementById("menu-close");
    const backdrop = document.getElementById("menu-backdrop");
    const themeButtons = document.querySelectorAll("[data-theme-choice]");

    function readSavedTheme() {
        try {
            const savedTheme = localStorage.getItem(themeKey);
            return savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
        } catch (error) {
            console.error("Não foi possível carregar o tema salvo:", error);
            return "dark";
        }
    }

    function applyTheme(theme, save = true) {
        document.documentElement.dataset.theme = theme;

        themeButtons.forEach((button) => {
            button.setAttribute("aria-pressed", String(button.dataset.themeChoice === theme));
        });

        if (save) {
            try {
                localStorage.setItem(themeKey, theme);
            } catch (error) {
                console.error("Não foi possível salvar o tema escolhido:", error);
            }
        }
    }

    function setMenuOpen(isOpen) {
        menu.classList.toggle("is-open", isOpen);
        menu.setAttribute("aria-hidden", String(!isOpen));
        menu.inert = !isOpen;
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        backdrop.hidden = !isOpen;

        if (isOpen) {
            menuClose.focus();
        } else {
            menuToggle.focus();
        }
    }

    applyTheme(readSavedTheme(), false);

    menuToggle.addEventListener("click", () => setMenuOpen(true));
    menuClose.addEventListener("click", () => setMenuOpen(false));
    backdrop.addEventListener("click", () => setMenuOpen(false));

    themeButtons.forEach((button) => {
        button.addEventListener("click", () => applyTheme(button.dataset.themeChoice));
    });

    document.addEventListener("keydown", (event) => {
        if (!menu.classList.contains("is-open")) return;

        if (event.key === "Escape") {
            setMenuOpen(false);
            return;
        }

        if (event.key === "Tab") {
            const focusableElements = menu.querySelectorAll("button:not([disabled])");
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    });
})();
