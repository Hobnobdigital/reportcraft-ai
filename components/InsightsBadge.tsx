"use client";

import { Lightbulb } from "lucide-react";

interface InsightsBadgeProps { insights: string[]; }

export function InsightsBadge({ insights }: InsightsBadgeProps) {
  return (
    <div className="glass-panel p-5" style={{ animation: "fadeUp 0.6s var(--ease-out) 560ms both" }}>
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb size={16} style={{ color: "var(--stripe-amber)" }} />
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Key Insights</h3>
      </div>
      <div className="flex flex-col gap-2">
        {insights.map((insight, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg p-3 text-[13px] transition-all duration-200"
            style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-secondary)" }}>
            <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-semibold"
              style={{ backgroundColor: "var(--accent-subtle)", color: "var(--stripe-purple)" }}>{i + 1}</span>
            <span style={{ color: "var(--text-secondary)" }} className="leading-relaxed">{insight}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
