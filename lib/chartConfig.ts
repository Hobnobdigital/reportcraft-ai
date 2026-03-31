export const CHART_COLORS = [
  "#635BFF",
  "#00D4AA",
  "#0073E6",
  "#FFBB00",
  "#DF1B41",
  "#8B5CF6",
];

export const CHART_THEME = {
  colors: CHART_COLORS,
  grid: {
    stroke: "#E3E8EE",
    strokeDasharray: "3 3",
  },
  axis: {
    stroke: "#8898AA",
    fontSize: 12,
    fontFamily: "Geist, sans-serif",
  },
  tooltip: {
    background: "#0A2540",
    border: "none",
    borderRadius: 8,
    color: "#FFFFFF",
    boxShadow: "0 8px 16px rgba(10,37,64,0.2)",
    fontSize: 13,
  },
};

export const DARK_CHART_THEME = {
  ...CHART_THEME,
  grid: {
    stroke: "#1E4976",
    strokeDasharray: "3 3",
  },
  axis: {
    ...CHART_THEME.axis,
    stroke: "#6B7C93",
  },
};

export function getTooltipStyle(isDark: boolean) {
  return {
    contentStyle: {
      backgroundColor: isDark ? "#1A3A5C" : "#0A2540",
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
}
