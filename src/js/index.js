import '../../node_modules/glightbox/dist/css/glightbox.min.css';
import '../css/animate.css';
import '../css/style.css';
import '../css/prism.css';
import './prism.js';
import './prism-normalize-whitespace.js';

import GLightbox from 'glightbox';
import WOW from 'wowjs';

window.wow = new WOW.WOW({
  live: false,
});

window.wow.init({
  offset: 50,
});

//========= glightbox
const lightbox = GLightbox({
  href: 'https://www.youtube.com/watch?v=r44RKWyfcFw&fbclid=IwAR21beSJORalzmzokxDRcGfkZA1AtRTE__l5N4r09HcGS5Y6vOluyouM9EM',
  type: 'video',
  source: 'youtube', //vimeo, youtube or local
  width: 900,
  autoplayVideos: true,
});

(function () {
  'use strict';

  // ==== darkToggler
  // const darkTogglerCheckbox = document.querySelector('#darkToggler');
  // const html = document.querySelector('html');

  // const darkModeToggler = () => {
  //   darkTogglerCheckbox.checked ? html.classList.remove('dark') : html.classList.add('dark');
  // };
  // darkModeToggler();

  // darkTogglerCheckbox.addEventListener('click', darkModeToggler);

  // ======= Sticky
  window.onscroll = function () {
    const ud_header = document.querySelector('.header');
    const sticky = ud_header.offsetTop;

    if (window.pageYOffset > sticky) {
      ud_header.classList.add('sticky');
    } else {
      ud_header.classList.remove('sticky');
    }

    // show or hide the back-top-top button
    const backToTop = document.querySelector('.back-to-top');
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
      backToTop.style.display = 'flex';
    } else {
      backToTop.style.display = 'none';
    }
  };

  // ===== responsive navbar
  let navbarToggler = document.querySelector('#navbarToggler');
  const navbarCollapse = document.querySelector('#navbarCollapse');

  navbarToggler.addEventListener('click', () => {
    navbarToggler.classList.toggle('navbarTogglerActive');
    navbarCollapse.classList.toggle('hidden');
  });

  //===== close navbar-collapse when a  clicked
  document.querySelectorAll('#navbarCollapse ul li:not(.submenu-item) a').forEach((e) =>
    e.addEventListener('click', () => {
      navbarToggler.classList.remove('navbarTogglerActive');
      navbarCollapse.classList.add('hidden');
    })
  );

  // ===== Sub-menu
  const submenuItems = document.querySelectorAll('.submenu-item');
  submenuItems.forEach((el) => {
    el.querySelector('a').addEventListener('click', () => {
      el.querySelector('.submenu').classList.toggle('hidden');
    });
  });

  // ===== Faq accordion
  const faqs = document.querySelectorAll('.single-faq');
  faqs.forEach((el) => {
    el.querySelector('.faq-btn').addEventListener('click', () => {
      el.querySelector('.icon').classList.toggle('rotate-180');
      el.querySelector('.faq-content').classList.toggle('hidden');
    });
  });

  // ====== scroll top js
  function scrollTo(element, to = 0, duration = 500) {
    const start = element.scrollTop;
    const change = to - start;
    const increment = 20;
    let currentTime = 0;

    const animateScroll = () => {
      currentTime += increment;

      const val = Math.easeInOutQuad(currentTime, start, change, duration);

      element.scrollTop = val;

      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };

    animateScroll();
  }

  Math.easeInOutQuad = function (t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  document.querySelector('.back-to-top').onclick = () => {
    scrollTo(document.documentElement);
  };
})();

// Document Loaded
document.addEventListener('DOMContentLoaded', () => {});
