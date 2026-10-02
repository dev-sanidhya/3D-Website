# CH+ Partners website

The site combines a scroll-driven homepage with the studio's service pages based on Apple design principle and a project-based interior gallery.

## Pages and assets

- `index.html` and `scrub-engine.js` drive the scroll-controlled home sequence. Poster stills appear before video frames are ready.
- `about.html`, `services.html`, `projects.html`, `testimonials.html`, `contact.html`, `privacy.html` and `terms.html` are the supporting pages.
- `gallery.html`, `gallery.js` and `gallery-data.js` render project cards, photo stories and the full-screen photo viewer.
- `assets/gallery/` keeps the original JPGs. `assets/gallery/optimized/` holds the smaller WebP card and grid images; the viewer opens the original JPG.
- `assets/stills/` and `assets/vid/` hold the homepage posters and video clips.

## Adding gallery photos

Keep original JPGs in `assets/gallery/`, then generate or refresh their WebP thumbnails with:

```bash
python -m pip install Pillow
python optimize_gallery_images.py
```

Add each photo to the appropriate project's `photos` array in `gallery-data.js` with its original pixel dimensions and a useful alt description. Add new projects there with a unique `id`, a `coverId`, descriptive title and copy, and an ordered photo list. Project titles currently describe the two supplied image sets; replace them with the studio's official names when available.

## Local preview

Run a static server from this directory, for example:

```bash
python -m http.server 8123
```

Then open `http://localhost:8123`. Python's simple server does not support byte-range requests for MP4 files, so use a range-capable server when measuring video transfer or seeking performance.
