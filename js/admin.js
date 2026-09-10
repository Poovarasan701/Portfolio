// ============================================================
//  admin.js  —  Complete, Robust Admin Panel Logic
//  Auth:  poovarasanvj860@gmail.com / 0987654321_0987654321
// ============================================================

const ADMIN_EMAIL    = 'poovarasanvj860@gmail.com';
const ADMIN_PASSWORD = '0987654321_0987654321';
const SESSION_KEY    = 'pvj_admin_session';

// State
let DATA = {};
let _currentSaveCallback = null;
let _currentConfirmCallback = null;

// ── Bootstrapping ─────────────────────────────────────────────
function initAdmin() {
  // Check if session is already granted
  if (sessionStorage.getItem(SESSION_KEY) === 'granted') {
    showPanel();
  }

  // Setup Login form
  const loginForm = document.getElementById('login-form');
  loginForm?.addEventListener('submit', handleLogin);

  // Setup Logout
  document.getElementById('logout-btn')?.addEventListener('click', handleLogout);

  // Setup Modal Close / Cancel / Save buttons
  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.getElementById('modal-cancel')?.addEventListener('click', closeModal);
  document.getElementById('modal-save')?.addEventListener('click', handleModalSave);

  const modalBackdrop = document.getElementById('modal-backdrop');
  modalBackdrop?.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  // Setup Confirm Dialog buttons
  document.getElementById('confirm-yes')?.addEventListener('click', handleConfirmYes);
  document.getElementById('confirm-no')?.addEventListener('click', handleConfirmNo);

  const confirmBackdrop = document.getElementById('confirm-backdrop');
  confirmBackdrop?.addEventListener('click', (e) => {
    if (e.target === confirmBackdrop) handleConfirmNo();
  });

  // Setup Global Keyboard events
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      handleConfirmNo();
    }
  });

  // Setup Section Save Buttons
  document.getElementById('about-save-btn')?.addEventListener('click', saveAboutData);
  document.getElementById('about-save-btn-bottom')?.addEventListener('click', saveAboutData);
  document.getElementById('resume-save-btn')?.addEventListener('click', saveResumeData);
  document.getElementById('contact-save-btn')?.addEventListener('click', saveContactData);
  document.getElementById('reset-data-btn')?.addEventListener('click', handleResetData);
  document.getElementById('cloud-sync-btn')?.addEventListener('click', handleManualSync);

  // Setup Navigation listeners (Sidebar & Mobile Bar)
  initNavigation();
}

// ── Safe Execution on Page Ready ──────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdmin);
} else {
  initAdmin();
}

// ── Login Handler ─────────────────────────────────────────────
function handleLogin(e) {
  e.preventDefault();
  const emailInput    = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const errEl         = document.getElementById('login-error');

  const email    = (emailInput?.value || '').trim().toLowerCase();
  const password = (passwordInput?.value || '').trim();

  if (email === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, 'granted');
    if (errEl) errEl.classList.remove('show');
    showPanel();
    showToast('Login successful! Welcome Poovarasan.', 'success');
  } else {
    if (errEl) {
      errEl.innerHTML = '<i class="fas fa-circle-exclamation"></i> Invalid email or password. Access denied.';
      errEl.classList.add('show');
    }
    if (passwordInput) {
      passwordInput.value = '';
      passwordInput.focus();
    }
  }
}

// ── Logout Handler ────────────────────────────────────────────
function handleLogout() {
  sessionStorage.removeItem(SESSION_KEY);
  location.reload();
}

// ── Show Admin Panel ──────────────────────────────────────────
function showPanel() {
  const loginScreen = document.getElementById('login-screen');
  const adminPanel  = document.getElementById('admin-panel');

  if (loginScreen) loginScreen.style.display = 'none';
  if (adminPanel)  adminPanel.classList.add('show');

  loadAdminData();
  navToSection('dashboard');
}

// ── Cloud Sync Status Helper ──────────────────────────────────
function updateCloudBadge(status, text) {
  const badge  = document.getElementById('cloud-sync-badge');
  const textEl = document.getElementById('cloud-sync-text');
  if (!badge || !textEl) return;

  badge.className = 'cloud-pill ' + status;
  textEl.textContent = text;

  const icon = badge.querySelector('i');
  if (icon) {
    if (status === 'syncing') {
      icon.className = 'fas fa-arrows-rotate fa-spin';
    } else if (status === 'synced') {
      icon.className = 'fas fa-cloud-check';
    } else if (status === 'error') {
      icon.className = 'fas fa-cloud-slash';
    } else {
      icon.className = 'fas fa-cloud';
    }
  }
}
window.updateCloudBadge = updateCloudBadge;

// ── Data Loading & Persistence ────────────────────────────────
function loadAdminData() {
  DATA = loadData();
  renderAllAdminSections();
  updateDashboardCounts();

  // Background sync with jsonbin.io
  if (typeof syncRemoteData === 'function') {
    updateCloudBadge('syncing', 'Syncing...');
    syncRemoteData().then(updated => {
      if (updated) {
        DATA = updated;
        renderAllAdminSections();
        updateDashboardCounts();
        updateCloudBadge('synced', 'Cloud Synced');
      } else {
        updateCloudBadge('synced', 'Cloud Ready');
      }
    }).catch(err => {
      console.warn('Admin sync error:', err);
      updateCloudBadge('error', 'Cloud Offline');
    });
  }
}

async function persistData(msg = 'Changes saved successfully!') {
  saveData(DATA);
  updateDashboardCounts();
  updateCloudBadge('syncing', 'Saving to cloud...');
  showToast(msg, 'success');

  if (typeof saveRemoteData === 'function') {
    const cloudSaved = await saveRemoteData(DATA);
    if (cloudSaved) {
      updateCloudBadge('synced', 'Cloud Synced');
      showToast('☁️ Live synced — visible to all visitors!', 'success');
    } else {
      updateCloudBadge('error', 'Cloud Offline');
      showToast('⚠️ Saved locally, but cloud sync failed.', 'error');
    }
  }
}

