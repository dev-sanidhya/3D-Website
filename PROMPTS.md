# CH+ Partners — 3D scroll-world rebrand — Google Flow prompts

Adapted from the `scroll-world` skill (github.com/oso95/scroll-world), swapping its paid
Monid/Higgsfield render backend for **Google Flow** (Veo), which you'll run manually.

**Brand:** CH+ Partners — residential interior design, Hyderabad.
**Tagline used as hero line:** "Brilliant design. Simplicity at scale."
**Style:** Photoreal architectural (not clay-diorama) — full-bleed, dark premium backdrop,
matches the Apple-cinematic reference.
**Camera:** Architecture A — one continuous forward flight through the house, scene into
scene, no cuts, no reversal. This maps directly onto Flow's **Extend** feature: generate
scene 1, then keep hitting Extend with the next scene's prompt. Flow continues from the
actual last frame automatically, so seams stay frame-identical for free — no manual frame
extraction needed.

## Palette (keep byte-identical across every prompt below)

`linen #F4EFE7, charcoal #1C1712, brass #B08D57, clay #A9673F, sage #8B9A82`

## Style preamble (paste verbatim into every prompt, still or video)

```
Ultra-photorealistic architectural interior photography of a single cohesive residential
space, cinematic wide-angle lens, warm golden-hour light spilling through large windows,
natural materials — oak, linen, brass, stone — restrained minimalist Indian-contemporary
furnishings, a breathtaking considered view, editorial magazine quality (Architectural
Digest), shallow depth of field, no people, no text, no logos, no watermarks. Cohesive
palette of linen #F4EFE7, charcoal #1C1712, brass #B08D57, clay #A9673F, sage #8B9A82.
```

---

## Step 1 — Generate the starting still

Use Flow's image tool (or ImageFX / Nano Banana — same output works) to generate ONE
still. This becomes the "Frames to video" start image for Leg 0.

```
[STYLE PREAMBLE]
Subject: the grand entrance of a modern Hyderabad residence at golden hour — double-height
stone facade, a large dark timber door with brass hardware, a sculptural pendant light
glowing through the adjacent glass panel, minimalist landscaping either side.
Compose for the centre, a little headroom. Aspect ratio 16:9.
```

Save the result as `assets/stills/entrance.png` (also becomes the hero poster frame).

---

## Step 2 — The six legs (one continuous flight)

Generate these **in order**. Leg 0 is "Frames to video" using the still above as the start
frame. Every leg after that: open Leg *n-1*'s result in Flow and hit **Extend**, pasting
the next prompt — Flow will continue from its own last frame, which is exactly what keeps
the seam invisible.

### Leg 0 — Entrance (Frames to video, start image = `entrance.png`)

```
Single continuous cinematic camera move, no cuts. Begin outside, looking at the grand
entrance of the residence from a respectful distance. The camera slowly glides forward and
rises slightly, pushing through the open threshold as if walking inside, sweeping past the
front door toward the hallway beyond. As the camera crosses the threshold, the golden light
shifts into a soft, warm interior glow. In the final second, settle back into a slow,
steady forward glide toward the opening into the living room. [STYLE PREAMBLE]. Smooth,
graceful, slow motion, subtle parallax. No text, no captions.
```

### Leg 1 — Living room (Extend from Leg 0)

```
Single continuous cinematic camera move, no cuts. Continue the same slow, steady forward
glide. The camera drifts into the living room, pushing in close to the linen sofa and the
sculptural floor lamp, letting the golden light rake across the oak floor. In the final
second, settle back into a slow, steady forward glide toward the open doorway leading to
the kitchen. [STYLE PREAMBLE]. Smooth, graceful, slow motion, subtle parallax. No text, no
captions.
```

### Leg 2 — Kitchen & dining (Extend from Leg 1)

```
Single continuous cinematic camera move, no cuts. Continue the same slow, steady forward
glide. The camera moves into the kitchen and dining space, tracking low and level alongside
the stone island, brass fixtures catching the light, then rising gently to reveal the long
dining table beyond. In the final second, settle back into a slow, steady forward glide
toward the hallway leading to the primary suite. [STYLE PREAMBLE]. Smooth, graceful, slow
motion, subtle parallax. No text, no captions.
```

### Leg 3 — Primary suite (Extend from Leg 2)

```
Single continuous cinematic camera move, no cuts. Continue the same slow, steady forward
glide. The camera drifts into the primary suite, pushing in gently toward the platform bed
and the reading nook by the window, soft sage textiles catching the afternoon light. In the
final second, settle back into a slow, steady forward glide toward a door leading to the
design studio. [STYLE PREAMBLE]. Smooth, graceful, slow motion, subtle parallax. No text,
no captions.
```

### Leg 4 — The atelier / design studio (Extend from Leg 3)

```
Single continuous cinematic camera move, no cuts. Continue the same slow, steady forward
glide. The camera moves into the design studio, pushing in close to a table scattered with
fabric swatches and material samples until the detail nearly fills the frame, then easing
gently back. In the final second, settle back into a slow, steady forward glide toward a
bright opening ahead. [STYLE PREAMBLE]. Smooth, graceful, slow motion, subtle parallax. No
text, no captions.
```

### Leg 5 — The signature (finale, Extend from Leg 4)

```
Single continuous cinematic camera move, no cuts. Continue the same slow, steady forward
glide. The camera glides forward and the space dissolves toward a single sculptural console
vignette floating in soft dark space, brass and stone catching a warm spotlight, arriving
centered in front of it in a slow half-orbit. [STYLE PREAMBLE]. Smooth, graceful, slow
motion, subtle parallax. No text, no captions.
```

---

## Step 3 — What to send back to me

For each leg, download the clip and hand me the 6 files (any names are fine, just tell me
which is which, in order):

1. Entrance
2. Living room
3. Kitchen & dining
4. Primary suite
5. Atelier
6. Signature / finale

Plus the `entrance.png` still from Step 1.

I'll handle from there: extracting a poster frame for each scene, encoding/optimizing the
clips (GOP 8, faststart, no audio) with ffmpeg, and wiring them into `index.html` /
`scrub-engine.js`, which are already scaffolded in this folder.

## Notes if a leg comes out wrong

- **Angle drift**: Veo can rotate slightly on long extends — if a leg's last frame has
  visibly turned from a level view, regenerate that leg before extending further (a bad
  handoff frame poisons everything after it).
- **Reversal only mid-leg, never at a seam**: it's fine if the camera does something
  expressive mid-clip; the *first and last frame direction* is what must stay a forward
  glide, since that's what Extend chains on.
- **One session, one look**: don't restart the chain in a different Flow project/model
  version partway through — character drift between legs reads as a visible style pop even
  without a hard cut.
