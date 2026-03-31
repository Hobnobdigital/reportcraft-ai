# TESTING_AND_QA.md — Append to Every CLAUDE.md

## MANDATORY: Do Not Consider This Project Complete Until All Tests Pass

Before pushing to GitHub or deploying to Vercel, you MUST complete every step below. If any step fails, fix it before proceeding.

---

## Phase 1: Build Verification

### 1.1 Clean Build
```bash
npm run build
```
- [ ] Build completes with ZERO errors
- [ ] Fix all TypeScript errors (no `@ts-ignore` or `any` hacks)
- [ ] Fix all ESLint warnings (or configure rules explicitly)
- [ ] No "Module not found" errors

### 1.2 Dev Server
```bash
npm run dev
```
- [ ] Server starts without errors on localhost:3000
- [ ] No console errors in terminal
- [ ] No hydration mismatch warnings

---

## Phase 2: Functional Testing

### 2.1 Access Code Gate
- [ ] On first visit, access code modal appears
- [ ] Entering wrong code shows error state
- [ ] Entering correct code (`stripe-fda-2026`) dismisses modal
- [ ] Code persists in localStorage — refreshing page does not re-show modal
- [ ] API routes return 401 when called without valid access code header
- [ ] API routes work correctly when valid access code is provided

### 2.2 Landing Page
- [ ] Hero section renders with correct text
- [ ] All CTAs/buttons are clickable and navigate correctly
- [ ] Feature cards render
- [ ] Staggered entrance animation plays on page load
- [ ] Page is responsive — check at 1440px, 1024px, 768px, 375px widths

### 2.3 Core Functionality (Project-Specific)

**For ReportCraft AI:**
- [ ] Template selector loads sample data correctly (try all 3 templates)
- [ ] CSV file upload works (create a test CSV with 5 columns and 10 rows)
- [ ] Data preview table renders uploaded/template data
- [ ] "Generate Dashboard" button triggers API call
- [ ] Loading shimmer shows during API processing
- [ ] KPI cards render with correct values and trend indicators
- [ ] All charts render (bar, line, area, or pie as appropriate)
- [ ] Charts have tooltips on hover
- [ ] Executive narrative renders in the narrative panel
- [ ] PDF export downloads a file
- [ ] Dark/light mode toggle works and all elements adapt

**For StrategyAgent:**
- [ ] Task input accepts text and has character count
- [ ] Task templates load correctly when clicked
- [ ] "Run Agent" button initiates the agent loop
- [ ] SSE stream connects and reasoning chain starts populating
- [ ] Orchestrator thinking message appears first
- [ ] Plan is displayed with subtask list
- [ ] Approval gate appears and "Approve" button works
- [ ] Each sub-agent's thoughts/tool calls stream in sequence
- [ ] Tool call cards show tool name, input, and output
- [ ] Agent avatars show with correct colors
- [ ] Final deliverable renders as formatted content
- [ ] "Cancel" / abort works mid-execution
- [ ] Full execution completes without errors for all 3 task templates

**For WorkflowX:**
- [ ] Text input accepts workflow descriptions
- [ ] Templates load correctly (try all 4)
- [ ] "Analyze Workflow" triggers API call
- [ ] ReactFlow diagram renders with nodes and edges
- [ ] Nodes are color-coded by automation score
- [ ] Nodes are draggable in the flow diagram
- [ ] Analysis panel shows automation opportunities
- [ ] Time savings comparison renders
- [ ] Before/After toggle switches between flow views
- [ ] Export as PNG works

**For CohortIQ:**
- [ ] "Load Demo Data" populates 20 marketers
- [ ] Dashboard overview stats show correct counts
- [ ] Stage distribution chart renders
- [ ] Momentum chart renders
- [ ] Marketer grid shows all marketers with correct stage badges
- [ ] Filtering by stage works (tabs)
- [ ] Search by name works
- [ ] Clicking a marketer card navigates to their profile
- [ ] Individual profile shows stage progression and win timeline
- [ ] "Log Win" form works and win appears in timeline
- [ ] "Advance Stage" button updates the marketer's stage
- [ ] "Get Coaching" button calls Claude API and shows recommendation
- [ ] Attention flags appear for marketers stuck >14 days
- [ ] Data persists after page refresh (localStorage)
- [ ] Export as JSON works
- [ ] Adding a new marketer works

**For PaceIQ:**
- [ ] "Load Demo Data" populates 30 days of runs
- [ ] Dashboard stats show correct values
- [ ] Pace chart renders with pace trend line
- [ ] Mileage chart shows weekly bars
- [ ] Race predictions calculate and display for 5K, 10K, Half, Marathon
- [ ] Run logger form works (all fields)
- [ ] Saving a run adds it to the history
- [ ] "Get AI Analysis" returns coaching feedback after logging
- [ ] Training plan generation works (select goal + weeks)
- [ ] Training calendar renders daily workouts
- [ ] Data persists in localStorage after refresh

