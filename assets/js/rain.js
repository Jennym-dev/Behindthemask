/* ==========================================================================
   Neon rain — animated rain + road splashes drawn over the background art.
   Taken from neon-rain.html; the canvas is created by site.js.
   Tweak CFG to change the weather. Respects "reduce motion" and pauses
   automatically when the tab is hidden.
   ========================================================================== */
(() => {
  const CFG = {
    amount: 1,      // rain density multiplier (0.5 = lighter, 2 = storm)
    wind: 0.16,     // slant: sideways travel per unit of fall (negative = other way)
    speed: 1,       // fall speed multiplier
    splashes: 1,    // ripples on the wet road; 0 = off
    groundY: 0.63   // where the road begins, as a fraction of image height
  };

  const cv = document.getElementById('rain');
  if (!cv) return;

  const W = 1672, H = 941;
  const ctx = cv.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rnd = (a, b) => a + Math.random() * (b - a);

  // ---------- falling streaks: far, middle, near ----------
  const LAYERS = [
    { n: 420, len: [10, 22],  v: [700, 950],   w: 0.8, a: [0.06, 0.16] },
    { n: 220, len: [24, 46],  v: [1100, 1500], w: 1.1, a: [0.10, 0.26] },
    { n: 46,  len: [60, 120], v: [1900, 2600], w: 1.8, a: [0.08, 0.18] }
  ];
  const drops = [];
  function reset(d, anywhere) {
    const L = d.L;
    d.len = rnd(L.len[0], L.len[1]);
    d.v = rnd(L.v[0], L.v[1]);
    d.a = rnd(L.a[0], L.a[1]);
    d.x = rnd(-W * 0.25, W * 1.1);
    d.y = anywhere ? rnd(-H * 0.2, H) : rnd(-H * 0.3, -d.len);
  }
  LAYERS.forEach(L => {
    for (let i = 0; i < Math.round(L.n * CFG.amount); i++) { const d = { L }; reset(d, true); drops.push(d); }
  });

  function drawRain(dt) {
    ctx.lineCap = 'round';
    for (const L of LAYERS) {
      ctx.lineWidth = L.w;
      for (const d of drops) {
        if (d.L !== L) continue;
        d.y += d.v * CFG.speed * dt;
        d.x += d.v * CFG.speed * CFG.wind * dt;
        if (d.y - d.len > H) reset(d, false);
        ctx.strokeStyle = `rgba(196,212,255,${d.a})`;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - d.len * CFG.wind, d.y - d.len);
        ctx.stroke();
      }
    }
  }

  // ---------- ripples and splashes on the road ----------
  const G0 = H * CFG.groundY;
  const rings = [];
  let spawnDebt = 0;
  function spawnRing() {
    const k = Math.pow(Math.random(), 0.6);       // bias toward the foreground
    const y = G0 + 12 + k * (H - G0 - 12);
    const depth = (y - G0) / (H - G0);            // 0 far … 1 near
    rings.push({ x: rnd(0, W), y, depth, age: 0, life: rnd(0.35, 0.7), r: 4 + depth * 22, jump: Math.random() < 0.55 });
  }

  function drawRings(dt) {
    spawnDebt += dt * 150 * CFG.amount * CFG.splashes;
    while (spawnDebt >= 1) { spawnRing(); spawnDebt--; }
    ctx.globalCompositeOperation = 'lighter';
    for (let i = rings.length - 1; i >= 0; i--) {
      const s = rings[i];
      s.age += dt;
      const p = s.age / s.life;
      if (p >= 1) { rings.splice(i, 1); continue; }
      const a = (1 - p) * (0.10 + s.depth * 0.22);
      const r = s.r * (0.25 + p * 0.75);
      ctx.strokeStyle = `rgba(190,205,255,${a})`;
      ctx.lineWidth = 0.6 + s.depth * 0.9;
      ctx.beginPath();
      ctx.ellipse(s.x, s.y, r, r * 0.3, 0, 0, Math.PI * 2);
      ctx.stroke();
      if (s.jump && p < 0.45) {                   // tiny crown splash
        const h = Math.sin(p / 0.45 * Math.PI) * (3 + s.depth * 12);
        ctx.strokeStyle = `rgba(215,225,255,${a * 1.6})`;
        ctx.beginPath();
        ctx.moveTo(s.x - r * 0.35, s.y); ctx.lineTo(s.x - r * 0.6, s.y - h);
        ctx.moveTo(s.x + r * 0.35, s.y); ctx.lineTo(s.x + r * 0.6, s.y - h);
        ctx.moveTo(s.x, s.y);            ctx.lineTo(s.x, s.y - h * 1.2);
        ctx.stroke();
      }
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  // ---------- loop ----------
  function step(dt) {
    ctx.clearRect(0, 0, W, H);
    if (CFG.splashes) drawRings(dt);
    drawRain(dt);
  }

  if (reduce) {                                   // one still frame of rain
    for (let i = 0; i < 30; i++) step(0.016);
    return;
  }

  let prev = performance.now();
  function tick(now) {
    const dt = Math.min(0.05, (now - prev) / 1000);
    prev = now;
    step(dt);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
