"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, FileSpreadsheet, X } from "lucide-react";
import { parseFile } from "@/lib/parseData";
import { ParsedData } from "@/lib/types";

interface FileUploadProps { onDataParsed: (data: ParsedData, fileName: string) => void; }

export function FileUpload({ onDataParsed }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{ rows: number; cols: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setError(null); setIsParsing(true);
    try {
      const result = await parseFile(file);
      setFileName(file.name);
      setFileInfo({ rows: result.data.length, cols: result.columns.length });
      onDataParsed(result, file.name);
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to parse file"); setFileName(null); setFileInfo(null); }
    setIsParsing(false);
  }, [onDataParsed]);

  return (
    <div className="w-full">
      <div className="relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200"
        style={{ borderColor: isDragging ? "var(--stripe-purple)" : error ? "var(--stripe-red)" : "var(--border-primary)", backgroundColor: isDragging ? "var(--accent-subtle)" : "transparent", cursor: fileName ? "default" : "pointer" }}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => !fileName && inputRef.current?.click()}>
        <input ref={inputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        {isParsing ? (
          <div className="py-4"><div className="w-8 h-8 mx-auto mb-3 rounded-lg shimmer" /><p className="text-sm" style={{ color: "var(--text-secondary)" }}>Parsing file...</p></div>
        ) : fileName ? (
          <div className="py-2 flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--accent-subtle)" }}>
                <FileSpreadsheet className="w-5 h-5" style={{ color: "var(--stripe-purple)" }} />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium truncate max-w-[200px]" style={{ color: "var(--text-primary)" }}>{fileName}</p>
                {fileInfo && <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)", fontVariantNumeric: "tabular-nums" }}>{fileInfo.rows.toLocaleString()} rows &middot; {fileInfo.cols} columns</p>}
              </div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setFileName(null); setFileInfo(null); setError(null); if (inputRef.current) inputRef.current.value = ""; }}
              className="w-8 h-8 flex items-center justify-center rounded-md transition-all duration-150" style={{ color: "var(--text-tertiary)" }}><X className="w-4 h-4" /></button>
          </div>
        ) : (
          <div className="py-4">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--bg-secondary)" }}>
              <Upload className="w-5 h-5" style={{ color: "var(--text-tertiary)" }} />
            </div>
            <p className="text-[15px] font-medium" style={{ color: "var(--text-primary)" }}>Drop a CSV or Excel file here</p>
            <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>or click to browse</p>
          </div>
        )}
      </div>
      {error && <p className="mt-2 text-xs font-medium" style={{ color: "var(--stripe-red)" }}>{error}</p>}
    </div>
  );
}
