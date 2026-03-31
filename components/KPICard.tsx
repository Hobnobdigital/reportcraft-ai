"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
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
    const duration = 800;
    const steps = 30;
    const increment = kpi.value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += increment;
      if (step >= steps) {
        setDisplayValue(kpi.value);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [kpi.value]);

  const sparkData = kpi.sparklineData.map((v, i) => ({ v, i }));

  return (
    <div
      className="stripe-card p-5 animate-fadeUp"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <p
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: "var(--text-tertiary)" }}
        >
          {kpi.label}
        </p>
        <div
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
          style={{
            backgroundColor: isPositive ? "var(--success-bg)" : "var(--error-bg)",
            color: isPositive ? "var(--success)" : "var(--error)",
          }}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {kpi.trendValue.toFixed(1)}%
        </div>
      </div>

      <p className="metric text-2xl mb-3" style={{ color: "var(--text-primary)" }}>
        {formatValue(displayValue, kpi.format)}
      </p>

      <div className="h-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData}>
            <Line
              type="monotone"
              dataKey="v"
              stroke={isPositive ? "#00D4AA" : "#DF1B41"}
              strokeWidth={2}
              dot={false}
              strokeLinecap="round"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
