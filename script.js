/* ================================================================
   MANAN PAHU — PERSONAL HUB
   script.js

   Features:
   1. Footer year (auto-generated)
   2. Sticky nav — border + background on scroll
   3. Active nav link highlighting (scroll spy)
   4. Mobile nav toggle (hamburger menu)
   5. Scroll-to-top button visibility
   6. Smooth scroll for all anchor links
   7. Scroll reveal animations (IntersectionObserver)
   8. Keyboard accessibility (Escape closes mobile nav)
   ================================================================ */

'use strict';

/* ----------------------------------------------------------------
   1. FOOTER YEAR — automatically set current year
   ---------------------------------------------------------------- */
(function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ----------------------------------------------------------------
   2. CACHED DOM REFERENCES
   ---------------------------------------------------------------- */
const navHeader  = document.getElementById('nav-header');
const navToggle  = document.getElementById('nav-toggle');
const navMenu    = document.getElementById('nav-menu');
const navLinks   = document.querySelectorAll('.nav-link');
const scrollTopBtn = document.getElementById('scroll-top');

// All sections that nav links point to
const sections = Array.from(document.querySelectorAll('section[id], div[id]'))
  .filter(el => el.id === 'hero' || el.id === 'connect' || el.id === 'websites' || el.id === 'about');


/* ----------------------------------------------------------------
   3. SCROLL HANDLER — sticky nav + scroll-to-top button visibility
   ---------------------------------------------------------------- */
function onScroll() {
  const scrollY = window.scrollY;

  // Sticky nav styling
  if (scrollY > 20) {
    navHeader.classList.add('scrolled');
  } else {
    navHeader.classList.remove('scrolled');
  }

  // Scroll-to-top button
  if (scrollY > 400) {
    scrollTopBtn.removeAttribute('hidden');
    // Small rAF delay so the 'hidden' removal renders before the class add
    requestAnimationFrame(() => scrollTopBtn.classList.add('visible'));
  } else {
    scrollTopBtn.classList.remove('visible');
    // Re-hide after transition completes
    setTimeout(() => {
      if (window.scrollY <= 400) scrollTopBtn.setAttribute('hidden', '');
    }, 300);
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
// Run once on load in case page is already scrolled
onScroll();


/* ----------------------------------------------------------------
   4. ACTIVE NAV LINK — scroll spy using IntersectionObserver
   ---------------------------------------------------------------- */
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  },
  {
    rootMargin: '-40% 0px -55% 0px',  // triggers when section is ~middle of viewport
    threshold: 0
  }
);

sections.forEach(section => sectionObserver.observe(section));


/* ----------------------------------------------------------------
   5. MOBILE NAV TOGGLE
   ---------------------------------------------------------------- */
function openNav() {
  navMenu.classList.add('open');
  navToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden'; // prevent background scroll
}

function closeNav() {
  navMenu.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

function toggleNav() {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  isOpen ? closeNav() : openNav();
}

navToggle.addEventListener('click', toggleNav);

// Close nav when a link is clicked (navigating away)
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    closeNav();
  });
});

// Close nav on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
    closeNav();
    navToggle.focus(); // return focus to toggle button
  }
});

// Close nav when clicking outside (on the overlay)
document.addEventListener('click', (e) => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  if (isOpen && !navHeader.contains(e.target)) {
    closeNav();
  }
});


/* ----------------------------------------------------------------
   6. SMOOTH SCROLL — all internal anchor links
   ---------------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const navHeight = navHeader ? navHeader.offsetHeight : 0;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({
      top: targetTop,
      behavior: 'smooth'
    });

    // Update focus for accessibility
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
  });
});


/* ----------------------------------------------------------------
   7. SCROLL-TO-TOP BUTTON — click handler
   ---------------------------------------------------------------- */
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ----------------------------------------------------------------
   8. SCROLL REVEAL ANIMATIONS
   Adds .revealed class when elements enter the viewport.
   Elements need class="reveal" or class="reveal-stagger" in HTML.
   ---------------------------------------------------------------- */
function initRevealObserver() {
  // Respect prefers-reduced-motion
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    // Just mark everything as revealed immediately
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
      el.classList.add('revealed');
    });
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target); // only trigger once
        }
      });
    },
    {
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1
    }
  );

  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
    revealObserver.observe(el);
  });
}

// Auto-apply reveal classes to key elements (so HTML stays clean)
function applyRevealClasses() {
  // Section headers
  document.querySelectorAll('.section__header').forEach(el => {
    el.classList.add('reveal');
  });

  // Social cards grid — stagger children
  document.querySelectorAll('.social-grid').forEach(el => {
    el.classList.add('reveal-stagger');
  });

  // Site cards grid — stagger children
  document.querySelectorAll('.sites-grid').forEach(el => {
    el.classList.add('reveal-stagger');
  });

  // About grid
  document.querySelectorAll('.about__grid').forEach(el => {
    el.classList.add('reveal');
  });
}

// Run on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  applyRevealClasses();
  initRevealObserver();
});

// Fallback if script loads after DOM is ready
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  applyRevealClasses();
  initRevealObserver();
}
