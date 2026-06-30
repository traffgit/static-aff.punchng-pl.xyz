(function () {
	function initCasinoFaq() {
		const roots = document.querySelectorAll("[data-casino-faq]");

		roots.forEach(function (root) {
			const toggles = root.querySelectorAll("[data-casino-faq-toggle]");

			toggles.forEach(function (btn) {
				btn.addEventListener("click", function () {
					const item = btn.closest("[data-casino-faq-item]");
					const panel = item ? item.querySelector("[data-casino-faq-panel]") : null;

					if (!item || !panel) {
						return;
					}

					const open = !item.classList.contains("is-expanded");

					if (open) {
						panel.removeAttribute("inert");
						requestAnimationFrame(function () {
							requestAnimationFrame(function () {
								item.classList.add("is-expanded");
							});
						});
					} else {
						panel.setAttribute("inert", "");
						item.classList.remove("is-expanded");
					}
				});
			});
		});
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", initCasinoFaq);
	} else {
		initCasinoFaq();
	}
})();
