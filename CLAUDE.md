# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A single-page static travel guide for Spain, written primarily in Chinese (Simplified) with bilingual labels. No build system, no framework, no package manager — everything ships as plain HTML/CSS/JS. To preview, open `index.html` directly in a browser or serve it locally:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

There are no tests, no linter, and no CI pipeline.

## File layout

All content, styles, and behaviour live in `index.html` (~3850 lines). The only external files are:

- `assets/css/fonts.css` — self-hosted `@font-face` declarations for Cormorant Garamond, Inter, and Noto Serif SC (fetched from Google Fonts CDN at load time)
- `assets/js/lucide.min.js` — Lucide icon library, initialised at the bottom of the page with `lucide.createIcons()`
- `assets/images/` — JPEG photos referenced directly in HTML `src` attributes

## Architecture of index.html

The file is divided into three logical zones:

1. **`<head>` → line ~1738** — all CSS (custom properties, layout, component styles, responsive breakpoints, print styles) embedded in one `<style>` block. Design tokens are declared as CSS variables on `:root`.

2. **`<body>` content (lines ~1739–3259)** — static HTML sections in document order:
   - Fixed nav with desktop dropdown + mobile hamburger drawer
   - Full-viewport hero with search bar
   - `#tips` — horizontal-scroll card slider (travel tips)
   - `#map` — inline SVG route map of Spain
   - `#festivals` — horizontal-scroll festival cards
   - `#transport` — transport options grid
   - City sections (`#madrid`, `#barcelona`, `#granada`, `#sevilla`, `#cordoba`, `#toledo`, `#segovia`) — each contains `.attraction-card` elements
   - Sticky city quick-nav bar that tracks scroll position
   - Footer

3. **`<script>` block (lines ~3260–3836)** — vanilla JS initialisation that runs once at DOMContentReady (no modules, no bundler):
   - `attractionDetails` / `attractionImageSets` — plain objects keyed by Chinese attraction name; used to inject English subtitles, body text, and image galleries into `.attraction-card` nodes at page load
   - `focusMap` — maps attraction names to CSS `object-position` classes for hero images
   - Reminder / ICS download modal — generates `.ics` calendar files in-browser via `Blob`
   - Routes expand/collapse toggle
   - Drag-to-scroll for tip and festival sliders
   - Nav scroll effect (transparent → frosted-glass on scroll past 100 px)
   - Attraction search — highlights matching `.attraction-card` elements and smooth-scrolls to the first match; does **not** hide non-matching cards
   - Copy-to-clipboard buttons with `navigator.clipboard` + `execCommand` fallback, showing a toast notification
   - Reading progress bar
   - Mobile drawer open/close
   - City quick-nav active-link tracking via scroll position
   - Scroll-reveal animations using `IntersectionObserver`
   - Tip card emoji injection from `tipEmojiMap`

## Agents

Two custom subagents live in `.claude/agents/`:

| Agente | Archivo | Cuándo usarlo |
|--------|---------|---------------|
| `ux-ui` | `ux-ui.md` | Cambios de diseño, responsivo, CSS, accesibilidad, componentes visuales |
| `automatizacion` | `automatizacion.md` | Tareas automáticas end-to-end: implementar → commit → push → notificar |

El agente **`automatizacion`** opera con estas políticas fijas:
- Solo accede a ficheros dentro del repositorio; bloquea cualquier ruta externa al repo.
- Valida la fiabilidad de URLs externas antes de incluirlas (5 criterios de confianza).
- Al terminar siempre hace `git commit` + `git push origin main` e informa al usuario que el despliegue tardará 1–5 minutos.

El agente **`ux-ui`** sigue un diseño mobile-first con breakpoints definidos para Android pequeño (< 380 px) hasta desktop wide (≥ 1440 px), y exige áreas táctiles mínimas de 44 × 44 px.

## Key conventions

- **Language**: UI text is Chinese; English appears as secondary labels (`.attraction-title-en`) and in CSS class names / IDs.
- **CSS naming**: BEM-ish flat classes (`attraction-card`, `city-section`, `transport-icon`). No utility framework.
- **Icons**: Lucide icons are embedded as inline SVG in the HTML. `lucide.createIcons()` is called once at the end to replace any `data-lucide` attributes.
- **Images**: All photos are local JPEGs in `assets/images/`. Filenames come from Unsplash slugs. Multiple images per attraction are listed in `attractionImageSets` as arrays; the JS builds an image gallery div at initialisation time.
- **No external JS dependencies** beyond Lucide — no jQuery, no React, no fetch calls to APIs at runtime.
