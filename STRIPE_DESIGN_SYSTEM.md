# STRIPE_DESIGN_SYSTEM.md — Shared Design System for All Projects

## CRITICAL: This file must be read and followed by Claude Code before building ANY project in the portfolio. Copy this file into each project repo root.

---

## Design Philosophy

These tools must look like they were built by Stripe's internal design team — not by AI. Every pixel must feel intentional. The goal is: if a Stripe hiring manager opens the app, their first thought should be "this person understands our design language."

**Core principles from Stripe's actual site:**
1. Generous whitespace — let content breathe
2. Confidence in simplicity — fewer elements, each one perfect
3. Subtle depth — layered shadows, not flat
4. Motion with purpose — animations guide attention, never distract
5. Data-forward — numbers and metrics are heroes, not decoration

---

## Typography

### Font Stack
Stripe uses **Sohne** (proprietary, licensed). We use the closest publicly available alternative:

**Primary (Headlines + UI):** `"Söhne", "Helvetica Neue", Helvetica, Arial, sans-serif`
- Since Sohne isn't freely available, use **Inter** with careful weight selection as the practical fallback — BUT style it like Sohne: tighter letter-spacing on headlines, heavier weights for impact
- Import from Google Fonts: `Inter:wght@300;400;500;600;700;800`

**Alternative approach (PREFERRED):** Use **Geist** by Vercel — it's free, modern, geometric, and very close to Sohne's character. Import from `@fontsource/geist-sans` npm package.
```css
font-family: "Geist", "Helvetica Neue", Helvetica, Arial, sans-serif;
```

**Monospace (code blocks, data):** `"Geist Mono", "SF Mono", "Fira Code", monospace`
- Import: `@fontsource/geist-mono`

### Typography Scale
```css
--font-size-hero: clamp(3rem, 5vw, 4.5rem);     /* 48-72px - Landing page headlines */
--font-size-h1: clamp(2rem, 3.5vw, 3rem);        /* 32-48px - Page titles */
--font-size-h2: clamp(1.5rem, 2.5vw, 2rem);      /* 24-32px - Section headers */
--font-size-h3: 1.25rem;                          /* 20px - Card titles */
--font-size-body: 1rem;                           /* 16px - Body text */
--font-size-body-sm: 0.875rem;                    /* 14px - Secondary text */
--font-size-caption: 0.75rem;                     /* 12px - Labels, timestamps */
--font-size-overline: 0.6875rem;                  /* 11px - Overlines, badges */
```

### Typography Treatments
```css
/* Hero headlines: Extra bold, tight tracking, -2% letter-spacing */
.hero-headline {
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.05;
}

/* Section headers: Semibold, slight negative tracking */
.section-header {
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

/* Body: Regular weight, generous line height for readability */
.body-text {
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.6;
}

/* Overlines / labels: All caps, wide tracking, small size */
.overline {
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: var(--font-size-overline);
}

/* Data/metrics: Tabular numbers, mono-spaced for alignment */
.metric {
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  letter-spacing: -0.02em;
}
```

---

## Color System

### Primary Palette (Stripe's actual brand colors)
```css
/* Core Stripe Colors */
--stripe-primary: #635BFF;          /* Stripe's signature purple/indigo — USE SPARINGLY as accent */
--stripe-dark: #0A2540;             /* Stripe's dark navy — primary text, dark backgrounds */
--stripe-light-bg: #F6F9FC;         /* Stripe's off-white — light backgrounds */
--stripe-white: #FFFFFF;

/* Extended palette derived from Stripe */
--stripe-cyan: #00D4AA;             /* Success, positive metrics */
--stripe-blue: #0073E6;             /* Links, interactive elements */
--stripe-amber: #FFBB00;            /* Warnings, attention */
--stripe-red: #DF1B41;              /* Errors, negative metrics, destructive actions */
--stripe-green: #0E6245;            /* Success states */
```

