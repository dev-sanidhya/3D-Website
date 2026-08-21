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

---

# Villa concept — replacement walkthrough (exterior → interior → garden)

A second, alternative concept for the home page video: a contemporary Indian villa,
exterior-to-interior-to-garden, one continuous eye-level walkthrough. Same Flow workflow as
above (Frames to video for Leg 0, then Extend for every leg after) — this is a drop-in
replacement for the current entrance/living/kitchen clips, with an added exterior approach
and a garden/pool finale.

Practical note: Veo/Flow generates in ~8-second bursts. "One continuous camera move, no
cuts" describes the *result* you're chaining toward, not something you get from a single
generation — the leg-by-leg Extend chain below is how that continuity is actually achieved.
Do not try to paste the whole brief as one prompt into a single generation; it will
compress/skip spaces instead of walking through them in order.

## Palette (keep byte-identical across every prompt below)

`travertine #E4D9BE, warm stone #C7B18C, exposed concrete #9C978C, deep teak #5B4230, tropical green #3F5A41`

## Style preamble (paste verbatim into every prompt, still or video)

```
Photorealistic architectural photography of a contemporary Indian luxury villa, premium
Hyderabad-style residential architecture magazine aesthetic. Eye-level camera at
approximately 1.6m height, natural 24-28mm architectural lens. Warm late-afternoon
golden-hour sunlight, soft realistic shadows, physically accurate glass reflections,
realistic global illumination and indirect lighting. Natural materials only — warm
sandstone and pale travertine, exposed concrete, dark teak wood, large frameless glass.
Restrained tropical Indian landscaping: mature trees, manicured grass, stone paving,
a quiet courtyard. Minimal, sophisticated, quiet luxury. Subtle cinematic depth of field,
architecture kept sharp. No clutter, no excessive decoration, no gold, no marble-overload,
no ornate columns, no religious imagery, no stereotypical palace architecture, no
futuristic architecture. No people, no text, no logos, no signage, no cars. Architecture,
materials, furniture and spatial relationships stay physically consistent throughout.
Cohesive palette of travertine #E4D9BE, warm stone #C7B18C, exposed concrete #9C978C, deep
teak #5B4230, tropical green #3F5A41.
```

---

## Step 1 — Generate the starting still

```
[STYLE PREAMBLE]
Subject: the full exterior of a low, horizontal contemporary villa at golden hour, seen
from the front garden at eye level. Strong geometric volumes, deep roof overhangs, large
frameless glass openings, natural stone walls with warm wood accents, a wide pivot entrance
door in dark timber. Lush but restrained landscaping either side — native tropical planting,
manicured lawn, a stone pathway leading toward the door. Empty, no people, no cars. Compose
as a wide establishing shot with generous negative space above and around the villa. Aspect
ratio 16:9.
```

Save the result as `assets/stills/villa-exterior.png` — this becomes the "Frames to video"
start image for Leg 0, and doubles as the new hero poster frame.

---

## Step 2 — The four legs (one continuous walkthrough)

Generate in order. Leg 0 is "Frames to video" using `villa-exterior.png` as the start frame.
Every leg after: open the previous leg's result in Flow and hit **Extend**, pasting the next
prompt.

### Leg 0 — Approach & entrance (Frames to video, start image = `villa-exterior.png`)

```
Single continuous cinematic camera move, no cuts, no drone movement, no orbiting. The
camera glides forward at a slow, deliberate, constant speed at eye level, approaching the
villa's entrance. As it nears the door, the large timber pivot door slowly and naturally
swings open inward, well before the camera reaches it. The camera continues straight
through the doorway without slowing or stopping, the warm exterior light shifting into a
softer interior glow as it crosses the threshold. In the final second, settle into a slow,
steady forward glide toward the living room opening ahead. [STYLE PREAMBLE]. Extremely
smooth, no handheld shake, no sudden acceleration. No text, no captions.
```

### Leg 1 — Living room (Extend from Leg 0)

```
Single continuous cinematic camera move, no cuts. Continue the same slow, steady forward
glide, now inside a dramatic but understated living room — high ceilings, large windows,
natural stone flooring, sculptural furniture, warm timber, soft neutral fabrics, indirect
architectural lighting, a framed view of the garden through the glass. The camera drifts
forward through the space toward a second set of large internal wood-and-glass doors; as it
approaches, these doors slowly begin to open. In the final second, settle into a slow,
steady forward glide through the opening toward the dining area beyond. [STYLE PREAMBLE].
Extremely smooth, no handheld shake. No text, no captions.
```

### Leg 2 — Dining & kitchen (Extend from Leg 1)

```
Single continuous cinematic camera move, no cuts. Continue the same slow, steady forward
glide into an elegant dining area connected to a minimalist designer kitchen — natural
stone, warm wood cabinetry, concealed appliances, a large island, a sculptural dining table,
understated contemporary lighting. Same architectural language and material palette as
before. The camera moves forward toward another large opening at the far end; as it
approaches, those doors slowly open, revealing daylight and greenery beyond. In the final
second, settle into a slow, steady forward glide toward the garden opening. [STYLE
PREAMBLE]. Extremely smooth, no handheld shake. No text, no captions.
```

### Leg 3 — Garden & pool (finale, Extend from Leg 2)

```
Single continuous cinematic camera move, no cuts. Continue the same slow, steady forward
glide, exiting through the final opening into a serene private courtyard garden. Reveal a
long reflecting pool or understated swimming pool, natural stone paving, mature tropical
Indian landscaping, and the rear facade of the villa glowing in warm evening light. The
camera continues forward slightly and gently eases to a stop, settling into a composed wide
architectural view of the villa, garden and pool together. [STYLE PREAMBLE]. Extremely
smooth, no handheld shake, no sudden stop. No text, no captions.
```

---

## Step 3 — What to send back

For each leg, download the clip and hand back the 4 files in order:

1. Approach & entrance
2. Living room
3. Dining & kitchen
4. Garden & pool (finale)

Plus the `villa-exterior.png` still from Step 1.

Mapping onto the site: this is a 4-scene structure (vs. the current 3: entrance/living/
kitchen) — the extra scene is the garden/pool finale. Once the clips are in, wiring them
into `index.html` / `scrub-engine.js` means adding a fourth `sections[]` entry with its own
`still`/`clip`/`eyebrow`/`title`/`body`, and re-cutting each clip to whatever length works
for the scroll-scrub pacing (the current clips are trimmed to 8s each — same idea applies
here).
