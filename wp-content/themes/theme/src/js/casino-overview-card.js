(function () {
    function initCasinoOverviewCards() {
        const roots = document.querySelectorAll("[data-casino-overview]");

        roots.forEach(function ( root ) {
            const shell = root.querySelector("[data-casino-overview-body]");
            const toggles = root.querySelectorAll("[data-casino-overview-toggle]");

            if (!shell || !toggles.length) {
                return;
            }

            function openPanel() {
                shell.removeAttribute("inert");
                requestAnimationFrame(function () {
                    requestAnimationFrame(function () {
                        root.classList.add("is-expanded");
                    });
                });
            }

            function closePanel() {
                shell.setAttribute("inert", "");
                root.classList.remove("is-expanded");
            }

            toggles.forEach(function ( btn ) {
                btn.addEventListener("click", function () {
                    const open = !root.classList.contains("is-expanded");

                    if (open) {
                        openPanel();
                    } else {
                        closePanel();
                    }
                });
            });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initCasinoOverviewCards);
    } else {
        initCasinoOverviewCards();
    }
})();
