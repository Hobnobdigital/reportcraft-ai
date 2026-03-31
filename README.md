# ReportCraft AI

An AI-powered executive dashboard builder for marketing teams. Upload CSV/Excel data and get interactive dashboards with charts, KPIs, and written executive narratives in seconds.

Built by **Kwame Sarfo-Mensah** for the Stripe Forward Deployed AI Accelerator role.

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS with Stripe-inspired design system
- **Charts:** Recharts
- **AI:** Anthropic Claude API (claude-sonnet-4-20250514)
- **Data Parsing:** PapaParse (CSV), SheetJS (Excel)
- **PDF Export:** html2canvas + jsPDF

## Features

- Upload CSV or Excel files for instant analysis
- 3 pre-built marketing templates (Campaign Performance, Funnel Analysis, Channel Mix)
- AI-generated KPI cards with sparklines and trend indicators
- Interactive charts (bar, line, area, pie, composed)
- Executive narrative summaries written by Claude
- PDF export with branding
- Dark/light mode toggle
- Access code gate for API protection

## Getting Started

### Prerequisites

- Node.js 18+
- Anthropic API key

### Installation

```bash
git clone https://github.com/kwamesarfo/reportcraft-ai.git
cd reportcraft-ai
npm install
```

### Environment Variables

Create a `.env.local` file:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
ACCESS_CODE=stripe-fda-2026
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

## Deployment

1. Push to GitHub
2. Connect to [Vercel](https://vercel.com)
3. Add environment variables: `ANTHROPIC_API_KEY`, `ACCESS_CODE`
4. Deploy

## Access Code

The default access code is `stripe-fda-2026`. This gates AI features to prevent unauthorized API usage.
