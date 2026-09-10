// ============================================================
//  three-bg.js  —  Floating tech icon background
//  Badges for Python, AI/ML, and code symbols drift gently
//  through 3D space — a lighter, more playful take that still
//  fits an AI/ML & CSE portfolio.
// ============================================================

(function () {
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;

  const W = window.innerWidth, H = window.innerHeight;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 1000);
  camera.position.z = 90;

  const palette = [
    '#7c3aed', // purple
    '#06b6d4', // cyan
    '#3b82f6', // blue
    '#a855f7', // violet
    '#10b981', // emerald
  ];

  // ── Icon badge labels — tech stack + AI/ML + code symbols ────
  const ICONS = [
    'Py', 'AI', 'ML', 'C', 'SQL', 'JS', 'CSS', 'HTML',
    'NLP', 'CV', 'Git', 'VS', '</>', '{ }', '01', 'UI',
    'Java', 'AI', 'ML', 'Py', '</>', 'NLP', 'Git', '{ }'
  ];

  // ── Build a rounded-badge texture for a label ─────────────────
  function makeIconTexture(label, color) {
    const size = 160;
    const c = document.createElement('canvas');
    c.width = size; c.height = size;
    const ctx = c.getContext('2d');

    const r = 34;
    const pad = 14;
    ctx.clearRect(0, 0, size, size);

    // rounded square background
    ctx.beginPath();
    ctx.moveTo(pad + r, pad);
    ctx.arcTo(size - pad, pad, size - pad, size - pad, r);
    ctx.arcTo(size - pad, size - pad, pad, size - pad, r);
    ctx.arcTo(pad, size - pad, pad, pad, r);
    ctx.arcTo(pad, pad, size - pad, pad, r);
    ctx.closePath();

    ctx.fillStyle = color + '22'; // low-opacity fill (hex + alpha)
    ctx.fill();
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = color;
    ctx.stroke();

    // label text
    const fontSize = label.length > 3 ? 40 : 52;
    ctx.font = `bold ${fontSize}px 'Courier New', monospace`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = color;
    ctx.shadowBlur = 14;
    ctx.fillText(label, size / 2, size / 2 + 2);

    return new THREE.CanvasTexture(c);
  }

  // ── Spawn floating icon sprites ────────────────────────────────
  const BOUND_X = 150, BOUND_Y = 130, BOUND_Z = 70;
  const icons = [];

  ICONS.forEach((label) => {
    const color = palette[Math.floor(Math.random() * palette.length)];
    const tex = makeIconTexture(label, color);
    const mat = new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(mat);
    const scale = Math.random() * 5 + 9;
    sprite.scale.set(scale, scale, 1);
    sprite.position.set(
      (Math.random() - 0.5) * BOUND_X * 2,
      (Math.random() - 0.5) * BOUND_Y * 2,
      (Math.random() - 0.5) * BOUND_Z * 2
    );
    sprite.userData = {
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.045,
        (Math.random() - 0.5) * 0.045,
        (Math.random() - 0.5) * 0.03
      ),
      spin: (Math.random() - 0.5) * 0.006,
      floatPhase: Math.random() * Math.PI * 2,
      floatAmp: Math.random() * 3 + 1.5,
      baseScale: scale
    };
    scene.add(sprite);
    icons.push(sprite);
  });

  // ── Subtle background dust particles for depth ────────────────
  const DUST_COUNT = 180;
  const dustGeo = new THREE.BufferGeometry();
  const dustPositions = new Float32Array(DUST_COUNT * 3);
  const dustColors = new Float32Array(DUST_COUNT * 3);
  const paletteRGB = palette.map(hex => new THREE.Color(hex));

  for (let i = 0; i < DUST_COUNT; i++) {
    dustPositions[i * 3] = (Math.random() - 0.5) * 260;
    dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 220;
    dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 160 - 40;
    const c = paletteRGB[Math.floor(Math.random() * paletteRGB.length)];
    dustColors[i * 3] = c.r;
    dustColors[i * 3 + 1] = c.g;
    dustColors[i * 3 + 2] = c.b;
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
  dustGeo.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));
  const dustMat = new THREE.PointsMaterial({
    size: 1.4,
    vertexColors: true,
    transparent: true,
    opacity: 0.4,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  // ── Lights (kept for parity with rest of site's glow) ─────────
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const pointLight1 = new THREE.PointLight(0x7c3aed, 1.2, 220);
  pointLight1.position.set(60, 50, 60);
  scene.add(pointLight1);
  const pointLight2 = new THREE.PointLight(0x06b6d4, 1.2, 220);
  pointLight2.position.set(-60, -50, 60);
  scene.add(pointLight2);

  // ── Mouse parallax ───────────────────────────────────────────
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Scroll effect ────────────────────────────────────────────
  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; });

  // ── Animation loop ───────────────────────────────────────────
  let clock = 0;
  function animate() {
    requestAnimationFrame(animate);
    clock += 0.01;

    icons.forEach((s) => {
      const u = s.userData;
      s.position.add(u.velocity);

      // gentle bob
      s.position.y += Math.sin(clock + u.floatPhase) * 0.01;

      // slow spin via sprite material rotation
      s.material.rotation += u.spin;

      // breathing scale
      const breathe = 1 + Math.sin(clock * 0.8 + u.floatPhase) * 0.06;
      s.scale.set(u.baseScale * breathe, u.baseScale * breathe, 1);

      // wrap around bounds
      if (s.position.x > BOUND_X) s.position.x = -BOUND_X;
      if (s.position.x < -BOUND_X) s.position.x = BOUND_X;
      if (s.position.y > BOUND_Y) s.position.y = -BOUND_Y;
      if (s.position.y < -BOUND_Y) s.position.y = BOUND_Y;
      if (s.position.z > BOUND_Z) s.position.z = -BOUND_Z;
      if (s.position.z < -BOUND_Z) s.position.z = BOUND_Z;
    });

    dust.rotation.y += 0.0006;

    // Camera parallax
    camera.position.x += (mouseX * 8 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY * 8 - camera.position.y) * 0.04;
    camera.position.z = 90 - scrollY * 0.02;
    camera.lookAt(scene.position);

    // Pulsate point lights
    pointLight1.intensity = 1.2 + Math.sin(clock * 2) * 0.4;
    pointLight2.intensity = 1.2 + Math.cos(clock * 1.5) * 0.4;

    renderer.render(scene, camera);
  }
  animate();

  // ── Resize ───────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    const w = window.innerWidth, h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
})();
