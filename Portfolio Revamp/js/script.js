const loader = document.getElementById('site-loader');
const lightbox = document.getElementById('project-lightbox');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPanels = document.querySelectorAll('.project-panel');
const workTriggers = document.querySelectorAll('.work-trigger');
const changingText = document.getElementById('changing-text');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('#nav-menu a');
const workFilters = document.querySelectorAll('.work-filter');
const workTiles = document.querySelectorAll('.work-tile');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let lastTrigger = null;
let typefaceIndex = 0;

const heroTypefaceStyles = [
  {
    fontFamily: "'Luke 400', 'Playfair Display', serif",
    letterSpacing: '0.01em',
    textTransform: 'none'
  },
  {
    fontFamily: "'Clash Display', 'Montserrat', sans-serif",
    letterSpacing: '-0.03em',
    textTransform: 'none'
  },
  {
    fontFamily: "'Horizon', 'Oswald', sans-serif",
    letterSpacing: '0.08em',
    textTransform: 'uppercase'
  },
  {
    fontFamily: "'Playfair Display', serif",
    letterSpacing: '0.01em',
    textTransform: 'none'
  },
  {
    fontFamily: "'Oswald', sans-serif",
    letterSpacing: '0.04em',
    textTransform: 'uppercase'
  }
];

const hideLoader = () => {
  if (!loader) return;

  loader.classList.add('is-hidden');
  document.body.classList.remove('is-loading');

  window.setTimeout(() => {
    loader.setAttribute('hidden', '');
  }, 750);
};

window.addEventListener('load', () => {
  window.setTimeout(hideLoader, 500);
});

window.setTimeout(hideLoader, 2200);

const closeLightbox = () => {
  if (!lightbox) return;

  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('is-loading');

  lightboxPanels.forEach((panel) => {
    panel.classList.remove('is-active');
  });

  if (lastTrigger) {
    lastTrigger.focus();
  }
};

const openLightbox = (projectId, trigger) => {
  if (!lightbox) return;

  const activePanel = document.getElementById(projectId);
  if (!activePanel) return;

  lastTrigger = trigger;

  lightboxPanels.forEach((panel) => {
    panel.classList.toggle('is-active', panel === activePanel);
  });

  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('is-loading');
  lightbox.querySelector('.lightbox-dialog').scrollTop = 0;
  lightboxClose.focus();
};

workTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    openLightbox(trigger.dataset.project, trigger);
  });
});

if (lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && lightbox && lightbox.classList.contains('is-open')) {
    closeLightbox();
  }
});

const applyHeroTypeface = (style) => {
  if (!changingText) return;

  changingText.style.fontFamily = style.fontFamily;
  changingText.style.letterSpacing = style.letterSpacing;
  changingText.style.textTransform = style.textTransform;
};

const rotateHeroTypeface = () => {
  if (!changingText) return;

  changingText.classList.add('is-switching');

  window.setTimeout(() => {
    typefaceIndex = (typefaceIndex + 1) % heroTypefaceStyles.length;
    applyHeroTypeface(heroTypefaceStyles[typefaceIndex]);
    changingText.classList.remove('is-switching');
  }, 180);
};

if (changingText) {
  applyHeroTypeface(heroTypefaceStyles[typefaceIndex]);
  window.setInterval(rotateHeroTypeface, 3000);
}

const closeNavMenu = () => {
  if (!navToggle || !navMenu) return;

  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open navigation menu');
  navMenu.classList.remove('is-open');
};

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
    navMenu.classList.toggle('is-open', !isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 640) {
        closeNavMenu();
      }
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 640) {
      closeNavMenu();
    }
  });
}

if (workFilters.length && workTiles.length) {
  const applyWorkFilter = (filterValue) => {
    workFilters.forEach((button) => {
      const isActive = button.dataset.filter === filterValue;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    workTiles.forEach((tile) => {
      const tileCategory = tile.dataset.category;
      const shouldShow = filterValue === 'all' || tileCategory === filterValue;
      tile.classList.toggle('is-hidden', !shouldShow);
    });
  };

  workFilters.forEach((button) => {
    button.addEventListener('click', () => {
      applyWorkFilter(button.dataset.filter);
    });
  });
}

if (!prefersReducedMotion.matches) {
  let currentScroll = window.scrollY;
  let targetScroll = window.scrollY;
  let isTicking = false;

  const clampScrollTarget = () => {
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
  };

  const smoothStep = () => {
    currentScroll += (targetScroll - currentScroll) * 0.09;

    if (Math.abs(targetScroll - currentScroll) < 0.5) {
      currentScroll = targetScroll;
      window.scrollTo(0, currentScroll);
      isTicking = false;
      return;
    }

    window.scrollTo(0, currentScroll);
    window.requestAnimationFrame(smoothStep);
  };

  window.addEventListener(
    'wheel',
    (event) => {
      if (lightbox && lightbox.classList.contains('is-open')) return;

      event.preventDefault();
      targetScroll += event.deltaY * 1.1;
      clampScrollTarget();

      if (!isTicking) {
        currentScroll = window.scrollY;
        isTicking = true;
        window.requestAnimationFrame(smoothStep);
      }
    },
    { passive: false }
  );

  window.addEventListener('resize', clampScrollTarget);
}
