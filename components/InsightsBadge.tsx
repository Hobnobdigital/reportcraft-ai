"use client";

import { Lightbulb } from "lucide-react";

interface InsightsBadgeProps {
  insights: string[];
}

export function InsightsBadge({ insights }: InsightsBadgeProps) {
  return (
    <div
      className="glass-card p-5 animate-fadeUp"
      style={{ animationDelay: "560ms" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb size={16} color="#C47806" />
        <h3 className="text-sm font-semibold text-[#0A2540] tracking-tight">
          Key Insights
        </h3>
      </div>

      <div className="flex flex-col gap-2">
        {insights.map((insight, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-lg bg-[#F6F9FC] p-3 text-xs transition-all duration-200 border border-transparent hover:border-[#E3E8EE] hover:bg-white hover:-translate-y-px"
          >
            <span
              className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold"
              style={{
                backgroundColor: "rgba(99, 91, 255, 0.08)",
                color: "#635BFF",
                fontSize: 11,
              }}
            >
              {i + 1}
            </span>
            <span className="text-[#425466] leading-relaxed">{insight}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
