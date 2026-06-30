(function () {
	function initToggles() {
		document.addEventListener("click", function (ev) {
			var btn = ev.target.closest("[data-at-a-glance-toggle]");

			if (!btn) {
				return;
			}

			var root = btn.closest("[data-at-a-glance]");

			if (!root) {
				return;
			}

			var extra = root.querySelector("[data-at-a-glance-extra]");

			if (!extra) {
				return;
			}

			var open = !root.classList.contains("is-expanded");

			if (open) {
				extra.removeAttribute("inert");
				root.classList.add("is-expanded");
			} else {
				extra.setAttribute("inert", "");
				root.classList.remove("is-expanded");
			}
		});
	}

	function openLicensePopup() {
		if (typeof window.openModalShell === "function") {
			window.openModalShell("license");
		}
	}

	function initLicenseRows() {
		document.addEventListener("click", function (ev) {
			var row = ev.target.closest("[data-at-a-glance-license]");

			if (!row) {
				return;
			}

			var root = row.closest("[data-at-a-glance]");

			if (!root) {
				return;
			}

			openLicensePopup();
		});
	}

	function boot() {
		document.querySelectorAll("[data-at-a-glance]").forEach(function (root) {
			var extra = root.querySelector("[data-at-a-glance-extra]");

			if (extra && !root.classList.contains("is-expanded")) {
				extra.setAttribute("inert", "");
			}
		});
		initToggles();
		initLicenseRows();
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", boot);
	} else {
		boot();
	}
})();