async function handleManualSync() {
  updateCloudBadge('syncing', 'Syncing...');
  showToast('Connecting to cloud data store...', 'info');
  if (typeof syncRemoteData === 'function') {
    const updated = await syncRemoteData();
    if (updated) {
      DATA = updated;
      renderAllAdminSections();
      updateDashboardCounts();
      updateCloudBadge('synced', 'Cloud Synced');
      showToast('✅ Synced with shared cloud store!', 'success');
    } else {
      updateCloudBadge('error', 'Sync Failed');
      showToast('❌ Could not sync with cloud store.', 'error');
    }
  }
}
window.handleManualSync = handleManualSync;

function handleResetData() {
  openConfirm('⚠️ Are you sure you want to reset all portfolio data to default? This will clear customizations and sync defaults to all visitors.', async () => {
    DATA = resetData();
    renderAllAdminSections();
    updateDashboardCounts();
    updateCloudBadge('syncing', 'Resetting cloud...');
    const ok = await saveRemoteData(DATA);
    if (ok) {
      updateCloudBadge('synced', 'Cloud Synced');
      showToast('✅ All data reset to defaults and synced for all visitors!', 'success');
    } else {
      showToast('Data reset locally.', 'info');
    }
  });
}
window.handleResetData = handleResetData;

// ── Navigation Engine ─────────────────────────────────────────
function initNavigation() {
  // Desktop sidebar & mobile navigation links
  document.querySelectorAll('a[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sec = link.getAttribute('data-section');
      if (sec) navToSection(sec);
    });
  });

  // Interactive dashboard stat cards (Click to jump to that section!)
  document.querySelectorAll('.dash-stat[data-jump]').forEach(card => {
    card.addEventListener('click', () => {
      const jump = card.getAttribute('data-jump');
      if (jump) navToSection(jump);
    });
  });

  // Mobile menu toggle button
  document.getElementById('mobile-menu-toggle')?.addEventListener('click', () => {
    const mobileNav = document.getElementById('mobile-nav-bar');
    if (mobileNav) {
      mobileNav.style.display = mobileNav.style.display === 'flex' ? 'none' : 'flex';
    }
  });
}

