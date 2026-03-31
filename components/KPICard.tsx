"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { KPI } from "@/lib/types";
import { formatValue } from "@/lib/utils";

interface KPICardProps { kpi: KPI; index: number; }

export function KPICard({ kpi, index }: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const isUp = kpi.trend === "up";

  useEffect(() => {
    let start: number;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1200, 1);
      setDisplayValue(kpi.value * (p === 1 ? 1 : 1 - Math.pow(2, -10 * p)));
      if (p < 1) requestAnimationFrame(animate); else setDisplayValue(kpi.value);
    };
    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [kpi.value]);

  return (
    <div className="glass-panel p-5" style={{ animation: `fadeUp 0.6s var(--ease-out) ${index * 100}ms both` }}>
      <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-tertiary)" }}>{kpi.label}</p>
      <div className="flex items-end justify-between mb-3">
        <span className="metric text-2xl">{formatValue(displayValue, kpi.format)}</span>
        <div className="h-10 w-24">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={kpi.sparklineData.map((v, i) => ({ v, i }))}>
              <Line type="monotone" dataKey="v" stroke={isUp ? "var(--trend-up)" : "var(--trend-down)"} strokeWidth={2} dot={false} strokeLinecap="round" animationDuration={1000} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="flex items-center gap-2 text-[12px] font-medium">
        <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md" style={{ backgroundColor: isUp ? "var(--trend-up-bg)" : "var(--trend-down-bg)", color: isUp ? "var(--trend-up)" : "var(--trend-down)" }}>
          {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{kpi.trendValue.toFixed(1)}%
        </span>
        <span style={{ color: "var(--text-tertiary)" }}>vs last period</span>
      </div>
    </div>
  );
}
