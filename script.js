/**
 * PORTFOLIO CLIENT-SIDE INTERACTION SCRIPT
 * Candidate: Hamed Mohamed Hamed Hegazy
 * Role: Aspiring Data Engineer | Python & SQL
 */

(function () {
  'use strict';

  // --- 1. THEME TOGGLE (Dark Mode Default + Light Mode Option) ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  const rootElement = document.documentElement;

  // Retrieve stored theme preference or default to dark
  const storedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  applyTheme(storedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = rootElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      localStorage.setItem('portfolio-theme', nextTheme);
    });
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      rootElement.setAttribute('data-theme', 'light');
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
        themeToggleBtn.setAttribute('title', 'Switch to dark mode');
      }
    } else {
      rootElement.removeAttribute('data-theme');
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
        themeToggleBtn.setAttribute('title', 'Switch to light mode');
      }
    }
  }

  // --- 2. MOBILE NAVIGATION MENU ---
  const mobileToggleBtn = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = mobileToggleBtn.getAttribute('aria-expanded') === 'true';
      mobileToggleBtn.setAttribute('aria-expanded', String(!isExpanded));
      navMenu.classList.toggle('mobile-open');
    });

    // Close menu when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      if (!navMenu.contains(event.target) && !mobileToggleBtn.contains(event.target)) {
        navMenu.classList.remove('mobile-open');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('mobile-open')) {
        navMenu.classList.remove('mobile-open');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- 3. NAVBAR SCROLL EFFECT & ACTIVE SECTION TRACKING ---
  const headerNav = document.querySelector('.header-nav');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Add shadow border to navbar when scrolled
    if (headerNav) {
      if (window.scrollY > 20) {
        headerNav.classList.add('scrolled');
      } else {
        headerNav.classList.remove('scrolled');
      }
    }

    // Active link highlighting
    highlightActiveSection();
  }, { passive: true });

  function highlightActiveSection() {
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');
      const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (correspondingLink) {
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          correspondingLink.classList.add('active');
        } else {
          correspondingLink.classList.remove('active');
        }
      }
    });
  }

  // --- 4. VIEWPORT INTERSECTION FADE-IN ANIMATIONS ---
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fadeElements = document.querySelectorAll('.fade-in-section');

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    });

    fadeElements.forEach((el) => fadeObserver.observe(el));
  } else {
    // If reduced motion or observer unsupported, make all visible immediately
    fadeElements.forEach((el) => el.classList.add('is-visible'));
  }

  // --- 5. SCHEMA DETAILS TOGGLE (PROJECT 1) ---
  const toggleSchemaBtn = document.getElementById('toggle-schema-details');
  const schemaAccordion = document.getElementById('schema-details-accordion');

  if (toggleSchemaBtn && schemaAccordion) {
    toggleSchemaBtn.addEventListener('click', () => {
      const isHidden = schemaAccordion.hasAttribute('hidden');
      if (isHidden) {
        schemaAccordion.removeAttribute('hidden');
        toggleSchemaBtn.setAttribute('aria-expanded', 'true');
        toggleSchemaBtn.textContent = 'Hide Schema Details';
      } else {
        schemaAccordion.setAttribute('hidden', '');
        toggleSchemaBtn.setAttribute('aria-expanded', 'false');
        toggleSchemaBtn.textContent = 'View Schema Details';
      }
    });
  }

  // --- 6. CONTACT FORM DEMONSTRATION & CLIENT VALIDATION ---
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const subjectInput = document.getElementById('form-subject');
      const messageInput = document.getElementById('form-message');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      // Simple Client Validation
      if (!name || !email || !subject || !message) {
        formFeedback.className = 'form-feedback active info';
        formFeedback.innerHTML = `<strong>Please complete all fields.</strong> All inputs are required before proceeding.`;
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        formFeedback.className = 'form-feedback active info';
        formFeedback.innerHTML = `<strong>Invalid email address.</strong> Please provide a valid email format.`;
        return;
      }

      // Construct mailto link
      const encodedSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject}`);
      const encodedBody = encodeURIComponent(`Hello Hamed,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      const mailtoUrl = `mailto:hamed.hgazy124@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;

      // Show honest notice (no backend configured, frontend demonstration)
      formFeedback.className = 'form-feedback active info';
      formFeedback.innerHTML = `
        <p><strong>Thank you, ${escapeHtml(name)}!</strong></p>
        <p style="margin-top: 0.4rem; font-size: 0.85rem;">
          <em>Notice:</em> This contact form is a <strong>frontend demonstration</strong> and does not send messages to a backend server.
          To contact Hamed directly with your entered details, please use the direct email link below:
        </p>
        <a href="${mailtoUrl}" class="btn btn-primary btn-sm form-fallback-btn">
          Send via Email Client (mailto)
        </a>
      `;
    });
  }

  // Helper to prevent XSS in feedback rendering
  function escapeHtml(string) {
    const div = document.createElement('div');
    div.textContent = string;
    return div.innerHTML;
  }

  // --- 7. BACK TO TOP SMOOTH SCROLL ---
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

})();
