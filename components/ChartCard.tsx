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

interface ChartCardProps { chart: ChartConfig; index: number; }

function mapType(t: string): ChartType { return t === "composed" ? "bar" : t as ChartType; }

const tooltipStyle = {
  contentStyle: { backgroundColor: "var(--tooltip-bg)", border: "1px solid var(--border-primary)", borderRadius: 10, color: "var(--tooltip-text)", boxShadow: "0 8px 24px rgba(0,0,0,0.15)", fontSize: 13, fontFamily: "Geist, sans-serif" },
  labelStyle: { color: "var(--tooltip-label)", fontSize: 11, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: 4 },
};

const axisProps = { stroke: "var(--chart-axis)", fontSize: 11, fontFamily: "Geist, sans-serif", tickLine: false, axisLine: false };

export function ChartCard({ chart, index }: ChartCardProps) {
  const rec = mapType(chart.type);
  const [activeType, setActiveType] = useState<ChartType>(rec);
  const [insightOpen, setInsightOpen] = useState(false);
  const colors = chart.colors?.length ? chart.colors : CHART_COLORS;

  const renderChart = () => {
    const grid = "var(--chart-grid)";
    switch (activeType) {
      case "bar": return (<BarChart data={chart.data}><CartesianGrid stroke={grid} strokeDasharray="3 3" vertical={false} /><XAxis dataKey={chart.xKey} {...axisProps} /><YAxis {...axisProps} /><Tooltip {...tooltipStyle} />{chart.yKeys.map((k, i) => <Bar key={k} dataKey={k} fill={colors[i % colors.length]} radius={[4,4,0,0]} maxBarSize={48} animationDuration={800} />)}</BarChart>);
      case "line": return (<LineChart data={chart.data}><CartesianGrid stroke={grid} strokeDasharray="3 3" vertical={false} /><XAxis dataKey={chart.xKey} {...axisProps} /><YAxis {...axisProps} /><Tooltip {...tooltipStyle} />{chart.yKeys.map((k, i) => <Line key={k} type="monotone" dataKey={k} stroke={colors[i % colors.length]} strokeWidth={2} dot={{ fill: "var(--bg-primary)", strokeWidth: 2, r: 3 }} animationDuration={800} />)}</LineChart>);
      case "area": return (<AreaChart data={chart.data}><defs>{chart.yKeys.map((k, i) => <linearGradient key={k} id={`ag-${index}-${i}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={colors[i % colors.length]} stopOpacity={0.3} /><stop offset="100%" stopColor={colors[i % colors.length]} stopOpacity={0} /></linearGradient>)}</defs><CartesianGrid stroke={grid} strokeDasharray="3 3" vertical={false} /><XAxis dataKey={chart.xKey} {...axisProps} /><YAxis {...axisProps} /><Tooltip {...tooltipStyle} />{chart.yKeys.map((k, i) => <Area key={k} type="monotone" dataKey={k} stroke={colors[i % colors.length]} fill={`url(#ag-${index}-${i})`} strokeWidth={2} animationDuration={800} />)}</AreaChart>);
      case "pie": case "donut": return (<PieChart><Tooltip {...tooltipStyle} /><Pie data={chart.data} dataKey={chart.yKeys[0]} nameKey={chart.xKey} cx="50%" cy="50%" innerRadius={activeType === "donut" ? "60%" : 0} outerRadius="80%" stroke="var(--bg-primary)" strokeWidth={2} animationDuration={800}>{chart.data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}</Pie><Legend verticalAlign="bottom" iconType="circle" iconSize={8} /></PieChart>);
      case "radar": return (<RadarChart cx="50%" cy="50%" outerRadius="70%" data={chart.data}><PolarGrid stroke={grid} /><PolarAngleAxis dataKey={chart.xKey} tick={{ fill: "var(--chart-axis)", fontSize: 11 }} /><Tooltip {...tooltipStyle} />{chart.yKeys.map((k, i) => <Radar key={k} name={k} dataKey={k} stroke={colors[i % colors.length]} strokeWidth={2} fill={colors[i % colors.length]} fillOpacity={0.15} animationDuration={800} />)}</RadarChart>);
      default: return <div />;
    }
  };

  return (
    <div className="glass-panel flex flex-col" style={{ animation: `fadeUp 0.6s var(--ease-out) ${(index + 4) * 100}ms both` }}>
      <div className="p-5 pb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>{chart.title}</h3>
        <ChartSwitcher activeType={activeType} recommendedType={rec} onTypeChange={setActiveType} />
      </div>
      <div className="px-5 h-72"><ResponsiveContainer width="100%" height="100%">{renderChart()}</ResponsiveContainer></div>
      {chart.insight && (
        <div className="px-5 pb-5 pt-2">
          <button onClick={() => setInsightOpen(!insightOpen)} className="flex items-center gap-1.5 text-[13px] font-medium transition-colors" style={{ color: "var(--text-tertiary)" }}>
            <Sparkles size={14} style={{ color: "var(--stripe-purple)" }} /> AI Insight
            <ChevronDown size={14} style={{ transform: insightOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s" }} />
          </button>
          {insightOpen && <div className="mt-3 p-3 rounded-lg text-[13px] leading-relaxed" style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border-primary)" }}>{chart.insight}</div>}
        </div>
      )}
    </div>
  );
}
