// ============================================================
//  main.js  —  Portfolio page logic
// ============================================================

function renderAll(data) {
  if (!data) data = loadData();

  renderHero(data.about, data);
  renderAbout(data.about);
  renderSkills(data.skills);
  renderProjects(data.projects);
  renderEducation(data.education);
  renderResume(data.resume);
  renderCertificates(data.certificates);
  renderAchievements(data.achievements);
  renderContact(data.contact);

  initSkillAnimations();
  initCertLightbox();
  initTiltEffect();
}

document.addEventListener('DOMContentLoaded', () => {
  const data = loadData();
  renderAll(data);

  initNav();
  initThemeToggle();
  initScrollReveal();
  initTyping(data.about);
  initContactForm(data.contact);

  // Live storage update listeners (Cross-tab & same-tab)
  window.addEventListener('storage', (e) => {
    if (e.key === 'portfolioData') {
      renderAll(loadData());
    }
  });

  window.addEventListener('portfolioDataUpdated', (e) => {
    if (e.detail) {
      renderAll(e.detail);
    }
  });

  // Automatically fetch fresh cloud data for all visitors
  if (typeof syncRemoteData === 'function') {
    syncRemoteData().catch(err => console.warn('Cloud sync error:', err));
  }
});

// ── Wait for THREE to load then start bg ──────────────────────
window.addEventListener('load', () => {
  if (typeof THREE !== 'undefined') {
    const script = document.createElement('script');
    script.src = 'js/three-bg.js';
    document.body.appendChild(script);
  }
});

/* ============================================================
   RENDER FUNCTIONS
   ============================================================ */

// ── Hero ─────────────────────────────────────────────────────
function renderHero(about, data) {
  const el = (id) => document.getElementById(id);
  if (!about) return;

  const imgEl = el('hero-avatar');
  if (imgEl) {
    if (about.profileImage && !about.profileImage.includes('placeholder')) {
      imgEl.src = about.profileImage;
    } else {
      imgEl.src = 'https://i.ibb.co/LkTSVBq/default-profile.png';
    }
    imgEl.alt = about.name || 'Poovarasan VJ';
    imgEl.onerror = function() {
      this.src = 'https://i.ibb.co/LkTSVBq/default-profile.png';
    };
  }

  const nameEl = el('hero-name');
  if (nameEl) nameEl.textContent = about.name || 'Poovarasan VJ';

  const descEl = el('hero-desc');
  if (descEl) descEl.textContent = about.bio || '';

  const badgeEl = el('hero-badge');
  if (badgeEl) {
    const status  = about.educationStatus || '3rd Year Student';
    const college = about.college || 'Sree Sakthi Engineering College';
    badgeEl.textContent = `🎓 ${status} · ${college}`;
  }

  if (data) {
    safeSet('hero-stat-projects', (data.projects || []).length);
    safeSet('hero-stat-skills',   (data.skills || []).length);
    safeSet('hero-stat-certs',    (data.certificates || []).length);
  }
}

// ── About ─────────────────────────────────────────────────────
function renderAbout(about) {
  if (!about) return;

  const imgEl = document.getElementById('about-img');
  if (imgEl) {
    if (about.profileImage && !about.profileImage.includes('placeholder')) {
      imgEl.src = about.profileImage;
    } else {
      imgEl.src = 'https://i.ibb.co/LkTSVBq/default-profile.png';
    }
    imgEl.onerror = function() {
      this.src = 'https://i.ibb.co/LkTSVBq/default-profile.png';
    };
  }

  safeSet('about-name',         about.name || 'Poovarasan VJ');
  safeSet('about-title-text',   about.title || 'AI & ML Developer | Python & Web Developer');
  safeSet('about-bio',          about.bio || '');
  safeSet('about-status',       about.educationStatus || '3rd Year Student');
  safeSet('about-college',      about.college || 'Sree Sakthi Engineering College');
  safeSet('about-dept',         about.department || 'Artificial Intelligence & Machine Learning (AI & ML)');
  safeSet('about-location',     about.location || 'Tamil Nadu, India');
  safeSet('about-email',        about.email || 'poovarasanvj860@gmail.com');
  safeSet('about-availability', about.availability || 'Open to Internships & Collaborations');
  safeSet('about-career-goal',  about.careerGoal || 'Build practical AI/ML and web-development projects and develop skills for internships and future software/AI roles.');
  safeSet('about-interests',    about.areasOfInterest || 'AI & Machine Learning, Web Development, UI/UX Design, Data Analysis');
}

