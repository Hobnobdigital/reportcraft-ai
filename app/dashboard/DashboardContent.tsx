"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, PanelLeftClose, PanelLeft, MessageSquare } from "lucide-react";
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

interface QueryResult {
  chart: ChartConfig;
  answer: string;
  query: string;
}

export function DashboardContent() {
  const searchParams = useSearchParams();
  const { accessCode, isAuthenticated } = useAccessCode();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [queryResults, setQueryResults] = useState<QueryResult[]>([]);
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryError, setQueryError] = useState<string | null>(null);

  const [state, setState] = useState<DashboardState>({
    parsedData: null, analysis: null, narrative: null,
    isAnalyzing: false, isGeneratingNarrative: false,
    error: null, activeTemplate: null, fileName: null, layout: "executive",
  });

  const handleDataParsed = useCallback((data: ParsedData, fileName: string) => {
    setState(p => ({ ...p, parsedData: data, fileName, activeTemplate: null, analysis: null, narrative: null, error: null }));
    setQueryResults([]);
  }, []);

  const handleTemplateSelect = useCallback((data: ParsedData, templateId: string) => {
    setState(p => ({ ...p, parsedData: data, activeTemplate: templateId, fileName: null, analysis: null, narrative: null, error: null }));
    setQueryResults([]);
  }, []);

  const handleDataChange = useCallback((data: ParsedData) => {
    setState(p => ({ ...p, parsedData: data, analysis: null, narrative: null }));
  }, []);

  const handleLayoutChange = useCallback((layout: LayoutPreset) => {
    setState(p => ({ ...p, layout }));
  }, []);

  const handleQuery = async (query: string) => {
    if (!state.parsedData || !accessCode) return;
    setIsQuerying(true);
    setQueryError(null);
    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-access-code": accessCode },
        body: JSON.stringify({ query, data: state.parsedData.data, columns: state.parsedData.columns }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Query failed (${res.status})`);
      }
      const result = await res.json();
      setQueryResults(prev => [...prev, { chart: result as ChartConfig, answer: result.insight || "Analysis complete — see the chart below.", query }]);
    } catch (err) {
      setQueryError(err instanceof Error ? err.message : "Query failed. Please try again.");
    }
    setIsQuerying(false);
  };

  useEffect(() => {
    const tp = searchParams.get("template");
    if (tp) {
      const t = templates.find(t => t.id === tp);
      if (t) handleTemplateSelect({ data: t.data as Record<string, unknown>[], columns: t.columns }, t.id);
    }
  }, [searchParams, handleTemplateSelect]);

  const generateDashboard = async () => {
    if (!state.parsedData || !accessCode) return;
    setState(p => ({ ...p, isAnalyzing: true, error: null, analysis: null, narrative: null }));
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-access-code": accessCode },
        body: JSON.stringify({ data: state.parsedData.data, columns: state.parsedData.columns, template: state.activeTemplate || undefined }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Analysis failed"); }
      const analysis: AnalysisResult = await res.json();
      setState(p => ({ ...p, analysis, isAnalyzing: false, isGeneratingNarrative: true }));

      const nRes = await fetch("/api/narrative", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-access-code": accessCode },
        body: JSON.stringify({ kpis: analysis.kpis, charts: analysis.charts, insights: analysis.insights, columns: state.parsedData!.columns }),
      });
      if (nRes.ok) { const { narrative } = await nRes.json(); setState(p => ({ ...p, narrative, isGeneratingNarrative: false })); }
      else setState(p => ({ ...p, isGeneratingNarrative: false }));
    } catch (error) {
      setState(p => ({ ...p, isAnalyzing: false, isGeneratingNarrative: false, error: error instanceof Error ? error.message : "Something went wrong" }));
    }
  };

  const suggestedTitle = state.activeTemplate
    ? `${templates.find(t => t.id === state.activeTemplate)?.name || "Dashboard"} Report`
    : state.fileName ? `${state.fileName.replace(/\.[^.]+$/, "")} Report` : "Dashboard Report";

  return (
    <div className="min-h-screen pt-16 flex relative">
      <div className="mesh-bg"><div className="grid-pattern" /></div>

      <aside className="flex-shrink-0 border-r transition-all duration-300 overflow-hidden relative z-10"
        style={{ width: sidebarOpen ? 320 : 0, borderColor: "var(--border-primary)", backgroundColor: "var(--bg-secondary)" }}>
        <div className="w-80 h-full overflow-y-auto p-5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Data Source</h2>
            <button onClick={() => setSidebarOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-md transition-colors" style={{ color: "var(--text-tertiary)" }}>
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>
          <FileUpload onDataParsed={handleDataParsed} />
          <div style={{ borderTop: "1px solid var(--border-primary)" }} />
          <TemplateSelector onSelect={handleTemplateSelect} activeTemplate={state.activeTemplate} />
        </div>
      </aside>

      <div className="flex-1 min-w-0 relative z-10">
        <div className="max-w-[1400px] mx-auto p-6">
          <div className="flex items-center justify-between mb-6 animate-fadeUp">
            <div className="flex items-center gap-3">
              {!sidebarOpen && (
                <button onClick={() => setSidebarOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
                  style={{ color: "var(--text-secondary)", border: "1px solid var(--border-primary)" }}><PanelLeft className="w-4 h-4" /></button>
              )}
              <div>
                <h1 className="text-xl font-semibold" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Dashboard Builder</h1>
                {state.fileName && <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>{state.fileName}</p>}
                {state.activeTemplate && <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>Template: {templates.find(t => t.id === state.activeTemplate)?.name}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {state.analysis && (
                <><LayoutSwitcher activeLayout={state.layout} onLayoutChange={handleLayoutChange} />
                <ExportButton targetId="dashboard-export" suggestedTitle={suggestedTitle} analysis={state.analysis!} templateName={state.activeTemplate ? templates.find(t => t.id === state.activeTemplate)?.name : undefined} columns={state.parsedData?.columns} /></>
              )}
              {state.parsedData && (
                <button onClick={generateDashboard} disabled={state.isAnalyzing || !isAuthenticated}
                  className="btn-primary py-2.5 px-5 disabled:opacity-50 disabled:cursor-not-allowed">
                  <Sparkles className="w-4 h-4" />{state.isAnalyzing ? "Analyzing..." : "Generate Dashboard"}
                </button>
              )}
            </div>
          </div>

          {/* Query input */}
          {state.parsedData && state.analysis && (
            <div className="flex justify-center mb-8 animate-fadeUp" style={{ animationDelay: "200ms" }}>
              <QueryInput onQuery={handleQuery} isLoading={isQuerying} disabled={!isAuthenticated} />
            </div>
          )}

          {/* Query error */}
          {queryError && (
            <div className="flex justify-center mb-4">
              <div className="max-w-2xl w-full p-3 rounded-lg text-sm animate-fadeUp" style={{ backgroundColor: "var(--error-subtle)", border: "1px solid rgba(223,27,65,0.2)", color: "var(--stripe-red)" }}>
                {queryError}
              </div>
            </div>
          )}

          {/* Query results — prominent answer cards */}
          {queryResults.length > 0 && (
            <div className="mb-8 space-y-6">
              {queryResults.map((qr, i) => (
                <div key={i} className="glass-panel p-6 animate-fadeUp">
                  {/* Question badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare size={16} style={{ color: "var(--stripe-purple)" }} />
                    <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{qr.query}</span>
                  </div>

                  {/* AI Answer — prominent card */}
                  <div className="rounded-xl p-5 mb-5" style={{ backgroundColor: "var(--accent-subtle)", border: "1px solid rgba(99,91,255,0.15)" }}>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #635BFF, #00D4AA)" }}>
                        <Sparkles size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.08em] mb-2" style={{ color: "var(--stripe-purple)" }}>AI Answer</p>
                        <p className="text-[15px] leading-relaxed font-medium" style={{ color: "var(--text-primary)" }}>{qr.answer}</p>
                      </div>
                    </div>
                  </div>

                  {/* Chart visualization */}
                  <ChartCard chart={qr.chart} index={0} />
                </div>
              ))}
            </div>
          )}

          {state.error && (
            <div className="mb-6 p-4 rounded-lg border text-sm animate-fadeUp"
              style={{ backgroundColor: "var(--error-subtle)", borderColor: "var(--stripe-red)", color: "var(--stripe-red)" }}>{state.error}</div>
          )}

          {state.parsedData && !state.analysis && !state.isAnalyzing && <DataPreview data={state.parsedData} onDataChange={handleDataChange} />}
          {state.isAnalyzing && <LoadingState />}
          {state.analysis && <DashboardGrid analysis={state.analysis} narrative={state.narrative} layout={state.layout} />}

          {!state.parsedData && !state.isAnalyzing && (
            <div className="flex flex-col items-center justify-center py-24 text-center animate-fadeUp">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: "var(--accent-subtle)" }}>
                <Sparkles className="w-7 h-7" style={{ color: "var(--stripe-purple)" }} />
              </div>
              <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Ready to analyze</h2>
              <p className="text-sm max-w-sm" style={{ color: "var(--text-tertiary)" }}>Upload a CSV or Excel file, or select a template from the sidebar to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
