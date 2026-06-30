(function () {
	var scrollOffset = 120;

	function initSidebarTocNav(nav) {
		var items = Array.prototype.slice.call(nav.querySelectorAll("[data-sidebar-toc-item]"));
		var sections = items.map(function (li) {
			var a = li.querySelector('a[href^="#"]');

			if (!a) {
				return null;
			}

			var id = a.getAttribute("href").slice(1);

			if (!id) {
				return null;
			}

			return document.getElementById(id);
		});

		if (!items.length) {
			return;
		}

		function setActive(index) {
			items.forEach(function (li, i) {
				if (i === index) {
					li.classList.add("is-active");
				} else {
					li.classList.remove("is-active");
				}
			});
		}

		function clearActive() {
			items.forEach(function (li) {
				li.classList.remove("is-active");
			});
		}

		function syncActive() {
			var current = -1;
			var i;

			for (i = 0; i < sections.length; i++) {
				if (!sections[i]) {
					continue;
				}

				if (sections[i].getBoundingClientRect().top <= scrollOffset) {
					current = i;
				}
			}

			if (current >= 0) {
				setActive(current);
			} else {
				clearActive();
			}
		}

		var ticking = false;

		function onScrollOrResize() {
			if (ticking) {
				return;
			}

			ticking = true;

			requestAnimationFrame(function () {
				syncActive();
				ticking = false;
			});
		}

		window.addEventListener("scroll", onScrollOrResize, { passive: true });
		window.addEventListener("resize", onScrollOrResize);
		syncActive();
	}

	function initAll() {
		var navs = document.querySelectorAll("[data-sidebar-toc]");

		navs.forEach(function (nav) {
			initSidebarTocNav(nav);
		});
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", initAll);
	} else {
		initAll();
	}
})();
