# CLAUDE.md — ReportCraft AI

## IMPORTANT: Read STRIPE_DESIGN_SYSTEM.md FIRST
Before writing any code, read the STRIPE_DESIGN_SYSTEM.md file in this repo root. It contains the mandatory design system (colors, typography, animations, spacing, anti-patterns) that must be followed for every component. All CSS variables, font choices, shadows, and animation patterns come from that file. Override the "Design Direction" section below with the design system where they conflict.

## Project Overview
ReportCraft AI is an executive data storytelling dashboard builder. Users upload CSV/Excel data and the app uses Claude AI to analyze it, generate interactive dashboards with charts, KPI cards, and written executive narratives. It includes pre-built marketing templates and PDF export.

This is a portfolio project for a Stripe "Forward Deployed AI Accelerator" role. It must look polished, professional, and demonstrate that the builder understands marketing analytics workflows.

## Tech Stack
- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS + shadcn/ui
- **Charts:** Recharts
- **AI:** Anthropic Claude API (claude-sonnet-4-20250514)
- **Data Parsing:** PapaParse (CSV), SheetJS/xlsx (Excel)
- **PDF Export:** html2canvas + jsPDF
- **Deploy:** Vercel

## Design Direction
See STRIPE_DESIGN_SYSTEM.md for complete spec. Key points:
- Dark mode default with light mode toggle
- Font: Geist Sans + Geist Mono (import @fontsource/geist-sans and @fontsource/geist-mono)
- Colors: Stripe palette — #0A2540 dark, #635BFF accent, #F6F9FC light bg
- All charts use consistent Stripe chart theme colors from design system
- Cards have 1px border + layered shadow + hover lift animation
- Page load uses staggered fadeUp entrance animation
- Loading states use shimmer effect, NOT spinners
- Responsive but optimized for desktop (executive tool)

## Access Code Gate
Before any AI features work, the user must enter an access code. This prevents unauthorized API usage.

### Implementation:
- On first visit, show a clean modal: "Enter access code to use AI features"
- Store the code in localStorage after validation
- The access code is stored as env var `ACCESS_CODE` on the server
- Client sends the code in a header `x-access-code` with every API request
- API routes check the header against the env var before processing
- If no match, return 401 with a clean error message
- Include a "Lock" icon in the nav that shows access status
- Default access code for demo: `stripe-fda-2026`

## Environment Variables (Vercel)
```
ANTHROPIC_API_KEY=sk-ant-... (user will add)
ACCESS_CODE=stripe-fda-2026
```

