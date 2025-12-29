# Hero Section V6 — Design Specification

**Route:** `/` (Home Page)
**Concept:** "The Orbital Hub" — Visualizing the orchestration of AI intelligence.
**Vibe:** Luxury, High-End, Editorial, Engineering Excellence.

---

## 🎨 Typography, Color & Theme

### Typography Hierarchy
- **Headline (H1):** `Playfair Display`, 72px (Desktop). Bold, tracking -0.02em. Use high-contrast white against navy.
- **Subheadline:** `Inter`, 20px. Light (300) weight, leading 1.6. Color: Slate-400 (#94a3b8).
- **Badge:** `Inter` Semibold, 10px. All-caps, tracking 0.2em. Glassmorphism background.
- **CTA Text:** `Inter` Bold, 14px. All-caps, tracking 0.1em.

### Color Palette
- **Deep Void:** #050508 (Base Background)
- **Agency Emerald:** #10b981 (Primary Accent / Glow)
- **Starlight White:** #ffffff (Primary Text)
- **Glass Border:** rgba(255, 255, 255, 0.08)

---

## 📐 Spatial Composition (Desktop 1440px)

### Left Zone (45% Width)
- **Alignment:** Left-aligned, vertically centered.
- **Stacking:** 
  1. Production Badge (Top)
  2. Headline (Split into 3 lines)
  3. Subheadline (Max-width 540px)
  4. Dual CTAs (Emerald Primary / Ghost Secondary)
  5. Trust Ticker (Small, at the bottom)

### Right Zone (55% Width)
- **Visual Center:** Central AI Globe (320px diameter).
- **Orbital System:** A series of 3 concentric, faint dotted rings.
- **Icon Nodes:** 8 glassmorphism circles (64px) placed along the outermost ring.
- **Depth:** Central globe sits on a slightly different parallax plane than the orbital rings.

---

## 🎬 Motion & Animations

### 1. The Word-by-Word Reveal
- **Headline:** Each word fades in and slides up 15px with a 0.08s stagger.
- **Highlight:** The phrase "Real Revenue" uses a text-clipping gradient (Emerald to Cyan).

### 2. The Orbital Logic
- **Outer Ring:** Rotates clockwise 360° every 60 seconds (Linear).
- **Inner Icons:** Use a counter-rotation logic so the icons themselves remain "upright" while their container orbits the center.
- **Hover Interaction:** Hovering an icon pauses the orbit, scales the icon to 1.2x, and reveals a tiny glowing connector line to the central globe.

### 3. The Central AI Globe
- **Visual:** A wireframe globe with a halftone texture.
- **Pulse:** Subtle 2s breathing animation (Scale 1.0 to 1.03).
- **Neural Activity:** Random "spark" particles move along the wireframe paths using SVG path animation.

---

## 🌌 Background & Visual Details

### Layer 1: Gradient Mesh
- A slow-moving radial gradient mesh in the background. 
- Top-Left: #0a1628 (Deep Blue)
- Bottom-Right: #050505 (Noir)
- Center-Right: A faint Emerald glow (#10b981 at 5% opacity).

### Layer 2: Noise & Particles
- 5% Grain/Noise overlay to prevent color banding and add an editorial texture.
- Subtle white particles drifting upwards (20-30px/sec).

---

## 🤖 Multistep Prompts for Implementation

### Prompt 1: The Typography & Layout
> "Create a Hero container (100vh). On the left, place a Badge '⚡ PRODUCTION-READY AI' with a 12px backdrop blur. Below, implement an H1 using Playfair Display: 'Build Intelligent AI Products, Agents & Automation'. Apply a word-by-word reveal animation using Framer Motion. Below, a subheadline in Slate-400 and two large buttons with 12px border radius. Ensure the layout is responsive, stacking on mobile."

### Prompt 2: The Orbital Icon System
> "Build a React component for the Orbital system. A central 320px circle with a radial gradient. Create an outer SVG path (circle) with a stroke-dasharray to make it look dotted. Place 8 icons along this path at 45-degree intervals. Implement a continuous rotation animation. Use counter-rotation so icons stay vertical. On hover, the animation should pause and the hovered icon should scale up with a shadow glow."

### Prompt 3: The Animated AI Globe
> "Design the central AI logo as an SVG wireframe globe. Use a halftone pattern fill for the continents. Add a 'breathing' animation using scale transforms. Implement 'Neural Sparks'—small SVG circles that animate along the longitude/latitude paths of the globe on a random loop. The entire component should sit inside a glassmorphism container with 30px blur."

---

## ✅ Success Criteria
- [ ] Section fills 100vh without scrolling.
- [ ] Headline communicates the 8-week launch promise instantly.
- [ ] Orbital motion is smooth (60fps) and non-distracting.
- [ ] Mobile view collapses to a single column with the Globe centered at the top.
