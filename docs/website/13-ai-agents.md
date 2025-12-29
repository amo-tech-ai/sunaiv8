
# 29. AI Agents Page (Simplified V6) — Design Specification

**Route:** `/agents`
**Theme:** "Essential Intelligence" — Clean, typographic, confident.
**Goal:** Showcase the AI workforce using a stable, high-performance editorial layout. No complex 3D or heavy render costs.

---

## 📊 Implementation Progress Tracker

| Component | Phase | Status | Technical Details |
| :--- | :--- | :---: | :--- |
| **Hero Section** | Structure | 🔴 | Minimalist dark mode. Large serif typography. Static gradient mesh. |
| **Agent Cards** | Visuals | 🔴 | 2x2 Grid. Flat glass style. CSS-only hover states (Border/Glow). |
| **Workflow Strip** | Layout | 🔴 | Simple 3-step horizontal flex container. Static icons. |
| **Tech Specs** | Content | 🔴 | Clean data table for model details. |
| **CTA Footer** | Conversion | 🔴 | Standard centered conversion block. |
| **Mobile Adaption** | Responsive | 🔴 | Vertical stack for all grids. Standard padding. |

---

## 🎨 Design Tokens (Simplified)

**Palette**
- **Background:** `#050508` (Deep Void)
- **Text:** `#FFFFFF` (White) & `#94A3B8` (Slate-400)
- **Accent:** `#10B981` (Emerald) — Used sparingly for borders/buttons.

**Typography**
- **Headline:** `Playfair Display` (Serif).
- **Body:** `Inter` (Sans).

---

## 📐 Section 1: The Hero ("Meet the Workforce")

**Concept:** Confidence through simplicity.
**Visual:** Left-aligned text, Right-aligned abstract static visual (e.g., a simple glowing orb image).

### 🤖 Implementation Prompt
> "Build the Agents Hero. Background: #050508.
> **Left Column:**
> 1. Badge: 'THE SUN AI SQUAD' (Emerald text, border-emerald-900/50).
> 2. H1: 'Your new digital executive team.' (Playfair, 64px, White).
> 3. Subhead: 'Four specialized agents. One unified goal. 24/7 execution.' (Inter, Gray-400).
> **Right Column:**
> A static image of a minimalist geometric shape (e.g., a glass tetrahedron) with a subtle CSS 'float' animation (translateY 10px)."

---

## 📐 Section 2: The Agent Grid (2x2)

**Concept:** Clear role definition.
**Visual:** Standard CSS Grid. Clean borders.

### 🤖 Implementation Prompt
> "Create a 2x2 Grid for the agents. Gap: 32px.
> **Card Design:**
> - Background: `bg-white/5`.
> - Border: `border-white/10`.
> - Padding: `p-8`.
> - Radius: `rounded-2xl`.
> - **Content:** Top-left icon (Search, Map, Chart, Pen). H3 Title (Serif). Description (Sans).
> - **Hover:** Simple CSS transition: `border-emerald-500` and `bg-white/10`. No 3D tilts."

**The Agents:**
1.  **Researcher:** "Competitive Intel & Grounding."
2.  **Planner:** "Strategic Roadmap Generation."
3.  **Analyst:** "ROI Forecasting & Data Audit."
4.  **Creative:** "Visual Moodboarding."

---

## 📐 Section 3: The Workflow (Linear Process)

**Concept:** How it works.
**Visual:** 3 Cards in a horizontal row.

### 🤖 Implementation Prompt
> "Build a 'How They Work' section. White background.
> **Header:** 'The Orchestration Loop' (Dark Navy).
> **Layout:** Flex row (col on mobile). 3 Steps:
> 1. **Input:** 'You provide the goal.'
> 2. **Orchestration:** 'Agents research & plan.'
> 3. **Approval:** 'You authorize execution.'
> Connect steps with a simple CSS arrow `→` (hidden on mobile)."

---

## 📐 Section 4: Technical Specifications (Simple Table)

**Concept:** Transparency.
**Visual:** Minimalist data table.

### 🤖 Implementation Prompt
> "Create a 'Model Specs' section. Dark background.
> **Table Component:**
> - Headers: Agent Name, Base Model, Context Window, Tools.
> - Rows: Simple text rows with `border-b border-white/10`.
> - Example Row: 'Researcher | Gemini 3 Pro | 2M Tokens | Google Search'.
> Ensure the table scrolls horizontally on mobile if needed."

---

## 📐 Section 5: CTA

**Concept:** Action.
**Visual:** Centered text block.

### 🤖 Implementation Prompt
> "Final CTA. Background: Emerald-500. Text: White.
> H2: 'Ready to deploy?'
> Button: 'Start Project' (Black background, White text)."

---

## ✅ Best Practices (Simplified)
- [ ] **Mobile:** All grids turn into vertical stacks (flex-col).
- [ ] **Performance:** No heavy libraries. Use standard Tailwind classes.
- [ ] **Interaction:** Hover states should just be color changes or opacity shifts.
- [ ] **Images:** Use lightweight SVGs or optimized PNGs for the hero visual.
