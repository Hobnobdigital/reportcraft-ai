"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { ParsedData } from "@/lib/types";

interface DataPreviewProps { data: ParsedData; onDataChange?: (data: ParsedData) => void; }

type SortDir = "asc" | "desc" | null;

export function DataPreview({ data, onDataChange }: DataPreviewProps) {
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editingCell && inputRef.current) { inputRef.current.focus(); inputRef.current.select(); } }, [editingCell]);

  const handleSave = useCallback(() => {
    if (!editingCell || !onDataChange) { setEditingCell(null); return; }
    const newData = [...data.data]; newData[editingCell.row] = { ...newData[editingCell.row], [editingCell.col]: editValue };
    onDataChange({ ...data, data: newData }); setEditingCell(null);
  }, [editingCell, editValue, data, onDataChange]);

  const handleSort = (col: string) => {
    if (sortCol === col) {
      if (sortDir === "asc") setSortDir("desc");
      else if (sortDir === "desc") { setSortCol(null); setSortDir(null); }
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  // Apply sorting
  let displayData = [...data.data];
  if (sortCol && sortDir) {
    displayData.sort((a, b) => {
      const va = a[sortCol]; const vb = b[sortCol];
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      const na = Number(va); const nb = Number(vb);
      if (!isNaN(na) && !isNaN(nb)) return sortDir === "asc" ? na - nb : nb - na;
      return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }
  const previewRows = displayData.slice(0, 10);

  return (
    <div className="w-full animate-fadeUp">
      <div className="flex justify-between items-end mb-3 px-1">
        <span className="overline">Data Preview</span>
        <div className="flex items-center gap-3">
          {sortCol && <span className="text-[11px] font-medium" style={{ color: "var(--stripe-purple)" }}>Sorted by {sortCol} ({sortDir})</span>}
          <span className="text-xs" style={{ color: "var(--text-tertiary)", fontVariantNumeric: "tabular-nums" }}>{data.data.length} rows &middot; {data.columns.length} columns</span>
        </div>
      </div>
      <div className="glass-panel rounded-xl overflow-x-auto">
        <table className="w-full border-collapse text-left whitespace-nowrap">
          <thead><tr>
            {data.columns.map(col => (
              <th key={col}
                className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider cursor-pointer select-none group"
                style={{ color: "var(--text-tertiary)", backgroundColor: "var(--bg-secondary)", borderBottom: "1px solid var(--border-primary)" }}
                onClick={() => handleSort(col)}
              >
                <span className="flex items-center gap-1">
                  {col}
                  {sortCol === col ? (
                    sortDir === "asc" ? <ArrowUp size={12} style={{ color: "var(--stripe-purple)" }} /> : <ArrowDown size={12} style={{ color: "var(--stripe-purple)" }} />
                  ) : (
                    <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-50 transition-opacity" />
                  )}
                </span>
              </th>
            ))}
          </tr></thead>
          <tbody>
            {previewRows.map((row, i) => (
              <tr key={i} className="transition-colors" style={{ borderBottom: i < previewRows.length - 1 ? "1px solid var(--border-secondary)" : "none" }}>
                {data.columns.map(col => {
                  const isEditing = editingCell?.row === i && editingCell?.col === col;
                  return <td key={col} className="p-0 text-[13px] relative" style={{ color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}
                    onDoubleClick={() => { if (onDataChange) { setEditingCell({ row: i, col }); setEditValue(row[col] != null ? String(row[col]) : ""); } }}>
                    {isEditing ? <input ref={inputRef} value={editValue} onChange={e => setEditValue(e.target.value)} onBlur={handleSave}
                      onKeyDown={e => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setEditingCell(null); }}
                      className="w-full px-3 py-2 text-[13px] bg-transparent outline-none" style={{ color: "var(--text-primary)", boxShadow: "inset 0 0 0 2px var(--stripe-purple)" }} />
                    : <div className="px-3 py-2 truncate max-w-[280px] cursor-default hover:bg-[var(--bg-secondary)] transition-colors">{String(row[col] ?? "")}</div>}
                  </td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-3 px-1">
        {data.data.length > 10 && <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>Showing 10 of {data.data.length} rows</p>}
        <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>Click column headers to sort &middot; Double-click cells to edit</p>
      </div>
    </div>
  );
}
