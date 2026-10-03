# CH+ Partners website

The site combines a scroll-driven homepage with the studio's service pages and a project-based interior gallery.

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

Add each photo to the appropriate project's `photos` array in `gallery-data.js` with its original pixel dimensions and a useful alt description. Add a project there with a unique `id`, a `coverId`, description, and ordered photo list. The current 33 supplied JPGs have generic filenames and no official project metadata. They are grouped into three numbered albums by their continuous source sequence and visual content; the numbers are neutral labels, not the studio's official project names. Replace the neutral labels after the studio maps the photos to its named projects.

## Local preview

Run the range-capable preview server from this directory:

```bash
python preview_server.py --port 8123
```

Then open `http://localhost:8123`. The server supports HTTP byte ranges for MP4 files so scroll scrubbing behaves like it does on the production static host.
