"use client";

import {
  BarChart3,
  TrendingUp,
  AreaChart,
  PieChart,
  CircleDot,
  Hexagon,
} from "lucide-react";
import type { ChartType } from "@/lib/types";

interface ChartSwitcherProps {
  activeType: ChartType;
  recommendedType: ChartType;
  onTypeChange: (type: ChartType) => void;
  availableTypes?: ChartType[];
}

const CHART_ICONS: Record<string, React.ElementType> = {
  bar: BarChart3,
  line: TrendingUp,
  area: AreaChart,
  pie: PieChart,
  donut: CircleDot,
  radar: Hexagon,
};

const DEFAULT_TYPES: ChartType[] = ["bar", "line", "area", "pie", "donut", "radar"];

export function ChartSwitcher({
  activeType,
  recommendedType,
  onTypeChange,
  availableTypes = DEFAULT_TYPES,
}: ChartSwitcherProps) {
  return (
    <div
      className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#F6F9FC] border border-[#E6EBF1]"
      style={{ boxShadow: "0 1px 2px rgba(10,37,64,0.04)" }}
      role="toolbar"
      aria-label="Chart type switcher"
    >
      {availableTypes.map((type) => {
        const Icon = CHART_ICONS[type] || BarChart3;
        const isActive = activeType === type;
        const isRecommended = recommendedType === type;

        return (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            type="button"
            title={`${type.charAt(0).toUpperCase() + type.slice(1)} chart${isRecommended ? " (Recommended)" : ""}`}
            className={`
              relative flex items-center justify-center w-7 h-7 rounded-md
              transition-all duration-200
              ${isActive
                ? "bg-[#635BFF] text-white shadow-sm"
                : "bg-transparent text-[#8898AA] hover:bg-[#F0F3F7] hover:text-[#425466]"
              }
            `}
          >
            <Icon className="w-3.5 h-3.5" strokeWidth={isActive ? 2.5 : 2} />
            {isRecommended && (
              <span
                className={`absolute bottom-[2px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isActive ? "bg-white" : "bg-[#635BFF]"}`}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
