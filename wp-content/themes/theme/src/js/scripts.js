// core version + navigation, pagination modules:
import Swiper from 'swiper';
import {Pagination } from 'swiper/modules';
// import Swiper and modules styles
import 'swiper/css';

require('./bonus-offers-slider');
require('./casino-overview-card');
require('./casino-faq');
require('./modal-shell');
require('./sidebar-toc');
require('./user-reviews');
require('./at-a-glance');

document.addEventListener('DOMContentLoaded', function() {
    const casinoSliders = document.querySelectorAll('.casino-card--bonuses');

    casinoSliders.forEach((sliderElement, index) => {

        const paginationEl = sliderElement.querySelector('.swiper-pagination');

        new Swiper(sliderElement, {
            slidesPerView: 'auto',
            spaceBetween: 8,
            loop: false,
            freeMode: true,
            pagination: {
                el: paginationEl,
                clickable: true,
            },
            modules: [Pagination],
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const textBlock = document.querySelector('.home--intro-text');
    const toggleBtn = document.querySelector('.home--intro-switch');

    if (textBlock && toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            textBlock.classList.toggle('active');
            toggleBtn.classList.toggle('active');
        })
    }
});


// .site-header--menu-btn
(() => {
    const btn = document.querySelector('.header--menu-open')

    if (btn) {
        const menu = document.querySelector('.header--menu')
        btn.addEventListener('click', () => {
            btn.classList.toggle('menu-active')
            menu.classList.toggle('menu-active')
            document.querySelector('body').classList.toggle('menu-active')
        })
    }
})();

//FAQ Block

(() => {
    const faq_items = document.querySelectorAll('.faq--title');
    if(faq_items){
        faq_items.forEach((title) => {
            title.addEventListener('click', () => {
                title.closest('.faq--item').classList.toggle('active');
            })
        })
    }
})();

function goButtonRedirect() {
    document.addEventListener('click', function (event) {
        const button = event.target.closest('[data-go]');

        if (!button) {
            return;
        }

        const encodedUrl = button.dataset.go;
        const decodedUrl = atob(encodedUrl.toString());

        window.open(decodedUrl, '_blank');
    });
}

goButtonRedirect();

document.addEventListener('DOMContentLoaded', () => {
    initTableScrollInSpaceContent();


    document.querySelectorAll('.casino-card--payment-items').forEach(container => {
        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;

        const onMouseMove = (e) => {
            if (!isDown) return;
            e.preventDefault();

            const x = e.pageX;
            const walk = (x - startX) * 1.2;
            container.scrollLeft = scrollLeft - walk;
        };

        const onMouseUp = () => {
            if (!isDown) return;
            isDown = false;
            container.classList.remove('is-dragging');

            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        container.addEventListener('mousedown', (e) => {
            isDown = true;
            container.classList.add('is-dragging');
            startX = e.pageX;
            scrollLeft = container.scrollLeft;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    });
});

function initTableScrollInSpaceContent() {
    const MIN_THUMB = 8;
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    document.querySelectorAll('.table_scroll').forEach((block) => {
        const viewport = block.querySelector('.table_scroll__viewport');
        const track = block.querySelector('.table_scroll__track');
        const thumb = block.querySelector('.table_scroll__thumb');

        if (!viewport || !track || !thumb) {
            return;
        }

        const metrics = () => {
            const sw = viewport.scrollWidth;
            const cw = viewport.clientWidth;
            const tw = track.clientWidth;

            return {
                sw,
                cw,
                tw,
                maxScroll: Math.max(sw - cw, 0),
                thumbPx: Math.max((cw / (sw || 1)) * tw, MIN_THUMB),
            };
        };

        const syncThumb = () => {
            const { sw, cw, tw, maxScroll } = metrics();

            if (!sw || !cw) {
                return;
            }

            if (sw <= cw) {
                block.classList.remove('is-scrollable');
                thumb.style.width = '';
                thumb.style.left = '';
                return;
            }

            block.classList.add('is-scrollable');

            const minPct = tw > 0 ? (MIN_THUMB / tw) * 100 : 0;
            const thumbW = Math.max((cw / sw) * 100, minPct);
            const leftPct = maxScroll > 0 ? (viewport.scrollLeft / maxScroll) * (100 - thumbW) : 0;

            thumb.style.width = thumbW + '%';
            thumb.style.left = leftPct + '%';

            if (tw === 0) {
                requestAnimationFrame(syncThumb);
            }
        };

        let isDragging = false;
        let dragStartX = 0;
        let dragStartScroll = 0;

        thumb.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            isDragging = true;
            dragStartX = e.clientX;
            dragStartScroll = viewport.scrollLeft;
            block.classList.add('is-dragging');
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) {
                return;
            }

            e.preventDefault();

            const { maxScroll, thumbPx, tw } = metrics();
            const travel = Math.max(tw - thumbPx, 1);
            const delta = ((e.clientX - dragStartX) / travel) * maxScroll;

            viewport.scrollLeft = clamp(dragStartScroll + delta, 0, maxScroll);
        });

        document.addEventListener('mouseup', () => {
            if (!isDragging) {
                return;
            }

            isDragging = false;
            block.classList.remove('is-dragging');
        });

        track.addEventListener('mousedown', (e) => {
            if (e.target !== track) {
                return;
            }

            const { maxScroll } = metrics();

            if (maxScroll <= 0) {
                return;
            }

            const rect = track.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;

            viewport.scrollLeft = clamp(ratio * maxScroll, 0, maxScroll);
        });

        viewport.addEventListener('scroll', syncThumb, { passive: true });
        window.addEventListener('resize', syncThumb, { passive: true });
        window.addEventListener('load', syncThumb, { once: true });
        requestAnimationFrame(() => requestAnimationFrame(syncThumb));

        if (typeof ResizeObserver !== 'undefined') {
            const ro = new ResizeObserver(syncThumb);

            ro.observe(viewport);

            const tableEl = viewport.querySelector('table');

            if (tableEl) {
                ro.observe(tableEl);
            }
        }

        syncThumb();
    });
}


document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    const sticky = document.querySelector('.space-organization-float-bar-bg');
    const closeBtn = document.querySelector('.casino-review-split-banner__close-btn');

    if (sticky) {
        window.addEventListener('scroll', function() {
            const scroll = window.scrollY || document.documentElement.scrollTop;

            if (sticky.classList.contains('is-closed')) return;

            if (scroll >= 400) {
                sticky.classList.add('show');
            } else {
                sticky.classList.remove('show');
            }
        });
    }

    if (closeBtn && sticky) {
        closeBtn.addEventListener('click', function() {

            sticky.classList.remove('show');

            sticky.classList.add('is-closed');
        });
    }
});