// Shared behaviour: reveal-on-scroll, header colour per section, practice image swap, footer year.
(function () {
  const items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add("is-in"));
  }

  // Header text follows the theme of whichever section sits under it.
  const header = document.querySelector("[data-header]");
  const themed = [...document.querySelectorAll("[data-theme]")];
  function headerTheme() {
    if (!header || !themed.length) return;
    const y = 40;
    let light = false;
    for (const el of themed) {
      const r = el.getBoundingClientRect();
      if (r.top <= y && r.bottom > y) {
        light = el.dataset.theme === "light";
        break;
      }
    }
    header.classList.toggle("is-light", light);
    const film = document.querySelector("[data-film]");
    header.classList.toggle("on-film", !!film && film.getBoundingClientRect().bottom > y);
  }

  // Practice: swap the pinned image to match the discipline nearest the middle of the screen.
  const media = document.querySelector("[data-practice-media]");
  const disciplines = [...document.querySelectorAll("[data-discipline]")];
  const pics = media ? [...media.querySelectorAll("img")] : [];
  let active = 0;
  function practice() {
    if (!pics.length) return;
    const mid = window.innerHeight * 0.5;
    let best = active;
    let bestD = Infinity;
    disciplines.forEach((d, i) => {
      const r = d.getBoundingClientRect();
      const dist = Math.abs(r.top + r.height / 2 - mid);
      if (dist < bestD) {
        bestD = dist;
        best = i;
      }
    });
    if (best !== active) {
      pics[active].classList.remove("is-on");
      pics[best].classList.add("is-on");
      active = best;
    }
  }

  let queued = false;
  function onScroll() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      headerTheme();
      practice();
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
