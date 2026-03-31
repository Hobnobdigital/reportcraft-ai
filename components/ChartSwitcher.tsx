"use client";

import { BarChart3, TrendingUp, AreaChart, PieChart, CircleDot, Hexagon } from "lucide-react";
import type { ChartType } from "@/lib/types";

interface ChartSwitcherProps { activeType: ChartType; recommendedType: ChartType; onTypeChange: (t: ChartType) => void; availableTypes?: ChartType[]; }
const ICONS: Record<string, React.ElementType> = { bar: BarChart3, line: TrendingUp, area: AreaChart, pie: PieChart, donut: CircleDot, radar: Hexagon };
const TYPES: ChartType[] = ["bar", "line", "area", "pie", "donut", "radar"];

export function ChartSwitcher({ activeType, recommendedType, onTypeChange, availableTypes = TYPES }: ChartSwitcherProps) {
  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border-primary)" }}>
      {availableTypes.map((type) => {
        const Icon = ICONS[type] || BarChart3;
        const isActive = activeType === type;
        const isRec = recommendedType === type;
        return (
          <button key={type} onClick={() => onTypeChange(type)} title={`${type}${isRec ? " (Recommended)" : ""}`}
            className="relative flex items-center justify-center w-7 h-7 rounded-md transition-all duration-200"
            style={{ backgroundColor: isActive ? "var(--bg-primary)" : "transparent", color: isActive ? "var(--stripe-purple)" : "var(--text-tertiary)", boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.08)" : "none" }}>
            <Icon className="w-3.5 h-3.5" strokeWidth={isActive ? 2.5 : 2} />
            {isRec && <span className="absolute bottom-[2px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ backgroundColor: isActive ? "var(--stripe-purple)" : "var(--stripe-purple)" }} />}
          </button>
        );
      })}
    </div>
  );
}
