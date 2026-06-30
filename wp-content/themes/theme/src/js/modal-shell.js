(function () {
	var openStack = [];

	function syncBodyOverflow() {
		if (openStack.length > 0) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
	}

	function closeModalShell(root) {
		if (!root) {
			return;
		}

		var i = openStack.length;

		while (i--) {
			if (openStack[i] === root) {
				openStack.splice(i, 1);
			}
		}

		root.setAttribute("inert", "");
		root.classList.remove("is-open");
		syncBodyOverflow();
	}

	function openModalShell(root) {
		if (!root || root.classList.contains("is-open")) {
			return;
		}

		document.querySelectorAll("[data-modal-shell].is-open").forEach(function (other) {
			if (other !== root) {
				closeModalShell(other);
			}
		});

		root.removeAttribute("inert");
		root.classList.add("is-open");
		openStack.push(root);
		syncBodyOverflow();
	}

	function closeTopModal() {
		if (!openStack.length) {
			return;
		}

		var top = openStack[openStack.length - 1];

		closeModalShell(top);
	}

	document.addEventListener("click", function (ev) {
		var opener = ev.target.closest("[data-modal-shell-open]");

		if (opener) {
			var inst = opener.getAttribute("data-modal-shell-open");

			if (!inst) {
				return;
			}

			var target = document.querySelector(
				'[data-modal-shell-instance="' + inst.replace(/"/g, '\\"') + '"]'
			);

			if (!target) {
				return;
			}

			ev.preventDefault();
			openModalShell(target);

			return;
		}

		var closer = ev.target.closest("[data-modal-shell-close]");

		if (!closer) {
			return;
		}

		var shell = closer.closest("[data-modal-shell]");

		if (!shell) {
			return;
		}

		closeModalShell(shell);
	});

	document.addEventListener("keydown", function (ev) {
		if (ev.key !== "Escape") {
			return;
		}

		closeTopModal();
	});

	window.openModalShell = function (instance) {
		if (!instance) {
			return;
		}

		var el = document.querySelector(
			'[data-modal-shell-instance="' + String(instance).replace(/"/g, '\\"') + '"]'
		);

		if (!el) {
			return;
		}

		openModalShell(el);
	};

	window.closeModalShell = function (instance) {
		if (!instance) {
			return;
		}

		var el = document.querySelector(
			'[data-modal-shell-instance="' + String(instance).replace(/"/g, '\\"') + '"]'
		);

		if (!el) {
			return;
		}

		closeModalShell(el);
	};
})();
