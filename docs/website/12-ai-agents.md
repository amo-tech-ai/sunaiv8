
# 28. AI Agents Page (V6) — Design Specification & Progress Tracker

**Route:** `/agents`
**Theme:** "Cognitive Infrastructure" — Ethereal, Intelligent, Autonomous.
**Goal:** Personify the AI models as a specialized, high-performance digital workforce.

---

## 📊 Implementation Progress Tracker

| Component | Phase | Status | Technical Details |
| :--- | :--- | :---: | :--- |
| **Hero Section** | Structure | 🔴 | Dark mode, particle network background, "Cognitive Scale" copy. |
| **Agent Roster** | Visuals | 🔴 | Holographic glass cards for each agent persona. |
| **Orchestration Flow** | Animation | 🔴 | Animated SVG diagram showing the "User -> Gate -> Agent" path. |
| **Performance Charts** | Visuals | 🔴 | Animated bar charts comparing Human vs. AI velocity. |
| **Scroll Storytelling** | Interaction | 🔴 | Sticky-scroll section demonstrating a "Live Run". |
| **Tech Specs** | Content | 🔴 | Model breakdown (Gemini 3 Pro, Context Windows). |
| **CTA Block** | Conversion | 🔴 | "Hire Your Team" high-contrast block. |
| **Mobile Layout** | Responsive | 🔴 | Stacked cards, simplified diagrams for small screens. |

---

## 🎨 Global Design Tokens (V6 Refresher)

**Palette**
- **Void:** `#050508` (Primary Background)
- **Emerald:** `#10B981` (Active/Thinking State)
- **Cyan:** `#06b6d4` (Data Flow / Connections)
- **Glass:** `bg-white/5 border-white/10 backdrop-blur-xl`

**Typography**
- **Headlines:** `Playfair Display` (Serif).
- **Technical Labels:** `Inter` Mono / Uppercase / Tracking `0.2em`.

---

## 📐 Section 1: The Hero ("Digital Sovereignty")

**Concept:** The scale of the workforce. Infinite potential.
**Visual:** Deep Void background. A subtle, rotating constellation of nodes (representing agents) connecting in the background.

### 🤖 Implementation Prompt
> "Build the Agents Hero section. Background: Deep Void (#050508) with a CSS canvas particle network effect (slow moving nodes). Center Copy: Eyebrow 'AUTONOMOUS WORKFORCE' (Emerald). H1: 'Digital Employees for Cognitive Scale.' (Playfair, 72px, White). Subhead: 'A sovereign team of specialized agents working in concert to execute strategy, research, and production.' (Inter, Gray-400). CTA: 'Deploy Your Team' (White Button) and 'View Architecture' (Ghost)."

---

## 📐 Section 2: The Agent Roster (Holographic Cards)

**Concept:** Introducing the "Team Members".
**Visual:** A grid of premium, glass-like profile cards. Not cartoonish—architectural.

### 🤖 Implementation Prompt
> "Create the 'Agent Roster' grid. Layout: 2x2 or 3x2 grid. Each card is a 'Holographic Card': Dark glass background (white/5), 1px border (white/10).
>
> **Card Content:**
> 1.  **Icon:** A large, abstract 3D shape (e.g., Icosahedron for Planner, Sphere for Analyst) utilizing a glow effect.
> 2.  **Role:** Serif H3 (e.g., 'The Architect').
> 3.  **Function:** Mono label (e.g., 'STRATEGIC PLANNING').
> 4.  **Specs:** Small grid showing 'Model: Gemini 3 Pro', 'Tools: Search, Python'.
>
> **Interaction:** On hover, the card tilts (3D transform) and the border glows Emerald."

---

## 📐 Section 3: The Neural Orchestration (Animated Diagram)

**Concept:** How they work together.
**Visual:** A flowchart that feels alive. Data packets moving between nodes.

### 🤖 Implementation Prompt
> "Build the 'Orchestration Layer' section. Background: Dark. Layout: Center stage is a complex SVG diagram.
>
> **The Flow:**
> Left Node ('User Input') -> Line -> Center Node ('Orchestrator') -> Branching Lines -> Right Nodes ('Researcher', 'Planner', 'Analyst').
>
> **Animation:** Use SVG `stroke-dasharray` and `stroke-dashoffset` to animate 'data packets' (Emerald dashes) traveling along the connecting lines. The nodes should pulse when a packet hits them. Add a glass panel overlay explaining the 'Controller Gate' (Human Approval) which sits between the Agents and the Final Output."

---

## 📐 Section 4: Performance Velocity (Animated Charts)

**Concept:** Quantifiable ROI.
**Visual:** Clean, mathematical, high-contrast charts.

### 🤖 Implementation Prompt
> "Create a 'Velocity Metrics' section. Layout: Split view. Left: Text explaining 'Non-Linear Scaling'. Right: Two animated charts.
>
> 1.  **Speed Chart:** Horizontal bars. 'Traditional Agency: 3 Weeks' (Gray bar, slow fill). 'Sun AI Swarm: 4 Hours' (Emerald bar, fast fill).
> 2.  **Cost Efficiency:** A line chart showing 'Cost per Output' dropping to near zero over time with AI, compared to flat linear cost of humans.
>
> Use `framer-motion` or CSS transitions to animate the bars growing when the section enters the viewport."

---

## 📐 Section 5: "Live Run" (Scroll Storytelling)

**Concept:** Showing a workflow in action.
**Visual:** Sticky left text, scrolling right terminal/UI.

### 🤖 Implementation Prompt
> "Build a 'Workflow Simulation' scroll section.
> **Left Column (Sticky):** Step-by-step narrative. 1. 'Objective Set', 2. 'Deep Research', 3. 'Strategy Generation', 4. 'Execution'.
> **Right Column (Scroll):** A mock 'Terminal' or 'Dashboard' window.
> *   When 'Objective Set' is active, show a prompt being typed.
> *   When 'Deep Research' is active, show the Terminal scrolling through URLs and data points rapidly.
> *   When 'Strategy Generation' is active, show a structured JSON object forming.
> *   Use a progress bar that fills up as the user scrolls through the steps."

---

## 🎬 Animation & Micro-interaction Specs

1.  **Holographic Tilt:** Agent cards should track the mouse position slightly (`perspective(1000px) rotateX(...)`).
2.  **Data Flow:** The connector lines in the Orchestration section must loop infinitely.
3.  **Number Counters:** Any metric (e.g., "10x Speed") should count up from 0 when revealed.
4.  **Glass Glow:** Buttons should have a subtle internal shadow/glow `box-shadow: inset 0 0 20px rgba(16, 185, 129, 0.2)`.

---

## ✅ Best Practices Checklist
- [ ] **Mobile Diagram:** On mobile, the Orchestration diagram must stack vertically (User -> Orchestrator -> Agents) instead of branching horizontally.
- [ ] **Performance:** Heavy use of `backdrop-filter` can be slow. Use fallback solid colors for low-power devices if possible.
- [ ] **Contrast:** Ensure Emerald text on Dark background passes AA accessibility standards.
- [ ] **Touch Targets:** Agent cards must be fully clickable on mobile.