// ── Skills ────────────────────────────────────────────────────
function renderSkills(skills) {
  const container = document.getElementById('skills-grid');
  if (!container || !skills) return;

  const categories = ['All', ...new Set(skills.map(s => s.category))];
  const filterBar  = document.getElementById('skills-filter');
  if (filterBar) {
    filterBar.innerHTML = categories.map((c, i) =>
      `<button class="filter-btn ${i===0?'active':''}" data-cat="${c}">${c}</button>`
    ).join('');
    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      container.querySelectorAll('.skill-card').forEach(card => {
        const show = cat === 'All' || card.dataset.cat === cat;
        card.style.display = show ? '' : 'none';
      });
    });
  }

  container.innerHTML = skills.map(skill => `
    <div class="glass-card skill-card reveal" data-cat="${skill.category}">
      <div class="skill-card-top">
        <div class="skill-icon"><i class="${skill.icon || 'fas fa-code'}"></i></div>
        <div>
          <div class="skill-name">${skill.name}</div>
          <div class="skill-category-badge">${skill.category}</div>
        </div>
      </div>
      <div class="skill-level-bar">
        <div class="skill-level-fill" style="--target:${skill.level/100}" data-level="${skill.level}"></div>
      </div>
      <div class="skill-pct">${skill.level}%</div>
    </div>
  `).join('');
}

