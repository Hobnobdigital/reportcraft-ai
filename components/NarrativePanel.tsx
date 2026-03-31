"use client";

import { FileText } from "lucide-react";

interface NarrativePanelProps {
  narrative: string;
}

const SECTION_LABELS = ["Overview", "Key Findings", "Recommendations"];
const BORDER_OPACITIES = [1, 0.6, 0.3];

export function NarrativePanel({ narrative }: NarrativePanelProps) {
  const paragraphs = narrative.split("\n\n").filter((p) => p.trim() !== "");

  return (
    <div
      className="glass-card flex flex-col overflow-hidden animate-fadeUp"
      style={{ animationDelay: "640ms" }}
    >
      <div
        className="flex items-center gap-2.5 px-6 py-4 border-b"
        style={{ borderColor: "rgba(10, 37, 64, 0.06)" }}
      >
        <FileText size={18} style={{ color: "#635BFF" }} />
        <h3 className="text-sm font-semibold text-[#0A2540] tracking-tight">
          Executive Summary
        </h3>
      </div>

      <div className="p-6 flex flex-col gap-6">
        {paragraphs.map((text, index) => {
          const label = SECTION_LABELS[index] || `Section ${index + 1}`;
          const opacity = BORDER_OPACITIES[index] ?? 0.3;

          return (
            <div key={index} className="flex flex-col gap-2">
              <span className="overline" style={{ color: "#635BFF" }}>
                {label}
              </span>
              <div
                className="pl-4 py-0.5"
                style={{ borderLeft: `3px solid rgba(99, 91, 255, ${opacity})` }}
              >
                <p className="text-sm leading-relaxed text-[#425466]">{text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