### Semantic Colors — Light Mode
```css
--bg-primary: #FFFFFF;
--bg-secondary: #F6F9FC;
--bg-tertiary: #F0F3F7;
--bg-elevated: #FFFFFF;

--text-primary: #0A2540;
--text-secondary: #425466;
--text-tertiary: #8898AA;
--text-inverse: #FFFFFF;

--border-primary: #E3E8EE;
--border-secondary: #F0F3F7;
--border-focus: #635BFF;

--accent-primary: #635BFF;
--accent-primary-hover: #5851EA;
--accent-primary-subtle: rgba(99, 91, 255, 0.08);

--success: #0E6245;
--success-bg: rgba(14, 98, 69, 0.08);
--error: #DF1B41;
--error-bg: rgba(223, 27, 65, 0.08);
--warning: #C47806;
--warning-bg: rgba(196, 120, 6, 0.08);
```

### Semantic Colors — Dark Mode
```css
--bg-primary: #0A2540;
--bg-secondary: #0F2E4C;
--bg-tertiary: #143558;
--bg-elevated: #1A3A5C;

--text-primary: #FFFFFF;
--text-secondary: #ADBDCC;
--text-tertiary: #6B7C93;
--text-inverse: #0A2540;

--border-primary: #1E4976;
--border-secondary: #163B63;
--border-focus: #635BFF;

--accent-primary: #7B73FF;
--accent-primary-hover: #8F89FF;
--accent-primary-subtle: rgba(123, 115, 255, 0.15);
```

### Gradient Palette (Stripe uses gradient mesh backgrounds)
```css
/* Hero gradient — inspired by Stripe's homepage mesh */
--gradient-hero: linear-gradient(135deg, #0A2540 0%, #1B3A5C 25%, #0A2540 50%, #132D4A 75%, #0A2540 100%);

/* Card gradient — subtle glass effect */
--gradient-card: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);

/* Accent gradient — Stripe purple */
--gradient-accent: linear-gradient(135deg, #635BFF 0%, #8B5CF6 100%);

/* Success gradient */
--gradient-success: linear-gradient(135deg, #00D4AA 0%, #0E6245 100%);
```

---

## Spacing & Layout

### Spacing Scale (8px base grid)
```css
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-5: 1.5rem;     /* 24px */
--space-6: 2rem;       /* 32px */
--space-7: 2.5rem;     /* 40px */
--space-8: 3rem;       /* 48px */
--space-9: 4rem;       /* 64px */
--space-10: 5rem;      /* 80px */
--space-11: 6rem;      /* 96px */
--space-12: 8rem;      /* 128px */
```

### Layout Constraints
```css
--max-width-content: 1280px;
--max-width-text: 680px;      /* Optimal reading width */
--max-width-wide: 1440px;

/* Section padding — generous vertical space between sections */
--section-padding-y: clamp(4rem, 8vw, 8rem);
--section-padding-x: clamp(1.5rem, 4vw, 4rem);
```

### Border Radius
```css
--radius-sm: 6px;      /* Small elements: badges, tags */
--radius-md: 8px;      /* Buttons, inputs */
--radius-lg: 12px;     /* Cards */
--radius-xl: 16px;     /* Large cards, modals */
--radius-2xl: 24px;    /* Hero cards, feature blocks */
--radius-full: 9999px; /* Pills, avatars */
```

---

## Shadows & Depth

Stripe uses layered, subtle shadows — never harsh single-layer drop shadows.

```css
/* Elevation levels */
--shadow-xs: 0 1px 2px rgba(10, 37, 64, 0.04);
--shadow-sm: 0 2px 4px rgba(10, 37, 64, 0.06), 0 1px 2px rgba(10, 37, 64, 0.04);
--shadow-md: 0 4px 8px rgba(10, 37, 64, 0.08), 0 2px 4px rgba(10, 37, 64, 0.04);
--shadow-lg: 0 8px 16px rgba(10, 37, 64, 0.08), 0 4px 8px rgba(10, 37, 64, 0.04);
--shadow-xl: 0 16px 32px rgba(10, 37, 64, 0.10), 0 8px 16px rgba(10, 37, 64, 0.06);

/* Stripe-style card shadow with border */
.stripe-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.stripe-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

/* Glass card for dark backgrounds */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
}
```

