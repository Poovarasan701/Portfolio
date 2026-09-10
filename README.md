# 🤖 Poovarasan VJ — 3D Portfolio Website

<div align="center">

![Portfolio Banner](https://img.shields.io/badge/Portfolio-3D%20Interactive-7c3aed?style=for-the-badge&logo=three.js&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white)

> A stunning, fully-interactive 3D portfolio website for **Poovarasan VJ**,  
> AI & ML Developer | Python Developer | Web Developer  
> Built with Three.js, Glassmorphism UI, and a secure Admin Panel.

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🗂️ Project Structure](#️-project-structure)
- [🚀 How to Open](#-how-to-open)
- [🔐 Admin Panel](#-admin-panel)
- [🖼️ Adding Images (ImgBB)](#️-adding-images-imgbb)
- [📦 Technologies Used](#-technologies-used)
- [📁 Portfolio Sections](#-portfolio-sections)
- [🎨 Design System](#-design-system)
- [💾 Data Storage](#-data-storage)
- [📱 Responsive Design](#-responsive-design)
- [👤 About the Developer](#-about-the-developer)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌌 **3D Animated Background** | 1800-particle Three.js field + 8 floating wireframe geometric shapes |
| 🖱️ **Mouse Parallax** | 3D scene depth shifts as you move the cursor |
| 🃏 **3D Card Tilt** | Every glass card tilts in perspective on hover |
| ⌨️ **Typing Animation** | Hero subtitle cycles through 5 professional roles |
| 📊 **Animated Skill Bars** | Progress bars animate on scroll-into-view |
| 🔭 **Scroll Reveal** | Sections fade+slide in as you scroll |
| 🔢 **Counter Animation** | Hero stats count up on page load |
| 🔍 **Certificate Lightbox** | Click any certificate card to preview full-size |
| 🎯 **Skill Filter** | Filter skills by category (AI/ML, Web, Tools, etc.) |
| 📬 **Contact Form** | Opens your default email client with pre-filled content |
| 🔐 **Secure Admin Panel** | Password-protected dashboard to manage all content |
| 📱 **Fully Responsive** | Works on desktop, tablet, and mobile |
| 🌙 **Dark Theme** | Neon-accented dark UI with glassmorphism cards |

---

## 🗂️ Project Structure

```
Desktop/01/
│
├── index.html          ← Main portfolio page (OPEN THIS)
├── admin.html          ← Admin login & content manager
├── README.md           ← You are here
│
├── css/
│   ├── style.css       ← Main styles (3D, glassmorphism, animations)
│   └── admin.css       ← Admin panel styles
│
└── js/
    ├── data.js         ← Default content data + localStorage helpers
    ├── three-bg.js     ← Three.js 3D animated background
    ├── main.js         ← Portfolio render logic & interactions
    └── admin.js        ← Admin CRUD operations
```

---

## 🚀 How to Open

### Option 1 — Direct (Simplest)
1. Open **File Explorer** → go to `Desktop\01`
2. Double-click **`index.html`**
3. The portfolio opens in your default browser ✅

### Option 2 — VS Code Live Server (Recommended)
1. Open the `01` folder in **VS Code**
2. Install the **Live Server** extension (if not already installed)
3. Right-click `index.html` → **Open with Live Server**
4. Auto-reloads on any file change ✅

### Option 3 — Python Local Server
```bash
# Navigate to the project folder
cd Desktop/01

# Python 3
python -m http.server 8000

# Then open in browser:
# http://localhost:8000
```

---

## 🔐 Admin Panel

Access the admin dashboard to manage **all portfolio content** without touching any code.

### How to Access
- Scroll to the bottom of the portfolio → click the tiny **"⚙ Admin"** link in the footer
- Or open `admin.html` directly in your browser

### Login Credentials
| Field    | Value                          |
|----------|-------------------------------|
| Email    | `poovarasanvj860@gmail.com`   |
| Password | `0987654321_0987654321`        |

> ⚠️ **Security Note:** The admin panel uses client-side authentication stored in `sessionStorage`. It automatically logs out when the browser tab is closed. Do not share this page link with others.

### What Admin Can Do

| Section       | Actions Available                          |
|---------------|--------------------------------------------|
| About Me      | Edit name, bio, title, profile image URL   |
| Skills        | Add / Edit / Delete skills with % level    |
| Projects      | Add / Edit / Delete project cards          |
| Education     | Add / Edit / Delete education entries      |
| Resume        | Set PDF download link                      |
| Certificates  | Add / Edit / Delete + ImgBB image URL      |
| Achievements  | Add / Edit / Delete with icon & year       |
| Contact       | Update email, phone, and all social links  |

---

## 🖼️ Adding Images (ImgBB)

This portfolio uses **[ImgBB](https://imgbb.com)** for hosting images — no local image files needed.

### Steps to Add Your Profile Photo

1. Go to **[https://imgbb.com](https://imgbb.com)**
2. Click **"Start uploading"** → select your photo
3. After upload, copy the **"Direct link"** URL  
   _(it looks like: `https://i.ibb.co/XXXXXXXX/photo.jpg`)_
4. Open `admin.html` → login → go to **About Me**
5. Paste the URL in **"Profile Image URL"** → click **Save**

### Steps to Add Certificate Images

1. Upload certificate image to **[imgbb.com](https://imgbb.com)**
2. Copy the **Direct link** URL
3. Admin → **Certificates** → **Add Certificate** (or Edit)
4. Paste URL in **"Certificate Image URL"** → Save

---

## 📦 Technologies Used

| Technology | Purpose | CDN |
|---|---|---|
| **Three.js r134** | 3D particle background & geometry | `cdnjs.cloudflare.com` |
| **Font Awesome 6.5** | Icons throughout the site | `cdnjs.cloudflare.com` |
| **Google Fonts** | Orbitron (headings), Exo 2 (body), Share Tech Mono | `fonts.googleapis.com` |
| **Vanilla JS (ES6+)** | All interactivity & data management | — |
| **CSS3** | Glassmorphism, animations, 3D transforms | — |
| **localStorage** | Persisting admin edits in browser | — |
| **sessionStorage** | Admin login session | — |

> 🔌 **No backend, no database, no npm, no build tools required.**  
> Open `index.html` and it just works.

---

## 📁 Portfolio Sections

| # | Section | Description |
|---|---|---|
| 1 | **Hero** | 3D background, profile photo, typing animation, hero stats |
| 2 | **About Me** | Bio, personal info, quick facts |
| 3 | **Skills** | Filterable skill cards with animated progress bars |
| 4 | **Projects** | Project cards with tags, demo links, GitHub links |
| 5 | **Education** | Timeline of academic history |
| 6 | **Resume** | PDF download button |
| 7 | **Certificates** | Certificate gallery with lightbox preview |
| 8 | **Achievements** | Icon-based achievement cards |
| 9 | **Contact** | Info links + contact form (opens email client) |

---

## 🎨 Design System

### Color Palette

| Name | Hex | Usage |
|---|---|---|
| Purple | `#7c3aed` | Primary accent, buttons, glow |
| Violet | `#a855f7` | Secondary accent, skill icons |
| Cyan | `#06b6d4` | Links, highlights, borders |
| Blue | `#3b82f6` | Gradient fills |
| Emerald | `#10b981` | Success, availability status |
| Dark BG | `#020817` | Page background |

### Fonts

| Font | Weight | Usage |
|---|---|---|
| **Orbitron** | 400, 700, 900 | Section titles, logo, nav |
| **Exo 2** | 300–700 | Body text, descriptions |
| **Share Tech Mono** | 400 | Code, percentages, badges |

### Card Style
All content cards use **glassmorphism**:
- `backdrop-filter: blur(16px)`
- Semi-transparent dark background
- Purple-tinted border
- 3D perspective tilt on hover

---

## 💾 Data Storage

All portfolio data is stored in **browser localStorage** under the key `portfolioData`.

```
First visit  →  Default data from js/data.js seeded into localStorage
Admin edits  →  Saved to localStorage immediately
Next visit   →  localStorage data loaded (admin edits persist)
```

### Reset to Default Data
If you ever want to start fresh:
- **Admin Panel → Dashboard → "Reset to Defaults"** button

Or manually in browser DevTools:
```javascript
// Open browser console (F12) and run:
localStorage.removeItem('portfolioData');
location.reload();
```

---

## 📱 Responsive Design

| Breakpoint | Layout |
|---|---|
| Desktop (`> 768px`) | Full sidebar, multi-column grids |
| Tablet (`768px`) | Stacked grids, hidden sidebar |
| Mobile (`< 480px`) | Single column, hamburger nav |

---

## 👤 About the Developer

**Poovarasan VJ**  
3rd Year B.E. — Artificial Intelligence & Machine Learning  
Sree Sakthi Engineering College, Tamil Nadu, India

| Skill Area | Technologies |
|---|---|
| Primary | Python, C, Java, SQL |
| Web | HTML5, CSS3, JavaScript |
| AI/ML | Machine Learning, Computer Vision, NLP |
| Tools | VS Code, Git, GitHub, OpenCV |

**Career Goal:** Build practical AI/ML and web-development projects and develop skills for internships and future software/AI roles.

- 📧 Email: [poovarasanvj860@gmail.com](mailto:poovarasanvj860@gmail.com)
- 📞 Phone: [+91 70109999860](tel:+9170109999860)
- 💼 LinkedIn: [https://linkedin.com/in/poovarasan-p-2b506a377/](https://linkedin.com/in/poovarasan-p-2b506a377/)
- 🐙 GitHub: [https://github.com/Poovarasan701](https://github.com/Poovarasan701)

---

<div align="center">

Made with ❤️ by **Poovarasan VJ** | AI & ML Developer

</div>
