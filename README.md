# CH+ Partners — 3D scroll-world rebrand

A scroll-driven cinematic landing page for [chpluspartners.com](https://chpluspartners.com/)
(residential interior design, Hyderabad), built with the
[`scroll-world`](https://github.com/oso95/scroll-world) technique: scroll drives a single
continuous camera flight through a photoreal AI-rendered home, no cuts.

Adapted to use **Google Flow** instead of the skill's default paid Monid/Higgsfield
backend — see [`PROMPTS.md`](./PROMPTS.md) for the exact prompts to run there.

## Status

Scaffold only. Waiting on 6 rendered clips + 1 still from Google Flow (see `PROMPTS.md`
Step 3) before the page has real visuals.

## Structure

```
index.html          — the page (config-driven, see mountScrollWorld call at the bottom)
scrub-engine.js      — portable vanilla-JS scroll-scrub engine (from scroll-world skill)
PROMPTS.md           — Google Flow prompts, in order, for every scene
assets/
  stills/            — poster frame per scene (first frame of each clip)
  vid/               — the 6 rendered .mp4 clips
```

## Once you have the Flow clips

Hand them to me in order (entrance → living → kitchen & dining → primary suite → atelier →
finale) and I'll:
1. Extract poster stills from each clip's first frame
2. Re-encode at GOP 8, crf 20, faststart, no audio (ffmpeg)
3. Drop everything into `assets/` matching the paths already wired in `index.html`
4. Serve it locally and QA the seams

## Local preview

Any static file server works, e.g.:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.
