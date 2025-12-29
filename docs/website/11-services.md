
# 27. Services Page (V6) — Design Specification & Progress Tracker

**Route:** `/services`
**Theme:** "Systems Architecture" — Technical depth meets high fashion.
**Goal:** Shift perception from "AI Experiment" to "Enterprise Infrastructure".

---

## 📊 Implementation Progress Tracker

| Component | Phase | Status | Technical Details |
| :--- | :--- | :---: | :--- |
| **Hero Section** | Structure | 🔴 | Typography-heavy, "Enterprise Grade" badge, Anchor nav. |
| **Service Catalog** | Visuals | 🔴 | Dark Mode (#050508) section, 6-card grid with glassmorphism. |
| **Methodology** | Content | 🔴 | "Systems First" grid with iconographic breakdown. |
| **Agent Architecture** | Visuals | 🔴 | Interactive flow diagram: User -> Orchestrator -> Agents. |
| **Verticals** | Content | 🔴 | Quick-select buttons for SaaS, Health, Fintech, etc. |
| **Tech Stack** | Content | 🔴 | Re-use existing TechStack component (DRY). |
| **CTA Block** | Conversion | 🔴 | "Start Project" wizard integration. |
| **Mobile Layout** | Responsive | 🔴 | Vertical stacking, touch-friendly touch targets. |
| **Animations** | Motion | 🔴 | Staggered reveals, hover lifts, border glows. |

---

## 🎨 Global Design Tokens (V6 Refresher)

**Palette**
- **Void:** `#050508` (Service Catalog Background)
- **Paper:** `#FFFFFF` (Hero Background)
- **Emerald:** `#10B981` (Accents / Success Signals)
- **Navy:** `#0A1628` (Text / Footers)

**Typography**
- **Headlines:** `Playfair Display` (Serif).
- **UI/Body:** `Inter` (Sans).

---

## 📐 Section 1: The Hero ("Systems, Not Demos")

**Concept:** Immediate differentiation. We build systems, not toys.
**Visual:** High-key (White), Centered, Editorial.

### 🤖 Implementation Prompt
> "Build the Services Hero section. Background: White. Top element: A pill badge '⚡ ENTERPRISE GRADE' (Emerald text/border). Headline (H1): 'AI Systems Built for Production—Not Demos.' uses Playfair Display (64px). Subhead: 'We design full-stack AI platforms, agents, and automation systems that ship fast, scale reliably, and stay human-controlled.' (Inter, Gray-500). Actions: Two buttons 'Explore Services' (Navy) and 'Industry Solutions' (Ghost). Add a subtle scroll-down indicator."

---

## 📐 Section 2: The Core Catalog (Dark Mode)

**Concept:** The "Menu". A sophisticated list of products.
**Visual:** Dark Void background (#050508). Cards look like premium software boxes.

### 🤖 Implementation Prompt
> "Create the 'Core Services' section. Background: Deep Void (#050508). Header: 'CORE CAPABILITIES' (Emerald eyebrow). Grid: 3 columns. Cards: 6 total (Web Dev, AI Agents, Chatbots, MVP, Sales AI, Custom Dev). Card Style: Glassmorphism on dark (bg-white/5), 1px border (white/10). Hover Effect: Border turns Emerald (#10B981), Card lifts -8px, Inner Title glows. Content: Serif H3 Title, 2-line description (Gray-400), and a 'View Specs ->' link at the bottom."

---

## 📐 Section 3: The Methodology ("Systems First")

**Concept:** Explaining the "Why".
**Visual:** Clean grid, Icon-heavy.

### 🤖 Implementation Prompt
> "Build the 'Our Approach' section. Background: White. Layout: Split 50/50. Left side: Sticky text. H2 'Systems Before AI.' + Paragraph explaining the 'Controller Gate' philosophy (Human approval). Right side: A 2x2 grid of feature blocks. 1. 'Blueprinted' (Icon: Ruler), 2. 'Human-in-the-Loop' (Icon: Shield), 3. 'Production-Ready' (Icon: Server), 4. 'Scalable' (Icon: Chart). Each block has a gray-50 background and hover-scale effect on the icon."

---

## 📐 Section 4: The 10-Agent Architecture

**Concept:** Visualizing complexity.
**Visual:** A diagrammatic view of the "Sun AI Brain".

### 🤖 Implementation Prompt
> "Create an 'Agent Architecture' section. Background: Emerald-50 (Very light green tint). Content: A list of the 10 agents (Orchestrator, Planner, Analyst, etc.) on the left. On the right, a CSS-drawn flow chart inside a glass card. The flow chart shows: Input -> Orchestrator -> [Split to Planner/Analyst] -> Human Gate -> Execution. Use animated SVG lines to connect the boxes to simulate data flow."

---

## 📐 Section 5: Industry Solutions (Verticals)

**Concept:** Self-selection.
**Visual:** Simple, high-contrast buttons.

### 🤖 Implementation Prompt
> "Build an 'Industry Solutions' strip. Background: White. Centered text: 'Vertical Intelligence'. A flex-wrap grid of 8 pill-shaped buttons: SaaS, E-Commerce, Healthcare, Real Estate, B2B, Automotive, Tourism, Fintech. Default style: Gray-50 bg, Gray-600 text. Hover style: Navy bg, White text. Clicking one should navigate to the Booking wizard."

---

## 🎬 Animation & Interaction Specs

1.  **Scroll Reveal:** All sections must use `IntersectionObserver`.
    *   *Effect:* `opacity: 0, y: 20px` -> `opacity: 1, y: 0` over 0.8s ease-out.
2.  **Hover Physics:**
    *   *Service Cards:* `transform: translateY(-8px) scale(1.01)`.
    *   *Buttons:* `transform: scale(1.05)`.
3.  **Diagram Motion:**
    *   *Agent Architecture:* The SVG lines connecting the boxes should animate their `stroke-dashoffset` to look like data is flowing.

---

## ✅ Best Practices Checklist
- [ ] **Mobile:** The Service Catalog grid must collapse to 1 column.
- [ ] **Contrast:** Ensure gray text on dark backgrounds is at least `text-gray-400`.
- [ ] **Navigation:** Anchor links (`#services`, `#methodology`) must smooth-scroll.
- [ ] **SEO:** All H2s and H3s must contain semantic keywords (e.g., "AI Web Development").
