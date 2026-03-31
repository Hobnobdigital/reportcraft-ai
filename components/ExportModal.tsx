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

function Checkbox({ id, label, checked, onChange, disabled }: {
  id: string; label: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean;
}) {
  return (
    <label htmlFor={id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F6F9FC] transition-colors cursor-pointer group">
      <div className="relative flex items-center justify-center w-5 h-5">
        <input type="checkbox" id={id} checked={checked} onChange={(e) => onChange(e.target.checked)} disabled={disabled} className="sr-only" />
        <div className={`absolute inset-0 rounded-md border transition-all duration-200 flex items-center justify-center ${
          checked ? "bg-[#635BFF] border-[#635BFF]" : "bg-white border-[#E3E8EE] group-hover:border-[#635BFF]/50"
        }`}>
          <Check size={12} strokeWidth={3} className={`text-white transition-transform duration-200 ${checked ? "scale-100" : "scale-50 opacity-0"}`} />
        </div>
      </div>
      <span className="text-sm font-medium text-[#425466]">{label}</span>
    </label>
  );
}

export function ExportModal({ isOpen, onClose, onExport, isExporting, suggestedTitle }: ExportModalProps) {
  const [title, setTitle] = useState(suggestedTitle);
  const [includeCover, setIncludeCover] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeAppendix, setIncludeAppendix] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setTitle(suggestedTitle);
      setIncludeCover(true);
      setIncludeSummary(true);
      setIncludeCharts(true);
      setIncludeAppendix(true);
    }
  }, [isOpen, suggestedTitle]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(10,37,64,0.6)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget && !isExporting) onClose(); }}
    >
      <div className="w-full max-w-md bg-white animate-scaleIn overflow-hidden flex flex-col" style={{ borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-xl)" }}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E3E8EE]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[rgba(99,91,255,0.1)] flex items-center justify-center text-[#635BFF]">
              <Download size={16} />
            </div>
            <h2 className="text-lg font-semibold text-[#0A2540] tracking-tight">Export Report</h2>
          </div>
          {!isExporting && (
            <button onClick={onClose} className="text-[#425466] hover:text-[#0A2540] hover:bg-[#F6F9FC] p-1.5 rounded-md transition-colors">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="px-6 py-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="report-title" className="text-[13px] font-semibold text-[#0A2540]">Report Title</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#425466]">
                <FileText size={16} />
              </div>
              <input
                id="report-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isExporting}
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E3E8EE] rounded-lg text-sm text-[#0A2540] disabled:opacity-60 disabled:bg-[#F6F9FC]"
                style={{ height: 44 }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[13px] font-semibold text-[#0A2540] mb-1">Include sections:</span>
            <div className="bg-[#F6F9FC]/50 border border-[#E3E8EE]/60 rounded-xl p-1">
              <Checkbox id="chk-cover" label="Cover Page" checked={includeCover} onChange={setIncludeCover} disabled={isExporting} />
              <Checkbox id="chk-summary" label="Executive Summary" checked={includeSummary} onChange={setIncludeSummary} disabled={isExporting} />
              <Checkbox id="chk-charts" label="Charts & Analysis" checked={includeCharts} onChange={setIncludeCharts} disabled={isExporting} />
              <Checkbox id="chk-appendix" label="Data Appendix" checked={includeAppendix} onChange={setIncludeAppendix} disabled={isExporting} />
            </div>
          </div>
        </div>

        <div className="px-6 py-5 bg-[#F6F9FC] border-t border-[#E3E8EE] flex items-center justify-end gap-3">
          {isExporting ? (
            <div className="flex-1 flex flex-col gap-3">
              <span className="text-[13px] font-medium text-[#425466]">Generating report...</span>
              <div className="h-2 w-full bg-[#E3E8EE] rounded-full overflow-hidden">
                <div className="h-full w-full shimmer rounded-full" />
              </div>
            </div>
          ) : (
            <>
              <button onClick={onClose} className="btn-ghost px-4 py-2 text-sm">Cancel</button>
              <button onClick={() => onExport({ title, includeCover, includeSummary, includeCharts, includeAppendix })} className="btn-primary px-4 py-2">
                <Download size={16} />
                Export PDF
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
