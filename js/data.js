// ============================================================
//  data.js  —  Shared Portfolio Content & Remote Data Store
//  Synced via jsonbin.io so admin changes show for ALL visitors.
// ============================================================

// ===== SHARED REMOTE DATA STORE CONFIGURATION =====
const REMOTE_BIN_ID = '6a8b10a8f5f4af5e2938ba0a';
const REMOTE_MASTER_KEY = '$2a$10$EDbFVMRAZ.XU7zDpY2WK7OzTf42wsU5iS2.rx4VevqnHTGsMF3bLu';
const REMOTE_API_BASE = 'https://api.jsonbin.io/v3/b/';
const REMOTE_CONFIGURED = !!(REMOTE_BIN_ID && REMOTE_MASTER_KEY &&
  REMOTE_BIN_ID !== 'PASTE_YOUR_BIN_ID_HERE' &&
  REMOTE_MASTER_KEY !== 'PASTE_YOUR_X_MASTER_KEY_HERE');

const DEFAULT_DATA = {
  about: {
    name: "Poovarasan VJ",
    title: "AI & ML Developer | Python & Web Developer",
    educationStatus: "3rd Year Student",
    department: "Artificial Intelligence & Machine Learning (AI & ML)",
    college: "Sree Sakthi Engineering College",
    bio: "I'm a passionate 3rd-year AI & ML student at Sree Sakthi Engineering College, dedicated to building practical AI/ML and web-development projects. I love solving real-world problems through intelligent systems, creative web experiences, and data-driven insights.",
    careerGoal: "Build practical AI/ML and web-development projects and develop skills for internships and future software/AI roles.",
    areasOfInterest: "AI & Machine Learning, Web Development, UI/UX Design, Data Analysis",
    aimlInterest: "Machine Learning, Computer Vision, NLP, AI-based applications",
    tools: "VS Code, Git, GitHub, OpenCV",
    profileImage: "https://i.ibb.co/qMZ6yGtz/Poovarasan.jpg",
    email: "poovarasanvj860@gmail.com",
    location: "Tamil Nadu, India",
    availability: "Open to Internships & Collaborations"
  },

  skills: [
    { id: "s1", category: "Programming Languages", name: "Python",           level: 90, icon: "fab fa-python" },
    { id: "s2", category: "Programming Languages", name: "C",                level: 75, icon: "fas fa-code" },
    { id: "s3", category: "Programming Languages", name: "Java",             level: 70, icon: "fab fa-java" },
    { id: "s4", category: "Database",              name: "SQL",              level: 75, icon: "fas fa-database" },
    { id: "s5", category: "Web Development",       name: "HTML5",            level: 88, icon: "fab fa-html5" },
    { id: "s6", category: "Web Development",       name: "CSS3",             level: 85, icon: "fab fa-css3-alt" },
    { id: "s7", category: "Web Development",       name: "JavaScript",       level: 80, icon: "fab fa-js-square" },
    { id: "s8", category: "AI / ML",               name: "Machine Learning",  level: 80, icon: "fas fa-brain" },
    { id: "s9", category: "AI / ML",               name: "Computer Vision",   level: 72, icon: "fas fa-eye" },
    { id: "s10", category: "AI / ML",              name: "NLP",               level: 68, icon: "fas fa-language" },
    { id: "s11", category: "Tools",                name: "Git & GitHub",      level: 82, icon: "fab fa-github" },
    { id: "s12", category: "Tools",                name: "OpenCV",            level: 70, icon: "fas fa-camera" },
    { id: "s13", category: "Tools",                name: "VS Code",           level: 95, icon: "fas fa-laptop-code" },
    { id: "s14", category: "Design",               name: "UI/UX Design",      level: 72, icon: "fas fa-paint-brush" }
  ],

  projects: [
    {
      id: "p1",
      title: "Smart Blood Bank Connect using AI & ML",
      description: "An AI & ML powered platform that intelligently connects blood donors with recipients in real-time, predicting compatibility and reducing emergency wait times.",
      tags: ["AI", "ML", "Python", "Web"],
      image: "https://i.ibb.co/placeholder/blood-bank.jpg",
      link: "#",
      github: "#",
      featured: true
    },
    {
      id: "p2",
      title: "Blood Donor Website",
      description: "A fully responsive web platform for managing blood donation records, donor registration, and emergency blood requests with an intuitive dashboard.",
      tags: ["HTML", "CSS", "JavaScript", "SQL"],
      image: "https://i.ibb.co/placeholder/blood-donor.jpg",
      link: "#",
      github: "#",
      featured: true
    },
    {
      id: "p3",
      title: "AI-generated Image Detection",
      description: "A deep learning model that distinguishes between real photographs and AI-generated images using CNN and feature-extraction techniques.",
      tags: ["Python", "Computer Vision", "Deep Learning", "OpenCV"],
      image: "https://i.ibb.co/placeholder/ai-detect.jpg",
      link: "#",
      github: "#",
      featured: true
    },
    {
      id: "p4",
      title: "Fake Certificate Detection",
      description: "An intelligent system using ML and image processing to verify the authenticity of certificates, detecting tamper marks and reducing academic fraud.",
      tags: ["Python", "OpenCV", "ML", "Security"],
      image: "https://i.ibb.co/placeholder/fake-cert.jpg",
      link: "#",
      github: "#",
      featured: false
    },
    {
      id: "p5",
      title: "TruthQuest – AI-powered media literacy game",
      description: "An interactive AI-powered browser game that teaches users to identify fake news, disinformation, and media manipulation techniques in real time.",
      tags: ["AI", "JavaScript", "NLP", "Game"],
      image: "https://i.ibb.co/placeholder/truthquest.jpg",
      link: "#",
      github: "#",
      featured: false
    },
    {
      id: "p6",
      title: "Student Academic Performance Prediction",
      description: "ML model predicting student academic outcomes based on behavioral, demographic, and historical academic features to enable early intervention.",
      tags: ["Python", "ML", "Data Analysis", "Scikit-Learn"],
      image: "https://i.ibb.co/placeholder/student.jpg",
      link: "#",
      github: "#",
      featured: false
    },
    {
      id: "p7",
      title: "House Price Prediction",
      description: "Regression-based ML model predicting property prices accurately from location, size, and amenities with interactive visualization charts.",
      tags: ["Python", "ML", "Regression", "Data Analysis"],
      image: "https://i.ibb.co/placeholder/house.jpg",
      link: "#",
      github: "#",
      featured: false
    }
  ],

  education: [
    {
      id: "e1",
      degree: "B.E. Artificial Intelligence & Machine Learning",
      institution: "Sree Sakthi Engineering College",
      duration: "2023 – 2027 (Expected)",
      status: "3rd Year Student",
      grade: "In Progress",
      description: "Studying core AI/ML algorithms, data structures, web technologies, and software engineering practices."
    },
    {
      id: "e2",
      degree: "Higher Secondary (12th Grade)",
      institution: "Tamil Nadu State Board",
      duration: "2021 – 2023",
      status: "Completed",
      grade: "Distinction",
      description: "Completed with focus on Mathematics, Physics, and Computer Science."
    }
  ],

  resume: {
    url: "https://drive.google.com/file/d/1R6Iyqbf4RkUsZ-uRAzXywedI2jt8h6Og/view?usp=drive_link",
    label: "Poovarasan_Resume (PDF)"
  },

  certificates: [
    {
      id: 1787502098693,
      title: "AI Fundamentals Course - Introduction to Artificial Intelligence for Beginners",
      issuer: "GUVI / HCL",
      date: "2026",
      icon: "fas fa-award",
      color: "from-blue-500 to-indigo-600",
      image: "https://i.ibb.co/bR37XVpp/AI-Fundamentals-Course.png",
      link: "https://i.ibb.co/bR37XVpp/AI-Fundamentals-Course.png"
    },
    {
      id: 1787502194129,
      title: "Introduction to Machine Learning",
      issuer: "GUVI / HCL",
      date: "2026",
      icon: "fas fa-brain",
      color: "from-yellow-400 to-orange-500",
      image: "https://i.ibb.co/ZpLz138F/Machine-Learning.png",
      link: "https://i.ibb.co/ZpLz138F/Machine-Learning.png"
    },
    {
      id: 1787502305708,
      title: "Python (Basic)",
      issuer: "HackerRank",
      date: "2026",
      icon: "fab fa-python",
      color: "from-blue-500 to-indigo-600",
      image: "https://i.ibb.co/S7vwQ376/python.png",
      link: "https://i.ibb.co/S7vwQ376/python.png"
    }
  ],

  achievements: [
    {
      id: "a1",
      title: "AI Project Hackathon – Top 10",
      description: "Secured top 10 position in a state-level AI hackathon with the Smart Blood Bank Connect project.",
      icon: "fas fa-trophy",
      year: "2024"
    },
    {
      id: "a2",
      title: "Full Stack Web Development",
      description: "Completed an intensive full-stack web development course and built 3 end-to-end projects.",
      icon: "fas fa-medal",
      year: "2024"
    },
    {
      id: "a3",
      title: "Open Source Contributor",
      description: "Contributed to open-source AI/ML repositories on GitHub, improving documentation and adding features.",
      icon: "fab fa-github",
      year: "2025"
    },
    {
      id: "a4",
      title: "Department Academic Excellence",
      description: "Recognized for outstanding performance in AI & ML core subjects in the 2nd year.",
      icon: "fas fa-star",
      year: "2025"
    }
  ],

  contact: {
    email: "poovarasanvj860@gmail.com",
    phone: "+91 70109999860",
    linkedin: "https://linkedin.com/in/poovarasan-p-2b506a377/",
    github: "https://github.com/Poovarasan701",
    instagram: "#",
    twitter: "#",
    location: "Tamil Nadu, India"
  }
};