---

## Animation & Motion

### Timing Functions
```css
/* Stripe uses smooth, slightly bouncy easing */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);          /* Primary — exit animations */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);      /* Symmetric transitions */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);   /* Subtle bounce — buttons, cards */
```

### Duration Scale
```css
--duration-fast: 150ms;     /* Micro-interactions: hover, focus */
--duration-normal: 250ms;   /* Standard transitions */
--duration-slow: 400ms;     /* Complex transitions, page elements */
--duration-slower: 600ms;   /* Staggered reveals */
```

### Key Animations
```css
/* Fade up — primary entrance animation for all content */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale in — for modals, popovers */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Slide in from right — for panels, sidebars */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Shimmer — for loading states (NOT a skeleton pulse — a shimmer sweep) */
@keyframes shimmer {
  from {
    background-position: -200% 0;
  }
  to {
    background-position: 200% 0;
  }
}

.shimmer {
  background: linear-gradient(
    90deg,
    var(--bg-tertiary) 25%,
    var(--bg-secondary) 50%,
    var(--bg-tertiary) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease infinite;
}
```

### Staggered Entrance Pattern
Every page load should have a choreographed entrance. Elements appear in sequence, not all at once.
```css
/* Apply to children with increasing delay */
.stagger-enter > * {
  animation: fadeUp 0.6s var(--ease-out) both;
}
.stagger-enter > *:nth-child(1) { animation-delay: 0ms; }
.stagger-enter > *:nth-child(2) { animation-delay: 80ms; }
.stagger-enter > *:nth-child(3) { animation-delay: 160ms; }
.stagger-enter > *:nth-child(4) { animation-delay: 240ms; }
.stagger-enter > *:nth-child(5) { animation-delay: 320ms; }
.stagger-enter > *:nth-child(6) { animation-delay: 400ms; }
```

### Micro-interactions
```css
/* Button hover — scale + shadow lift */
.btn-primary {
  transition: all var(--duration-fast) var(--ease-spring);
}
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
.btn-primary:active {
  transform: translateY(0);
}

/* Interactive card — tilt on hover (subtle) */
/* Use framer-motion or CSS perspective transform for 3D tilt */

/* Chart/data hover — crosshair cursor, highlight element */
/* Tooltips animate in with scaleIn, not instant show/hide */

/* Number counting animation — metrics should count up on page load */
/* Use requestAnimationFrame or a library like countup.js */
```

---

## Component Patterns

### Buttons
```
Primary:   bg #635BFF, text white, rounded-md, px-5 py-2.5, font-medium
           hover: bg #5851EA, shadow-md, translateY(-1px)
Secondary: bg transparent, text #0A2540, border 1px #E3E8EE, rounded-md
           hover: bg #F6F9FC, border-color #C4CDD5
Ghost:     bg transparent, text #635BFF, no border
           hover: bg rgba(99,91,255,0.08)
```

### Cards
- Always have a 1px border (not just shadow)
- Border radius: 12px
- Padding: 24px
- Hover: lift 2px, shadow increases
- Dark mode: glass effect with backdrop-filter

### Inputs
- Height: 44px
- Border: 1px solid var(--border-primary)
- Border radius: 8px
- Focus: 2px ring in var(--accent-primary) with 0.15 opacity background
- No outline — use box-shadow for focus ring
- Placeholder: var(--text-tertiary)

### Badges / Tags
```
Default:   bg #F6F9FC, text #425466, rounded-full, px-3 py-1, text-xs font-medium
Success:   bg rgba(14,98,69,0.08), text #0E6245
Error:     bg rgba(223,27,65,0.08), text #DF1B41
Accent:    bg rgba(99,91,255,0.08), text #635BFF
```

