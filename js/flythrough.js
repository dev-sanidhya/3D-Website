// Scroll-driven flythrough: draws a WebP frame sequence onto a sticky canvas.
(function () {
  const film = document.querySelector("[data-film]");
  if (!film) return;

  const CONFIG = {
    frames: 235,
    // Frame index where each stage starts; the last entry is the end of the film.
    stages: [0, 40, 81, 139, 235],
    // Horizontal focal point (0-1) used when the viewport is narrower than the frame.
    // The house sits right of centre until the camera swings to the front door.
    focal(i) {
      if (i < 139) return 0.62;
      if (i > 160) return 0.5;
      return 0.62 - ((i - 139) / 21) * 0.12;
    },
  };

  const canvas = film.querySelector(".film-canvas");
  const ctx = canvas.getContext("2d", { alpha: false });
  const fade = film.querySelector(".film-fade");
  const loader = film.querySelector(".film-loader");
  const hint = film.querySelector("[data-hint]");
  const intro = film.querySelector('[data-step="intro"]');
  const steps = [...film.querySelectorAll(".film-step")];
  const bar = film.querySelector(".film-progress i");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = window.matchMedia("(max-width: 760px)").matches;
  const saveData = navigator.connection && navigator.connection.saveData;
  const variant = small || saveData ? "m" : "d";
  const N = CONFIG.frames;
  const frames = new Array(N);
  const src = (i) => `assets/fly/${variant}/${String(i + 1).padStart(4, "0")}.avif`;

  // ---------- loading: coarse passes first so the whole film is scrubbable early ----------
  const order = [];
  const seen = new Uint8Array(N);
  for (const stride of [16, 8, 4, 2, 1]) {
    for (let i = 0; i < N; i += stride) {
      if (!seen[i]) {
        seen[i] = 1;
        order.push(i);
      }
    }
  }
  if (!seen[N - 1]) order.splice(1, 0, N - 1);

  let loaded = 0;
  let next = 0;
  const coarseCount = Math.ceil(N / 4);

  function loadOne() {
    if (next >= order.length) return;
    const i = order[next++];
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      frames[i] = img;
      loaded++;
      if (loaded <= coarseCount) loader.style.transform = `scaleX(${loaded / coarseCount})`;
      if (loaded === coarseCount) loader.style.opacity = "0";
      if (i === 0 || Math.abs(i - Math.round(current)) < 8) needsDraw = true;
      loadOne();
    };
    img.onerror = loadOne;
    img.src = src(i);
  }
  for (let k = 0; k < 6; k++) loadOne();

  function nearest(i) {
    if (frames[i]) return i;
    for (let d = 1; d < N; d++) {
      if (i - d >= 0 && frames[i - d]) return i - d;
      if (i + d < N && frames[i + d]) return i + d;
    }
    return -1;
  }

  // ---------- drawing ----------
  let cw = 0;
  let ch = 0;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    cw = Math.round(canvas.clientWidth * dpr);
    ch = Math.round(canvas.clientHeight * dpr);
    canvas.width = cw;
    canvas.height = ch;
    needsDraw = true;
  }

  function drawFrame(img, fx, alpha) {
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const s = Math.max(cw / iw, ch / ih);
    const w = iw * s;
    const h = ih * s;
    let dx = cw / 2 - w * fx;
    dx = Math.min(0, Math.max(cw - w, dx));
    const dy = (ch - h) / 2;
    ctx.globalAlpha = alpha;
    ctx.drawImage(img, dx, dy, w, h);
  }

  let ready = false;
  function draw(pos) {
    const fx = CONFIG.focal(pos);
    const timelapse = pos < CONFIG.stages[3];
    // The locked-off time-lapse dissolves between frames; camera moves stay crisp.
    const a = timelapse ? Math.floor(pos) : Math.round(pos);
    const ia = nearest(a);
    if (ia < 0) return;
    drawFrame(frames[ia], fx, 1);
    const frac = pos - a;
    if (timelapse && ia === a && frac > 0.04 && frames[a + 1]) drawFrame(frames[a + 1], fx, frac);
    ctx.globalAlpha = 1;
    if (!ready) {
      ready = true;
      film.classList.add("is-ready");
    }
  }

  // ---------- scroll mapping ----------
  const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
  const ramp = (v, a, b) => clamp((v - a) / (b - a));
  const bounds = CONFIG.stages.map((f) => f / (N - 1));

  let progress = 0;
  let target = 0;
  let current = 0;
  let needsDraw = true;

  function readScroll() {
    const rect = film.getBoundingClientRect();
    const span = rect.height - window.innerHeight;
    progress = clamp(-rect.top / span);
    target = progress * (N - 1);
  }

  function updateOverlays(p) {
    intro.style.opacity = 1 - ramp(p, 0.015, 0.05);
    intro.style.transform = `translateY(${-ramp(p, 0.015, 0.05) * 16}px)`;
    hint.style.opacity = 1 - ramp(p, 0, 0.02);

    steps.forEach((el, s) => {
      const a = bounds[s];
      const b = bounds[s + 1];
      const start = s === 0 ? 0.055 : a + 0.012;
      const end = s === steps.length - 1 ? 0.9 : b - 0.012;
      const o = Math.min(ramp(p, start, start + 0.025), 1 - ramp(p, end - 0.025, end));
      el.style.opacity = o;
      el.style.transform = `translateY(${(1 - o) * 14}px)`;
    });

    bar.style.transform = `scaleX(${p})`;

    const end = ramp(p, 0.9, 1);
    canvas.style.transform = `scale(${1 + end * 0.05})`;
    fade.style.opacity = ramp(p, 0.94, 1);
  }

  function tick() {
    const prev = current;
    current = reduceMotion ? target : current + (target - current) * 0.16;
    if (Math.abs(target - current) < 0.01) current = target;
    if (needsDraw || Math.abs(current - prev) > 0.001) {
      draw(current);
      needsDraw = false;
    }
    updateOverlays(progress);
    requestAnimationFrame(tick);
  }

  window.addEventListener("scroll", readScroll, { passive: true });
  window.addEventListener("resize", () => {
    resize();
    readScroll();
  });
  resize();
  readScroll();
  current = target;
  requestAnimationFrame(tick);
})();
