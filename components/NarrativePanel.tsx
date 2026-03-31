"use client";

import { FileText } from "lucide-react";

interface NarrativePanelProps { narrative: string; }

const SECTIONS = ["Overview", "Key Findings", "Recommendations"];
const OPACITIES = [0.8, 0.5, 0.3];

export function NarrativePanel({ narrative }: NarrativePanelProps) {
  const paragraphs = narrative.split("\n\n").filter(Boolean);

  return (
    <div className="glass-panel flex flex-col overflow-hidden" style={{ animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 640ms both" }}>
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-white/5">
        <FileText size={18} className="text-[#635BFF]" />
        <h3 className="text-[15px] font-medium text-white/95 tracking-tight">Executive Summary</h3>
      </div>
      <div className="p-6 flex flex-col gap-6">
        {paragraphs.map((text, i) => (
          <div key={i} className="flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#635BFF]">
              {SECTIONS[i] || `Section ${i + 1}`}
            </span>
            <div className="pl-4 py-0.5" style={{ borderLeft: `3px solid rgba(99, 91, 255, ${OPACITIES[i] ?? 0.3})` }}>
              <p className="text-sm leading-relaxed text-white/60">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
