"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnalysisResult, LayoutPreset } from "@/lib/types";
import { KPICard } from "./KPICard";
import { ChartCard } from "./ChartCard";
import { NarrativePanel } from "./NarrativePanel";
import { InsightsBadge } from "./InsightsBadge";

interface DashboardGridProps { analysis: AnalysisResult; narrative: string | null; layout: LayoutPreset; }

export function DashboardGrid({ analysis, narrative, layout = "executive" }: DashboardGridProps) {
  const [slide, setSlide] = useState(0);

  const kpis = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {analysis.kpis.map((kpi, i) => <KPICard key={i} kpi={kpi} index={i} />)}
    </div>
  );

  if (layout === "presentation") {
    const total = analysis.charts.length;
    return (
      <div id="dashboard-export" className="space-y-5">
        {kpis}
        <div className="relative group">
          <div className="glass-panel p-8 min-h-[500px] flex flex-col">
            <ChartCard chart={analysis.charts[slide]} index={0} />
          </div>
          <button onClick={() => setSlide(s => Math.max(0, s - 1))} disabled={slide === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full transition-all duration-200 disabled:opacity-0 opacity-0 group-hover:opacity-100"
            style={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border-primary)", color: "var(--text-secondary)" }}><ChevronLeft size={20} /></button>
          <button onClick={() => setSlide(s => Math.min(total - 1, s + 1))} disabled={slide === total - 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full transition-all duration-200 disabled:opacity-0 opacity-0 group-hover:opacity-100"
            style={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border-primary)", color: "var(--text-secondary)" }}><ChevronRight size={20} /></button>
          <div className="flex gap-2 justify-center mt-4">
            {analysis.charts.map((_, i) => <button key={i} onClick={() => setSlide(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{ width: i === slide ? 24 : 6, backgroundColor: i === slide ? "var(--stripe-purple)" : "var(--border-primary)" }} />)}
          </div>
        </div>
      </div>
    );
  }

  const isDeepDive = layout === "deep-dive";

  return (
    <div id="dashboard-export" className="space-y-5">
      {kpis}
      {isDeepDive ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {analysis.charts.map((c, i) => <ChartCard key={i} chart={c} index={i} />)}
        </div>
      ) : (
        <>
          {analysis.charts.length >= 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ChartCard chart={analysis.charts[0]} index={0} />
              <ChartCard chart={analysis.charts[1]} index={1} />
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {analysis.charts.length >= 3 && <ChartCard chart={analysis.charts[2]} index={2} />}
            {narrative ? <NarrativePanel narrative={narrative} /> : analysis.insights.length > 0 ? <InsightsBadge insights={analysis.insights} /> : null}
          </div>
        </>
      )}
      {narrative && analysis.insights.length > 0 && <InsightsBadge insights={analysis.insights} />}
    </div>
  );
}
