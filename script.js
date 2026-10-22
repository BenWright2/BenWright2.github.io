
const menu = document.querySelector('.menu');
const links = document.querySelector('.links');

menu.addEventListener('click', () => {
  links.classList.toggle('open');
});

document.querySelectorAll('.links a').forEach(a => {
  a.addEventListener('click', () => links.classList.remove('open'));
});

document.getElementById('year').textContent = new Date().getFullYear();

// Parallax effect — explicitly excludes the entire About section.
const layers = [...document.querySelectorAll('.parallax')]
  .filter(el => !el.closest('.about-block'));

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let ticking = false;

function updateParallax() {
  if (reduce) return;

  const vh = window.innerHeight;

  for (const el of layers) {
    const r = el.getBoundingClientRect();

    if (r.bottom < -100 || r.top > vh + 100) continue;

    const speed = Number(el.dataset.speed || .12);
    const center = (r.top + r.height / 2 - vh / 2);

    let shift = -center * speed;

    // Keep the parallax-lock behavior for the statement section.
    if (el.classList.contains('parallax-lock')) {
      shift = Math.min(shift, 0);
    }

    el.style.transform = `translate3d(0,${shift.toFixed(1)}px,0)`;
  }

  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
}, { passive: true });

window.addEventListener('resize', updateParallax);
updateParallax();

// Seamless auto-scrolling photo strips.
const marqueeTracks = [...document.querySelectorAll('.marquee-track')];

const marqueeSpeedFactor = reduce ? 0.6 : 1;

function buildMarquee() {
  for (const track of marqueeTracks) {
    const original = track.querySelector('.marquee-set:not(.clone)');

    if (!original) continue;

    track.querySelectorAll('.marquee-set.clone').forEach(c => c.remove());

    const w = original.offsetWidth;

    if (!w) continue;

    const speed = Number(track.dataset.speed || 40) * marqueeSpeedFactor;
    const copies = Math.ceil(window.innerWidth / w) + 1;

    for (let i = 0; i < copies; i++) {
      const c = original.cloneNode(true);

      c.classList.add('clone');
      c.setAttribute('aria-hidden', 'true');

      c.querySelectorAll('img').forEach(img => img.alt = '');

      track.appendChild(c);
    }

    track.style.setProperty('--shift', (-w) + 'px');
    track.style.setProperty('--dur', (w / speed).toFixed(1) + 's');
  }
}

buildMarquee();

// Rebuild after images and fonts load.
window.addEventListener('load', buildMarquee);

// Only rebuild when the screen width changes.
let lastW = window.innerWidth;
let marqueeTimer;

window.addEventListener('resize', () => {
  if (window.innerWidth === lastW) return;

  lastW = window.innerWidth;

  clearTimeout(marqueeTimer);
  marqueeTimer = setTimeout(buildMarquee, 200);
});
