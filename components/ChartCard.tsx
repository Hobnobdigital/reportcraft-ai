"use client";

import { useTheme } from "next-themes";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartConfig } from "@/lib/types";
import { CHART_COLORS, getTooltipStyle } from "@/lib/chartConfig";

interface ChartCardProps {
  chart: ChartConfig;
  index: number;
}

export function ChartCard({ chart, index }: ChartCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const tooltipStyle = getTooltipStyle(isDark);
  const gridColor = isDark ? "#1E4976" : "#E3E8EE";
  const axisColor = isDark ? "#6B7C93" : "#8898AA";
  const colors = chart.colors?.length ? chart.colors : CHART_COLORS;

  const renderChart = () => {
    const commonAxisProps = {
      stroke: axisColor,
      fontSize: 12,
      fontFamily: "Geist, sans-serif",
      tickLine: false,
      axisLine: false,
    };

    switch (chart.type) {
      case "bar":
        return (
          <BarChart data={chart.data}>
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={chart.xKey} {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            <Tooltip {...tooltipStyle} />
            <Legend />
            {chart.yKeys.map((key, i) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[i % colors.length]}
                radius={[4, 4, 0, 0]}
                animationDuration={800}
                animationBegin={index * 200}
              />
            ))}
          </BarChart>
        );

      case "line":
        return (
          <LineChart data={chart.data}>
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={chart.xKey} {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            <Tooltip {...tooltipStyle} />
            <Legend />
            {chart.yKeys.map((key, i) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[i % colors.length]}
                strokeWidth={2}
                dot={{ fill: colors[i % colors.length], r: 3 }}
                strokeLinecap="round"
                animationDuration={800}
                animationBegin={index * 200}
              />
            ))}
          </LineChart>
        );

      case "area":
        return (
          <AreaChart data={chart.data}>
            <defs>
              {chart.yKeys.map((key, i) => (
                <linearGradient key={key} id={`gradient-${index}-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors[i % colors.length]} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={colors[i % colors.length]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={chart.xKey} {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            <Tooltip {...tooltipStyle} />
            <Legend />
            {chart.yKeys.map((key, i) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[i % colors.length]}
                fill={`url(#gradient-${index}-${i})`}
                strokeWidth={2}
                strokeLinecap="round"
                animationDuration={800}
                animationBegin={index * 200}
              />
            ))}
          </AreaChart>
        );

      case "pie":
        return (
          <PieChart>
            <Tooltip {...tooltipStyle} />
            <Pie
              data={chart.data}
              dataKey={chart.yKeys[0]}
              nameKey={chart.xKey}
              cx="50%"
              cy="50%"
              outerRadius="80%"
              animationDuration={800}
              animationBegin={index * 200}
              label={({ name, percent }) =>
                `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
              }
              labelLine={{ stroke: axisColor }}
            >
              {chart.data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        );

      case "composed":
        return (
          <ComposedChart data={chart.data}>
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={chart.xKey} {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            <Tooltip {...tooltipStyle} />
            <Legend />
            {chart.yKeys.map((key, i) =>
              i === 0 ? (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={colors[i % colors.length]}
                  radius={[4, 4, 0, 0]}
                  animationDuration={800}
                />
              ) : (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[i % colors.length]}
                  strokeWidth={2}
                  dot={{ fill: colors[i % colors.length], r: 3 }}
                  animationDuration={800}
                />
              )
            )}
          </ComposedChart>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="stripe-card p-5 animate-fadeUp"
      style={{ animationDelay: `${(index + 4) * 80}ms` }}
    >
      <h3
        className="text-sm font-semibold mb-4"
        style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
      >
        {chart.title}
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart() || <div />}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
