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

function mapConfigType(type: string): ChartType {
  if (type === "composed") return "bar";
  return type as ChartType;
}

const tooltipStyle = {
  contentStyle: {
    backgroundColor: "#0A2540",
    border: "none",
    borderRadius: 8,
    color: "#FFFFFF",
    boxShadow: "0 8px 16px rgba(10,37,64,0.2)",
    fontSize: 13,
    fontFamily: "Geist, sans-serif",
  },
  labelStyle: {
    color: "#ADBDCC",
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    marginBottom: 4,
  },
};

const axisProps = {
  stroke: "#8898AA",
  fontSize: 12,
  fontFamily: "Geist, sans-serif",
  tickLine: false,
  axisLine: false,
};

export function ChartCard({ chart, index }: ChartCardProps) {
  const recommendedType = mapConfigType(chart.type);
  const [activeType, setActiveType] = useState<ChartType>(recommendedType);
  const [insightOpen, setInsightOpen] = useState(false);
  const colors = chart.colors?.length ? chart.colors : CHART_COLORS;

  const renderChart = () => {
    switch (activeType) {
      case "bar":
        return (
          <BarChart data={chart.data}>
            <CartesianGrid stroke="#E3E8EE" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={chart.xKey} {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip {...tooltipStyle} />
            {chart.yKeys.map((key, i) => (
              <Bar key={key} dataKey={key} fill={colors[i % colors.length]} radius={[4, 4, 0, 0]} maxBarSize={48} animationDuration={800} />
            ))}
          </BarChart>
        );

      case "line":
        return (
          <LineChart data={chart.data}>
            <CartesianGrid stroke="#E3E8EE" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={chart.xKey} {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip {...tooltipStyle} />
            {chart.yKeys.map((key, i) => (
              <Line key={key} type="monotone" dataKey={key} stroke={colors[i % colors.length]} strokeWidth={2} dot={{ fill: colors[i % colors.length], r: 3 }} strokeLinecap="round" animationDuration={800} />
            ))}
          </LineChart>
        );

      case "area":
        return (
          <AreaChart data={chart.data}>
            <defs>
              {chart.yKeys.map((key, i) => (
                <linearGradient key={key} id={`area-grad-${index}-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors[i % colors.length]} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={colors[i % colors.length]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid stroke="#E3E8EE" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={chart.xKey} {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip {...tooltipStyle} />
            {chart.yKeys.map((key, i) => (
              <Area key={key} type="monotone" dataKey={key} stroke={colors[i % colors.length]} fill={`url(#area-grad-${index}-${i})`} strokeWidth={2} strokeLinecap="round" animationDuration={800} />
            ))}
          </AreaChart>
        );

      case "pie":
        return (
          <PieChart>
            <Tooltip {...tooltipStyle} />
            <Pie data={chart.data} dataKey={chart.yKeys[0]} nameKey={chart.xKey} cx="50%" cy="50%" outerRadius="80%" stroke="#FFFFFF" strokeWidth={2} animationDuration={800}
              label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
            >
              {chart.data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" iconType="circle" iconSize={8} />
          </PieChart>
        );

      case "donut":
        return (
          <PieChart>
            <Tooltip {...tooltipStyle} />
            <Pie data={chart.data} dataKey={chart.yKeys[0]} nameKey={chart.xKey} cx="50%" cy="50%" innerRadius="60%" outerRadius="80%" stroke="#FFFFFF" strokeWidth={2} animationDuration={800}>
              {chart.data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" iconType="circle" iconSize={8} />
          </PieChart>
        );

      case "radar":
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chart.data}>
            <PolarGrid stroke="#E3E8EE" />
            <PolarAngleAxis dataKey={chart.xKey} tick={{ fill: "#8898AA", fontSize: 11 }} />
            <Tooltip {...tooltipStyle} />
            {chart.yKeys.map((key, i) => (
              <Radar key={key} name={key} dataKey={key} stroke={colors[i % colors.length]} strokeWidth={2} fill={colors[i % colors.length]} fillOpacity={0.2} animationDuration={800} />
            ))}
          </RadarChart>
        );

      default:
        return <div />;
    }
  };

  return (
    <div
      className="glass-card flex flex-col animate-fadeUp"
      style={{ animationDelay: `${(index + 4) * 80}ms` }}
    >
      <div className="p-5 pb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#0A2540]" style={{ letterSpacing: "-0.01em" }}>
          {chart.title}
        </h3>
        <ChartSwitcher
          activeType={activeType}
          recommendedType={recommendedType}
          onTypeChange={setActiveType}
        />
      </div>

      <div className="px-5 h-72">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {chart.insight && (
        <div className="px-5 pb-5 pt-2">
          <button
            onClick={() => setInsightOpen(!insightOpen)}
            className="flex items-center gap-1.5 text-[13px] font-medium text-[#425466] hover:text-[#0A2540] transition-colors"
          >
            <Sparkles size={14} className="text-[#8898AA]" />
            AI Insight
            <ChevronDown
              size={14}
              className="text-[#8898AA] transition-transform duration-300"
              style={{ transform: insightOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>
          {insightOpen && (
            <div className="mt-3 p-3.5 rounded-lg text-[13px] leading-relaxed bg-[#F6F9FC] text-[#425466] border border-[#E3E8EE]">
              {chart.insight}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
