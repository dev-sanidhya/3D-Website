// Landing hero: a cursor lens that reveals a finished house, a slow picture cycle, and press-to-open.
(function () {
  const hero = document.querySelector("[data-hero]");
  if (!hero) return;

  const stage = hero.querySelector(".hero-stage");
  const lens = hero.querySelector("[data-hero-lens]");
  const ring = hero.querySelector("[data-hero-ring]");
  const copy = hero.querySelector("[data-hero-copy]");
  const stacks = [...hero.querySelectorAll("[data-hero-stack]")].map((s) => [...s.querySelectorAll("img")]);
  const num = hero.querySelector("[data-hero-num]");
  const cap = hero.querySelector("[data-hero-cap]");
  const tip = hero.querySelector("[data-hero-tip]");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch = window.matchMedia("(hover: none)").matches;
  const labels = ["The villa, finished", "The front door", "The living room"];
  const N = stacks[0].length;

  // ---------- picture cycle ----------
  let idx = 0;
  function show(i) {
    idx = (i + N) % N;
    stacks.forEach((imgs) => imgs.forEach((im, k) => im.classList.toggle("is-on", k === idx)));
    num.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(N).padStart(2, "0")}`;
    cap.textContent = labels[idx] || "";
  }
  let timer = null;
  function startCycle() {
    if (timer || reduceMotion) return;
    timer = setInterval(() => show(idx + 1), 6500);
  }
  function stopCycle() {
    clearInterval(timer);
    timer = null;
  }

  // ---------- lens ----------
  let w = 0;
  let h = 0;
  let baseR = 190;
  function measure() {
    const r = stage.getBoundingClientRect();
    w = r.width;
    h = r.height;
    baseR = Math.max(110, Math.min(230, Math.min(w, h) * 0.26));
    if (!inited) {
      tx = cx = w * 0.7;
      ty = cy = h * 0.42;
      tr = cr = baseR;
      inited = true;
    }
  }
  let inited = false;
  let tx = 0, ty = 0, cx = 0, cy = 0, tr = 0, cr = 0;
  let lastMove = 0;
  let pressed = false;
  let visible = true;
  let running = false;
  const fullR = () => Math.hypot(w, h) * 1.05;

  function move(e) {
    const r = stage.getBoundingClientRect();
    tx = e.clientX - r.left;
    ty = e.clientY - r.top;
    lastMove = performance.now();
    if (!hero.classList.contains("has-pointer")) hero.classList.add("has-pointer");
    if (tip && !tip.dataset.done && lastMove > 0) tip.dataset.done = "1";
    kick();
  }
  function press(e) {
    pressed = true;
    hero.classList.add("is-pressed");
    move(e);
    kick();
  }
  function release() {
    pressed = false;
    hero.classList.remove("is-pressed");
    kick();
  }

  stage.addEventListener("pointermove", move, { passive: true });
  stage.addEventListener("pointerdown", press);
  window.addEventListener("pointerup", release);
  window.addEventListener("pointercancel", release);
  stage.addEventListener("pointerleave", () => {
    if (!touch) hero.classList.remove("has-pointer");
  });
  stage.addEventListener("contextmenu", (e) => e.preventDefault());

  function frame(now) {
    // With no pointer for a while, the lens drifts on its own so the page is never static.
    if (!reduceMotion && now - lastMove > 3500 && !pressed) {
      const t = now / 1000;
      tx = w * (0.5 + 0.3 * Math.sin(t * 0.37) + 0.08 * Math.sin(t * 1.1));
      ty = h * (0.42 + 0.2 * Math.cos(t * 0.29));
      if (touch) hero.classList.remove("has-pointer");
    }
    tr = pressed ? fullR() : baseR;
    const k = pressed ? 0.07 : 0.14;
    cx += (tx - cx) * 0.14;
    cy += (ty - cy) * 0.14;
    cr += (tr - cr) * k;

    lens.style.setProperty("--x", `${cx.toFixed(1)}px`);
    lens.style.setProperty("--y", `${cy.toFixed(1)}px`);
    lens.style.setProperty("--r", `${cr.toFixed(1)}px`);
    ring.style.transform = `translate(${cx.toFixed(1)}px, ${cy.toFixed(1)}px)`;

    if (!reduceMotion && copy) {
      const px = (cx / w - 0.5) * -16;
      const py = (cy / h - 0.5) * -8;
      copy.style.transform = `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px)`;
    }

    const settled = Math.abs(tx - cx) < 0.3 && Math.abs(ty - cy) < 0.3 && Math.abs(tr - cr) < 0.5;
    if (visible && (!settled || (!reduceMotion && now - lastMove > 3500))) {
      requestAnimationFrame(frame);
    } else {
      running = false;
    }
  }
  function kick() {
    if (running || !visible) return;
    running = true;
    requestAnimationFrame(frame);
  }

  window.addEventListener("resize", () => {
    measure();
    kick();
  });
  measure();
  show(0);

  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible) {
        startCycle();
        kick();
      } else {
        stopCycle();
      }
    }).observe(hero);
  }
  startCycle();
  kick();
})();
