(function () {
	var LS_KEY = "user-reviews-votes";

	function getStore() {
		try {
			var raw = localStorage.getItem(LS_KEY);

			if (!raw) {
				return {};
			}

			var parsed = JSON.parse(raw);

			if (!parsed || typeof parsed !== "object") {
				return {};
			}

			return parsed;
		} catch (e) {
			return {};
		}
	}

	function setStore(obj) {
		try {
			localStorage.setItem(LS_KEY, JSON.stringify(obj));
		} catch (e) {}
	}

	function parseBase(root, attr, fallback) {
		var v = parseInt(root.getAttribute(attr), 10);

		if (isNaN(v)) {
			return fallback;
		}

		return v;
	}

	function syncVoteRow(root, data) {
		var likeEl = root.querySelector('[data-user-reviews-count="like"]');
		var dislikeEl = root.querySelector('[data-user-reviews-count="dislike"]');

		if (likeEl) {
			likeEl.textContent = String(data.likes);
		}

		if (dislikeEl) {
			dislikeEl.textContent = String(data.dislikes);
		}

		root.classList.remove("is-voted-like", "is-voted-dislike");

		if (data.vote === "like") {
			root.classList.add("is-voted-like");
		}

		if (data.vote === "dislike") {
			root.classList.add("is-voted-dislike");
		}
	}

	function getRowState(root, store) {
		var id = root.getAttribute("data-user-reviews-vote-id");

		if (!id) {
			return null;
		}

		var baseLikes = parseBase(root, "data-user-reviews-like-base", 0);
		var baseDis = parseBase(root, "data-user-reviews-dislike-base", 0);
		var saved = store[id];

		if (saved && typeof saved.likes === "number" && typeof saved.dislikes === "number") {
			return {
				likes: saved.likes,
				dislikes: saved.dislikes,
				vote: saved.vote === "like" || saved.vote === "dislike" ? saved.vote : null,
			};
		}

		return {
			likes: baseLikes,
			dislikes: baseDis,
			vote: null,
		};
	}

	function persistRow(root, state) {
		var id = root.getAttribute("data-user-reviews-vote-id");

		if (!id) {
			return;
		}

		var store = getStore();

		store[id] = {
			likes: state.likes,
			dislikes: state.dislikes,
			vote: state.vote,
		};
		setStore(store);
	}

	function applyVoteClick(root, kind) {
		var store = getStore();
		var state = getRowState(root, store);

		if (!state) {
			return;
		}

		if (kind === "like") {
			if (state.vote === "like") {
				state.likes -= 1;
				state.vote = null;
			} else {
				if (state.vote === "dislike") {
					state.dislikes -= 1;
				}

				state.likes += 1;
				state.vote = "like";
			}
		}

		if (kind === "dislike") {
			if (state.vote === "dislike") {
				state.dislikes -= 1;
				state.vote = null;
			} else {
				if (state.vote === "like") {
					state.likes -= 1;
				}

				state.dislikes += 1;
				state.vote = "dislike";
			}
		}

		persistRow(root, state);
		syncVoteRow(root, state);
	}

	function initVotes() {
		var store = getStore();

		document.querySelectorAll("[data-user-reviews-vote-root]").forEach(function (root) {
			var state = getRowState(root, store);

			if (!state) {
				return;
			}

			syncVoteRow(root, state);
		});
	}

	function findMainReplySheet(btn) {
		var item = btn.closest(".user-reviews__item");

		if (!item) {
			return null;
		}

		var ch = item.children;
		var i = 0;

		for (i = 0; i < ch.length; i++) {
			if (ch[i].classList && ch[i].classList.contains("user-reviews__reply-sheet")) {
				return ch[i];
			}
		}

		return null;
	}

	function findNestedReplySheet(btn) {
		var block = btn.closest(".user-reviews__reply-block");

		if (!block) {
			return null;
		}

		return block.querySelector("[data-user-reviews-reply-sheet]");
	}

	function closeAllReplySheetsInItem(item) {
		if (!item) {
			return;
		}

		item.querySelectorAll("[data-user-reviews-reply-sheet]").forEach(function (sheet) {
			sheet.setAttribute("inert", "");
		});
	}

	function openReplySheet(btn) {
		var nested = findNestedReplySheet(btn);
		var sheet = nested || findMainReplySheet(btn);
		var item = btn.closest(".user-reviews__item");

		if (!sheet || !item) {
			return;
		}

		if (!sheet.hasAttribute("inert")) {
			sheet.setAttribute("inert", "");

			return;
		}

		closeAllReplySheetsInItem(item);
		sheet.removeAttribute("inert");
	}

	function submitReplySheet(btn) {
		var sheet = btn.closest("[data-user-reviews-reply-sheet]");

		if (!sheet) {
			return;
		}

		var input = sheet.querySelector(".user-reviews__reply-input");

		if (!input) {
			return;
		}

		var text = String(input.value || "").trim();

		if (!text) {
			return;
		}

		input.value = "";

		if (typeof window.openModalShell === "function") {
			window.openModalShell("review-thanks");
		}
	}

	var REPLIES_PAGE = 5;

	function getThreadVisibleCount(item) {
		var body = item.querySelector("[data-user-reviews-thread-body]");

		if (!body) {
			return 0;
		}

		var v = parseInt(body.getAttribute("data-user-reviews-visible"), 10);

		if (isNaN(v)) {
			return 0;
		}

		return v;
	}

	function setThreadVisibleCount(item, count) {
		var body = item.querySelector("[data-user-reviews-thread-body]");

		if (!body) {
			return;
		}

		var blocks = body.querySelectorAll("[data-user-reviews-reply-item]");
		var total = blocks.length;
		var n = count;

		if (n > total) {
			n = total;
		}

		if (n < 0) {
			n = 0;
		}

		body.setAttribute("data-user-reviews-visible", String(n));

		var i;

		for (i = 0; i < blocks.length; i++) {
			if (i < n) {
				blocks[i].classList.remove("user-reviews__reply-block--hidden");
				blocks[i].removeAttribute("inert");
			} else {
				blocks[i].classList.add("user-reviews__reply-block--hidden");
				blocks[i].setAttribute("inert", "");
			}
		}

		var moreBtn = body.querySelector("[data-user-reviews-replies-more]");

		if (!moreBtn) {
			return;
		}

		if (n >= total) {
			moreBtn.setAttribute("hidden", "");
		} else {
			moreBtn.removeAttribute("hidden");
		}
	}

	function openRepliesPreview(btn) {
		var item = btn.closest(".user-reviews__item");

		if (!item) {
			return;
		}

		if (item.classList.contains("is-replies-expanded")) {
			return;
		}

		var panel = item.querySelector("[data-user-reviews-replies]");

		if (!panel) {
			return;
		}

		panel.removeAttribute("inert");
		item.classList.add("is-replies-expanded");
		setThreadVisibleCount(item, REPLIES_PAGE);
	}

	function loadMoreReplies(btn) {
		var item = btn.closest(".user-reviews__item");

		if (!item) {
			return;
		}

		if (!item.classList.contains("is-replies-expanded")) {
			return;
		}

		var cur = getThreadVisibleCount(item);

		if (!cur) {
			cur = REPLIES_PAGE;
		}

		setThreadVisibleCount(item, cur + REPLIES_PAGE);
	}

	function setStarRating(container, value) {
		var buttons = container.querySelectorAll("[data-user-reviews-star]");

		buttons.forEach(function (b) {
			var n = parseInt(b.getAttribute("data-user-reviews-star"), 10);

			if (isNaN(n)) {
				return;
			}

			b.classList.toggle("is-active", n <= value);
		});

		container.setAttribute("data-user-reviews-rating", String(value));
	}

	function initForm(root) {
		var form = root.querySelector("[data-user-reviews-form]");
		var starsWrap = root.querySelector("[data-user-reviews-stars]");
		var textField = root.querySelector("[data-user-reviews-text]");

		if (!form) {
			return;
		}

		if (starsWrap) {
			starsWrap.addEventListener("click", function (ev) {
				var starBtn = ev.target.closest("[data-user-reviews-star]");

				if (!starBtn || !starsWrap.contains(starBtn)) {
					return;
				}

				var val = parseInt(starBtn.getAttribute("data-user-reviews-star"), 10);

				if (isNaN(val)) {
					return;
				}

				setStarRating(starsWrap, val);
			});
		}

		form.addEventListener("submit", function (ev) {
			ev.preventDefault();

			var text = textField ? String(textField.value || "").trim() : "";
			var rating = 0;

			if (starsWrap) {
				var ra = parseInt(starsWrap.getAttribute("data-user-reviews-rating"), 10);

				if (!isNaN(ra)) {
					rating = ra;
				}
			}

			if (!text && !rating) {
				return;
			}

			if (textField) {
				textField.value = "";
			}

			if (starsWrap) {
				setStarRating(starsWrap, 0);
			}

			if (typeof window.openModalShell === "function") {
				window.openModalShell("review-thanks");
			}
		});
	}

	document.addEventListener("click", function (ev) {
		var voteBtn = ev.target.closest("[data-user-reviews-vote]");

		if (voteBtn) {
			var root = voteBtn.closest("[data-user-reviews-vote-root]");

			if (!root) {
				return;
			}

			var kind = voteBtn.getAttribute("data-user-reviews-vote");

			if (kind !== "like" && kind !== "dislike") {
				return;
			}

			applyVoteClick(root, kind);

			return;
		}

		var replyOpen = ev.target.closest("[data-user-reviews-reply-open]");

		if (replyOpen) {
			openReplySheet(replyOpen);

			return;
		}

		var replySubmit = ev.target.closest("[data-user-reviews-reply-submit]");

		if (replySubmit) {
			submitReplySheet(replySubmit);

			return;
		}

		var repPreview = ev.target.closest("[data-user-reviews-replies-preview]");

		if (repPreview) {
			openRepliesPreview(repPreview);

			return;
		}

		var repMore = ev.target.closest("[data-user-reviews-replies-more]");

		if (repMore) {
			loadMoreReplies(repMore);
		}
	});

	function boot() {
		initVotes();

		document.querySelectorAll("[data-user-reviews]").forEach(function (root) {
			initForm(root);
		});
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", boot);
	} else {
		boot();
	}
})();