## File Structure
```
reportcraft-ai/
├── app/
│   ├── layout.tsx              # Root layout with font, metadata, theme provider
│   ├── page.tsx                # Landing/hero page
│   ├── dashboard/
│   │   └── page.tsx            # Main dashboard builder page
│   ├── api/
│   │   ├── analyze/
│   │   │   └── route.ts        # Main AI analysis endpoint
│   │   └── narrative/
│   │       └── route.ts        # Executive narrative generation
│   └── globals.css
├── components/
│   ├── AccessCodeModal.tsx     # Access code gate modal
│   ├── AccessCodeProvider.tsx  # Context provider for access code state
│   ├── ThemeProvider.tsx       # Dark/light mode
│   ├── Navbar.tsx              # Top nav with logo, theme toggle, lock icon
│   ├── Hero.tsx                # Landing page hero section
│   ├── FileUpload.tsx          # Drag-and-drop CSV/Excel upload
│   ├── TemplateSelector.tsx    # Pre-built template cards
│   ├── DataPreview.tsx         # Table preview of uploaded data
│   ├── DashboardGrid.tsx       # Main dashboard layout grid
│   ├── KPICard.tsx             # Individual KPI metric card with sparkline
│   ├── ChartCard.tsx           # Wrapper for each chart with title
│   ├── NarrativePanel.tsx      # AI-generated executive summary panel
│   ├── InsightsBadge.tsx       # Individual insight/anomaly badge
│   ├── ExportButton.tsx        # PDF export button
│   └── LoadingState.tsx        # Skeleton/loading animation during AI analysis
├── lib/
│   ├── claude.ts               # Claude API helper functions
│   ├── parseData.ts            # CSV/Excel parsing logic
│   ├── chartConfig.ts          # Chart type mapping and color config
│   ├── templates.ts            # Template definitions with sample data
│   └── types.ts                # TypeScript interfaces
├── public/
│   └── logo.svg                # ReportCraft AI logo (simple SVG)
├── .env.local                  # Local env vars (gitignored)
├── .env.example                # Example env vars for README
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## Detailed Component Specs

### Landing Page (app/page.tsx)
- Hero section with:
  - Headline: "Upload data. Get an executive dashboard in seconds."
  - Subline: "AI-powered data storytelling for marketing teams. No SQL. No Looker. No waiting."
  - Two CTAs: "Try with Sample Data" (loads a template) and "Upload Your Data"
- Below: 3 feature cards (AI Analysis, Template Library, PDF Export)
- Below: Screenshot/preview of a generated dashboard
- Footer with "Built by Kwame Sarfo-Mensah" and GitHub link

### Dashboard Page (app/dashboard/page.tsx)
This is the main app. Layout:
- Left sidebar (collapsible): Template selector + file upload
- Main area: Dashboard grid that populates after analysis

Flow:
1. User uploads CSV/Excel OR selects a template
2. DataPreview shows first 10 rows in a table
3. User clicks "Generate Dashboard"
4. Loading state with animated skeleton
5. API returns analysis → dashboard renders with KPIs, charts, narrative

### FileUpload Component
- Drag-and-drop zone with dotted border
- Accepts .csv, .xlsx, .xls
- On drop: parse with PapaParse (CSV) or SheetJS (Excel)
- Show file name, row count, column count after upload
- Pass parsed data up to parent

### TemplateSelector Component
Three template cards, each with:
- Icon, name, description
- "Use Template" button that loads sample data

**Template 1: Campaign Performance**
Sample data columns: Campaign, Channel, Impressions, Clicks, Conversions, Spend, Revenue
~15 rows of realistic marketing data

**Template 2: Funnel Analysis**
Sample data columns: Stage, Visitors, Percentage, DropOff, AvgTimeInStage
~6 rows (Awareness → Interest → Consideration → Intent → Evaluation → Purchase)

**Template 3: Channel Mix**
Sample data columns: Channel, MonthlySpend, CAC, Conversions, LTV, ROAS
~8 rows (Paid Search, Paid Social, Organic, Email, Display, Video, Affiliate, Direct)

### KPICard Component
- Large metric number with label
- Trend indicator (↑ green or ↓ red with percentage)
- Mini sparkline chart (tiny Recharts line)
- Subtle card background with border

### DashboardGrid Component
- CSS Grid: 4 KPI cards on top row
- Second row: 2 charts side by side
- Third row: 1 wide chart + narrative panel
- All cards have consistent padding, border radius, shadow

### NarrativePanel Component
- Renders the AI-generated executive summary
- 3 sections: Overview, Key Findings, Recommendations
- Each section has a subtle heading and paragraph text
- Styled like a document/report excerpt

### ExportButton Component
- Uses html2canvas to capture the dashboard grid
- Generates PDF with jsPDF
- Adds a header with "ReportCraft AI" branding and date
- Downloads automatically

## API Routes

### POST /api/analyze
**Purpose:** Main AI analysis endpoint. Takes parsed data and returns KPIs, chart configs, and insights.

**Request:**
```typescript
{
  data: Array<Record<string, any>>,  // parsed rows
  columns: string[],                  // column headers
  template?: string                   // optional template name
}
```

**Claude System Prompt:**
```
You are a senior marketing analytics expert. You analyze datasets and produce executive-ready dashboard configurations.

Given a dataset, you must:
1. Identify the data types of each column (numeric, categorical, date, percentage, currency)
2. Select the top 4 KPIs - the most important metrics. For each KPI, provide:
   - label: human-readable name
   - value: the computed value (sum, average, or latest depending on context)
   - format: "number", "currency", "percentage"
   - trend: "up" or "down"
   - trendValue: percentage change or comparison value
   - sparklineData: array of 6-8 values for a mini trend line
3. Recommend 3 charts. For each chart, provide:
   - type: "bar", "line", "area", "pie", "composed"
   - title: descriptive chart title
   - xKey: column to use for x-axis
   - yKeys: array of columns for y-axis (allows multi-series)
   - colors: array of hex colors to use
   - data: the data subset for this chart
