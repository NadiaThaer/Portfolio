/* ============================================================
   NADIA SHAIKH — PORTFOLIO JS
   ============================================================ */

/* ── CANVAS PARTICLE BG ── */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let W, H;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initParticles(); });

function randRange(a, b) { return a + Math.random() * (b - a); }

function initParticles() {
  particles = [];
  const count = Math.min(Math.floor((W * H) / 14000), 110);
  for (let i = 0; i < count; i++) {
    particles.push({
      x: randRange(0, W), y: randRange(0, H),
      vx: randRange(-0.22, 0.22), vy: randRange(-0.22, 0.22),
      r: randRange(1, 2.5),
      alpha: randRange(0.3, 0.8),
    });
  }
}
initParticles();

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  const isLight = document.body.classList.contains('light-mode');
  const dotColor = isLight ? '14,165,233' : '56,189,248';
  const lineColor = isLight ? '14,165,233' : '56,189,248';

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${dotColor},${p.alpha})`;
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x, dy = p.y - q.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(${lineColor},${0.15 * (1 - dist / 130)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ── NAVBAR SCROLL ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveLink();
});

/* ── HAMBURGER MENU ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── ACTIVE NAV LINK ── */
const sections = document.querySelectorAll('section[id]');
function updateActiveLink() {
  const scroll = window.scrollY + 100;
  sections.forEach(s => {
    const top  = s.offsetTop;
    const bot  = top + s.offsetHeight;
    const link = document.querySelector(`.nav-link[href="#${s.id}"]`);
    if (link) link.classList.toggle('active', scroll >= top && scroll < bot);
  });
}

/* ── THEME TOGGLE ── */
const themeBtn = document.getElementById('themeToggle');
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  themeBtn.innerHTML = document.body.classList.contains('light-mode')
    ? '<i class="fas fa-moon"></i>'
    : '<i class="fas fa-sun"></i>';
  localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
});
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light-mode');
  themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
}

/* ── TYPED TEXT ── */
const roles = [
  'Computer Engineer',
  'Hardware Designer',
  'Systems Programmer',
  'Verilog Developer',
  'Problem Solver',
];
let roleIndex = 0, charIndex = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function typeEffect() {
  const current = roles[roleIndex];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeEffect, 1800);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeEffect, deleting ? 60 : 90);
}
setTimeout(typeEffect, 1400);

/* ── REVEAL ON SCROLL ── */
const reveals = document.querySelectorAll(
  '.about-card, .about-stats .stat, .skill-category, ' +
  '.project-card, .timeline-item, .contact-item, .contact-form'
);
reveals.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.transitionDelay = `${(i % 4) * 0.08}s`;
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);
reveals.forEach(el => revealObserver.observe(el));

/* ── SKILL BARS ANIMATION ── */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-category').forEach(el => barObserver.observe(el));

/* ── COUNTER ANIMATION ── */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(el => {
        const target = parseFloat(el.dataset.target);
        const isDecimal = el.dataset.target.includes('.');
        const duration = 1600;
        const step = 16;
        const increments = duration / step;
        let current = 0;
        const inc = target / increments;
        const timer = setInterval(() => {
          current += inc;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
        }, step);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
const statsSection = document.querySelector('.about-stats');
if (statsSection) counterObserver.observe(statsSection);

/* ── PROJECT FILTER ── */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.style.display = match ? '' : 'none';
      if (match) {
        card.style.animation = 'fadeUp 0.4s ease forwards';
      }
    });
  });
});

/* ── CONTACT FORM ── */
const contactForm = document.getElementById('contactForm');
const formMsg     = document.getElementById('formMsg');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;

  setTimeout(() => {
    formMsg.textContent  = '✓ Message sent! I\'ll get back to you soon.';
    formMsg.className    = 'form-feedback success';
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    btn.disabled  = false;
    contactForm.reset();
    setTimeout(() => { formMsg.textContent = ''; formMsg.className = 'form-feedback'; }, 4000);
  }, 1400);
});

/* ── SMOOTH LOGO SCROLL ── */
document.querySelector('.nav-logo').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
