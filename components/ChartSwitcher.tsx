"use client";

import { BarChart3, TrendingUp, AreaChart, PieChart, CircleDot, Hexagon } from "lucide-react";
import type { ChartType } from "@/lib/types";

interface ChartSwitcherProps {
  activeType: ChartType;
  recommendedType: ChartType;
  onTypeChange: (type: ChartType) => void;
  availableTypes?: ChartType[];
}

const ICONS: Record<string, React.ElementType> = {
  bar: BarChart3, line: TrendingUp, area: AreaChart, pie: PieChart, donut: CircleDot, radar: Hexagon,
};
const TYPES: ChartType[] = ["bar", "line", "area", "pie", "donut", "radar"];

export function ChartSwitcher({ activeType, recommendedType, onTypeChange, availableTypes = TYPES }: ChartSwitcherProps) {
  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/8">
      {availableTypes.map((type) => {
        const Icon = ICONS[type] || BarChart3;
        const isActive = activeType === type;
        const isRec = recommendedType === type;
        return (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            title={`${type} chart${isRec ? " (Recommended)" : ""}`}
            className={`relative flex items-center justify-center w-7 h-7 rounded-md transition-all duration-200 ${
              isActive ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white/70 hover:bg-white/5"
            }`}
          >
            <Icon className="w-3.5 h-3.5" strokeWidth={isActive ? 2.5 : 2} />
            {isRec && <span className={`absolute bottom-[2px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isActive ? "bg-white" : "bg-[#635BFF]"}`} />}
          </button>
        );
      })}
    </div>
  );
}
