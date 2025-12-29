# How It Works Section V6 — Design Specification

**Route:** `/` (Home Page)
**Component:** `ProcessShowcase`
**Concept:** "The Lifecycle of Intelligence" — A scroll-triggered interactive walkthrough.
**Vibe:** Sophisticated, Transparent, High-Efficiency.

---

## 🎨 Typography, Color & Theme

### Typography Hierarchy
- **Section Label:** `Inter` Semibold, 10px. Emerald-500 (#10b981), All-caps, 0.2em tracking.
- **Main Headline:** `Playfair Display`, 56px. Semi-bold. Navy-900 (#0a0a0f). 
- **Step Numbers:** `Playfair Display`, 32px. Italic. Used as "01.", "02.", "03.".
- **Step Titles:** `Inter` Bold, 24px. Tracking -0.01em.
- **Descriptions:** `Inter` Regular, 16px. Leading 1.7. Slate-500 (#64748b).

### Color Palette
- **Canvas:** #FFFFFF (Pure White)
- **Active Stroke:** #0a0a0f (Deep Navy)
- **Inactive Fill:** #F8FAFC (Light Slate)
- **Accent Glow:** rgba(16, 185, 129, 0.05) (Emerald tint for the "Dashboard" phase)

---

## 📐 Spatial Composition & Wireframe

### Layout Logic (Desktop 1440px)
- **Sticky Left Panel (45%):** The headline and step text remain fixed as the user scrolls.
- **Scrolling Right Panel (55%):** High-fidelity browser mockups slide in/out or cross-fade based on scroll depth.
- **Spacing:** 160px vertical padding between sections. 80px gutter between panels.

### Stage 1: The Scope Wizard
- **Visual:** A browser chrome window showing a minimalist "Project Scope Wizard".
- **Interaction:** Selecting "AI Product" (Orange highlight).
- **Detail:** Subtle shadow (0 20px 50px rgba(0,0,0,0.08)).

### Stage 2: The AI Blueprint
- **Visual:** A technical document layout with a "Budget Approved" green badge.
- **Interaction:** Animated lines drawing the roadmap architecture.

### Stage 3: The Operational Dashboard
- **Visual:** A 3-panel agency dashboard (mirroring the app itself).
- **Interaction:** Floating cards for "Proposal", "Wireframes", and "Architecture".

---

## 🎬 Motion: Scroll Interactivity

### 1. The Progressive Reveal
- As the user enters the 300vh scroll zone, the left-side text "1. Scope" is 100% opacity. 
- Steps 2 and 3 are at 10% opacity.
- As the scroll progresses to 33%, Step 1 fades out, and Step 2 highlights.

### 2. Mockup Transition Logic
- **Enter:** Slide up 40px + Fade in.
- **Exit:** Slide up -20px + Fade out.
- **Timing:** 0.6s ease-out-cubic.

### 3. The "Drawing Line" (Vertical)
- A thin 1px line connects the numbers 1, 2, and 3. 
- The line "fills" with Emerald color as the user scrolls down, acting as a progress indicator.

---

## 🌌 Backgrounds & Visual Details

### The Browser Chrome
- macOS-style dots (Red, Yellow, Green) but desaturated to match the luxury theme.
- 12px border radius.
- No heavy borders; 1px light gray stroke only.

### Decorative Elements
- Faint halftone dots behind the mockups to create a "Blueprint" engineering feel.
- Subtle grain overlay on the mockup screenshots to give them a matte, editorial texture.

---

## 🤖 Multistep Prompts for Implementation

### Phase 1: Structural Wireframe
> "Create a 300vh scroll container. On the left, a sticky panel (h-screen) containing a section label 'HOW IT WORKS', an H2 'The smarter way to build your startup', and a list of three steps: Scope, Blueprint, Dashboard. Ensure the left panel uses Playfair Display for headers and Inter for body. On the right, create a relative container to hold the mockups."

### Phase 2: Interactivity & State
> "Implement scroll-position tracking using a React hook. Divide the 300vh scroll into three zones (0-33%, 34-66%, 67-100%). Create a state variable `activeStep`. When `activeStep` changes, update the opacity of the left-side text links and trigger the enter/exit animations for the right-side browser mockups."

### Phase 3: High-Fidelity Mockups
> "Design three browser-frame components. Frame 1: A Scope Wizard with rounded pill buttons. Frame 2: A document view with a skeleton UI representing an AI Roadmap. Frame 3: A compact 3-panel dashboard with icons for Assets and Architecture. Apply a 20px backdrop blur to the browser chrome headers and a soft drop shadow to the frames."

### Phase 4: Polish & Refinement
> "Add a vertical progress line on the left that fills from top to bottom as the user scrolls. Implement a 'parallax' effect where the mockups move at 1.1x scroll speed while the left text stays at 1.0x. Add a subtle Emerald glow behind the 'Dashboard' mockup to signify high intelligence/completion."

---

## ✅ Success Criteria
- [ ] Left text remains perfectly readable throughout the scroll.
- [ ] Transitions between mockups are buttery smooth (60fps).
- [ ] The "Calm Luxury" aesthetic is maintained via high whitespace (at least 200px between major visual groups).
- [ ] Mobile view: Sticky layout is disabled; steps and mockups stack vertically in a standard flow.