// ── Projects ──────────────────────────────────────────────────
function renderProjects(projects) {
  const container = document.getElementById('projects-grid');
  if (!container || !projects) return;

  // gradient placeholders per project index
  const gradients = [
    'linear-gradient(135deg,#7c3aed,#06b6d4)',
    'linear-gradient(135deg,#a855f7,#3b82f6)',
    'linear-gradient(135deg,#06b6d4,#10b981)',
    'linear-gradient(135deg,#3b82f6,#7c3aed)',
    'linear-gradient(135deg,#10b981,#06b6d4)',
    'linear-gradient(135deg,#f59e0b,#ef4444)',
    'linear-gradient(135deg,#8b5cf6,#ec4899)',
  ];

  const icons = ['🩸','🌐','🔍','📜','🎮','📊','🏠'];

  container.innerHTML = projects.map((proj, idx) => {
    const imgContent = proj.image && !proj.image.includes('placeholder')
      ? `<div class="project-img-wrapper">
           <img class="project-img" src="${proj.image}" alt="${proj.title}" onerror="this.parentNode.innerHTML='<div class=project-img-placeholder style=background:${gradients[idx%gradients.length]}>${icons[idx%icons.length]}</div>'">
         </div>`
      : `<div class="project-img-placeholder" style="background:${gradients[idx%gradients.length]}">${icons[idx%icons.length]}</div>`;

    return `
      <div class="glass-card project-card reveal" style="transition-delay:${idx*0.08}s">
        ${proj.featured ? '<span class="project-featured-badge">⭐ Featured</span>' : ''}
        ${imgContent}
        <div class="project-body">
          <div class="project-title">${proj.title}</div>
          <p class="project-desc">${proj.description}</p>
          <div class="project-tags">${(proj.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('')}</div>
          <div class="project-links">
            ${proj.link && proj.link !== '#' ? `<a href="${proj.link}" target="_blank" class="project-link-btn demo"><i class="fas fa-external-link-alt"></i> Demo</a>` : ''}
            ${proj.github && proj.github !== '#' ? `<a href="${proj.github}" target="_blank" class="project-link-btn code"><i class="fab fa-github"></i> Code</a>` : ''}
            ${(!proj.link || proj.link==='#') && (!proj.github || proj.github==='#') ? '<span style="color:var(--text-muted);font-size:0.8rem">In Development</span>' : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ── Education ─────────────────────────────────────────────────
function renderEducation(education) {
  const container = document.getElementById('education-timeline');
  if (!container || !education) return;

  container.innerHTML = education.map((edu, idx) => `
    <div class="glass-card edu-item reveal" style="transition-delay:${idx*0.15}s">
      <div class="edu-degree">${edu.degree}</div>
      <div class="edu-institution">${edu.institution}</div>
      <div class="edu-meta">
        <span class="edu-meta-item"><i class="fas fa-calendar-alt"></i>${edu.duration}</span>
        <span class="edu-meta-item"><i class="fas fa-graduation-cap"></i>${edu.grade}</span>
      </div>
      <span class="edu-status">${edu.status}</span>
      <p class="edu-desc">${edu.description}</p>
    </div>
  `).join('');
}

// ── Resume ────────────────────────────────────────────────────
function renderResume(resume) {
  const link = document.getElementById('resume-link');
  if (link && resume) {
    link.href = resume.url || '#';
    const label = resume.label || 'Download Resume (PDF)';
    link.innerHTML = `<i class="fas fa-file-pdf"></i> ${escapeHtml(label)}`;
    if (resume.url && resume.url !== '#') {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      if (resume.url.startsWith('http')) {
        link.removeAttribute('download');
      } else {
        link.setAttribute('download', label);
      }
    } else {
      link.removeAttribute('target');
      link.removeAttribute('rel');
    }
  }
}

// ── Certificates ──────────────────────────────────────────────
function renderCertificates(certs) {
  const container = document.getElementById('certs-grid');
  if (!container || !certs) return;

  container.innerHTML = certs.map((cert, idx) => {
    const imgContent = cert.image && !cert.image.includes('placeholder')
      ? `<div class="cert-img-wrap"><img src="${cert.image}" alt="${cert.title}" onerror="this.parentNode.innerHTML='<div class=cert-img-placeholder>🏆</div>'"></div>`
      : `<div class="cert-img-placeholder">🏆</div>`;

    return `
      <div class="glass-card cert-card reveal" style="transition-delay:${idx*0.1}s"
           data-lightbox="${cert.image && !cert.image.includes('placeholder') ? cert.image : ''}">
        ${imgContent}
        <div class="cert-body">
          <div class="cert-title">${cert.title}</div>
          <div class="cert-issuer"><i class="fas fa-award"></i> ${cert.issuer}</div>
          <div class="cert-date"><i class="fas fa-calendar"></i> ${cert.date}</div>
        </div>
      </div>
    `;
  }).join('');
}

// ── Achievements ──────────────────────────────────────────────
function renderAchievements(achievements) {
  const container = document.getElementById('achievements-grid');
  if (!container || !achievements) return;

  container.innerHTML = achievements.map((ach, idx) => `
    <div class="glass-card achievement-card reveal" style="transition-delay:${idx*0.1}s">
      <div class="achievement-icon"><i class="${ach.icon || 'fas fa-star'}"></i></div>
      <div class="achievement-body">
        <div class="achievement-title">${ach.title}</div>
        <div class="achievement-year">${ach.year}</div>
        <p class="achievement-desc">${ach.description}</p>
      </div>
    </div>
  `).join('');
}

// ── Contact ───────────────────────────────────────────────────
function renderContact(contact) {
  if (!contact) return;

  safeSet('contact-email-text', contact.email);
  safeSet('contact-phone-text', contact.phone);

  const emailA = document.getElementById('contact-email-link');
  if (emailA && contact.email) emailA.href = `mailto:${contact.email}`;

  const phoneLink = document.getElementById('contact-phone-link');
  if (phoneLink && contact.phone) {
    phoneLink.href = `tel:${contact.phone.replace(/[^0-9+]/g, '')}`;
  }

  const linkedin  = document.getElementById('social-linkedin');
  const linkedin2 = document.getElementById('social-linkedin2');
  const github    = document.getElementById('social-github');
  const github2   = document.getElementById('social-github2');
  const phoneBtn  = document.getElementById('social-phone');

  if (linkedin)  linkedin.href  = contact.linkedin  || '#';
  if (linkedin2) linkedin2.href = contact.linkedin  || '#';
  if (github)    github.href    = contact.github    || '#';
  if (github2)   github2.href   = contact.github    || '#';
  if (phoneBtn && contact.phone) {
    phoneBtn.href = `tel:${contact.phone.replace(/[^0-9+]/g, '')}`;
  }
}

/* ============================================================
   UTILITY HELPERS
   ============================================================ */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function safeSet(id, val, attr='textContent') {
  const el = document.getElementById(id);
  if (!el || val === undefined || val === null) return;
  if (attr === 'textContent') el.textContent = val;
  else el.setAttribute(attr, val);
}

/* ============================================================
   NAV
   ============================================================ */
function initNav() {
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks  = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.addEventListener('click', () => navLinks.classList.remove('open'));
  }

  // Highlight active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

/* ============================================================
   THEME TOGGLE (sun / moon)
   ============================================================ */
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  });
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Re-observe after dynamic renders
  const mutObs = new MutationObserver(() => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
  });
  mutObs.observe(document.body, { childList: true, subtree: true });
}

/* ============================================================
   SKILL BAR ANIMATIONS
   ============================================================ */
function initSkillAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.skill-level-fill');
        if (fill) {
          const level = parseInt(fill.dataset.level || 80);
          fill.style.width = level + '%';
          fill.classList.add('animated');
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const reObserve = () => {
    document.querySelectorAll('.skill-card').forEach(card => observer.observe(card));
  };
  reObserve();

  // Watch for new cards
  const mutObs = new MutationObserver(reObserve);
  const grid = document.getElementById('skills-grid');
  if (grid) mutObs.observe(grid, { childList: true });
}

/* ============================================================
   TYPING ANIMATION
   ============================================================ */
function initTyping(about) {
  const el = document.getElementById('hero-typing');
  if (!el) return;

  const titles = [
    'AI & ML Developer',
    'Python Developer',
    'Web Developer',
    'UI/UX Enthusiast',
    'Data Analysis Learner',
  ];

  let ti = 0, ci = 0, deleting = false;

  function type() {
    const current = titles[ti];
    if (deleting) {
      el.textContent = current.substring(0, ci--);
      if (ci < 0) { deleting = false; ti = (ti + 1) % titles.length; ci = 0; setTimeout(type, 400); return; }
    } else {
      el.textContent = current.substring(0, ci++);
      if (ci > current.length) { deleting = true; setTimeout(type, 1600); return; }
    }
    setTimeout(type, deleting ? 60 : 90);
  }
  type();
}

/* ============================================================
   CERT LIGHTBOX
   ============================================================ */
function initCertLightbox() {
  const lb    = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbClose = document.getElementById('lightbox-close');
  if (!lb || !lbImg) return;

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.cert-card');
    if (card && card.dataset.lightbox) {
      lbImg.src = card.dataset.lightbox;
      lb.classList.add('open');
    }
  });

  lbClose?.addEventListener('click', () => lb.classList.remove('open'));
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.classList.remove('open'); });
}

/* ============================================================
   CONTACT FORM (mailto fallback)
   ============================================================ */
function initContactForm(contact) {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = form.querySelector('#cf-name')?.value.trim()    || '';
    const email   = form.querySelector('#cf-email')?.value.trim()   || '';
    const subject = form.querySelector('#cf-subject')?.value.trim() || 'Portfolio Contact';
    const message = form.querySelector('#cf-message')?.value.trim() || '';

    if (!name || !email || !message) {
      showToast('Please fill all required fields.', 'error');
      return;
    }

    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const mailto = `mailto:${contact?.email || 'poovarasanvj860@gmail.com'}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailto, '_blank');
    showToast('Opening your email client! 📧', 'success');
    form.reset();
  });
}

/* ============================================================
   TILT EFFECT
   ============================================================ */
function initTiltEffect() {
  const cards = document.querySelectorAll('.glass-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateX(${-y*8}deg) rotateY(${x*8}deg) translateY(-6px) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ============================================================
   PROJECTS FILTER
   ============================================================ */
function initProjectsFilter() {
  // Done inside renderSkills for skills, projects have no filter by default
  // but we could add one here in future
}

/* ============================================================
   COUNTER ANIMATION (hero stats)
   ============================================================ */
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

// Trigger counters when hero is visible
const heroObs = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    document.querySelectorAll('.hero-stat .num').forEach(el => {
      const t = parseInt(el.dataset.target || el.textContent);
      animateCounter(el, t);
    });
    heroObs.disconnect();
  }
}, { threshold: 0.5 });

window.addEventListener('DOMContentLoaded', () => {
  const hero = document.getElementById('hero');
  if (hero) heroObs.observe(hero);
});

/* ============================================================
   TOAST
   ============================================================ */
function showToast(msg, type='success') {
  let toast = document.getElementById('main-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'main-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${type==='success'?'fa-check-circle':'fa-exclamation-circle'}"></i>${msg}`;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3500);
}
