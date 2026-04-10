# Design System Document: The Luminescent Financial Intelligence

## 1. Overview & Creative North Star
**Creative North Star: "The Ethereal Ledger"**

This design system moves beyond the cold, static nature of traditional banking apps to create a living, breathing financial environment. It is built on the principle of **Luminescent Depth**—a philosophy where data is not just displayed, but illuminated through layers of frosted glass and ambient light. 

To achieve a "High-End Editorial" feel, we reject the rigid, boxy constraints of standard fintech. Instead, we use **intentional asymmetry** and **expansive white space** (or rather, "dark space") to allow the typography to breathe. This is not a "dashboard"; it is a digital concierge that feels both futuristic and authoritative.

---

## 2. Colors: Tonal Architecture
The palette is anchored in a deep, nocturnal base to allow neon accents and glass layers to pop with professional vibrancy.

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for sectioning. Boundaries must be defined solely through background color shifts or subtle tonal transitions. For example, a `surface-container-low` section sitting on a `surface` background provides enough contrast to define a zone without cluttering the visual field with "ink."

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of glass.
*   **Base:** `surface` (#0c1324) – The infinite foundation.
*   **Sectioning:** `surface-container-low` (#151b2d) – Large layout blocks.
*   **Interactive Elements:** `surface-container-highest` (#2e3447) – Primary cards and inputs.
*   **Floating Elements:** `surface-bright` (#33394c) – Tooltips and modals.

### The "Glass & Gradient" Rule
To elevate a component from "flat" to "premium," apply a subtle linear gradient to main CTAs using `primary` (#ddb7ff) to `primary-container` (#b76dff) at a 135° angle. This adds "soul" and a sense of light-source directionality.

---

## 3. Typography: The Editorial Voice
We utilize a dual-font strategy to balance futuristic character with financial legibility.

*   **Display & Headlines (Space Grotesk):** Use these for "Hero" moments—account balances, monthly summaries, and section headers. The geometric nature of Space Grotesk provides a technical, forward-thinking edge.
    *   *Display-LG (3.5rem):* Reserved for total net worth or primary financial milestones.
*   **Title & Body (Inter):** Inter is our workhorse for high-density financial data. It provides the "Trust" factor.
    *   *Title-MD (1.125rem):* Used for card titles and transaction line items.
    *   *Body-SM (0.75rem):* Used for metadata, timestamps, and supporting text.

**Typographic Contrast:** Always pair a `headline-md` in `on-surface` with a `body-sm` in `on-surface-variant` to create a clear hierarchy through color weight rather than just font size.

---

## 4. Elevation & Depth: Tonal Layering
In this design system, shadows are light, and layers are translucent.

*   **The Layering Principle:** Depth is achieved by "stacking." Place a `surface-container-lowest` card on a `surface-container-low` section. The change in hex value creates a soft, natural lift.
*   **Ambient Shadows:** For floating glass panels, use a shadow with a 40px–60px blur, 0% spread, and 6% opacity. The shadow color must be a tinted version of `surface-tint` (#ddb7ff) to mimic the purple neon light refracting through glass.
*   **The Ghost Border:** If accessibility requires a border, use `outline-variant` (#4d4354) at **15% opacity**. This creates a "frosted edge" that defines the shape without breaking the glass effect.
*   **Glassmorphism:** Apply a `backdrop-filter: blur(20px)` to any element using a `surface-container` token with 80% opacity. This allows background charts and glows to bleed through the UI, creating a cohesive, immersive environment.

---

## 5. Components: Functional Elegance

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary-container`), `XL` roundedness (3rem). No border. High-contrast `on-primary-fixed` text.
*   **Secondary:** Glass-fill. `surface-container-high` at 40% opacity with a `backdrop-filter`. "Ghost Border" enabled.
*   **Tertiary:** Text-only in `secondary` (#4cd7f6), reserved for low-emphasis actions like "Cancel" or "View All."

### Cards & Lists
*   **The Rule of Zero Dividers:** Forbid the use of horizontal divider lines. Separate list items using 12px–16px of vertical spacing.
*   **Nesting:** Transaction items should sit on a `surface-container-low` background. When hovered, the item should shift to `surface-container-high` with a 2px "glow" offset using the `primary` color.

### Input Fields
*   **Style:** Minimalist. No bottom line. Use `surface-container-highest` with `MD` roundedness (1.5rem). 
*   **States:** On focus, the "Ghost Border" transitions from 15% opacity to 100% `primary` opacity with a subtle outer glow.

### Charts (The Financial Heart)
*   **Positive Growth:** Use `tertiary` (#4edea3) with a gradient fade toward the baseline.
*   **Trends:** Use `secondary` (#4cd7f6) for neutral data projections.
*   **Composition:** Charts should never be "boxed." They should bleed to the edges of their container or sit directly on the `surface` to maximize the sense of scale.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use `XL` (3rem) rounded corners for primary containers to maintain the "futuristic sleek" look.
*   **Do** use "Secondary Neon" (`secondary`) for data visualization to contrast against "Primary Neon Purple" used for branding/actions.
*   **Do** employ "Breathing Room." If a layout feels crowded, increase the padding by 1.5x.

### Don't:
*   **Don't** use pure black (#000000) or pure white (#FFFFFF). Use the provided `surface` and `on-surface` tokens to maintain the high-end OLED-optimized depth.
*   **Don't** use standard "Drop Shadows." Only use the diffused Ambient Shadows described in Section 4.
*   **Don't** use sharp corners. Every element, including selection states and tooltips, must follow the roundedness scale (minimum `sm`: 0.5rem).
