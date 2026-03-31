"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { KPI } from "@/lib/types";
import { formatValue } from "@/lib/utils";

interface KPICardProps {
  kpi: KPI;
  index: number;
}

export function KPICard({ kpi, index }: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const isUp = kpi.trend === "up";

  useEffect(() => {
    let start: number;
    const duration = 1200;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setDisplayValue(kpi.value * eased);
      if (p < 1) requestAnimationFrame(animate);
      else setDisplayValue(kpi.value);
    };
    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [kpi.value]);

  const sparkData = kpi.sparklineData.map((v, i) => ({ v, i }));

  return (
    <div
      className="glass-panel relative overflow-hidden p-6 rounded-2xl group cursor-default"
      style={{ animation: `fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 100}ms both` }}
    >
      {/* Shimmer edge on hover */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex items-center gap-2 mb-4">
        <span className="text-[13px] font-medium text-white/50 tracking-wide">
          {kpi.label}
        </span>
      </div>

      <div className="flex items-end justify-between mb-4">
        <span className="text-3xl font-semibold text-white tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>
          {formatValue(displayValue, kpi.format)}
        </span>
        <div className="h-10 w-24">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData}>
              <Line
                type="monotone"
                dataKey="v"
                stroke={isUp ? "#10B981" : "#DF1B41"}
                strokeWidth={2}
                dot={false}
                strokeLinecap="round"
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[12px] font-medium">
        <span className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md border ${
          isUp
            ? "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20"
            : "text-[#DF1B41] bg-[#DF1B41]/10 border-[#DF1B41]/20"
        }`}>
          {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {kpi.trendValue.toFixed(1)}%
        </span>
        <span className="text-white/30">vs last period</span>
      </div>
    </div>
  );
}
