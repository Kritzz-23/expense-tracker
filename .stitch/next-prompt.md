---
page: dashboard
---
The main user dashboard for the Smart Finance Assistant / Finpay application.

**DESIGN SYSTEM (REQUIRED):**
[Copy from .stitch/DESIGN.md. Maintain the exact same Mint Equinox theme, off-white background, and mint/teal accents, but arranged for a dashboard rather than a marketing page.]
# Design System Specification: The Fluid Architect

## 1. Overview & Creative North Star
This design system is built on the philosophy of **"Atmospheric Precision."** In the high-stakes world of fintech, trust is not built through heavy borders and loud colors; it is built through clarity, breathing room, and intentionality. 

The Creative North Star for this system is **The Digital Curator.** We move away from the "boxy" nature of traditional banking apps. Instead, we embrace a high-end editorial feel—think of a premium gallery space where the architecture (the UI) is invisible, allowing the art (the financial data) to be the hero. We break the template look through **intentional asymmetry**, using generous whitespace as a functional element rather than a void, and utilizing high-contrast typographic scales to guide the user’s eye with authority.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule
Our palette is anchored in a sophisticated "Off-White/Slate" foundation, punctuated by "Hyper-Mint" and "Teal" accents that signify growth and digital fluency.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section content. Boundaries must be defined solely through background color shifts or subtle tonal transitions. 
*   **Example:** A `surface-container-low` card sitting on a `surface` background is the preferred method of containment. Lines create visual noise; tonal shifts create "zones."

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers, like stacked sheets of frosted glass.
*   **Base Layer:** `surface` (#f8f9fa)
*   **Primary Containers:** `surface-container-low` (#f3f4f5) for large sections.
*   **Actionable Elements:** `surface-container-lowest` (#ffffff) for cards and inputs to provide "pop."
*   **Persistent Elements:** `surface-container-highest` (#e1e3e4) for subtle navigation sidebars.

### The "Glass & Gradient" Rule
To elevate the experience, use **Glassmorphism** for floating overlays (e.g., Modals or Navigation Bars). Use a semi-transparent `surface` color with a `backdrop-blur` of 12px–20px. 
*   **Signature Textures:** For high-impact CTAs, use a subtle linear gradient (135°) transitioning from `primary` (#006c49) to `primary-container` (#10b981). This provides a "jewel-toned" depth that flat hex codes cannot achieve.

---

## 3. Typography: Editorial Authority
We utilize a dual-typeface system to balance technical precision with premium editorial style.

*   **Display & Headlines (Manrope):** A modern geometric sans-serif with a high x-height. Used to convey confidence. 
    *   *Role:* `display-lg` (3.5rem) should be used for account balances or hero marketing statements.
*   **Body & Labels (Inter):** The gold standard for readability in data-heavy interfaces.
    *   *Role:* `body-md` (0.875rem) for transaction details; `label-sm` (0.6875rem) for metadata.

**The Hierarchy Rule:** Always pair a `headline-lg` with a `body-md` using a generous 24px–32px gap. The "Golden Gap" creates the high-end feel associated with luxury brands.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are often too "muddy" for a clean fintech aesthetic. We use **Tonal Layering**.

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` background. The slight shift in lightness creates a soft, natural lift.
*   **Ambient Shadows:** If a "floating" effect is required (e.g., a credit card component), use a shadow with a 40px blur and 4% opacity. The color should be derived from `on-surface` (#191c1d), never pure black.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, it must be the `outline-variant` (#bbcabf) at 20% opacity. **Forbid 100% opaque borders.**

---

## 5. Components: Precision Primitives

### Buttons
*   **Primary:** Gradient of `primary` to `primary-container`. White text. Roundedness: `md` (0.375rem).
*   **Secondary:** Ghost style. Transparent background with a `primary` text. No border.
*   **Interaction:** On hover, primary buttons should slightly increase in saturation, not darken.

### Cards & Lists
*   **Constraint:** Zero dividers. 
*   **The Solution:** Use 16px–24px of vertical white space to separate list items. For complex transaction lists, use alternating backgrounds (`surface` and `surface-container-low`) only if necessary.
*   **Cards:** Use `rounded-xl` (0.75rem) for a modern, approachable feel.

### Input Fields
*   **State:** Default state uses `surface-container-highest` background with no border. 
*   **Active State:** Transitions to `surface-container-lowest` with a 2px "Glow" using `secondary` (#00687a) at 30% opacity.

### Fintech Specific: The "Wealth Graph"
*   Use `secondary` (Teal) for "Growth" trends and `tertiary` (#a43a3a) for "Expenses." 
*   Avoid standard line charts; use "Area" charts with a 10% opacity fill to create a sense of volume and stability.

---

## 6. Do’s and Don’ts

### Do:
*   **DO** use "Negative Space" as a luxury feature. If a screen feels crowded, increase the padding-global to 32px.
*   **DO** use `primary-fixed-dim` (#4edea3) for success states to keep the palette cohesive.
*   **DO** align text to a strict baseline grid to ensure "Trustworthy" precision.

### Don't:
*   **DON'T** use #000000 for text. Always use `on-surface` (#191c1d) to maintain the "Airy" feel.
*   **DON'T** use sharp corners. The `none` roundedness scale is forbidden except for full-bleed background imagery.
*   **DON'T** use "Standard" blue for links. Use the `secondary` (#00687a) Teal to maintain the signature fintech identity.
*   **DON'T** use more than two levels of nested containers. If you need a third level, rethink the information architecture.

**PAGE STRUCTURE:**
1. Sidebar navigation (Home, Transactions, Analytics, Settings).
2. Top bar with user profile, summary balance.
3. Bento grid of recent transactions and "AI Insights" block utilizing the clean white/slate design system with Mint accents.
