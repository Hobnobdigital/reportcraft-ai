"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { KPI } from "@/lib/types";
import { formatValue } from "@/lib/utils";

interface KPICardProps {
  kpi: KPI;
  index: number;
}

export function KPICard({ kpi, index }: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const isPositive = kpi.trend === "up";

  useEffect(() => {
    let startTime: number;
    const duration = 800;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(kpi.value * eased);
      if (progress < 1) requestAnimationFrame(animate);
      else setDisplayValue(kpi.value);
    };

    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [kpi.value]);

  const sparkData = kpi.sparklineData.map((v, i) => ({ v, i }));

  return (
    <div
      className="glass-card p-5 animate-fadeUp"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#8898AA]">
          {kpi.label}
        </p>
        <div
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
          style={{
            backgroundColor: isPositive ? "rgba(14,98,69,0.08)" : "rgba(223,27,65,0.08)",
            color: isPositive ? "#0E6245" : "#DF1B41",
          }}
        >
          {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          {kpi.trendValue.toFixed(1)}%
        </div>
      </div>

      <div className="flex items-end justify-between">
        <p className="metric text-2xl text-[#0A2540]">
          {formatValue(displayValue, kpi.format)}
        </p>
        <div className="h-10 w-24">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData}>
              <Line
                type="monotone"
                dataKey="v"
                stroke={isPositive ? "#00D4AA" : "#DF1B41"}
                strokeWidth={2}
                dot={false}
                strokeLinecap="round"
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