function navToSection(sectionId) {
  // Update section visibility
  document.querySelectorAll('.admin-section').forEach(sec => {
    sec.classList.toggle('active', sec.id === `sec-${sectionId}`);
  });

  // Update active links in desktop sidebar
  document.querySelectorAll('.sidebar-nav a[data-section]').forEach(a => {
    a.classList.toggle('active', a.getAttribute('data-section') === sectionId);
  });

  // Update active links in mobile nav bar
  document.querySelectorAll('.mobile-nav-bar a[data-section]').forEach(a => {
    a.classList.toggle('active', a.getAttribute('data-section') === sectionId);
  });

  // Update topbar title
  const topbarTitle = document.getElementById('topbar-title');
  if (topbarTitle) {
    const names = {
      dashboard:    'Dashboard Overview',
      about:        'About Me Management',
      skills:       'Skills Management',
      projects:     'Projects Management',
      education:    'Education Management',
      resume:       'Resume Link Management',
      certs:        'Certificates Management',
      achievements: 'Achievements Management',
      contact:      'Contact & Social Links'
    };
    topbarTitle.textContent = names[sectionId] || (sectionId.charAt(0).toUpperCase() + sectionId.slice(1));
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.navToSection = navToSection;

// ── Dashboard Counts & Stats ──────────────────────────────────
function updateDashboardCounts() {
  const skillsCount    = (DATA.skills || []).length;
  const projectsCount  = (DATA.projects || []).length;
  const certsCount     = (DATA.certificates || []).length;
  const achieveCount   = (DATA.achievements || []).length;
  const educationCount = (DATA.education || []).length;

  safeSet('stat-skills',    skillsCount);
  safeSet('stat-projects',  projectsCount);
  safeSet('stat-certs',     certsCount);
  safeSet('stat-achieve',   achieveCount);
  safeSet('stat-education', educationCount);

  safeSet('count-skills',    skillsCount);
  safeSet('count-projects',  projectsCount);
  safeSet('count-certs',     certsCount);
  safeSet('count-achieve',   achieveCount);
  safeSet('count-education', educationCount);
}

// ── Render All Sections ───────────────────────────────────────
function renderAllAdminSections() {
  renderAboutAdmin();
  renderSkillsAdmin();
  renderProjectsAdmin();
  renderEducationAdmin();
  renderResumeAdmin();
  renderCertsAdmin();
  renderAchievementsAdmin();
  renderContactAdmin();
}

/* ============================================================
   1. ABOUT ME MANAGEMENT
   ============================================================ */
function renderAboutAdmin() {
  const a = DATA.about || {};
  setValue('a-name',            a.name);
  setValue('a-title',           a.title);
  setValue('a-college',         a.college);
  setValue('a-department',      a.department);
  setValue('a-educationStatus', a.educationStatus);
  setValue('a-availability',    a.availability);
  setValue('a-profileImage',    a.profileImage);
  setValue('a-bio',             a.bio);
  setValue('a-careerGoal',      a.careerGoal);
  setValue('a-areasOfInterest', a.areasOfInterest);
  setValue('a-aimlInterest',    a.aimlInterest);
  setValue('a-tools',           a.tools);
  setValue('a-location',        a.location);
  setValue('a-email',           a.email);

  // Live preview image
  const previewImg = document.getElementById('a-img-preview');
  if (previewImg) {
    if (a.profileImage && !a.profileImage.includes('placeholder')) {
      previewImg.src = a.profileImage;
      previewImg.style.display = 'inline-block';
    } else {
      previewImg.style.display = 'none';
    }
  }
}

function saveAboutData() {
  DATA.about = {
    ...DATA.about,
    name:            getValue('a-name').trim() || 'Poovarasan VJ',
    title:           getValue('a-title').trim(),
    college:         getValue('a-college').trim(),
    department:      getValue('a-department').trim(),
    educationStatus: getValue('a-educationStatus').trim(),
    availability:    getValue('a-availability').trim(),
    profileImage:    getValue('a-profileImage').trim(),
    bio:             getValue('a-bio').trim(),
    careerGoal:      getValue('a-careerGoal').trim(),
    areasOfInterest: getValue('a-areasOfInterest').trim(),
    aimlInterest:    getValue('a-aimlInterest').trim(),
    tools:           getValue('a-tools').trim(),
    location:        getValue('a-location').trim(),
    email:           getValue('a-email').trim()
  };
  persistData('About Me details updated!');
  renderAboutAdmin();
}

/* ============================================================
   2. SKILLS MANAGEMENT
   ============================================================ */
function renderSkillsAdmin() {
  const container = document.getElementById('admin-skills-list');
  if (!container) return;
  const skills = DATA.skills || [];

  if (skills.length === 0) {
    container.innerHTML = `
      <div class="admin-card" style="text-align:center;padding:2.5rem 1rem">
        <i class="fas fa-code" style="font-size:2.5rem;color:var(--text-muted);margin-bottom:0.8rem"></i>
        <p style="color:var(--text-muted);margin-bottom:1rem">No skills added yet.</p>
        <button class="btn btn-primary" onclick="window.openSkillModal()"><i class="fas fa-plus"></i> Add Your First Skill</button>
      </div>
    `;
    return;
  }

  container.innerHTML = skills.map((s, i) => `
    <div class="admin-card" style="padding:1.3rem 1.6rem">
      <div class="admin-item-header">
        <div>
          <h4><i class="${s.icon || 'fas fa-code'}" style="color:var(--purple-light);margin-right:8px"></i> ${escapeHtml(s.name)}</h4>
          <span style="font-size:0.82rem;color:var(--text-muted)">
            <span class="item-badge">${escapeHtml(s.category)}</span>
            Proficiency: <strong style="color:var(--cyan)">${s.level}%</strong>
          </span>
        </div>
        <div class="admin-item-actions">
          <button class="btn btn-sm btn-edit" onclick="window.openSkillModal(${i})"><i class="fas fa-pen"></i> Edit</button>
          <button class="btn btn-sm btn-delete" onclick="window.deleteSkill(${i})"><i class="fas fa-trash"></i> Delete</button>
        </div>
      </div>
      <div style="height:7px;background:rgba(255,255,255,0.08);border-radius:4px;overflow:hidden;margin-top:0.6rem">
        <div style="height:100%;width:${s.level}%;background:linear-gradient(135deg,#7c3aed,#06b6d4);border-radius:4px"></div>
      </div>
    </div>
  `).join('');
}

function openSkillModal(idx) {
  const isEdit = idx !== undefined;
  const skill = isEdit
    ? { ...DATA.skills[idx] }
    : { id: uid(), name: '', category: 'Programming Languages', level: 80, icon: 'fab fa-python' };

  const categories = [
    'Programming Languages',
    'AI / ML',
    'Web Development',
    'Database',
    'Tools',
    'Design',
    'Other'
  ];

  const catOptions = categories.map(c =>
    `<option value="${c}" ${skill.category === c ? 'selected' : ''}>${c}</option>`
  ).join('');

  const modalHtml = `
    <div class="admin-form">
      <div class="form-row">
        <div class="form-group">
          <label><i class="fas fa-code"></i> Skill Name *</label>
          <input id="m-skill-name" value="${escapeHtml(skill.name)}" placeholder="e.g. Python, OpenCV, SQL" required>
        </div>
        <div class="form-group">
          <label><i class="fas fa-layer-group"></i> Category *</label>
          <select id="m-skill-cat">${catOptions}</select>
        </div>
      </div>

      <div class="form-group">
        <label><i class="fas fa-star"></i> Proficiency Level (<span id="m-level-num">${skill.level}</span>%)</label>
        <div class="range-with-val">
          <input type="range" id="m-skill-level" min="10" max="100" value="${skill.level}"
            oninput="document.getElementById('m-level-num').textContent = this.value; document.getElementById('m-level-badge').textContent = this.value + '%';">
          <span class="range-val" id="m-level-badge">${skill.level}%</span>
        </div>
      </div>

      <div class="form-group">
        <label><i class="fas fa-icons"></i> Font Awesome Icon Class</label>
        <input id="m-skill-icon" value="${escapeHtml(skill.icon)}" placeholder="e.g. fab fa-python, fas fa-brain, fab fa-java">
        <div style="margin-top:0.4rem;display:flex;gap:0.4rem;flex-wrap:wrap">
          <span style="font-size:0.75rem;color:var(--text-muted);width:100%">Quick Select:</span>
          <button type="button" class="btn btn-sm btn-action" onclick="document.getElementById('m-skill-icon').value='fab fa-python'"><i class="fab fa-python"></i> Python</button>
          <button type="button" class="btn btn-sm btn-action" onclick="document.getElementById('m-skill-icon').value='fas fa-brain'"><i class="fas fa-brain"></i> AI/ML</button>
          <button type="button" class="btn btn-sm btn-action" onclick="document.getElementById('m-skill-icon').value='fas fa-camera'"><i class="fas fa-camera"></i> Vision</button>
          <button type="button" class="btn btn-sm btn-action" onclick="document.getElementById('m-skill-icon').value='fab fa-html5'"><i class="fab fa-html5"></i> HTML5</button>
          <button type="button" class="btn btn-sm btn-action" onclick="document.getElementById('m-skill-icon').value='fab fa-js-square'"><i class="fab fa-js-square"></i> JS</button>
          <button type="button" class="btn btn-sm btn-action" onclick="document.getElementById('m-skill-icon').value='fas fa-database'"><i class="fas fa-database"></i> SQL</button>
          <button type="button" class="btn btn-sm btn-action" onclick="document.getElementById('m-skill-icon').value='fab fa-github'"><i class="fab fa-github"></i> Git</button>
        </div>
      </div>
    </div>
  `;

  openModal(isEdit ? 'Edit Skill' : 'Add New Skill', modalHtml, () => {
    const name  = getValue('m-skill-name').trim();
    const cat   = getValue('m-skill-cat');
    const icon  = getValue('m-skill-icon').trim() || 'fas fa-code';
    const level = parseInt(document.getElementById('m-skill-level')?.value || '80', 10);

    if (!name) {
      showToast('Skill name is required', 'error');
      return false;
    }

    const newObj = {
      ...(isEdit ? DATA.skills[idx] : { id: uid() }),
      name,
      category: cat,
      icon,
      level
    };

    if (isEdit) {
      DATA.skills[idx] = newObj;
      persistData(`Skill "${name}" updated!`);
    } else {
      DATA.skills.push(newObj);
      persistData(`Skill "${name}" added!`);
    }

    renderSkillsAdmin();
    return true;
  });
}
window.openSkillModal = openSkillModal;

function deleteSkill(idx) {
  const item = DATA.skills[idx];
  if (!item) return;

  openConfirm(`Are you sure you want to delete the skill <strong>"${escapeHtml(item.name)}"</strong>?`, () => {
    DATA.skills.splice(idx, 1);
    persistData(`Skill "${item.name}" deleted!`);
    renderSkillsAdmin();
  });
}
window.deleteSkill = deleteSkill;

/* ============================================================
   3. PROJECTS MANAGEMENT
   ============================================================ */
function renderProjectsAdmin() {
  const container = document.getElementById('admin-projects-list');
  if (!container) return;
  const projects = DATA.projects || [];

  if (projects.length === 0) {
    container.innerHTML = `
      <div class="admin-card" style="text-align:center;padding:2.5rem 1rem">
        <i class="fas fa-rocket" style="font-size:2.5rem;color:var(--text-muted);margin-bottom:0.8rem"></i>
        <p style="color:var(--text-muted);margin-bottom:1rem">No projects added yet.</p>
        <button class="btn btn-primary" onclick="window.openProjectModal()"><i class="fas fa-plus"></i> Add Your First Project</button>
      </div>
    `;
    return;
  }

  container.innerHTML = projects.map((p, i) => `
    <div class="admin-card">
      <div class="admin-item-header">
        <div>
          <h4>${p.featured ? '<span style="color:#fbbf24">⭐ [Featured]</span> ' : ''}${escapeHtml(p.title)}</h4>
          <div style="margin-top:0.4rem">
            ${(p.tags || []).map(t => `<span class="item-badge">${escapeHtml(t)}</span>`).join('')}
          </div>
        </div>
        <div class="admin-item-actions">
          <button class="btn btn-sm btn-edit" onclick="window.openProjectModal(${i})"><i class="fas fa-pen"></i> Edit</button>
          <button class="btn btn-sm btn-delete" onclick="window.deleteProject(${i})"><i class="fas fa-trash"></i> Delete</button>
        </div>
      </div>

      <p style="font-size:0.88rem;color:var(--text-muted);line-height:1.6;margin-bottom:0.8rem">
        ${escapeHtml(p.description || '')}
      </p>

      <div style="display:flex;gap:1.5rem;align-items:center;flex-wrap:wrap;font-size:0.82rem;color:var(--text-muted)">
        ${p.image && !p.image.includes('placeholder')
          ? `<span><i class="fas fa-image" style="color:var(--purple-light)"></i> ImgBB Image linked</span>`
          : `<span style="color:#f59e0b"><i class="fas fa-info-circle"></i> Placeholder image</span>`}
        ${p.link && p.link !== '#' ? `<a href="${p.link}" target="_blank" style="color:var(--cyan)"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
        ${p.github && p.github !== '#' ? `<a href="${p.github}" target="_blank" style="color:var(--cyan)"><i class="fab fa-github"></i> GitHub</a>` : ''}
      </div>
    </div>
  `).join('');
}

function openProjectModal(idx) {
  const isEdit = idx !== undefined;
  const p = isEdit
    ? { ...DATA.projects[idx] }
    : {
        id: uid(),
        title: '',
        description: '',
        tags: ['AI', 'Python'],
        image: '',
        link: '#',
        github: '#',
        featured: false
      };

  const modalHtml = `
    <div class="admin-form">
      <div class="form-group">
        <label><i class="fas fa-heading"></i> Project Title *</label>
        <input id="m-p-title" value="${escapeHtml(p.title)}" placeholder="e.g. Smart Blood Bank Connect using AI & ML" required>
      </div>

      <div class="form-group">
        <label><i class="fas fa-align-left"></i> Description *</label>
        <textarea id="m-p-desc" style="min-height:90px" placeholder="Detailed explanation of what this project does and how it was built...">${escapeHtml(p.description)}</textarea>
      </div>

      <div class="form-group">
        <label><i class="fas fa-tags"></i> Tags (comma-separated)</label>
        <input id="m-p-tags" value="${escapeHtml((p.tags || []).join(', '))}" placeholder="e.g. AI, ML, Python, OpenCV, Web">
      </div>

      <div class="form-group">
        <label><i class="fas fa-image"></i> Project Screenshot URL (from ImgBB.com)</label>
        <input id="m-p-image" value="${escapeHtml(p.image || '')}" placeholder="https://i.ibb.co/..." oninput="window.previewImage('m-p-image', 'm-p-img-preview')">
        <div class="img-preview-box">
          <span class="preview-label">Live Preview:</span>
          <img id="m-p-img-preview" src="${p.image || ''}" alt="Preview" onerror="this.style.display='none'" onload="this.style.display='inline-block'" style="${p.image ? '' : 'display:none'}">
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label><i class="fas fa-external-link-alt"></i> Live Demo Link</label>
          <input id="m-p-link" value="${escapeHtml(p.link || '#')}" placeholder="https://...">
        </div>
        <div class="form-group">
          <label><i class="fab fa-github"></i> GitHub Code Link</label>
          <input id="m-p-github" value="${escapeHtml(p.github || '#')}" placeholder="https://github.com/...">
        </div>
      </div>

      <div class="form-group" style="flex-direction:row;align-items:center;gap:0.7rem;margin-top:0.3rem">
        <input type="checkbox" id="m-p-featured" style="width:20px;height:20px;accent-color:var(--purple);cursor:pointer" ${p.featured ? 'checked' : ''}>
        <label for="m-p-featured" style="cursor:pointer;text-transform:none;letter-spacing:0;font-size:0.9rem">
          ⭐ Mark as Featured Project (displayed with special badge)
        </label>
      </div>
    </div>
  `;

  openModal(isEdit ? 'Edit Project' : 'Add New Project', modalHtml, () => {
    const title = getValue('m-p-title').trim();
    const desc  = getValue('m-p-desc').trim();

    if (!title) {
      showToast('Project title is required', 'error');
      return false;
    }

    const tags = getValue('m-p-tags')
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const newObj = {
      ...(isEdit ? DATA.projects[idx] : { id: uid() }),
      title,
      description: desc,
      tags,
      image:    getValue('m-p-image').trim(),
      link:     getValue('m-p-link').trim() || '#',
      github:   getValue('m-p-github').trim() || '#',
      featured: document.getElementById('m-p-featured')?.checked || false
    };

    if (isEdit) {
      DATA.projects[idx] = newObj;
      persistData(`Project "${title}" updated!`);
    } else {
      DATA.projects.push(newObj);
      persistData(`Project "${title}" added!`);
    }

    renderProjectsAdmin();
    return true;
  });
}
window.openProjectModal = openProjectModal;

function deleteProject(idx) {
  const item = DATA.projects[idx];
  if (!item) return;

  openConfirm(`Are you sure you want to delete the project <strong>"${escapeHtml(item.title)}"</strong>?`, () => {
    DATA.projects.splice(idx, 1);
    persistData(`Project "${item.title}" deleted!`);
    renderProjectsAdmin();
  });
}
window.deleteProject = deleteProject;

/* ============================================================
   4. EDUCATION MANAGEMENT
   ============================================================ */
function renderEducationAdmin() {
  const container = document.getElementById('admin-edu-list');
  if (!container) return;
  const edu = DATA.education || [];

  if (edu.length === 0) {
    container.innerHTML = `
      <div class="admin-card" style="text-align:center;padding:2.5rem 1rem">
        <i class="fas fa-graduation-cap" style="font-size:2.5rem;color:var(--text-muted);margin-bottom:0.8rem"></i>
        <p style="color:var(--text-muted);margin-bottom:1rem">No education entries added yet.</p>
        <button class="btn btn-primary" onclick="window.openEduModal()"><i class="fas fa-plus"></i> Add Education</button>
      </div>
    `;
    return;
  }

  container.innerHTML = edu.map((e, i) => `
    <div class="admin-card">
      <div class="admin-item-header">
        <div>
          <h4>${escapeHtml(e.degree)}</h4>
          <span style="font-size:0.84rem;color:var(--cyan);font-weight:600">${escapeHtml(e.institution)}</span>
          <div style="margin-top:0.3rem">
            <span class="item-badge"><i class="fas fa-calendar-alt"></i> ${escapeHtml(e.duration)}</span>
            <span class="item-badge"><i class="fas fa-award"></i> ${escapeHtml(e.grade || 'In Progress')}</span>
            <span class="item-badge" style="background:rgba(16,185,129,0.2);color:var(--emerald)">${escapeHtml(e.status || '')}</span>
          </div>
        </div>
        <div class="admin-item-actions">
          <button class="btn btn-sm btn-edit" onclick="window.openEduModal(${i})"><i class="fas fa-pen"></i> Edit</button>
          <button class="btn btn-sm btn-delete" onclick="window.deleteEdu(${i})"><i class="fas fa-trash"></i> Delete</button>
        </div>
      </div>
      <p style="font-size:0.86rem;color:var(--text-muted);line-height:1.6;margin-top:0.5rem">
        ${escapeHtml(e.description || '')}
      </p>
    </div>
  `).join('');
}

function openEduModal(idx) {
  const isEdit = idx !== undefined;
  const e = isEdit
    ? { ...DATA.education[idx] }
    : {
        id: uid(),
        degree: '',
        institution: '',
        duration: '2023 – 2027',
        status: '3rd Year Student',
        grade: 'In Progress',
        description: ''
      };

  const modalHtml = `
    <div class="admin-form">
      <div class="form-group">
        <label><i class="fas fa-graduation-cap"></i> Degree / Program *</label>
        <input id="m-e-degree" value="${escapeHtml(e.degree)}" placeholder="e.g. B.E. Artificial Intelligence & Machine Learning" required>
      </div>

      <div class="form-group">
        <label><i class="fas fa-university"></i> Institution / College *</label>
        <input id="m-e-inst" value="${escapeHtml(e.institution)}" placeholder="e.g. Sree Sakthi Engineering College" required>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label><i class="fas fa-calendar"></i> Duration</label>
          <input id="m-e-dur" value="${escapeHtml(e.duration)}" placeholder="2023 – 2027 (Expected)">
        </div>
        <div class="form-group">
          <label><i class="fas fa-user-clock"></i> Academic Status</label>
          <input id="m-e-status" value="${escapeHtml(e.status)}" placeholder="3rd Year Student">
        </div>
      </div>

      <div class="form-group">
        <label><i class="fas fa-medal"></i> Grade / Score</label>
        <input id="m-e-grade" value="${escapeHtml(e.grade)}" placeholder="e.g. In Progress, 8.5 CGPA, Distinction">
      </div>

      <div class="form-group">
        <label><i class="fas fa-info-circle"></i> Description / Details</label>
        <textarea id="m-e-desc" style="min-height:80px" placeholder="Details about courses, activities, achievements...">${escapeHtml(e.description)}</textarea>
      </div>
    </div>
  `;

  openModal(isEdit ? 'Edit Education' : 'Add Education Entry', modalHtml, () => {
    const degree = getValue('m-e-degree').trim();
    const inst   = getValue('m-e-inst').trim();

    if (!degree || !inst) {
      showToast('Degree and institution are required', 'error');
      return false;
    }

    const newObj = {
      ...(isEdit ? DATA.education[idx] : { id: uid() }),
      degree,
      institution: inst,
      duration:    getValue('m-e-dur').trim(),
      status:      getValue('m-e-status').trim(),
      grade:       getValue('m-e-grade').trim(),
      description: getValue('m-e-desc').trim()
    };

    if (isEdit) {
      DATA.education[idx] = newObj;
      persistData(`Education "${degree}" updated!`);
    } else {
      DATA.education.push(newObj);
      persistData(`Education "${degree}" added!`);
    }

    renderEducationAdmin();
    return true;
  });
}
window.openEduModal = openEduModal;

function deleteEdu(idx) {
  const item = DATA.education[idx];
  if (!item) return;

  openConfirm(`Are you sure you want to delete <strong>"${escapeHtml(item.degree)}"</strong>?`, () => {
    DATA.education.splice(idx, 1);
    persistData(`Education "${item.degree}" deleted!`);
    renderEducationAdmin();
  });
}
window.deleteEdu = deleteEdu;

/* ============================================================
   5. RESUME LINK MANAGEMENT
   ============================================================ */
function renderResumeAdmin() {
  const r = DATA.resume || {};
  setValue('r-url',   r.url || '');
  setValue('r-label', r.label || 'Download Resume (PDF)');

  const testBtn = document.getElementById('r-test-link');
  if (testBtn) {
    if (r.url && r.url !== '#') {
      testBtn.href = r.url;
      testBtn.style.display = 'inline-flex';
    } else {
      testBtn.style.display = 'none';
    }
  }
}

function saveResumeData() {
  const url   = getValue('r-url').trim() || '#';
  const label = getValue('r-label').trim() || 'Download Resume (PDF)';

  DATA.resume = { url, label };
  persistData('Resume link updated!');
  renderResumeAdmin();
}

/* ============================================================
   6. CERTIFICATES MANAGEMENT (cetf)
   ============================================================ */
function renderCertsAdmin() {
  const container = document.getElementById('admin-certs-list');
  if (!container) return;
  const certs = DATA.certificates || [];

  if (certs.length === 0) {
    container.innerHTML = `
      <div class="admin-card" style="text-align:center;padding:2.5rem 1rem">
        <i class="fas fa-certificate" style="font-size:2.5rem;color:var(--text-muted);margin-bottom:0.8rem"></i>
        <p style="color:var(--text-muted);margin-bottom:1rem">No certificates added yet.</p>
        <button class="btn btn-primary" onclick="window.openCertModal()"><i class="fas fa-plus"></i> Add Your First Certificate</button>
      </div>
    `;
    return;
  }

  container.innerHTML = certs.map((c, i) => `
    <div class="admin-card">
      <div class="admin-item-header">
        <div>
          <h4>${escapeHtml(c.title)}</h4>
          <span style="font-size:0.84rem;color:var(--cyan);font-weight:600">${escapeHtml(c.issuer)}</span>
          <div style="margin-top:0.3rem">
            <span class="item-badge"><i class="fas fa-calendar"></i> ${escapeHtml(c.date || '')}</span>
            ${c.link && c.link !== '#' ? `<a href="${c.link}" target="_blank" class="item-badge" style="color:var(--cyan);text-decoration:none"><i class="fas fa-link"></i> Verify</a>` : ''}
          </div>
        </div>
        <div class="admin-item-actions">
          <button class="btn btn-sm btn-edit" onclick="window.openCertModal(${i})"><i class="fas fa-pen"></i> Edit</button>
          <button class="btn btn-sm btn-delete" onclick="window.deleteCert(${i})"><i class="fas fa-trash"></i> Delete</button>
        </div>
      </div>

      ${c.image && !c.image.includes('placeholder')
        ? `<div style="margin-top:0.6rem"><img src="${c.image}" alt="${escapeHtml(c.title)}" style="height:90px;border-radius:8px;object-fit:cover;border:1px solid var(--glass-border)" onerror="this.style.display='none'"></div>`
        : `<div style="margin-top:0.4rem;font-size:0.8rem;color:var(--text-muted)"><i class="fas fa-info-circle"></i> Placeholder image</div>`}
    </div>
  `).join('');
}

function openCertModal(idx) {
  const isEdit = idx !== undefined;
  const c = isEdit
    ? { ...DATA.certificates[idx] }
    : { id: uid(), title: '', issuer: '', date: '2024', image: '', link: '#' };

  const modalHtml = `
    <div class="admin-form">
      <div class="form-group">
        <label><i class="fas fa-certificate"></i> Certificate Title *</label>
        <input id="m-c-title" value="${escapeHtml(c.title)}" placeholder="e.g. Python Programming Fundamentals" required>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label><i class="fas fa-building"></i> Issuer / Organization *</label>
          <input id="m-c-issuer" value="${escapeHtml(c.issuer)}" placeholder="e.g. NPTEL, Coursera, IBM, Udemy" required>
        </div>
        <div class="form-group">
          <label><i class="fas fa-calendar"></i> Date / Year</label>
          <input id="m-c-date" value="${escapeHtml(c.date)}" placeholder="2024">
        </div>
      </div>

      <div class="form-group">
        <label><i class="fas fa-image"></i> Certificate Image URL (from ImgBB.com)</label>
        <input id="m-c-image" value="${escapeHtml(c.image || '')}" placeholder="https://i.ibb.co/..." oninput="window.previewImage('m-c-image', 'm-c-img-preview')">
        <div class="img-preview-box">
          <span class="preview-label">Live Preview:</span>
          <img id="m-c-img-preview" src="${c.image || ''}" alt="Certificate Preview" onerror="this.style.display='none'" onload="this.style.display='inline-block'" style="${c.image ? '' : 'display:none'}">
        </div>
      </div>

      <div class="form-group">
        <label><i class="fas fa-link"></i> Verification URL / Credential Link</label>
        <input id="m-c-link" value="${escapeHtml(c.link || '#')}" placeholder="https://coursera.org/verify/...">
      </div>
    </div>
  `;

  openModal(isEdit ? 'Edit Certificate' : 'Add Certificate', modalHtml, () => {
    const title  = getValue('m-c-title').trim();
    const issuer = getValue('m-c-issuer').trim();

    if (!title || !issuer) {
      showToast('Title and issuer are required', 'error');
      return false;
    }

    const newObj = {
      ...(isEdit ? DATA.certificates[idx] : { id: uid() }),
      title,
      issuer,
      date:  getValue('m-c-date').trim(),
      image: getValue('m-c-image').trim(),
      link:  getValue('m-c-link').trim() || '#'
    };

    if (isEdit) {
      DATA.certificates[idx] = newObj;
      persistData(`Certificate "${title}" updated!`);
    } else {
      DATA.certificates.push(newObj);
      persistData(`Certificate "${title}" added!`);
    }

    renderCertsAdmin();
    return true;
  });
}
window.openCertModal = openCertModal;

function deleteCert(idx) {
  const item = DATA.certificates[idx];
  if (!item) return;

  openConfirm(`Are you sure you want to delete certificate <strong>"${escapeHtml(item.title)}"</strong>?`, () => {
    DATA.certificates.splice(idx, 1);
    persistData(`Certificate "${item.title}" deleted!`);
    renderCertsAdmin();
  });
}
window.deleteCert = deleteCert;

/* ============================================================
   7. ACHIEVEMENTS MANAGEMENT
   ============================================================ */
function renderAchievementsAdmin() {
  const container = document.getElementById('admin-achievements-list');
  if (!container) return;
  const ach = DATA.achievements || [];

  if (ach.length === 0) {
    container.innerHTML = `
      <div class="admin-card" style="text-align:center;padding:2.5rem 1rem">
        <i class="fas fa-trophy" style="font-size:2.5rem;color:var(--text-muted);margin-bottom:0.8rem"></i>
        <p style="color:var(--text-muted);margin-bottom:1rem">No achievements added yet.</p>
        <button class="btn btn-primary" onclick="window.openAchModal()"><i class="fas fa-plus"></i> Add Your First Achievement</button>
      </div>
    `;
    return;
  }

  container.innerHTML = ach.map((a, i) => `
    <div class="admin-card">
      <div class="admin-item-header">
        <div>
          <h4><i class="${a.icon || 'fas fa-trophy'}" style="color:#fbbf24;margin-right:8px"></i> ${escapeHtml(a.title)}</h4>
          <span class="item-badge"><i class="fas fa-calendar"></i> ${escapeHtml(a.year || '')}</span>
        </div>
        <div class="admin-item-actions">
          <button class="btn btn-sm btn-edit" onclick="window.openAchModal(${i})"><i class="fas fa-pen"></i> Edit</button>
          <button class="btn btn-sm btn-delete" onclick="window.deleteAch(${i})"><i class="fas fa-trash"></i> Delete</button>
        </div>
      </div>
      <p style="font-size:0.86rem;color:var(--text-muted);line-height:1.6;margin-top:0.4rem">
        ${escapeHtml(a.description || '')}
      </p>
    </div>
  `).join('');
}

function openAchModal(idx) {
  const isEdit = idx !== undefined;
  const a = isEdit
    ? { ...DATA.achievements[idx] }
    : { id: uid(), title: '', description: '', icon: 'fas fa-trophy', year: '2024' };

  const modalHtml = `
    <div class="admin-form">
      <div class="form-group">
        <label><i class="fas fa-trophy"></i> Achievement Title *</label>
        <input id="m-a-title" value="${escapeHtml(a.title)}" placeholder="e.g. AI Project Hackathon – Top 10" required>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label><i class="fas fa-calendar"></i> Year</label>
          <input id="m-a-year" value="${escapeHtml(a.year)}" placeholder="2024">
        </div>
        <div class="form-group">
          <label><i class="fas fa-icons"></i> Font Awesome Icon</label>
          <input id="m-a-icon" value="${escapeHtml(a.icon || 'fas fa-trophy')}" placeholder="fas fa-trophy">
        </div>
      </div>

      <div class="form-group">
        <label><i class="fas fa-align-left"></i> Description</label>
        <textarea id="m-a-desc" style="min-height:80px" placeholder="Explain what was accomplished and recognized...">${escapeHtml(a.description)}</textarea>
      </div>
    </div>
  `;

  openModal(isEdit ? 'Edit Achievement' : 'Add Achievement', modalHtml, () => {
    const title = getValue('m-a-title').trim();

    if (!title) {
      showToast('Achievement title is required', 'error');
      return false;
    }

    const newObj = {
      ...(isEdit ? DATA.achievements[idx] : { id: uid() }),
      title,
      year:        getValue('m-a-year').trim(),
      icon:        getValue('m-a-icon').trim() || 'fas fa-trophy',
      description: getValue('m-a-desc').trim()
    };

    if (isEdit) {
      DATA.achievements[idx] = newObj;
      persistData(`Achievement "${title}" updated!`);
    } else {
      DATA.achievements.push(newObj);
      persistData(`Achievement "${title}" added!`);
    }

    renderAchievementsAdmin();
    return true;
  });
}
window.openAchModal = openAchModal;

function deleteAch(idx) {
  const item = DATA.achievements[idx];
  if (!item) return;

  openConfirm(`Are you sure you want to delete achievement <strong>"${escapeHtml(item.title)}"</strong>?`, () => {
    DATA.achievements.splice(idx, 1);
    persistData(`Achievement "${item.title}" deleted!`);
    renderAchievementsAdmin();
  });
}
window.deleteAch = deleteAch;

/* ============================================================
   8. CONTACT MANAGEMENT (content)
   ============================================================ */
function renderContactAdmin() {
  const c = DATA.contact || {};
  setValue('c-email',     c.email || '');
  setValue('c-phone',     c.phone || '');
  setValue('c-linkedin',  c.linkedin || '');
  setValue('c-github',    c.github || '');
  setValue('c-instagram', c.instagram || '');
  setValue('c-twitter',   c.twitter || '');
  setValue('c-location',  c.location || '');
}

function saveContactData() {
  DATA.contact = {
    email:     getValue('c-email').trim() || 'poovarasanvj860@gmail.com',
    phone:     getValue('c-phone').trim(),
    linkedin:  getValue('c-linkedin').trim(),
    github:    getValue('c-github').trim(),
    instagram: getValue('c-instagram').trim(),
    twitter:   getValue('c-twitter').trim(),
    location:  getValue('c-location').trim()
  };
  persistData('Contact & social links updated!');
}

/* ============================================================
   RESET DATA
   ============================================================ */
function handleResetData() {
  openConfirm('Are you sure you want to reset <strong>ALL portfolio data</strong> back to the original defaults? All your custom edits will be replaced with defaults.', () => {
    DATA = resetData();
    renderAllAdminSections();
    updateDashboardCounts();
    showToast('All portfolio data reset to defaults!', 'info');
  });
}

/* ============================================================
   MODAL ENGINE
   ============================================================ */
function openModal(title, bodyHtml, onSave) {
  _currentSaveCallback = onSave;
  const backdrop = document.getElementById('modal-backdrop');
  const titleEl  = document.getElementById('modal-title');
  const bodyEl   = document.getElementById('modal-body');

  if (!backdrop || !titleEl || !bodyEl) return;

  titleEl.innerHTML = `<i class="fas fa-edit"></i> ${title}`;
  bodyEl.innerHTML  = bodyHtml;
  backdrop.classList.add('open');

  // Focus first input
  setTimeout(() => {
    backdrop.querySelector('input, textarea, select')?.focus();
  }, 50);
}

function closeModal() {
  document.getElementById('modal-backdrop')?.classList.remove('open');
  _currentSaveCallback = null;
}

function handleModalSave() {
  if (typeof _currentSaveCallback === 'function') {
    const ok = _currentSaveCallback();
    if (ok !== false) {
      closeModal();
    }
  }
}

/* ============================================================
   CONFIRM DIALOG ENGINE
   ============================================================ */
function openConfirm(htmlMessage, onConfirm) {
  _currentConfirmCallback = onConfirm;
  const backdrop = document.getElementById('confirm-backdrop');
  const msgEl    = document.getElementById('confirm-msg');

  if (!backdrop || !msgEl) return;

  msgEl.innerHTML = htmlMessage;
  backdrop.classList.add('open');
}

function handleConfirmYes() {
  if (typeof _currentConfirmCallback === 'function') {
    _currentConfirmCallback();
  }
  document.getElementById('confirm-backdrop')?.classList.remove('open');
  _currentConfirmCallback = null;
}

function handleConfirmNo() {
  document.getElementById('confirm-backdrop')?.classList.remove('open');
  _currentConfirmCallback = null;
}

/* ============================================================
   IMAGE PREVIEW HELPER
   ============================================================ */
function previewImage(inputId, imgId) {
  const input = document.getElementById(inputId);
  const img   = document.getElementById(imgId);
  if (!input || !img) return;

  const url = (input.value || '').trim();
  if (url) {
    img.src = url;
    img.style.display = 'inline-block';
  } else {
    img.style.display = 'none';
  }
}
window.previewImage = previewImage;

/* ============================================================
   UTILITY HELPERS
   ============================================================ */
function getValue(id) {
  const el = document.getElementById(id);
  return el ? (el.value || '') : '';
}

function setValue(id, val) {
  const el = document.getElementById(id);
  if (el && val !== undefined && val !== null) {
    el.value = val;
  }
}

function safeSet(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val !== undefined && val !== null ? val : '';
}

function uid() {
  return 'id_' + Math.random().toString(36).substring(2, 10);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ============================================================
   TOAST NOTIFICATIONS
   ============================================================ */
function showToast(msg, type = 'success') {
  const toast = document.getElementById('admin-toast');
  if (!toast) return;

  const icons = {
    success: 'fa-circle-check',
    error:   'fa-circle-exclamation',
    info:    'fa-circle-info'
  };

  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${icons[type] || 'fa-bell'}"></i> <span>${msg}</span>`;
  toast.classList.add('show');

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3400);
}
window.showToast = showToast;