4. Identify 3-5 key insights as short bullet strings

Respond ONLY with valid JSON matching this exact schema:
{
  "kpis": [...],
  "charts": [...],
  "insights": [...]
}

Do not include any text outside the JSON. Do not wrap in markdown code blocks.
```

**Response:**
```typescript
{
  kpis: Array<{
    label: string;
    value: number;
    format: "number" | "currency" | "percentage";
    trend: "up" | "down";
    trendValue: number;
    sparklineData: number[];
  }>,
  charts: Array<{
    type: "bar" | "line" | "area" | "pie" | "composed";
    title: string;
    xKey: string;
    yKeys: string[];
    colors: string[];
    data: any[];
  }>,
  insights: string[]
}
```

### POST /api/narrative
**Purpose:** Generate executive narrative summary from the analysis results.

**Request:**
```typescript
{
  kpis: [...],      // from analyze response
  charts: [...],    // from analyze response
  insights: [...],  // from analyze response
  columns: string[]
}
```

**Claude System Prompt:**
```
You are a senior marketing strategist writing an executive dashboard summary for a CMO.

Given KPIs, chart configurations, and insights from a marketing dataset, write a 3-paragraph executive narrative:

Paragraph 1 - Overview: A high-level summary of what the data shows. Set the scene.
Paragraph 2 - Key Findings: The most important patterns, anomalies, and opportunities. Be specific with numbers.
Paragraph 3 - Recommendations: 2-3 actionable next steps based on the data.

Write in a confident, executive tone. Be concise. Use specific numbers from the KPIs.
Do not use bullet points. Write in flowing paragraphs.
Keep the total length under 250 words.

Return ONLY the narrative text, no JSON, no markdown headers.
```

## Authentication Flow for API Routes
Every API route must:
```typescript
export async function POST(req: Request) {
  const accessCode = req.headers.get("x-access-code");
  if (accessCode !== process.env.ACCESS_CODE) {
    return NextResponse.json({ error: "Invalid access code" }, { status: 401 });
  }
  // ... rest of handler
}
```

## Key Implementation Details

### Data Parsing (lib/parseData.ts)
```typescript
// CSV: Use PapaParse with header: true, dynamicTyping: true
// Excel: Use SheetJS read(), get first sheet, convert to JSON with headers
// Return: { data: Record<string, any>[], columns: string[] }
```

### Chart Rendering
- Use Recharts components: BarChart, LineChart, AreaChart, PieChart, ComposedChart
- Each ChartCard takes the chart config from the API and renders the appropriate Recharts component
- Use ResponsiveContainer for all charts
- Consistent tooltip styling across all charts
- Animate on mount with Recharts built-in animation

### Template Sample Data (lib/templates.ts)
Generate realistic sample data for each template. Make the numbers look real:
- Campaign Performance: Spend ranges $5K-$50K, ROAS 2.1-5.8x, real channel names
- Funnel: Realistic drop-off percentages (100% → 65% → 38% → 22% → 15% → 8%)
- Channel Mix: Realistic CAC ($12-$180), LTV ($250-$2400), ROAS varies by channel

## npm Dependencies
```json
{
  "dependencies": {
    "next": "^14.2.0",
    "@anthropic-ai/sdk": "^0.39.0",
    "papaparse": "^5.4.1",
    "xlsx": "^0.18.5",
    "recharts": "^2.12.0",
    "html2canvas": "^1.4.1",
    "jspdf": "^2.5.1",
    "lucide-react": "^0.383.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  }
}
```

Also install shadcn/ui components: button, card, dialog, input, badge, tabs, dropdown-menu, separator, skeleton, tooltip

## Deployment
1. Push to GitHub repo `reportcraft-ai`
2. Connect to Vercel
3. Add environment variables: ANTHROPIC_API_KEY, ACCESS_CODE
4. Deploy

## README.md
Include:
- Project name and description
- Screenshot of a generated dashboard
- Tech stack
- How to run locally
- How to deploy
- Link to live demo
- "Built by Kwame Sarfo-Mensah for the Stripe Forward Deployed AI Accelerator role"
- Link to the portfolio landing page
