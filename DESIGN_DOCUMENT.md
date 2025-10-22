# Der Papst der Tauben - Design Document

## The Divine Order of Crumbs

Long ago, the first pigeon found the Holy Bread of the Square, and from it arose the teaching that all crumbs are sacred. Each crumb embodies divine will — the gift of humans and the sign of destiny. The faithful believe that when enough crumbs are gathered, the Great Flight will begin, lifting the chosen pigeons to a sky beyond the clouds.

### Ages of Faith

-   **The Hungry Dawn** – The world before bread, when pigeons scavenged in silence.
-   **The Crumb Revelation** – The first miracle: infinite bread fell from a cafe table.
-   **The Holy Peck Wars** – Factions fought for crumb supremacy; seagulls declared themselves heretics.
-   **The Urban Ascension** – Rooftops became temples; Faith spread across antennas.
-   **The Coming of the Papst der Tauben** – You, the Chosen, bring order and absurd divinity.

### Factions & Philosophy

| Faction            | Belief                                      | Visual Symbol             |
| ------------------ | ------------------------------------------- | ------------------------- |
| Order of the Crust | Humans are gods; all crumbs divine          | Golden halo of bread slice|
| Wings of Silence   | Reject human crumbs, seek internal faith    | Feather spiral emblem     |
| Seagull Dominion   | Consume all; chaos is holy                  | Blood-red feather mark    |
| Holy Nestkeepers   | Preserve relics and balance                 | Bread wreath sigil        |

*Each faction has unique doctrine cards, relics, and rival events in gameplay.*

---

## 🎬 ANIMATION BLUEPRINTS

### General Style

-   **Frame rate**: 12 fps for idle, 24 fps for action sequences.
-   **Animation Toolchain**: Aseprite / Godot / Piskel / Unity 2D.
-   **Loop length**: 8–12 frames average per action.
-   **Color depth**: 16-bit retro.

### Core Character Cycles

| Name              | Frames | Description                                      |
| ----------------- | ------ | ------------------------------------------------ |
| Idle Coo          | 4      | Slight head bob, wing rustle, subtle coo sound.    |
| Peck Loop         | 5      | Sharp downward motion, crumb pickup particle.    |
| Flap Hover        | 6      | Quick wings, small vertical bob.                 |
| Ritual Chant      | 8      | Eyes glow, halo pulse, feathers rise slightly.   |
| Collapse / Ascend | 10     | Wings fade upward or downward, feather particles.|

### Faith Burst Effect

-   **Sprite Layers**: Halo → Feather Burst → Light Gradient → Particle Sparks.
-   **Timing**: 0.4s charge → 0.2s burst → 1s fade.
-   **Sound Sync**: Coo harmony + shimmer tone.

### Environmental Animations

-   Floating crumbs (slow sine-wave motion).
-   Glowing candles (frame flicker intensity 90–110%).
-   Moving clouds (horizontal parallax, 0.5 px per frame at 1080p).

---

## 🎨 SPRITE CREATION GUIDE

### Resolution Grid

-   **Pigeon base**: 32×32 px.
-   **Follower variation**: 24×24 px.
-   **Rival pigeon**: 36×36 px.
-   **Relics**: 40×40 px.
-   **Cards & icons**: 128×96 px.

### Suggested Layers per Sprite

-   Base pigeon shape (gray tones)
-   Wing overlay (for animation)
-   Eye & beak details
-   Clothing / accessories (papal hat, relics)
-   Lighting highlights (faith glow)

### Color Palettes

| Category         | Color          | Hex      |
| ---------------- | -------------- | -------- |
| Base gray        | Base gray      | #C3C3C3  |
| Feather shadow   | Feather shadow | #8A8A8A  |
| Bread gold       | Bread gold     | #DDAA44  |
| Faith aura       | Faith aura     | #F6E89E  |
| Relic glow       | Relic glow     | #FFF9C6  |
| Sky blue         | Sky blue       | #A5D0E5  |

### Relic Icons

-   **Golden Feather** → rotating reflection shine.
-   **Blessed Crumb** → pulse every 2 seconds.
-   **Papal Hat of Hope** → gentle hovering wobble.
-   **Holy Nest** → feathers orbit in small loop.

---

## 🕹️ CUTSCENE GUIDE

### Intro Scene (The Revelation)

-   **Visual**: The Papst appears under a golden sky; a single crumb lands at his feet.
-   **Action**: 5 pigeons kneel, light radiates outward.
-   **Effect**: fade-in text: “Thus begins the age of crumbs.”

### Midgame (Rival Invasion)

-   **Visual**: Seagulls descend from the sky, lightning behind.
-   **Action**: card deck flashes, “Heretic Challenge” overlay.
-   **Effect**: ambient coo fades to storm wind.

### Ascension Ending

-   **Visual**: camera pans upward, pigeons flying through golden clouds.
-   **Action**: Papst dissolves into light.
-   **Effect**: fade out, subtle organ music.

---

## 🧠 AI SPRITE GENERATION PROMPTS

### Base Pigeon Sprite:
```
pixelart sprite of a pigeon facing right, 32x32 pixels, neutral stance, gray feathers, small golden halo, subtle shading.
```

### Pigeon Pope Sprite:
```
pixelart 32x32 pigeon wearing papal hat, small cape, glowing eyes, tiny loaf of bread in claws, pastel color palette.
```

### Rival Pigeon Sprite:
```
pixelart 36x36 dark pigeon with glowing purple halo, angry expression, torn feathers, gritty shading.
```

### Relic Icons:
```
pixelart relic icon of [NAME], glowing aura, ornate edges, retro divine style, 40x40 pixels.
```

### Backgrounds:
```
pixelart rooftop city scene, soft clouds, urban temples, pigeons perched, calm divine tone, 16:9 aspect.
```

---

## 📈 FUTURE VISUAL ADDITIONS

-   Animated Relic Altars with hovering crumbs.
-   Mini pixel comic panels for lore unlocks.
-   “Faith Flashbacks” — playable cutscenes from past ages.
-   Hidden idle Easter eggs (e.g., pigeon DJs or graffiti of the Holy Loaf).

### Tone & Goal

-   **Tone**: solemnly funny, cinematic yet silly.
-   **Goal**: every feather, crumb, and flicker should feel sacred — yet ridiculous enough to laugh at.
