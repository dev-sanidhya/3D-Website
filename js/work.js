// Lightbox for the Work page: click, arrow keys, swipe, Escape.
(function () {
  const dialog = document.querySelector("[data-lightbox]");
  const tiles = [...document.querySelectorAll(".tile")];
  if (!dialog || !tiles.length) return;

  const img = dialog.querySelector("[data-lb-img]");
  const caption = dialog.querySelector("[data-lb-caption]");
  const count = dialog.querySelector("[data-lb-count]");
  let index = 0;

  function show(i) {
    index = (i + tiles.length) % tiles.length;
    const tile = tiles[index];
    const thumb = tile.querySelector("img");
    img.src = thumb.currentSrc || thumb.src;
    img.alt = thumb.alt;
    const full = new Image();
    full.onload = () => {
      if (tiles[index] === tile) img.src = full.src;
    };
    full.src = tile.dataset.full;
    caption.textContent = thumb.alt;
    count.textContent = `${index + 1} / ${tiles.length}`;
  }

  tiles.forEach((tile, i) =>
    tile.addEventListener("click", () => {
      show(i);
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    })
  );

  dialog.addEventListener("close", () => {
    document.documentElement.style.overflow = "";
    tiles[index].focus({ preventScroll: true });
  });

  dialog.querySelector("[data-lb-prev]").addEventListener("click", () => show(index - 1));
  dialog.querySelector("[data-lb-next]").addEventListener("click", () => show(index + 1));
  dialog.querySelector("[data-lb-close]").addEventListener("click", () => dialog.close());

  // Clicking the dark backdrop (outside the photograph) closes the viewer.
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });

  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });

  let x0 = null;
  dialog.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
  dialog.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    x0 = null;
  });
})();
