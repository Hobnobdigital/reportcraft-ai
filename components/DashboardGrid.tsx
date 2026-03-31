"use client";

import { AnalysisResult } from "@/lib/types";
import { KPICard } from "./KPICard";
import { ChartCard } from "./ChartCard";
import { NarrativePanel } from "./NarrativePanel";
import { InsightsBadge } from "./InsightsBadge";

interface DashboardGridProps {
  analysis: AnalysisResult;
  narrative: string | null;
}

export function DashboardGrid({ analysis, narrative }: DashboardGridProps) {
  return (
    <div id="dashboard-export" className="space-y-5">
      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {analysis.kpis.map((kpi, i) => (
          <KPICard key={i} kpi={kpi} index={i} />
        ))}
      </div>

      {/* Charts row 1: two charts side by side */}
      {analysis.charts.length >= 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard chart={analysis.charts[0]} index={0} />
          <ChartCard chart={analysis.charts[1]} index={1} />
        </div>
      )}

      {/* Charts row 2: third chart + narrative or insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {analysis.charts.length >= 3 && (
          <ChartCard chart={analysis.charts[2]} index={2} />
        )}
        {narrative ? (
          <NarrativePanel narrative={narrative} />
        ) : (
          <InsightsBadge insights={analysis.insights} />
        )}
      </div>

      {/* Insights row (shown if narrative exists, so both display) */}
      {narrative && analysis.insights.length > 0 && (
        <InsightsBadge insights={analysis.insights} />
      )}
    </div>
  );
}