### Navigation
- Fixed top, height 64px
- Backdrop blur on scroll
- Logo left, links center, CTA right
- Active state: text color #635BFF with subtle bottom indicator
- Background transitions from transparent to bg-primary on scroll

### Charts (Recharts styling)
```javascript
// Consistent chart theming across all projects
const chartTheme = {
  colors: ['#635BFF', '#00D4AA', '#0073E6', '#FFBB00', '#DF1B41', '#8B5CF6'],
  grid: { stroke: '#E3E8EE', strokeDasharray: '3 3' },
  axis: { stroke: '#8898AA', fontSize: 12, fontFamily: 'Geist' },
  tooltip: {
    background: '#0A2540',
    border: 'none',
    borderRadius: 8,
    color: '#FFFFFF',
    boxShadow: '0 8px 16px rgba(10,37,64,0.2)',
    fontSize: 13,
  },
  // Area charts should have gradient fills, not solid
  // Line charts should have 2px stroke, rounded linecap
  // Bar charts should have rounded top corners (radius 4)
};
```

---

## ANTI-PATTERNS: What NOT To Do

**These will make the app look like AI slop. Avoid at all costs:**

1. ❌ **Purple gradients on white** — the #1 tell of AI-generated UI. We use Stripe's purple (#635BFF) as a tight accent, never as a gradient background.
2. ❌ **Centered everything** — Stripe uses left-aligned text with asymmetric layouts. Don't center every heading.
3. ❌ **Rounded everything** — Not every corner needs to be fully rounded. Use the radius scale intentionally.
4. ❌ **Shadow-less flat cards** — Stripe always has subtle borders + shadows. Never a completely flat card.
5. ❌ **Generic placeholder icons** — Use Lucide icons but choose specific, meaningful ones. Not every card needs a lightbulb or rocket.
6. ❌ **Cookie-cutter 3-column grids** — Break the grid. Use 2-column asymmetric layouts, full-width sections, overlapping elements.
7. ❌ **Instant show/hide** — Everything should animate. No content should pop into existence.
8. ❌ **System fonts or Inter as-is** — Use Geist with proper weight/tracking configuration.
9. ❌ **Low-contrast text on colored backgrounds** — Always check contrast. Stripe takes accessibility seriously.
10. ❌ **Emoji as decoration** — Never use emoji in the UI. Use icons or nothing.
11. ❌ **"Powered by AI" badges** — Don't slap AI badges everywhere. The tool should feel powerful, not gimmicky.
12. ❌ **Loading spinners** — Use shimmer/skeleton patterns, never circular spinners.
13. ❌ **Default shadcn/ui styling** — shadcn is a starting point, not the destination. Override colors, radius, shadows to match this system.

---

## Implementation Checklist

Before shipping any project, verify:
- [ ] Geist font loaded and applied globally
- [ ] All CSS variables from this file implemented in globals.css
- [ ] Dark/light mode works with proper semantic color swapping
- [ ] All cards have border + shadow + hover animation
- [ ] Page load has staggered entrance animation
- [ ] All buttons have hover/active states with transitions
- [ ] Charts use the consistent chart theme colors
- [ ] Loading states use shimmer, not spinners
- [ ] Metrics/numbers use tabular-nums and count-up animation
- [ ] Navigation has backdrop-blur on scroll
- [ ] All interactive elements have visible focus states
- [ ] No raw text colors — everything uses semantic variables
- [ ] Spacing follows the 8px grid
- [ ] Mobile responsive (but desktop-optimized for these tools)

---

## Access Code Modal Styling

Since every project has this, it should look great:
- Centered modal with glass effect backdrop (backdrop-filter: blur(8px))
- Dark overlay behind (rgba(10, 37, 64, 0.6))
- Modal card: white bg, 16px radius, shadow-xl
- Clean input with focus ring
- Primary button styled per button spec above
- Subtle "🔒" icon (exception to emoji rule — this one is fine) or use Lucide Lock icon
- Entrance animation: scaleIn
- Error state: subtle red border on input with message below
