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
import { templates } from "@/lib/templates";
import type { ParsedData, AnalysisResult, DashboardState, LayoutPreset } from "@/lib/types";

export function DashboardContent() {
  const searchParams = useSearchParams();
  const { accessCode, isAuthenticated } = useAccessCode();
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
    setState((prev) => ({
      ...prev,
      parsedData: data,
      fileName,
      activeTemplate: null,
      analysis: null,
      narrative: null,
      error: null,
    }));
  }, []);

  const handleTemplateSelect = useCallback((data: ParsedData, templateId: string) => {
    setState((prev) => ({
      ...prev,
      parsedData: data,
      activeTemplate: templateId,
      fileName: null,
      analysis: null,
      narrative: null,
      error: null,
    }));
  }, []);

  const handleDataChange = useCallback((data: ParsedData) => {
    setState((prev) => ({
      ...prev,
      parsedData: data,
      analysis: null,
      narrative: null,
    }));
  }, []);

  const handleLayoutChange = useCallback((layout: LayoutPreset) => {
    setState((prev) => ({ ...prev, layout }));
  }, []);

  useEffect(() => {
    const templateParam = searchParams.get("template");
    if (templateParam) {
      const template = templates.find((t) => t.id === templateParam);
      if (template) {
        handleTemplateSelect(
          { data: template.data as Record<string, unknown>[], columns: template.columns },
          template.id
        );
      }
    }
  }, [searchParams, handleTemplateSelect]);

  const generateDashboard = async () => {
    if (!state.parsedData || !accessCode) return;

    setState((prev) => ({ ...prev, isAnalyzing: true, error: null, analysis: null, narrative: null }));

    try {
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-code": accessCode,
        },
        body: JSON.stringify({
          data: state.parsedData.data,
          columns: state.parsedData.columns,
          template: state.activeTemplate || undefined,
        }),
      });

      if (!analyzeRes.ok) {
        const err = await analyzeRes.json();
        throw new Error(err.error || "Analysis failed");
      }

      const analysis: AnalysisResult = await analyzeRes.json();
      setState((prev) => ({ ...prev, analysis, isAnalyzing: false, isGeneratingNarrative: true }));

      const narrativeRes = await fetch("/api/narrative", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-code": accessCode,
        },
        body: JSON.stringify({
          kpis: analysis.kpis,
          charts: analysis.charts,
          insights: analysis.insights,
          columns: state.parsedData.columns,
        }),
      });

      if (narrativeRes.ok) {
        const { narrative } = await narrativeRes.json();
        setState((prev) => ({ ...prev, narrative, isGeneratingNarrative: false }));
      } else {
        setState((prev) => ({ ...prev, isGeneratingNarrative: false }));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      setState((prev) => ({
        ...prev,
        isAnalyzing: false,
        isGeneratingNarrative: false,
        error: message,
      }));
    }
  };

  const suggestedTitle = state.activeTemplate
    ? `${templates.find((t) => t.id === state.activeTemplate)?.name || "Dashboard"} Report`
    : state.fileName
      ? `${state.fileName.replace(/\.[^.]+$/, "")} Report`
      : "Dashboard Report";

  return (
    <div className="min-h-screen pt-16 flex">
      {/* Sidebar */}
      <aside
        className="flex-shrink-0 border-r transition-all duration-300 overflow-hidden"
        style={{
          width: sidebarOpen ? 320 : 0,
          borderColor: "#E3E8EE",
          backgroundColor: "#F6F9FC",
        }}
      >
        <div className="w-80 h-full overflow-y-auto p-5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#0A2540]" style={{ letterSpacing: "-0.01em" }}>
              Data Source
            </h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="w-7 h-7 flex items-center justify-center rounded-md transition-colors text-[#8898AA] hover:bg-[#E3E8EE]"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          <FileUpload onDataParsed={handleDataParsed} />

          <div className="border-t" style={{ borderColor: "#E3E8EE" }} />

          <TemplateSelector
            onSelect={handleTemplateSelect}
            activeTemplate={state.activeTemplate}
          />
        </div>
      </aside>

      {/* Main area with dashboard-bg gradient mesh */}
      <div className={`flex-1 min-w-0 ${state.analysis ? "dashboard-bg" : ""}`}>
        <div className="max-w-[1280px] mx-auto p-6">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 animate-fadeUp">
            <div className="flex items-center gap-3">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors text-[#425466] border border-[#E3E8EE] hover:bg-[#F6F9FC]"
                >
                  <PanelLeft className="w-4 h-4" />
                </button>
              )}
              <div>
                <h1 className="text-xl font-semibold text-[#0A2540]" style={{ letterSpacing: "-0.01em" }}>
                  Dashboard Builder
                </h1>
                {state.fileName && (
                  <p className="text-xs mt-0.5 text-[#8898AA]">{state.fileName}</p>
                )}
                {state.activeTemplate && (
                  <p className="text-xs mt-0.5 text-[#8898AA]">
                    Template: {templates.find((t) => t.id === state.activeTemplate)?.name}
                  </p>
                )}
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
                <button
                  onClick={generateDashboard}
                  disabled={state.isAnalyzing || !isAuthenticated}
                  className="btn-primary py-2.5 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-4 h-4" />
                  {state.isAnalyzing ? "Analyzing..." : "Generate Dashboard"}
                </button>
              )}
            </div>
          </div>

          {/* Error */}
          {state.error && (
            <div
              className="mb-6 p-4 rounded-lg border text-sm animate-fadeUp"
              style={{
                backgroundColor: "rgba(223,27,65,0.08)",
                borderColor: "#DF1B41",
                color: "#DF1B41",
              }}
            >
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
          {state.analysis && (
            <DashboardGrid
              analysis={state.analysis}
              narrative={state.narrative}
              layout={state.layout}
            />
          )}

          {/* Empty state */}
          {!state.parsedData && !state.isAnalyzing && (
            <div className="flex flex-col items-center justify-center py-24 text-center animate-fadeUp">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-[rgba(99,91,255,0.08)]">
                <Sparkles className="w-7 h-7 text-[#635BFF]" />
              </div>
              <h2 className="text-lg font-semibold text-[#0A2540] mb-2">
                Ready to analyze
              </h2>
              <p className="text-sm text-[#8898AA] max-w-sm">
                Upload a CSV or Excel file, or select a template from the sidebar to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
