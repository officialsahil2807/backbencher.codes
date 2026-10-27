# Design System: Backbencher.codes

## 1. Visual Theme & Atmosphere
A high-performance developer workspace and educational platform inspired by Visual Studio Code and Programiz. The aesthetic is deep, technical, and precise: off-black matte surfaces punctuated by laser-sharp safety orange accents, restrained glows, crisp borders, and monospaced data density. The vibe is focused, fast, and engineered for developers.

## 2. Color Palette & Roles
- **Main Canvas Background:** `#0B0B0D` (Deep obsidian dark background)
- **Secondary Surface:** `#141416` (Header, sidebar, cards, elevated controls)
- **Editor Background:** `#101012` (Monaco IDE canvas surface)
- **Primary Orange:** `#FF7900` (Safety orange for CTAs, active file tabs, run button, focal points)
- **Hover Orange:** `#FF963D` (Interactive hover states)
- **Borders & Dividers:** `#292929` (Subtle 1px structural separation)
- **Primary Text:** `#F5F5F5` (High-contrast crisp white typography)
- **Secondary Text:** `#A1A1AA` (Muted metadata, descriptions, line numbers)
- **Success Green:** `#22C55E` (Compiler pass, status ready)
- **Error Red:** `#EF4444` (Compilation diagnostics, syntax errors, run failure)

## 3. Typography Rules
- **Display & Headlines:** Geist / Inter Sans, tight letter-tracking (`tracking-tight`), semi-bold & bold hierarchy.
- **Body:** System / Geist Sans, relaxed line-height (1.6), optimal reading measure (65ch max).
- **Code & Numbers:** JetBrains Mono / Geist Mono, clean tabular figures, ligature support for operators.
- **Banned:** Generic serif fonts, uncalibrated bright saturated neon blues/purples, pure `#000000` pitch black.

## 4. Component Stylings
- **Buttons:** Tactile, sharp or 8px rounded corners (`rounded-lg`). Primary is solid `#FF7900` with dark `#0B0B0D` bold text. Secondary is `#141416` with `#292929` border and `#F5F5F5` text.
- **Cards:** `#141416` background, 1px `#292929` border, rounded-xl (12px), subtle hover lift with border transition to `#FF7900`.
- **IDE Panels:** 3-panel layout with draggable resizers, clean active tab indicator (2px top or bottom `#FF7900` border), sleek dark scrollbars.
- **Terminals & Output:** Console panel with elapsed runtime badge, memory usage, exit code pill, tabbed stdout/stderr/input.

## 5. Layout Principles
- Desktop-first IDE ergonomics with seamless responsive collapse on mobile devices.
- CSS Grid and Flexbox for strict spatial boundaries.
- Max-width containers for reading pages (`max-w-7xl` or `max-w-4xl` for tutorials/blog), full-bleed edge-to-edge for compiler workspace.

## 6. Motion & Interaction
- Restrained Framer Motion transitions (duration: 0.15s - 0.25s, ease: easeOut).
- Smooth tab switching, panel toggles, modal entrances. No distracting text animations while typing.
- Respect `prefers-reduced-motion`.

## 7. Anti-Patterns (Banned)
- No emojis as interface icons (use Lucide icons exclusively).
- No pure black `#000000`.
- No distracting glowing neon gradients.
- No fake execution outputs or mock buttons.
- No ads covering coding controls or console outputs.
