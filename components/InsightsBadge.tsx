"use client";

import { Lightbulb } from "lucide-react";

interface InsightsBadgeProps {
  insights: string[];
}

export function InsightsBadge({ insights }: InsightsBadgeProps) {
  return (
    <div
      className="stripe-card p-5 animate-fadeUp"
      style={{ animationDelay: "560ms" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-4 h-4" style={{ color: "var(--warning)" }} />
        <h3
          className="text-sm font-semibold"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
        >
          Key Insights
        </h3>
      </div>
      <div className="space-y-2">
        {insights.map((insight, i) => (
          <div
            key={i}
            className="flex items-start gap-2 p-3 rounded-lg text-xs"
            style={{
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-secondary)",
              lineHeight: 1.5,
            }}
          >
            <span
              className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5"
              style={{
                backgroundColor: "var(--accent-primary-subtle)",
                color: "var(--accent-primary)",
              }}
            >
              {i + 1}
            </span>
            <span>{insight}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
