"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, PanelLeftClose, PanelLeft } from "lucide-react";
import { useAccessCode } from "@/components/AccessCodeProvider";
import { FileUpload } from "@/components/FileUpload";
import { TemplateSelector } from "@/components/TemplateSelector";
import { DataPreview } from "@/components/DataPreview";
import { DashboardGrid } from "@/components/DashboardGrid";
import { LoadingState } from "@/components/LoadingState";
import { ExportButton } from "@/components/ExportButton";
import { LayoutSwitcher } from "@/components/LayoutSwitcher";
import { QueryInput } from "@/components/QueryInput";
import { ChartCard } from "@/components/ChartCard";
import { templates } from "@/lib/templates";
import type { ParsedData, AnalysisResult, DashboardState, LayoutPreset, ChartConfig } from "@/lib/types";

export function DashboardContent() {
  const searchParams = useSearchParams();
  const { accessCode, isAuthenticated } = useAccessCode();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [queryChart, setQueryChart] = useState<ChartConfig | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);

  const [state, setState] = useState<DashboardState>({
    parsedData: null,
    analysis: null,
    narrative: null,
    isAnalyzing: false,
    isGeneratingNarrative: false,
    error: null,
    activeTemplate: null,
    fileName: null,
    layout: "executive",
  });

  const handleDataParsed = useCallback((data: ParsedData, fileName: string) => {
    setState((prev) => ({ ...prev, parsedData: data, fileName, activeTemplate: null, analysis: null, narrative: null, error: null }));
    setQueryChart(null);
  }, []);

  const handleTemplateSelect = useCallback((data: ParsedData, templateId: string) => {
    setState((prev) => ({ ...prev, parsedData: data, activeTemplate: templateId, fileName: null, analysis: null, narrative: null, error: null }));
    setQueryChart(null);
  }, []);

  const handleDataChange = useCallback((data: ParsedData) => {
    setState((prev) => ({ ...prev, parsedData: data, analysis: null, narrative: null }));
  }, []);

  const handleLayoutChange = useCallback((layout: LayoutPreset) => {
    setState((prev) => ({ ...prev, layout }));
  }, []);

  const handleQuery = async (query: string) => {
    if (!state.parsedData || !accessCode) return;
    setIsQuerying(true);
    setQueryChart(null);
    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-access-code": accessCode },
        body: JSON.stringify({ query, data: state.parsedData.data, columns: state.parsedData.columns }),
      });
      if (!res.ok) throw new Error("Query failed");
      const chart = await res.json();
      setQueryChart(chart as ChartConfig);
    } catch (err) {
      console.error(err);
    }
    setIsQuerying(false);
  };

  useEffect(() => {
    const tp = searchParams.get("template");
    if (tp) {
      const t = templates.find((t) => t.id === tp);
      if (t) handleTemplateSelect({ data: t.data as Record<string, unknown>[], columns: t.columns }, t.id);
    }
  }, [searchParams, handleTemplateSelect]);

  const generateDashboard = async () => {
    if (!state.parsedData || !accessCode) return;
    setState((prev) => ({ ...prev, isAnalyzing: true, error: null, analysis: null, narrative: null }));

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-access-code": accessCode },
        body: JSON.stringify({ data: state.parsedData.data, columns: state.parsedData.columns, template: state.activeTemplate || undefined }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Analysis failed"); }
      const analysis: AnalysisResult = await res.json();
      setState((prev) => ({ ...prev, analysis, isAnalyzing: false, isGeneratingNarrative: true }));

      const nRes = await fetch("/api/narrative", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-access-code": accessCode },
        body: JSON.stringify({ kpis: analysis.kpis, charts: analysis.charts, insights: analysis.insights, columns: state.parsedData!.columns }),
      });
      if (nRes.ok) {
        const { narrative } = await nRes.json();
        setState((prev) => ({ ...prev, narrative, isGeneratingNarrative: false }));
      } else {
        setState((prev) => ({ ...prev, isGeneratingNarrative: false }));
      }
    } catch (error) {
      setState((prev) => ({ ...prev, isAnalyzing: false, isGeneratingNarrative: false, error: error instanceof Error ? error.message : "Something went wrong" }));
    }
  };

  const suggestedTitle = state.activeTemplate
    ? `${templates.find((t) => t.id === state.activeTemplate)?.name || "Dashboard"} Report`
    : state.fileName ? `${state.fileName.replace(/\.[^.]+$/, "")} Report` : "Dashboard Report";

  return (
    <div className="min-h-screen pt-16 flex relative">
      {/* Background mesh */}
      <div className="mesh-bg"><div className="grid-pattern" /></div>

      {/* Sidebar */}
      <aside className="flex-shrink-0 border-r transition-all duration-300 overflow-hidden relative z-10"
        style={{ width: sidebarOpen ? 320 : 0, borderColor: "rgba(255,255,255,0.05)", backgroundColor: "rgba(5,5,16,0.6)", backdropFilter: "blur(16px)" }}>
        <div className="w-80 h-full overflow-y-auto p-5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white/90 tracking-tight">Data Source</h2>
            <button onClick={() => setSidebarOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-md text-white/40 hover:text-white hover:bg-white/5 transition-colors">
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>
          <FileUpload onDataParsed={handleDataParsed} />
          <div className="border-t border-white/5" />
          <TemplateSelector onSelect={handleTemplateSelect} activeTemplate={state.activeTemplate} />
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 relative z-10">
        <div className="max-w-[1400px] mx-auto p-6">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6" style={{ animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both" }}>
            <div className="flex items-center gap-3">
              {!sidebarOpen && (
                <button onClick={() => setSidebarOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-lg text-white/50 border border-white/10 hover:bg-white/5 transition-colors">
                  <PanelLeft className="w-4 h-4" />
                </button>
              )}
              <div>
                <h1 className="text-xl font-semibold text-white tracking-tight">Dashboard Builder</h1>
                {state.fileName && <p className="text-xs mt-0.5 text-white/40">{state.fileName}</p>}
                {state.activeTemplate && <p className="text-xs mt-0.5 text-white/40">Template: {templates.find((t) => t.id === state.activeTemplate)?.name}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {state.analysis && (
                <>
                  <LayoutSwitcher activeLayout={state.layout} onLayoutChange={handleLayoutChange} />
                  <ExportButton targetId="dashboard-export" suggestedTitle={suggestedTitle} />
                </>
              )}
              {state.parsedData && (
                <button onClick={generateDashboard} disabled={state.isAnalyzing || !isAuthenticated}
                  className="btn-primary py-2.5 px-5 disabled:opacity-40 disabled:cursor-not-allowed">
                  <Sparkles className="w-4 h-4" />
                  {state.isAnalyzing ? "Analyzing..." : "Generate Dashboard"}
                </button>
              )}
            </div>
          </div>

          {/* Query Input — shown when data is loaded */}
          {state.parsedData && state.analysis && (
            <div className="flex justify-center mb-8" style={{ animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 200ms both" }}>
              <QueryInput onQuery={handleQuery} isLoading={isQuerying} disabled={!isAuthenticated} />
            </div>
          )}

          {/* Query result chart */}
          {queryChart && (
            <div className="mb-6" style={{ animation: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both" }}>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-[#635BFF]" />
                <span className="text-[13px] font-medium text-white/50">Query Result</span>
              </div>
              <ChartCard chart={queryChart} index={0} />
            </div>
          )}

          {/* Error */}
          {state.error && (
            <div className="mb-6 p-4 rounded-lg border text-sm" style={{ backgroundColor: "rgba(223,27,65,0.08)", borderColor: "rgba(223,27,65,0.2)", color: "#DF1B41", animation: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both" }}>
              {state.error}
            </div>
          )}

          {/* Data preview */}
          {state.parsedData && !state.analysis && !state.isAnalyzing && (
            <DataPreview data={state.parsedData} onDataChange={handleDataChange} />
          )}

          {/* Loading */}
          {state.isAnalyzing && <LoadingState />}

          {/* Dashboard */}
          {state.analysis && <DashboardGrid analysis={state.analysis} narrative={state.narrative} layout={state.layout} />}

          {/* Empty state */}
          {!state.parsedData && !state.isAnalyzing && (
            <div className="flex flex-col items-center justify-center py-24 text-center" style={{ animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both" }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-[#635BFF]/10 border border-[#635BFF]/20">
                <Sparkles className="w-7 h-7 text-[#635BFF]" />
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">Ready to analyze</h2>
              <p className="text-sm text-white/40 max-w-sm">Upload a CSV or Excel file, or select a template from the sidebar to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
