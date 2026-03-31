export interface KPI {
  label: string;
  value: number;
  format: "number" | "currency" | "percentage";
  trend: "up" | "down";
  trendValue: number;
  sparklineData: number[];
}

export type ChartType = "bar" | "line" | "area" | "pie" | "donut" | "radar" | "3d-bar" | "3d-scatter";

export interface ChartConfig {
  type: "bar" | "line" | "area" | "pie" | "composed";
  title: string;
  xKey: string;
  yKeys: string[];
  colors: string[];
  data: Record<string, unknown>[];
  insight?: string;
}

export interface AnalysisResult {
  kpis: KPI[];
  charts: ChartConfig[];
  insights: string[];
}

export interface ParsedData {
  data: Record<string, unknown>[];
  columns: string[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  data: Record<string, unknown>[];
  columns: string[];
}

export type LayoutPreset = "executive" | "deep-dive" | "presentation" | "custom";

export interface DashboardState {
  parsedData: ParsedData | null;
  analysis: AnalysisResult | null;
  narrative: string | null;
  isAnalyzing: boolean;
  isGeneratingNarrative: boolean;
  error: string | null;
  activeTemplate: string | null;
  fileName: string | null;
  layout: LayoutPreset;
}

export interface ExportOptions {
  title: string;
  includeCover: boolean;
  includeSummary: boolean;
  includeCharts: boolean;
  includeAppendix: boolean;
}
