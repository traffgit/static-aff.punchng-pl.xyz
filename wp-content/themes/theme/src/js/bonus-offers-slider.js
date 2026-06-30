import Swiper from "swiper";
import {Navigation, Pagination} from "swiper/modules";

(function () {
	function initBonusOffersSliders() {
		const roots = document.querySelectorAll("[data-bonus-offers-slider]");

		roots.forEach(function (root) {
			const carousel = root.querySelector("[data-bonus-offers-slider-carousel]");

			if (!carousel) {
				return;
			}
			const paginationEl = carousel.querySelector('.swiper-pagination');
			const prevBtn = carousel.querySelector('.swiper-button-prev');
			const nextBtn = carousel.querySelector('.swiper-button-next');
			new Swiper(carousel, {
				slidesPerView: 1,
				spaceBetween: 20,
				loop: false,
				pagination: {
					el: paginationEl,
					clickable: true,
				},
				navigation: {
					nextEl: nextBtn,
					prevEl: prevBtn,
				},
				modules: [Pagination, Navigation],
			});
		});
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", initBonusOffersSliders);
	} else {
		initBonusOffersSliders();
	}
})();
