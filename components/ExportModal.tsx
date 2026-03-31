"use client";

import { useState, useEffect } from "react";
import { Download, X, Check, FileText } from "lucide-react";
import { ExportOptions } from "@/lib/types";

interface ExportModalProps { isOpen: boolean; onClose: () => void; onExport: (options: ExportOptions) => void; isExporting: boolean; suggestedTitle: string; }

function Chk({ id, label, checked, onChange, disabled }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <label htmlFor={id} className="flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer group" style={{ backgroundColor: "transparent" }}>
      <div className="relative w-5 h-5">
        <input type="checkbox" id={id} checked={checked} onChange={e => onChange(e.target.checked)} disabled={disabled} className="sr-only" />
        <div className="absolute inset-0 rounded-md border transition-all duration-200 flex items-center justify-center"
          style={{ backgroundColor: checked ? "var(--stripe-purple)" : "var(--bg-secondary)", borderColor: checked ? "var(--stripe-purple)" : "var(--border-primary)" }}>
          <Check size={12} strokeWidth={3} className={`text-white transition-transform duration-200 ${checked ? "scale-100" : "scale-50 opacity-0"}`} />
        </div>
      </div>
      <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{label}</span>
    </label>
  );
}

export function ExportModal({ isOpen, onClose, onExport, isExporting, suggestedTitle }: ExportModalProps) {
  const [title, setTitle] = useState(suggestedTitle);
  const [opts, setOpts] = useState({ cover: true, summary: true, charts: true, appendix: true });
  useEffect(() => { if (isOpen) { setTitle(suggestedTitle); setOpts({ cover: true, summary: true, charts: true, appendix: true }); } }, [isOpen, suggestedTitle]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(10,37,64,0.6)", backdropFilter: "blur(8px)" }}
      onClick={e => { if (e.target === e.currentTarget && !isExporting) onClose(); }}>
      <div className="w-full max-w-md animate-scaleIn overflow-hidden flex flex-col"
        style={{ backgroundColor: "var(--bg-primary)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-primary)", boxShadow: "0 20px 40px rgba(10,37,64,0.15)" }}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid var(--border-primary)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--accent-subtle)", color: "var(--stripe-purple)" }}><Download size={16} /></div>
            <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Export Report</h2>
          </div>
          {!isExporting && <button onClick={onClose} className="p-1.5 rounded-md transition-colors" style={{ color: "var(--text-tertiary)" }}><X size={18} /></button>}
        </div>
        <div className="px-6 py-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>Report Title</label>
            <div className="relative">
              <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-tertiary)" }} />
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} disabled={isExporting}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm disabled:opacity-50"
                style={{ height: 44, backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-primary)", color: "var(--text-primary)" }} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[13px] font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Include sections:</span>
            <div className="rounded-xl p-1" style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-secondary)" }}>
              <Chk id="c1" label="Cover Page" checked={opts.cover} onChange={v => setOpts(p => ({...p, cover: v}))} disabled={isExporting} />
              <Chk id="c2" label="Executive Summary" checked={opts.summary} onChange={v => setOpts(p => ({...p, summary: v}))} disabled={isExporting} />
              <Chk id="c3" label="Charts & Analysis" checked={opts.charts} onChange={v => setOpts(p => ({...p, charts: v}))} disabled={isExporting} />
              <Chk id="c4" label="Data Appendix" checked={opts.appendix} onChange={v => setOpts(p => ({...p, appendix: v}))} disabled={isExporting} />
            </div>
          </div>
        </div>
        <div className="px-6 py-5 flex items-center justify-end gap-3" style={{ backgroundColor: "var(--bg-secondary)", borderTop: "1px solid var(--border-primary)" }}>
          {isExporting ? (
            <div className="flex-1 flex flex-col gap-3">
              <span className="text-[13px] font-medium" style={{ color: "var(--text-tertiary)" }}>Generating report...</span>
              <div className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-tertiary)" }}><div className="h-full w-full shimmer rounded-full" /></div>
            </div>
          ) : (
            <><button onClick={onClose} className="btn-ghost">Cancel</button>
            <button onClick={() => onExport({ title, includeCover: opts.cover, includeSummary: opts.summary, includeCharts: opts.charts, includeAppendix: opts.appendix })} className="btn-primary"><Download size={16} /> Export PDF</button></>
          )}
        </div>
      </div>
    </div>
  );
}
