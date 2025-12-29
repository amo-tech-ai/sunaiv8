
# SUN AI AGENCY — HOME PAGE REBUILD STRATEGY

## ROLE
**Principal Product Designer + UX Architect**.
This document outlines the exact specification to rebuild the Sun AI Agency home page (`/`), extracting the "Editorial Luxury" design system established in the codebase.

---

## STEP 0 — GLOBAL EXTRACTION (DESIGN SYSTEM)

### 🎨 Design Tokens

**Color Palette**
- **Deep Void:** `#050508` (Primary Background - Dark)
- **Starlight White:** `#FFFFFF` (Primary Background - Light)
- **Snow Slate:** `#FAFAFA` (Secondary Background - Light)
- **Agency Emerald:** `#10B981` (Primary Accent - Success/Growth)
- **Signal Orange:** `#FF6B2C` (Secondary Accent - Velocity/Urgency)
- **Celestial Navy:** `#0A1628` (Text/Contrast)
- **Glass Border:** `rgba(255, 255, 255, 0.08)`

**Typography System**
- **Headlines:** `Playfair Display` (Serif).
  - H1: 72px / -0.02em tracking / Bold.
  - H2: 56px / -0.01em tracking / SemiBold.
- **Body/UI:** `Inter` (Sans-Serif).
  - Subhead: 20px / Light (300).
  - Label: 10-11px / Bold (700) / Uppercase / 0.2em tracking.
  - Body: 16px / Regular (400) / 1.6 leading.

**Grid & Spacing**
- **Container:** Max-width `1440px` (7xl).
- **Padding:** `px-8` (Horizontal), `py-32` (Vertical Section Spacing).
- **Gutter:** `gap-8` to `gap-20` depending on density.

**Motion Language**
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` (Editorial ease).
- **Duration:** Slow luxury feel (700ms - 1000ms).
- **Reveal:** Staggered `translate-y` + `fade-in` via IntersectionObserver.
- **Scroll:** Sticky headers, drawing lines, and progress bars.

### 🧩 Component Inventory
1.  **Orbital Node:** Circular glassmorphism icon container with rotation logic.
2.  **Stat Card:** High-padding card with animated counters.
3.  **Timeline Step:** Vertical/Horizontal connector logic with SVG icons.
4.  **Browser Frame:** MacOS-style window container for product mockups.
5.  **Ghost Cursor:** CSS-animated cursor for demo simulation.
6.  **Gradient Button:** Text-gradient or background-gradient actions.

---

## STEP 1 — SITEMAP & FLOW

### Section Order (Top-to-Bottom)
1.  **Header**: Sticky, glassmorphism, logo + nav + "Start Project" CTA.
2.  **Hero**: "Real Revenue" promise + Orbital Animation.
3.  **How It Works**: Sticky scroll container (Scope -> Blueprint -> Dashboard).
4.  **What We Build**: 4-column grid of capabilities (Cards).
5.  **Tech Stack**: Dark section list of tools (Gemini, Supabase, etc.).
6.  **Metrics**: Split layout (Counters vs Charts).
7.  **Velocity System**: 8-week timeline visualization.
8.  **CTA Section**: "Ready to Build" final conversion block.
9.  **Partners**: Monochrome logo ticker.
10. **Footer**: Navigation columns + Legal.

### Mermaid Diagram
```mermaid
flowchart TD
  A[Header] --> B[Hero Section]
  B --> C[How It Works (Scroll)]
  C --> D[What We Build (Grid)]
  D --> E[Tech Stack (Dark)]
  E --> F[Metrics & Results]
  F --> G[Velocity System (Timeline)]
  G --> H[Final CTA]
  H --> I[Partners]
  I --> J[Footer]
