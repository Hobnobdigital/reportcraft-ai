"use client";

import { Lightbulb } from "lucide-react";

interface InsightsBadgeProps { insights: string[]; }

export function InsightsBadge({ insights }: InsightsBadgeProps) {
  return (
    <div className="glass-panel p-5" style={{ animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 560ms both" }}>
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb size={16} className="text-amber-400" />
        <h3 className="text-[15px] font-medium text-white/95 tracking-tight">Key Insights</h3>
      </div>
      <div className="flex flex-col gap-2">
        {insights.map((insight, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg bg-white/[0.03] border border-white/5 p-3 text-[13px] transition-all duration-200 hover:bg-white/[0.05] hover:border-white/8">
            <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-semibold bg-[#635BFF]/15 text-[#635BFF]">
              {i + 1}
            </span>
            <span className="text-white/60 leading-relaxed">{insight}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
