"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnalysisResult, LayoutPreset } from "@/lib/types";
import { KPICard } from "./KPICard";
import { ChartCard } from "./ChartCard";
import { NarrativePanel } from "./NarrativePanel";
import { InsightsBadge } from "./InsightsBadge";

interface DashboardGridProps {
  analysis: AnalysisResult;
  narrative: string | null;
  layout: LayoutPreset;
}

export function DashboardGrid({ analysis, narrative, layout = "executive" }: DashboardGridProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const renderKPIs = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {analysis.kpis.map((kpi, i) => (
        <KPICard key={i} kpi={kpi} index={i} />
      ))}
    </div>
  );

  const renderExecutive = () => (
    <div className="space-y-5">
      {renderKPIs()}

      {analysis.charts.length >= 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard chart={analysis.charts[0]} index={0} />
          <ChartCard chart={analysis.charts[1]} index={1} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {analysis.charts.length >= 3 && (
          <ChartCard chart={analysis.charts[2]} index={2} />
        )}
        {narrative ? (
          <NarrativePanel narrative={narrative} />
        ) : analysis.insights.length > 0 ? (
          <InsightsBadge insights={analysis.insights} />
        ) : null}
      </div>

      {narrative && analysis.insights.length > 0 && (
        <InsightsBadge insights={analysis.insights} />
      )}
    </div>
  );

  const renderDeepDive = () => (
    <div className="space-y-5">
      {renderKPIs()}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {analysis.charts.map((chart, i) => (
          <ChartCard key={i} chart={chart} index={i} />
        ))}
      </div>

      {analysis.insights.length > 0 && (
        <InsightsBadge insights={analysis.insights} />
      )}
    </div>
  );

  const renderPresentation = () => {
    const total = analysis.charts.length;
    if (total === 0) return null;

    return (
      <div className="space-y-5">
        {renderKPIs()}

        <div className="relative group">
          <div className="glass-card p-8 min-h-[500px] flex flex-col">
            <ChartCard chart={analysis.charts[currentSlide]} index={0} />
          </div>

          <button
            onClick={() => setCurrentSlide((s) => Math.max(0, s - 1))}
            disabled={currentSlide === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white border border-[#E3E8EE] text-[#425466] shadow-md transition-all duration-200 disabled:opacity-0 opacity-0 group-hover:opacity-100 hover:shadow-lg"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={() => setCurrentSlide((s) => Math.min(total - 1, s + 1))}
            disabled={currentSlide === total - 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white border border-[#E3E8EE] text-[#425466] shadow-md transition-all duration-200 disabled:opacity-0 opacity-0 group-hover:opacity-100 hover:shadow-lg"
          >
            <ChevronRight size={20} />
          </button>

          <div className="flex gap-2 justify-center mt-4">
            {analysis.charts.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentSlide ? "w-6 bg-[#635BFF]" : "w-1.5 bg-[#E3E8EE] hover:bg-[#C4CDD5]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id="dashboard-export">
      {layout === "executive" && renderExecutive()}
      {layout === "deep-dive" && renderDeepDive()}
      {layout === "presentation" && renderPresentation()}
      {layout === "custom" && renderExecutive()}
    </div>
  );
}
