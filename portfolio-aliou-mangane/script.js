// === NAVIGATION : fond au scroll, menu mobile, lien actif ===
function initNav() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  const toTop = document.getElementById('toTop');

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
    toTop.classList.toggle('show', window.scrollY > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    toggle.innerHTML = open ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-list"></i>';
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<i class="bi bi-list"></i>';
  }));

  const navLinks = links.querySelectorAll('a[href^="#"]:not(.btn)');
  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));
}

// === TEXTE DÉFILANT DU RÔLE ===
function initTyped() {
  const el = document.getElementById('typed');
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const words = ['Full-Stack', 'Python / Django', 'React.js', 'passionné par l\'UX'];
  let w = 0, i = words[0].length, deleting = true;

  function tick() {
    const word = words[w];
    i += deleting ? -1 : 1;
    el.textContent = word.slice(0, i);
    let delay = deleting ? 45 : 90;
    if (!deleting && i === word.length) { deleting = true; delay = 1800; }
    else if (deleting && i === 0) { deleting = false; w = (w + 1) % words.length; delay = 300; }
    setTimeout(tick, delay);
  }
  setTimeout(tick, 2200);
}

// === APPARITION AU SCROLL ===
function initReveal() {
  const items = document.querySelectorAll('.section-head, .skill-card, .tl-item, .project, .edu-card, .cert, .about-grid > *, .lead-grid > *, .contact-card, .soft');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach((el, idx) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (idx % 3) * 80 + 'ms';
    io.observe(el);
  });
}

// === COMPTEURS ===
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.count;
      let n = 0;
      const step = () => {
        n++;
        el.textContent = n;
        if (n < target) setTimeout(step, 120);
      };
      step();
      io.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => io.observe(c));
}

// === FORMULAIRE DE CONTACT (ouvre la messagerie) ===
function initContactForm() {
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if (!data.nom || !data.email || !data.sujet || !data.message) {
      note.className = 'form-note error';
      note.textContent = 'Veuillez remplir tous les champs.';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      note.className = 'form-note error';
      note.textContent = 'Veuillez entrer une adresse email valide.';
      return;
    }
    const body = `${data.message}\n\n— ${data.nom} (${data.email})`;
    window.location.href = `mailto:alinemangane8@gmail.com?subject=${encodeURIComponent(data.sujet)}&body=${encodeURIComponent(body)}`;
    note.className = 'form-note ok';
    note.textContent = 'Votre messagerie va s\'ouvrir avec le message prêt à envoyer.';
    form.reset();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initTyped();
  initReveal();
  initCounters();
  initContactForm();
  document.getElementById('year').textContent = new Date().getFullYear();
});