// ──────────────────────────────────────────────
//  Remote Data Store Operations (jsonbin.io)
// ──────────────────────────────────────────────

/**
 * Fetch latest shared data from jsonbin.io
 */
async function fetchRemoteData() {
  if (!REMOTE_CONFIGURED) return null;
  try {
    const res = await fetch(REMOTE_API_BASE + REMOTE_BIN_ID + '/latest', {
      cache: 'no-store',
      headers: {
        'X-Master-Key': REMOTE_MASTER_KEY,
        'X-Bin-Meta': 'false'
      }
    });
    if (!res.ok) {
      console.warn('Could not fetch shared remote data. Status:', res.status);
      return null;
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('Could not reach remote shared store, using local/default data.', err);
    return null;
  }
}

/**
 * Save updated portfolio data to jsonbin.io so all visitors see it
 */
async function saveRemoteData(data) {
  if (!REMOTE_CONFIGURED) {
    console.warn('Shared data store not configured.');
    return false;
  }
  try {
    const payload = {
      portfolioData: data,
      certs: (data.certificates || []).map(c => ({
        id: c.id,
        title: c.title,
        issuer: c.issuer,
        date: c.date,
        icon: c.icon || 'fas fa-award',
        color: c.color || 'from-blue-500 to-indigo-600',
        image: c.image || ''
      })),
      resume: {
        name: data.resume?.label || data.resume?.name || 'Poovarasan_Resume',
        url: data.resume?.url || ''
      },
      profileImage: {
        url: data.about?.profileImage || ''
      },
      coffeeCount: 1
    };

    const res = await fetch(REMOTE_API_BASE + REMOTE_BIN_ID, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': REMOTE_MASTER_KEY,
        'X-Bin-Versioning': 'false'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('Remote save failed with status: ' + res.status);
    return true;
  } catch (err) {
    console.error('saveRemoteData error:', err);
    return false;
  }
}

/**
 * Merge remote store records into local data
 */
function mergeRemoteData(remote, current) {
  if (!remote || typeof remote !== 'object') return current;

  let merged = current;

  if (remote.portfolioData && typeof remote.portfolioData === 'object') {
    merged = {
      ...DEFAULT_DATA,
      ...remote.portfolioData,
      about: { ...DEFAULT_DATA.about, ...(remote.portfolioData.about || {}) },
      skills: Array.isArray(remote.portfolioData.skills) ? remote.portfolioData.skills : DEFAULT_DATA.skills,
      projects: Array.isArray(remote.portfolioData.projects) ? remote.portfolioData.projects : DEFAULT_DATA.projects,
      education: Array.isArray(remote.portfolioData.education) ? remote.portfolioData.education : DEFAULT_DATA.education,
      resume: { ...DEFAULT_DATA.resume, ...(remote.portfolioData.resume || {}) },
      certificates: Array.isArray(remote.portfolioData.certificates) ? remote.portfolioData.certificates : DEFAULT_DATA.certificates,
      achievements: Array.isArray(remote.portfolioData.achievements) ? remote.portfolioData.achievements : DEFAULT_DATA.achievements,
      contact: { ...DEFAULT_DATA.contact, ...(remote.portfolioData.contact || {}) }
    };
  } else {
    merged = { ...current };
    if (remote.profileImage && remote.profileImage.url) {
      merged.about = { ...merged.about, profileImage: remote.profileImage.url };
    }
    if (remote.resume && remote.resume.url) {
      merged.resume = {
        ...merged.resume,
        url: remote.resume.url,
        label: remote.resume.name || merged.resume.label || 'Download Resume (PDF)'
      };
    }
    if (Array.isArray(remote.certs) && remote.certs.length > 0) {
      merged.certificates = remote.certs.map((c, idx) => ({
        id: c.id || `remote-cert-${idx}`,
        title: c.title || 'Certificate',
        issuer: c.issuer || '',
        date: c.date || '2026',
        image: c.image || '',
        icon: c.icon || 'fas fa-award',
        color: c.color || 'from-blue-500 to-indigo-600',
        link: c.image || '#'
      }));
    }
  }

  return merged;
}

/**
 * Pull latest data from jsonbin, update local storage, and notify listeners
 */
async function syncRemoteData() {
  const remote = await fetchRemoteData();
  if (remote) {
    const current = loadData();
    const updated = mergeRemoteData(remote, current);
    try {
      localStorage.setItem('portfolioData', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not persist to localStorage:', e);
    }
    window.dispatchEvent(new CustomEvent('portfolioDataUpdated', { detail: updated }));
    return updated;
  }
  return null;
}

// ──────────────────────────────────────────────
//  Storage helpers (Sync with LocalStorage & Remote)
// ──────────────────────────────────────────────
function loadData() {
  const stored = localStorage.getItem('portfolioData');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);

      // Auto-migrate placeholder contact info to user's actual links
      if (parsed.contact) {
        if (!parsed.contact.linkedin || parsed.contact.linkedin.includes('poovarasanvj') || !parsed.contact.linkedin.includes('2b506a377')) {
          parsed.contact.linkedin = DEFAULT_DATA.contact.linkedin;
        }
        if (!parsed.contact.github || parsed.contact.github.includes('poovarasanvj') || !parsed.contact.github.includes('Poovarasan701')) {
          parsed.contact.github = DEFAULT_DATA.contact.github;
        }
        if (!parsed.contact.phone || parsed.contact.phone.includes('XXXXXXXXXX')) {
          parsed.contact.phone = DEFAULT_DATA.contact.phone;
        }
      }

      // If stored profileImage is placeholder, update to real one
      if (parsed.about && (!parsed.about.profileImage || parsed.about.profileImage.includes('placeholder'))) {
        parsed.about.profileImage = DEFAULT_DATA.about.profileImage;
      }

      // If stored resume is empty, update to real one
      if (parsed.resume && (!parsed.resume.url || parsed.resume.url === '#')) {
        parsed.resume = DEFAULT_DATA.resume;
      }

      // Merge with defaults to ensure all required keys exist
      const merged = {
        ...DEFAULT_DATA,
        ...parsed,
        about: { ...DEFAULT_DATA.about, ...(parsed.about || {}) },
        skills: Array.isArray(parsed.skills) && parsed.skills.length > 0 ? parsed.skills : DEFAULT_DATA.skills,
        projects: Array.isArray(parsed.projects) && parsed.projects.length > 0 ? parsed.projects : DEFAULT_DATA.projects,
        education: Array.isArray(parsed.education) && parsed.education.length > 0 ? parsed.education : DEFAULT_DATA.education,
        resume: { ...DEFAULT_DATA.resume, ...(parsed.resume || {}) },
        certificates: Array.isArray(parsed.certificates) && parsed.certificates.length > 0 ? parsed.certificates : DEFAULT_DATA.certificates,
        achievements: Array.isArray(parsed.achievements) && parsed.achievements.length > 0 ? parsed.achievements : DEFAULT_DATA.achievements,
        contact: { ...DEFAULT_DATA.contact, ...(parsed.contact || {}) }
      };

      localStorage.setItem('portfolioData', JSON.stringify(merged));
      return merged;
    } catch(e) {
      console.error('Error parsing stored portfolioData:', e);
    }
  }
  // Seed on first load
  localStorage.setItem('portfolioData', JSON.stringify(DEFAULT_DATA));
  return DEFAULT_DATA;
}