```

---

## STEP 2 — HERO SECTION PROMPT

**Goal:** Establish authority immediately.
**Visual:** Split layout (Text Left / Orbit Right).

### Prompt Specification
> "Build a Hero section (min-h-screen). Left side: 'Production-Ready AI' badge (Gray/Orange). H1: 'Build Intelligent AI Products...' with word-by-word stagger reveal. Subhead: 'Sun AI designs and launches...'. Two buttons: 'Start Project' (Navy) and 'Talk to Expert' (Ghost). Right side: An interactive 'Orbital System'. Center node is a glowing AI globe. Surrounding are 8 orbiting icons (NLP, Cloud, Data) on a 60s rotation loop. Hovering icons pauses orbit. Background: Subtle noise + gradient mesh."

---

## STEP 3 — HOW IT WORKS PROMPT

**Goal:** Explain the methodology via interaction.
**Visual:** Sticky Left Panel + Scrolling Right Mockups.

### Prompt Specification
> "Create a sticky-scroll section (400vh height). Left panel (Sticky): H2 'The smarter way to build'. List 3 steps: 1. Scope, 2. Blueprint, 3. Dashboard. As user scrolls, update active step style (Opacity/Color). Right panel (Scroll): Render a 'Browser Frame' component that transitions its content based on the active step. Step 1 shows a Wizard UI. Step 2 shows a Blueprint Doc. Step 3 shows the Agency Dashboard. Add a 'Ghost Cursor' that moves between UI elements during transitions."

---

## STEP 4 — WHAT WE BUILD PROMPT

**Goal:** Showcase breadth of capability.
**Visual:** 4-Column Card Grid.

### Prompt Specification
> "Create a 'What We Build' section. White background. Header: 'OUR EXPERTISE' (Emerald eyebrow). Grid: 8 cards. Each card contains a large Emerald-tinted icon container (56px), an H3 title (17px), and description text. Hover effect: Card lifts -4px, shadow deepens, and icon container background darkens slightly. Stagger the entrance of cards by 80ms each."

---

## STEP 5 — TECH STACK PROMPT

**Goal:** Technical credibility.
**Visual:** Dark Theme (#050508) Section.

### Prompt Specification
> "Build a 'Tech Stack' section with dark background (#050508). Header: 'TOOLS & TECHNOLOGIES'. Content: 4 columns. Column 1: Frontend (Cursor, Figma). Column 2: AI Models (Gemini 3, Claude). Column 3: Backend (Supabase, Vercel). Column 4: Channels (WhatsApp, Shopify). Use subtle borders (white/5). Footer of section: 3 metric stats (20+ Techs, 99.9% Uptime) in a horizontal flex row."

---

## STEP 6 — METRICS PROMPT

**Goal:** Proof of results.
**Visual:** Split Layout (Counters vs Charts).

### Prompt Specification
> "Create a Metrics section. Background #FAFAFA. Left side: 3 large 'Metric Cards' (Faster Deployment, Cost Savings, Productivity). Use `window.requestAnimationFrame` to animate numbers from 0 to target (e.g., 6x, 35%, 340%). Right side: A container comparing 'Traditional Dev (8 Months)' vs 'Sun AI (8 Weeks)' using horizontal bars. Below that, a vertical bar chart showing velocity growth over time."

---

## STEP 7 — VELOCITY SYSTEM PROMPT

**Goal:** Timeline visualization.
**Visual:** Horizontal Timeline (Desktop) / Vertical (Mobile).

### Prompt Specification
> "Build the 'Velocity System' section. Header: 'Build AI in 8 Weeks'. Visual: A horizontal line that draws itself (width 0 -> 100%) on scroll. Place 4 nodes along the line: 'Weeks 1-2 (Strategy)', 'Weeks 3-5 (Build)', 'Weeks 6-7 (Integration)', 'Week 8 (Launch)'. Each node has an icon above and a text card below. Stagger the appearance of the cards after the line finishes drawing."

---

## STEP 8 — CTA & PARTNERS PROMPT

**Goal:** Final conversion push.
**Visual:** Clean high-whitespace center alignment.

### Prompt Specification
> "Create a final CTA section. Background White. H2: 'Ready to Build Something Extraordinary?'. Two large buttons: 'Start Your Project' (Orange #FF6B2C) and 'Talk to Strategist' (Navy). Below CTA: A trusted-by section with a row of high-end fashion/tech logos (Vogue, LVMH, etc.) in grayscale opacity-30, hovering to full color."

---

## STEP 9 — FOOTER PROMPT

**Goal:** Navigation and Legal.
**Visual:** Dark Navy (#0A1628).

### Prompt Specification
> "Build a 4-column footer. Column 1: Logo + One-line mission statement. Column 2: Navigation Links. Column 3: Platform Links (CRM, Projects). Column 4: Contact info + Locations (London/Paris/NYC). Bottom row: Copyright + Privacy Policy. Text should be small (13px) gray-400, hovering to white."
