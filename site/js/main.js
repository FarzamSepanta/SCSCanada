const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');
const sections = document.querySelectorAll('main section');
const navAnchors = document.querySelectorAll('.nav__links a');
const yearEl = document.getElementById('year');
const ribbonTrack = document.querySelector('.story-ribbon__track');
const ribbonPrev = document.querySelector('.story-ribbon__control--prev');
const ribbonNext = document.querySelector('.story-ribbon__control--next');

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Sticky nav background
window.addEventListener('scroll', () => {
  if (!nav) return;
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// Section observer for nav highlighting
if (sections.length && navAnchors.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('id');
        const navLink = document.querySelector(`.nav__links a[href="#${id}"]`);
        if (!navLink) return;
        if (entry.isIntersecting) {
          navAnchors.forEach((anchor) => anchor.classList.remove('active'));
          navLink.classList.add('active');
        }
      });
    },
    { threshold: 0.55 }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

// Mobile nav toggle
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Story ribbon controls
const scrollRibbon = (direction) => {
  if (!ribbonTrack) return;
  const card = ribbonTrack.querySelector('.story-card');
  const cardWidth = card ? card.getBoundingClientRect().width : 240;
  const gap = parseFloat(getComputedStyle(ribbonTrack).gap || '16');
  const distance = cardWidth + gap;
  ribbonTrack.scrollBy({ left: direction * distance, behavior: 'smooth' });
};

ribbonPrev?.addEventListener('click', () => scrollRibbon(-1));
ribbonNext?.addEventListener('click', () => scrollRibbon(1));

// Back to top smooth scroll fallback
const backToTop = document.querySelector('.back-to-top');
backToTop?.addEventListener('click', (event) => {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Hero globe animation
const canvas = document.getElementById('globeCanvas');
if (canvas) {
  const context = canvas.getContext('2d');
  const renderGlobe = () => {
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    context.scale(devicePixelRatio, devicePixelRatio);
    context.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 6;

    const gradient = context.createRadialGradient(centerX, centerY, radius * 0.2, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(88, 176, 255, 0.9)');
    gradient.addColorStop(1, 'rgba(8, 34, 54, 0.95)');

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.fill();

    const lineCount = 12;
    context.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    context.lineWidth = 1.2;

    for (let i = 0; i < lineCount; i++) {
      const angle = (Math.PI * 2 * i) / lineCount;
      context.beginPath();
      context.arc(centerX, centerY, radius * Math.abs(Math.cos(angle)), 0, Math.PI * 2);
      context.stroke();
    }

    const waveCount = 120;
    const time = Date.now() / 1200;
    context.strokeStyle = 'rgba(45, 216, 168, 0.65)';
    context.lineWidth = 1.6;

    context.beginPath();
    for (let i = 0; i <= waveCount; i++) {
      const ratio = i / waveCount;
      const theta = ratio * Math.PI * 2;
      const latitude = Math.sin(theta + time) * 0.4;
      const x = centerX + Math.cos(theta) * radius * Math.cos(latitude);
      const y = centerY + Math.sin(theta) * radius * Math.cos(latitude);
      if (i === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }
    context.closePath();
    context.stroke();

    requestAnimationFrame(renderGlobe);
  };

  const resizeObserver = new ResizeObserver(renderGlobe);
  resizeObserver.observe(canvas);
  renderGlobe();
}