function saveData(data) {
  try {
    localStorage.setItem('portfolioData', JSON.stringify(data));
    // Dispatch local update event for current view
    window.dispatchEvent(new CustomEvent('portfolioDataUpdated', { detail: data }));
    // Asynchronously save to remote cloud store
    saveRemoteData(data).then(success => {
      window.dispatchEvent(new CustomEvent('remoteSyncStatus', { detail: { success } }));
    });
  } catch(e) {
    console.error('Error saving portfolioData:', e);
  }
}

function resetData() {
  localStorage.setItem('portfolioData', JSON.stringify(DEFAULT_DATA));
  window.dispatchEvent(new CustomEvent('portfolioDataUpdated', { detail: DEFAULT_DATA }));
  return DEFAULT_DATA;
}

// Global exports
window.DEFAULT_DATA = DEFAULT_DATA;
window.REMOTE_BIN_ID = REMOTE_BIN_ID;
window.REMOTE_MASTER_KEY = REMOTE_MASTER_KEY;
window.REMOTE_CONFIGURED = REMOTE_CONFIGURED;
window.loadData = loadData;
window.saveData = saveData;
window.resetData = resetData;
window.fetchRemoteData = fetchRemoteData;
window.saveRemoteData = saveRemoteData;
window.mergeRemoteData = mergeRemoteData;
window.syncRemoteData = syncRemoteData;