### 2.4 API Route Testing
For each API route in the project:
- [ ] Test with valid access code → returns 200 with expected JSON
- [ ] Test with invalid/missing access code → returns 401
- [ ] Test with malformed request body → returns appropriate error (400)
- [ ] Claude API call succeeds and returns parseable response
- [ ] Response JSON matches the expected TypeScript interface

---

## Phase 3: Design QA (Match STRIPE_DESIGN_SYSTEM.md)

### 3.1 Typography
- [ ] Geist font is loaded (check network tab or computed styles)
- [ ] Headlines use font-weight 700-800 with negative letter-spacing
- [ ] Body text uses weight 400 with line-height 1.6
- [ ] Overlines/labels use uppercase with wide letter-spacing
- [ ] Metrics use tabular-nums font-variant

### 3.2 Colors
- [ ] CSS variables from design system are defined in globals.css
- [ ] Primary accent is #635BFF (not generic blue or purple gradient)
- [ ] Dark mode uses #0A2540 as primary background
- [ ] Light mode uses #F6F9FC as secondary background
- [ ] No raw color values in components — all use CSS variables or Tailwind classes mapped to variables

### 3.3 Components
- [ ] Cards have 1px border AND shadow (not just one or the other)
- [ ] Cards lift on hover (translateY -2px + shadow increase)
- [ ] Buttons have hover/active states with transitions
- [ ] Inputs have focus ring (box-shadow, not outline)
- [ ] Badges use the correct bg/text color pairs from the design system
- [ ] No circular loading spinners — shimmer effects only

### 3.4 Animation
- [ ] Page load has staggered entrance animation (elements fade up in sequence)
- [ ] Transitions use the correct easing: cubic-bezier(0.16, 1, 0.3, 1)
- [ ] No content "pops" into existence without animation
- [ ] Charts animate on mount
- [ ] Modals use scaleIn animation

### 3.5 Layout
- [ ] Content max-width is ~1280px, centered
- [ ] Generous whitespace between sections (clamp(4rem, 8vw, 8rem))
- [ ] Not everything is centered — uses left-aligned text where appropriate
- [ ] Navigation has backdrop-blur effect on scroll
- [ ] Responsive: no horizontal scrolling at any viewport width

---

## Phase 4: Deployment

### 4.1 GitHub
- [ ] Initialize git repo
- [ ] Create .gitignore (include node_modules, .next, .env.local)
- [ ] Create .env.example with required env var names (no real values)
- [ ] Write README.md per the spec in CLAUDE.md
- [ ] Push to GitHub as public repo under user's account

### 4.2 Vercel
- [ ] Connect to GitHub repo via Vercel CLI or dashboard
- [ ] Set environment variables: ANTHROPIC_API_KEY, ACCESS_CODE
- [ ] For StrategyAgent: set function timeout to 60s in vercel.json
- [ ] Deploy
- [ ] Verify deployed URL loads correctly
- [ ] Run through Phase 2 functional tests AGAIN on the deployed URL
- [ ] Check that API routes work on production (not just localhost)

### 4.3 Post-Deploy Verification
- [ ] Visit the deployed URL in an incognito browser window
- [ ] Verify access code gate appears
- [ ] Enter access code and verify core functionality works
- [ ] Check browser console for any errors
- [ ] Test on mobile viewport (responsive check)

---

## Phase 5: Polish

### 5.1 Metadata & SEO
- [ ] Page title is set (e.g., "ReportCraft AI — Executive Dashboard Builder")
- [ ] Meta description is set
- [ ] Favicon is present (use a simple SVG favicon)
- [ ] Open Graph tags for social sharing (og:title, og:description, og:image)

### 5.2 Error States
- [ ] API failure shows a user-friendly error message (not raw error)
- [ ] Empty states are handled (no data yet → show helpful message)
- [ ] Network errors are caught and displayed gracefully

### 5.3 Final Visual Inspection
- [ ] Take a screenshot of each main page/state
- [ ] Does it look like a Stripe internal tool? Or does it look like generic AI slop?
- [ ] Would a designer at Stripe be impressed by this?
- [ ] If anything looks generic, fix it before shipping

---

## Definition of Done
A project is ONLY complete when:
1. ✅ Build passes with zero errors
2. ✅ All functional tests pass on localhost
3. ✅ Design matches STRIPE_DESIGN_SYSTEM.md
4. ✅ Deployed to Vercel successfully
5. ✅ All functional tests pass on production URL
6. ✅ README is complete
7. ✅ No console errors in browser

If ANY of these fail, the project is NOT done. Fix and re-test.
