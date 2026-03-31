"use client";

import { useState } from "react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Sparkles, ChevronDown } from "lucide-react";
import { ChartConfig, ChartType } from "@/lib/types";
import { CHART_COLORS } from "@/lib/chartConfig";
import { ChartSwitcher } from "./ChartSwitcher";

interface ChartCardProps {
  chart: ChartConfig;
  index: number;
}

function mapType(type: string): ChartType {
  if (type === "composed") return "bar";
  return type as ChartType;
}

const tooltipStyle = {
  contentStyle: {
    backgroundColor: "rgba(15,15,25,0.95)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    color: "#ffffff",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    fontSize: 13,
    fontFamily: "Geist, sans-serif",
    backdropFilter: "blur(16px)",
  },
  labelStyle: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    marginBottom: 4,
  },
};

const axisProps = {
  stroke: "rgba(255,255,255,0.15)",
  fontSize: 11,
  fontFamily: "Geist, sans-serif",
  tickLine: false,
  axisLine: false,
  tick: { fill: "rgba(255,255,255,0.4)" },
};

export function ChartCard({ chart, index }: ChartCardProps) {
  const recommended = mapType(chart.type);
  const [activeType, setActiveType] = useState<ChartType>(recommended);
  const [insightOpen, setInsightOpen] = useState(false);
  const colors = chart.colors?.length ? chart.colors : CHART_COLORS;

  const renderChart = () => {
    const gridStroke = "rgba(255,255,255,0.05)";

    switch (activeType) {
      case "bar":
        return (
          <BarChart data={chart.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={chart.xKey} {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip {...tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            {chart.yKeys.map((key, i) => (
              <Bar key={key} dataKey={key} fill={colors[i % colors.length]} radius={[4, 4, 0, 0]} maxBarSize={48} animationDuration={800} />
            ))}
          </BarChart>
        );
      case "line":
        return (
          <LineChart data={chart.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={chart.xKey} {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip {...tooltipStyle} cursor={{ stroke: "rgba(255,255,255,0.1)", strokeDasharray: "4 4" }} />
            {chart.yKeys.map((key, i) => (
              <Line key={key} type="monotone" dataKey={key} stroke={colors[i % colors.length]} strokeWidth={2} dot={{ r: 3, fill: "#050510", strokeWidth: 2 }} activeDot={{ r: 5, strokeWidth: 0 }} animationDuration={800} />
            ))}
          </LineChart>
        );
      case "area":
        return (
          <AreaChart data={chart.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {chart.yKeys.map((key, i) => (
                <linearGradient key={key} id={`ag-${index}-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[i % colors.length]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors[i % colors.length]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={chart.xKey} {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip {...tooltipStyle} cursor={{ stroke: "rgba(255,255,255,0.1)", strokeDasharray: "4 4" }} />
            {chart.yKeys.map((key, i) => (
              <Area key={key} type="monotone" dataKey={key} stroke={colors[i % colors.length]} fill={`url(#ag-${index}-${i})`} strokeWidth={2} animationDuration={800} />
            ))}
          </AreaChart>
        );
      case "pie":
      case "donut":
        return (
          <PieChart>
            <Tooltip {...tooltipStyle} />
            <Pie data={chart.data} dataKey={chart.yKeys[0]} nameKey={chart.xKey} cx="50%" cy="50%" innerRadius={activeType === "donut" ? "60%" : 0} outerRadius="80%" stroke="rgba(5,5,16,0.8)" strokeWidth={2} animationDuration={800}>
              {chart.data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
            </Pie>
            <Legend verticalAlign="bottom" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }} />
          </PieChart>
        );
      case "radar":
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chart.data}>
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis dataKey={chart.xKey} tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} />
            <Tooltip {...tooltipStyle} />
            {chart.yKeys.map((key, i) => (
              <Radar key={key} name={key} dataKey={key} stroke={colors[i % colors.length]} strokeWidth={2} fill={colors[i % colors.length]} fillOpacity={0.15} animationDuration={800} />
            ))}
          </RadarChart>
        );
      default:
        return <div />;
    }
  };

  return (
    <div
      className="glass-panel relative overflow-hidden flex flex-col"
      style={{ animation: `fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) ${(index + 4) * 100}ms both` }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />

      <div className="p-6 pb-3 flex items-center justify-between">
        <h3 className="text-[15px] font-medium text-white/95 tracking-tight">{chart.title}</h3>
        <ChartSwitcher activeType={activeType} recommendedType={recommended} onTypeChange={setActiveType} />
      </div>

      <div className="px-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {chart.insight && (
        <div className="px-6 pb-5 pt-2">
          <button onClick={() => setInsightOpen(!insightOpen)} className="flex items-center gap-1.5 text-[13px] font-medium text-white/40 hover:text-white/70 transition-colors">
            <Sparkles size={14} className="text-[#635BFF]" />
            AI Insight
            <ChevronDown size={14} style={{ transform: insightOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s" }} />
          </button>
          {insightOpen && (
            <div className="mt-3 p-3.5 rounded-lg text-[13px] leading-relaxed text-white/60 bg-white/[0.03] border border-white/5">
              {chart.insight}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
