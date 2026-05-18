# Niseko Ryugaku — Homepage Prototype

Static HTML/CSS/JS prototype of a redesigned homepage for [nisekoryugaku.com](https://nisekoryugaku.com/). Built as a design exploration before converting to a custom WordPress theme.

## Open it

Open `index.html` directly in any browser. No build step.

## What's in the box

```
niseko-ryugaku-redesign/
├── index.html                    homepage (all sections)
├── assets/
│   ├── css/styles.css            full design system + components
│   ├── js/main.js                nav, slider, counters, reveal
│   └── img/                      (reserved for real photography)
└── README.md
```

## Audience & positioning

The site sells **English immersion in Niseko, Hokkaido — to Japanese learners**, leveraging the fact that ~95% of the town's residents are foreign nationals. The pitch is "国内留学" (study abroad, domestically): no passport, no visa, no exchange rate — but real native-speaker immersion.

Primary language is Japanese. English is positioned as a secondary toggle for future tracking by international referrers.

## Design direction

- **Personality**: warm, place-rooted, slightly retro-travel. Boutique mountain inn that happens to be a school — not a global corporate brand like EF or Kaplan.
- **Palette** (locked, from brief):
  - `#FF7F73` Coral — primary accent, sparingly. Only for CTA, key highlights, decorative dots.
  - `#2EC4B6` Teal — secondary accent. Icons, hovers, eyebrow text.
  - `#FFE8DF` Cream — section backgrounds, dark-surface text.
  - `#0F4C5C` Deep teal — body text, dark sections, ink.
- **Typography**:
  - `Shippori Mincho` — display (headlines, prices, numerics). Warm modern mincho, evokes signage.
  - `Noto Sans JP` — body Japanese.
  - `Manrope` — Latin (UI, eyebrows, dates, brand wordmark).
- **Signature motif**: Mt. Yotei silhouette appears in the brand mark (as a hanko-style stamp), the hero illustration, and the testimonial "声" seal — recurring visual anchor.

## Homepage sections (in order)

1. **Announcement bar** — winter intake countdown
2. **Sticky header** — brand, nav, JP/EN toggle, primary CTA
3. **Hero** — Japanese-first headline, snow + Yotei SVG, live "今週のニセコ" weather card
4. **Stats strip** — four credibility numbers (animated on scroll)
5. **Programs (3-up)** — Short / Season / Long, middle card featured
6. **Why Niseko** — dark section, 4-icon credibility grid
7. **A week at Niseko Ryugaku** — visual schedule grid (Mon–Sun × 6 time blocks)
8. **Life in Niseko** — asymmetric image grid (lodge, snow, food, onsen, community)
9. **Voices** — horizontal-scroll testimonial cards with hanko stamp
10. **News / Snow report** — 3-card grid mixing conditions + events + alumni
11. **Booking** — brand-themed Calendly mock: service card + month/timezone header + 7-day picker + time-slot grid + phone/email/brochure fallback
12. **Footer** — locations, programs, support, social, legal

## Imagery approach

This prototype uses **custom inline SVG illustrations** in lieu of stock photography, so it reads as a designer's mockup rather than a placeholder dump. When converting to WordPress, the SVG blocks in:
- the hero (`.hero__bg`)
- each program card media (`.program-card__media`)
- each life tile (`.life-tile__media`)
- each news card media (`.news-card__media`)

…should be replaced with real photography of:
- Students with native-speaking instructors in casual settings
- Mt. Yotei / Niseko village in winter and green seasons
- The shared lodge interior (warm, lived-in)
- Onsen at dusk, steam rising
- Plates of Hokkaido food at a long shared table

Stick to a slightly warm, slightly grainy color treatment — no clinical stock-corporate photography.

## Interactions

- **Sticky header** shrinks shadow on scroll (`.is-scrolled`).
- **Mobile nav** drawers in below header at `<1024px`.
- **Stats counters** animate from 0 when the strip enters viewport.
- **Testimonial carousel** scroll-snaps; prev/next buttons step by card width.
- **Cards** lift on hover with media zoom inside.
- All animations respect duration tokens (`--t-fast`, `--t-med`, `--t-slow`).

## Responsive breakpoints

```
640px   tablet portrait     (3-col life grid kicks in)
720px   tablet              (3-col programs / news)
800px   small laptop        (4-col why / stats; two-col section heads)
900px   laptop              (two-col CTA band, footer)
960px   large laptop        (hero side-by-side)
1024px  desktop             (full nav, no mobile drawer)
```

## Notes for the WordPress conversion

When this lands in WordPress as a custom theme:

### Theme structure
```
niseko-ryugaku-theme/
├── style.css                     theme header + (optionally) main styles
├── functions.php                 enqueue, ACF blocks, custom post types
├── header.php / footer.php       announce + header + footer
├── front-page.php                composes the homepage from blocks
├── template-parts/
│   ├── hero.php
│   ├── stats.php
│   ├── programs.php
│   ├── why.php
│   ├── week.php
│   ├── life.php
│   ├── voices.php
│   ├── news.php
│   └── cta-band.php
├── assets/css/styles.css         (move this file here unchanged)
├── assets/js/main.js             (move this file here unchanged)
└── inc/
    ├── post-types.php            cpt: program, testimonial, instructor
    ├── acf-fields.php            field groups (if using ACF)
    └── blocks.php                Gutenberg block registration
```

### Custom post types to create
- **`program`** — title, duration, price-from, features (repeater), badge text, accent color
- **`testimonial`** ("受講生の声") — quote, student name, age/location, program taken, season/year
- **`news`** — uses post category for スノーレポート / イベント / 卒業生

### Reusable Gutenberg blocks worth building
- **Stats strip** — repeater of 4 stat cards
- **Program grid** — pulls latest 3 published programs, supports "featured" flag
- **Voices carousel** — pulls testimonials, optional filter by program
- **Life tiles** — repeater with image + title + blurb, supports the asymmetric grid layout

### Things to wire to real data
- Hero weather card (`.hero__card`) — could pull from a snow report API or be manually updated weekly in a single-row CPT.
- Stats numbers — ACF options page so marketing can edit without touching theme code.
- Announcement bar — ACF options page with toggle.
- **Booking section (`.booking__card`)** — currently a visual mock. Replace the entire `<div class="booking__card">…</div>` block with the live Calendly inline embed and load Calendly's widget script. The exact swap is documented in a comment block inside `index.html` directly above the mock. Brand-themed URL params already chosen: `?primary_color=ff7f73&text_color=0f4c5c&background_color=fffcfa&hide_gdpr_banner=1`.

### Things to keep as design tokens
The CSS custom properties at the top of `styles.css` are the design system. If the WordPress site adds a theme customizer for color tweaks, expose just those tokens — everything else cascades.

## What's NOT in this prototype

- Subpages (programs detail, about, FAQ, contact form, blog index)
- Real photography
- Language switcher backend (the JP/EN button is decorative)
- Live Calendly booking (the calendar in `#contact` is a styled visual mock — swap instructions are in `index.html`)
- Payment integration
- Accessibility audit (basic semantics + alt text are in place; full audit needed before launch)
- Performance pass (SVG inlining is fine at this scale; if photography balloons the page, set up next-gen formats + lazy loading at build time)

## Browser support

Tested visually in modern Chromium, Safari, Firefox. Uses CSS Grid, custom properties, `clamp()`, `backdrop-filter`, `aspect-ratio`. No IE11.
