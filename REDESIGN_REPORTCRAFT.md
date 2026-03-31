# REDESIGN_REPORTCRAFT.md — Complete UI Overhaul Spec

## INSTRUCTIONS FOR CLAUDE CODE
This is a full UI redesign of ReportCraft AI. Read this file completely, then redesign every frontend component using Gemini 3.1 Pro via ~/gemini-frontend.mjs. The existing backend/API routes stay the same. Only the frontend changes.

For EVERY component, write a detailed spec and call:
```bash
cat /tmp/component-spec.md | node ~/gemini-frontend.mjs > /tmp/component-output.tsx
```
Review the output, fix issues, save to the correct path. Rebuild and redeploy.

---

## DESIGN DIRECTION: Stripe.com White-Light with Glassmorphism Dashboards

### The Vibe
Imagine stripe.com's clean white aesthetic married with a Bloomberg Terminal's data density — but beautiful. White backgrounds, subtle depth through glass panels, interactive charts that respond to user input, and exec-ready exports that look like they came from McKinsey.

### Core Visual Identity

**Background:** Pure white (#FFFFFF) primary, with #F6F9FC for secondary panels — MATCHING stripe.com exactly.

**Glassmorphism Treatment for Dashboard Cards:**
```css
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  box-shadow: 
    0 4px 24px rgba(10, 37, 64, 0.06),
    0 1px 2px rgba(10, 37, 64, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

/* Subtle gradient mesh behind the dashboard area for glassmorphism to work against */
.dashboard-bg {
  background: 
    radial-gradient(ellipse at 20% 50%, rgba(99, 91, 255, 0.04) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(0, 212, 170, 0.04) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 80%, rgba(0, 115, 230, 0.03) 0%, transparent 50%),
    #F6F9FC;
}
```

**Typography:** Geist Sans. Headlines in #0A2540 (Stripe navy). Body in #425466. Tertiary in #8898AA.

**Accent Colors:**
- Primary: #635BFF (Stripe purple) — buttons, active states, primary chart color
- Success: #00D4AA — positive metrics, growth indicators  
- Blue: #0073E6 — links, secondary chart color
- Warning: #FFBB00 — attention states
- Error: #DF1B41 — negative metrics, decline indicators

---

## FEATURE 1: Interactive Dashboard with Live Data Input

The dashboard is NOT just a display — it's a workspace. Users can:

### Data Input Panel (Left Sidebar, Collapsible)
- **Upload Zone:** Drag-and-drop CSV/Excel with animated drop state
- **Manual Entry:** Inline editable data table — users can type directly into cells
- **Quick Adjust:** Slider controls to modify key values and see charts update in real-time
- **Data Source Tabs:** Switch between "Upload", "Template", "Manual Entry"

### Real-Time Reactivity
- When ANY data changes (upload, edit, slider), ALL charts and KPIs update instantly with smooth transitions
- Charts animate between states (bars grow/shrink, lines morph, numbers count up/down)
- Use React state management — all chart components receive data from a shared context

---

## FEATURE 2: Dynamic Chart Type Switching

Each chart card has a toolbar at the top-right with chart type options:

### Chart Type Options per Card
```
[ Bar | Line | Area | Pie | Donut | Radar | 3D Bar | 3D Scatter ]
```

- User clicks an icon → chart morphs to the new type with a smooth transition animation
- All chart types share the same data — only the visualization changes
- The AI-recommended chart type is highlighted with a subtle badge: "AI Recommended"

### 3D Chart Support
Use **Three.js** via `@react-three/fiber` and `@react-three/drei` for 3D charts:

**3D Bar Chart:**
- Bars rendered as 3D columns with subtle shadows
- Camera orbits slowly on idle (autoRotate)
- User can drag to rotate, scroll to zoom
- Hover highlights individual bars with a glow effect
- Same data as the 2D bar chart

**3D Scatter Plot:**
- Data points as spheres with size encoding a third dimension
- Subtle connecting lines for trend visualization
- Hover shows tooltip with all data fields

### Implementation
```typescript
// ChartSwitcher component
interface ChartSwitcherProps {
  data: any[];
  xKey: string;
  yKeys: string[];
  colors: string[];
  defaultType: ChartType;
  title: string;
}

type ChartType = "bar" | "line" | "area" | "pie" | "donut" | "radar" | "3d-bar" | "3d-scatter";

// Each chart type is a separate component that receives the same data
// Switching uses AnimatePresence for smooth mount/unmount transitions
```

---

## FEATURE 3: Dashboard Layout Customization

### Layout Presets
A toolbar at the top of the dashboard with layout options:
- **Executive Summary** (default): 4 KPIs → 2 charts → narrative
- **Data Deep Dive:** 4 KPIs → 4 charts in 2x2 grid → no narrative
- **Presentation Mode:** Full-width charts, one at a time, with navigation arrows
- **Custom:** Drag-and-drop grid where users can resize and rearrange cards

### Visual Treatment
- Layout switcher is a segmented control (pill-shaped buttons)
- Switching layouts uses a smooth grid animation (cards slide and resize)
- Active layout has the #635BFF accent underline

---

## FEATURE 4: Executive-Ready PDF Export with Data Storytelling

This is the crown jewel. The exported PDF must look like it came from a top consulting firm.

### PDF Structure (Multi-Page)
```
Page 1: COVER PAGE
  - Clean white background
  - Report title (auto-generated from data context, e.g., "Q1 2026 Campaign Performance Report")
  - Generated date
  - "Prepared by ReportCraft AI" in small text
  - Subtle decorative line in #635BFF

Page 2: EXECUTIVE SUMMARY
  - "Executive Summary" header
  - 4 KPI cards in a 2x2 grid with values, trends, and sparklines
  - AI-generated 3-paragraph narrative:
    - Paragraph 1: Overview — what the data shows at a high level
    - Paragraph 2: Key Findings — specific numbers, trends, anomalies
    - Paragraph 3: Recommendations — 2-3 actionable next steps
  - Each paragraph has a subtle left-border accent line

Page 3: DETAILED ANALYSIS
  - Chart 1 (full width) with title and caption
  - Chart 2 (full width) with title and caption
  - Each chart has a 2-sentence AI-generated insight below it

Page 4: DATA APPENDIX
  - Clean data table with alternating row colors
  - Column headers in #0A2540 with bottom border
  - Page number in footer

Every Page:
  - Header: thin line + "ReportCraft AI" right-aligned in #8898AA
  - Footer: page number centered + date left-aligned
  - Consistent margins: 60px all sides
  - Font: Geist Sans (embedded) or Helvetica Neue fallback
```

### PDF Generation Approach
Use `@react-pdf/renderer` instead of html2canvas for true PDF rendering:
- Proper vector text (not screenshots of HTML)
- Consistent rendering across devices
- Proper page breaks
- Embedded fonts

Alternative: Use `jsPDF` with custom layout code for more control.

### The Export Button
- Position: top-right of the dashboard, next to layout switcher
- Label: "Export Report" with a Download icon
- On click: show a modal with options:
  - Report title (editable text field, AI-suggested default)
  - Include sections: checkboxes for Cover, Summary, Charts, Appendix
  - "Generating..." state with progress bar
  - Download starts automatically

---

## FEATURE 5: AI Insights Layer

Beyond the narrative, add contextual AI insights throughout:

### Insight Badges on Charts
- Small "💡 Insight" badge on each chart card
- Click to expand a 1-2 sentence AI-generated observation about that specific chart
- E.g., "Paid Search drives 62% of conversions but only 34% of spend — this channel is significantly outperforming."

### Anomaly Highlighting
- If the AI detects an anomaly (spike, drop, outlier), it highlights that data point:
  - Red pulsing dot on the chart
  - Tooltip explains: "This value is 2.3 standard deviations above the mean"
- In the data table, anomaly rows have a subtle yellow-left-border

---

## COMPONENT-BY-COMPONENT REDESIGN SPECS

### When delegating to Gemini, include this context in EVERY spec:

```
CONTEXT FOR GEMINI:
You are redesigning ReportCraft AI — an executive data storytelling dashboard builder.
The app MUST look like it was built by Stripe's design team — clean, white backgrounds (#FFFFFF primary, #F6F9FC secondary), the Stripe brand system.
Dashboard cards use glassmorphism: rgba(255,255,255,0.7) background, backdrop-filter blur(20px), 1px white/30% border, subtle inset highlight.
Behind the dashboard area is a very subtle gradient mesh in the brand colors at 3-4% opacity.
Font: Geist Sans. Headlines: #0A2540, 700-800 weight. Body: #425466. Accent: #635BFF.
All animations use cubic-bezier(0.16, 1, 0.3, 1). Cards lift on hover. Numbers count up on load.
NO dark mode for this app — it's white/light only to match stripe.com.
Use Tailwind CSS. Use "use client" for components with hooks.
```

### Components to Redesign (in order):

1. **globals.css** — New CSS variables, glassmorphism classes, gradient mesh background, animation keyframes
2. **Navbar.tsx** — White bg, fixed top, backdrop-blur on scroll, Stripe-style nav
3. **Hero.tsx** — White background, bold headline, subtle gradient text effect on "AI", animated stats counter
4. **FileUpload.tsx** — Drag-and-drop with animated border, file icon, progress bar
5. **DataPreview.tsx** — Clean table with inline editing capability, alternating rows, sort arrows
6. **TemplateSelector.tsx** — Three cards with glassmorphism, hover lift, icon + title + description
7. **DashboardGrid.tsx** — New layout system with preset switcher, glassmorphism cards, gradient mesh bg
8. **KPICard.tsx** — Glassmorphism card, large metric with count-up animation, trend badge, sparkline
9. **ChartCard.tsx** — Glassmorphism card, chart type switcher toolbar, AI insight badge
10. **ChartSwitcher.tsx** — New component that handles chart type toggling with smooth transitions
11. **ThreeDBarChart.tsx** — New 3D bar chart using @react-three/fiber
12. **ThreeDScatter.tsx** — New 3D scatter plot
13. **NarrativePanel.tsx** — Glassmorphism card, structured 3-paragraph narrative, left-border accents
14. **InsightBadge.tsx** — Expandable insight tooltip
15. **AnomalyHighlight.tsx** — Pulsing dot + tooltip for anomalous data points
16. **LayoutSwitcher.tsx** — Segmented control for dashboard layout presets
17. **ExportModal.tsx** — Clean modal with report options and progress indicator
18. **PDFReport.tsx** — Full multi-page PDF generation with @react-pdf/renderer
19. **AccessCodeModal.tsx** — Glassmorphism modal on subtle blurred backdrop

### New Dependencies to Install
```bash
npm install @react-three/fiber @react-three/drei three @react-pdf/renderer framer-motion
npm install -D @types/three
```

---

## GEMINI SYSTEM PROMPT ADDENDUM

Add this to the system prompt when calling Gemini for this redesign:

```
ADDITIONAL CONTEXT — STRIPE DASHBOARD REDESIGN:

Reference these award-winning dashboard designs for inspiration:
- stripe.com (clean white, generous spacing, subtle depth)
- linear.app (glassmorphism, clean typography, smooth animations)  
- vercel.com/dashboard (data-forward, clean grids, real-time updates)
- raycast.com (glassmorphism, refined interactions, polished details)

Key principles for THIS redesign:
1. WHITE BACKGROUNDS — Not dark mode. Clean, bright, professional. Like stripe.com.
2. GLASSMORPHISM — Dashboard cards are frosted glass with subtle blur and white borders. They float above a very subtle gradient mesh.
3. INTERACTIVE — Charts respond to data changes in real-time. Users can edit data inline.
4. CHART SWITCHING — Every chart has a type switcher. Include 3D options via Three.js.
5. EXECUTIVE QUALITY — Everything looks like it belongs in a boardroom presentation.
6. MOTION — Smooth transitions everywhere. Numbers count up. Charts animate between states. Cards lift on hover.
7. NO AI SLOP — No purple gradients. No centered-everything layouts. No generic icons. No emoji. This should look like it was designed by humans at a $1B company.
```

---

## DEFINITION OF DONE FOR REDESIGN

- [ ] All components rewritten with glassmorphism + white Stripe aesthetic
- [ ] Dashboard has interactive data input (upload + manual edit + sliders)
- [ ] Chart type switching works for all chart cards (including 3D)
- [ ] Layout presets work (Executive, Deep Dive, Presentation, Custom)
- [ ] PDF export generates multi-page exec-ready report with narrative
- [ ] All animations smooth (count-up, chart transitions, card hover, page entrance)
- [ ] No dark mode — white/light only
- [ ] Deployed to Vercel and tested on production
- [ ] A Stripe designer would look at this and nod approvingly
