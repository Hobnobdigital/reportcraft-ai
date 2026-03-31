"use client";

import { BarChart3, Filter, PieChart, ArrowRight } from "lucide-react";
import { templates } from "@/lib/templates";
import { ParsedData } from "@/lib/types";

const iconMap: Record<string, React.ElementType> = { BarChart3, Filter, PieChart };
const gradients = [
  "linear-gradient(135deg, rgba(99,91,255,0.1), rgba(99,91,255,0.03))",
  "linear-gradient(135deg, rgba(0,212,170,0.1), rgba(0,212,170,0.03))",
  "linear-gradient(135deg, rgba(0,115,230,0.1), rgba(0,115,230,0.03))",
];
const accents = ["#635BFF", "#00D4AA", "#0073E6"];
const topBars = [
  "linear-gradient(90deg, #635BFF, #8B5CF6)",
  "linear-gradient(90deg, #00D4AA, #0073E6)",
  "linear-gradient(90deg, #0073E6, #635BFF)",
];

interface TemplateSelectorProps { onSelect: (data: ParsedData, templateId: string) => void; activeTemplate: string | null; }

export function TemplateSelector({ onSelect, activeTemplate }: TemplateSelectorProps) {
  return (
    <div className="w-full flex flex-col">
      <span className="overline mb-3 px-1">Templates</span>
      <div className="flex flex-col gap-3">
        {templates.map((template, idx) => {
          const isActive = activeTemplate === template.id;
          const Icon = iconMap[template.icon] || BarChart3;
          const accent = accents[idx % accents.length];
          return (
            <button key={template.id}
              onClick={() => onSelect({ data: template.data as Record<string, unknown>[], columns: template.columns }, template.id)}
              className="w-full text-left rounded-xl overflow-hidden group"
              style={{
                border: `1px solid ${isActive ? accent : "var(--border-primary)"}`,
                transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                boxShadow: isActive ? `0 4px 16px -4px ${accent}30` : "none",
                transform: isActive ? "scale(1.02)" : "scale(1)",
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px -8px rgba(10,37,64,0.1)"; }}}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}}
            >
              {/* Color strip */}
              <div style={{ height: 3, background: isActive ? topBars[idx % topBars.length] : "var(--border-primary)", transition: "background 0.3s" }} />
              <div className="p-4 flex items-start gap-3" style={{ background: isActive ? gradients[idx % gradients.length] : "var(--bg-elevated)" }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: isActive ? `${accent}18` : "var(--bg-secondary)", border: `1px solid ${isActive ? `${accent}25` : "var(--border-secondary)"}`, transition: "all 0.3s" }}>
                  <Icon size={20} style={{ color: isActive ? accent : "var(--text-tertiary)", transition: "color 0.3s" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>{template.name}</span>
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5"
                      style={{ color: accent }} />
                  </div>
                  <span className="text-[11px] leading-relaxed mt-1 block" style={{ color: "var(--text-tertiary)" }}>{template.description}</span>
                  {/* Data hint */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-tertiary)" }}>
                      {template.data.length} rows
                    </span>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-tertiary)" }}>
                      {template.columns.length} cols
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
