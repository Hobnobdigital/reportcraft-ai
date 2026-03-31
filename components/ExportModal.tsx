"use client";

import { useState, useEffect } from "react";
import { Download, X, Check, FileText } from "lucide-react";
import { ExportOptions } from "@/lib/types";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => void;
  isExporting: boolean;
  suggestedTitle: string;
}

function Checkbox({ id, label, checked, onChange, disabled }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <label htmlFor={id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer group">
      <div className="relative w-5 h-5">
        <input type="checkbox" id={id} checked={checked} onChange={(e) => onChange(e.target.checked)} disabled={disabled} className="sr-only" />
        <div className={`absolute inset-0 rounded-md border transition-all duration-200 flex items-center justify-center ${checked ? "bg-[#635BFF] border-[#635BFF]" : "bg-white/5 border-white/15 group-hover:border-white/25"}`}>
          <Check size={12} strokeWidth={3} className={`text-white transition-transform duration-200 ${checked ? "scale-100" : "scale-50 opacity-0"}`} />
        </div>
      </div>
      <span className="text-sm font-medium text-white/70">{label}</span>
    </label>
  );
}

export function ExportModal({ isOpen, onClose, onExport, isExporting, suggestedTitle }: ExportModalProps) {
  const [title, setTitle] = useState(suggestedTitle);
  const [opts, setOpts] = useState({ cover: true, summary: true, charts: true, appendix: true });

  useEffect(() => { if (isOpen) { setTitle(suggestedTitle); setOpts({ cover: true, summary: true, charts: true, appendix: true }); } }, [isOpen, suggestedTitle]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(5,5,16,0.85)", backdropFilter: "blur(12px)" }}
      onClick={(e) => { if (e.target === e.currentTarget && !isExporting) onClose(); }}>
      <div className="glass-panel w-full max-w-md overflow-hidden" style={{ animation: "scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) both" }}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#635BFF]/15 flex items-center justify-center text-[#635BFF]"><Download size={16} /></div>
            <h2 className="text-lg font-semibold text-white tracking-tight">Export Report</h2>
          </div>
          {!isExporting && <button onClick={onClose} className="text-white/40 hover:text-white hover:bg-white/5 p-1.5 rounded-md transition-colors"><X size={18} /></button>}
        </div>
        <div className="px-6 py-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-semibold text-white/80">Report Title</label>
            <div className="relative">
              <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isExporting}
                className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white disabled:opacity-50" style={{ height: 44 }} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[13px] font-semibold text-white/80 mb-1">Include sections:</span>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-1">
              <Checkbox id="c1" label="Cover Page" checked={opts.cover} onChange={(v) => setOpts(p => ({...p, cover: v}))} disabled={isExporting} />
              <Checkbox id="c2" label="Executive Summary" checked={opts.summary} onChange={(v) => setOpts(p => ({...p, summary: v}))} disabled={isExporting} />
              <Checkbox id="c3" label="Charts & Analysis" checked={opts.charts} onChange={(v) => setOpts(p => ({...p, charts: v}))} disabled={isExporting} />
              <Checkbox id="c4" label="Data Appendix" checked={opts.appendix} onChange={(v) => setOpts(p => ({...p, appendix: v}))} disabled={isExporting} />
            </div>
          </div>
        </div>
        <div className="px-6 py-5 bg-white/[0.02] border-t border-white/5 flex items-center justify-end gap-3">
          {isExporting ? (
            <div className="flex-1 flex flex-col gap-3">
              <span className="text-[13px] font-medium text-white/50">Generating report...</span>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full w-full shimmer rounded-full" /></div>
            </div>
          ) : (
            <>
              <button onClick={onClose} className="btn-ghost">Cancel</button>
              <button onClick={() => onExport({ title, includeCover: opts.cover, includeSummary: opts.summary, includeCharts: opts.charts, includeAppendix: opts.appendix })} className="btn-primary">
                <Download size={16} /> Export PDF
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
