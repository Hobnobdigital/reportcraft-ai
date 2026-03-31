"use client";

import { LayoutDashboard, Grid3x3, Monitor } from "lucide-react";
import { LayoutPreset } from "@/lib/types";

interface LayoutSwitcherProps {
  activeLayout: LayoutPreset;
  onLayoutChange: (layout: LayoutPreset) => void;
}

const options = [
  { id: "executive" as const, label: "Executive Summary", icon: LayoutDashboard },
  { id: "deep-dive" as const, label: "Data Deep Dive", icon: Grid3x3 },
  { id: "presentation" as const, label: "Presentation", icon: Monitor },
];

export function LayoutSwitcher({ activeLayout, onLayoutChange }: LayoutSwitcherProps) {
  return (
    <div
      className="inline-flex items-center bg-[#F0F3F7] rounded-full p-[3px] gap-[2px]"
      role="group"
      aria-label="Dashboard layout options"
    >
      {options.map((option) => {
        const isActive = activeLayout === option.id;
        const Icon = option.icon;

        return (
          <button
            key={option.id}
            onClick={() => onLayoutChange(option.id)}
            type="button"
            className={`
              flex items-center justify-center gap-2
              px-3.5 py-1.5 rounded-full text-xs font-medium
              transition-all duration-300
              ${isActive
                ? "bg-white text-[#635BFF] shadow-sm"
                : "bg-transparent text-[#425466] hover:text-[#0A2540]"
              }
            `}
          >
            <Icon className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={isActive ? 2.5 : 2} />
            <span className="hidden sm:inline-block tracking-tight">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
