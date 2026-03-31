"use client";

import { BarChart3, Filter, PieChart } from "lucide-react";
import { templates } from "@/lib/templates";
import { ParsedData } from "@/lib/types";

const iconMap: Record<string, React.ElementType> = {
  BarChart3,
  Filter,
  PieChart,
};

interface TemplateSelectorProps {
  onSelect: (data: ParsedData, templateId: string) => void;
  activeTemplate: string | null;
}

export function TemplateSelector({ onSelect, activeTemplate }: TemplateSelectorProps) {
  return (
    <div className="w-full flex flex-col">
      <span className="overline text-[#8898AA] mb-3 px-1">Templates</span>

      <div className="flex flex-col gap-2.5">
        {templates.map((template) => {
          const isActive = activeTemplate === template.id;
          const Icon = iconMap[template.icon] || BarChart3;

          return (
            <button
              key={template.id}
              onClick={() =>
                onSelect(
                  { data: template.data as Record<string, unknown>[], columns: template.columns },
                  template.id
                )
              }
              className={`
                w-full text-left p-4 rounded-xl border flex items-start gap-3.5
                transition-all duration-200
                ${isActive
                  ? "border-[#635BFF] bg-[rgba(99,91,255,0.08)] shadow-sm"
                  : "border-[#E3E8EE] bg-white hover:-translate-y-px hover:shadow-md hover:border-[#D3D9E2]"
                }
              `}
            >
              <div className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center bg-[rgba(99,91,255,0.08)] text-[#635BFF]">
                <Icon size={18} strokeWidth={2.5} />
              </div>

              <div className="flex flex-col gap-1 pt-0.5 min-w-0">
                <span className="text-sm font-medium text-[#0A2540] leading-none">
                  {template.name}
                </span>
                <span className="text-xs text-[#8898AA] leading-relaxed">
                  {template.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
