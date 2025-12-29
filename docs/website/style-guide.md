# Sun AI Marketing — Style Guide & Color Palette

**Philosophy:** Editorial Luxury. We treat AI as a quiet, sophisticated partner, not a noisy tool. The design should feel like a high-end fashion magazine crossed with a precision engineering blueprint.

---

## 🎨 Color Palette: The "Lux" Series

### 1. Primary Foundations
| Color Name | Hex Code | Usage | Vibe |
| :--- | :--- | :--- | :--- |
| **Deep Void** | `#050508` | Backgrounds, primary text on white | Absolute authority, luxury |
| **Starlight White** | `#FFFFFF` | Backgrounds, primary text on dark | Purity, clarity |
| **Snow Slate** | `#FAFAFA` | Secondary backgrounds (Dashboard) | Calm, neutral |

### 2. Strategic Accents
| Color Name | Hex Code | Usage | Vibe |
| :--- | :--- | :--- | :--- |
| **Agency Emerald** | `#10B981` | CTAs, success signals, active nodes | Growth, intelligence, life |
| **Celestial Navy** | `#0A1628` | Gradient mesh, deep shadows | Depth, technical reliability |
| **Ghost Border** | `rgba(255,255,255,0.08)` | Glassmorphism strokes, dividers | Sophisticated precision |

---

## typography Typography: The "Dual-Font" System

### Primary: `Playfair Display` (Serif)
*   **Usage:** H1, H2, Blockquotes, Hero Headlines.
*   **Best Practice:** Use for "emotional" or "authoritative" statements. Never use for small UI labels.
*   **Scaling:** 72px (H1) -> 56px (H2) -> 32px (H3).

### Secondary: `Inter` (Sans-Serif)
*   **Usage:** Body copy, UI labels, buttons, technical data.
*   **Best Practice:** Tight tracking for labels (`-0.01em`), generous leading for body (`1.7`).
*   **Weighting:** 300 (Light) for subheadlines, 600 (Semibold) for CTAs.

---

## 💎 Visual Components

### 1. Glassmorphism (The "Quiet" UI)
All floating elements (Pills, Cards, Orbitals) must follow this formula:
*   **Background:** `rgba(255, 255, 255, 0.03)` on dark / `rgba(255, 255, 255, 0.7)` on light.
*   **Blur:** `backdrop-filter: blur(20px);`.
*   **Border:** `1px solid rgba(255, 255, 255, 0.1)`.
*   **Shadow:** Large, low-opacity spread (`shadow-2xl` with a color tint).

### 2. Spacing & Rhythm
*   **The "Air" Rule:** Marketing sections require a minimum of `160px` vertical padding.
*   **Gutter:** `80px` standard horizontal spacing between panels.
*   **Container:** Max-width `1440px` for desktop readability.

---

## 🎬 Motion & Interactivity

### 1. The Stagger Protocol
Items never appear all at once. Use a staggered `y: 20` to `y: 0` animation with `0.05s` delay between sibling elements.

### 2. Smooth Transitions
*   **Easing:** Always use `cubic-bezier(0.4, 0, 0.2, 1)` (Quartic). Avoid linear transitions except for the infinite orbital rotation.
*   **Hover:** Interaction should feel weightless. Use `scale: 1.02` and increase shadow depth rather than changing background colors abruptly.

### 3. The "Ghost Cursor" (Advanced)
Implementation of a custom emerald ring cursor that expands over interactive nodes, providing tactile feedback for the "Orbital System."

---

## 🛠 Tailwind Config Suggestions

```javascript
// Add these to your theme extension
colors: {
  lux: {
    void: '#050508',
    emerald: '#10B981',
    navy: '#0A1628',
    snow: '#FAFAFA',
  }
},
fontFamily: {
  serif: ['Playfair Display', 'serif'],
  sans: ['Inter', 'sans-serif'],
}
```

---
**Status:** Approved for implementation across all Marketing Routes.
