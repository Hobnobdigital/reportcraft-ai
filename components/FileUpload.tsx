"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, FileSpreadsheet, X, CloudUpload } from "lucide-react";
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
      <div
        className="relative rounded-xl overflow-hidden group"
        style={{
          border: `2px dashed ${isDragging ? "#635BFF" : error ? "#DF1B41" : "var(--border-primary)"}`,
          background: isDragging ? "rgba(99,91,255,0.06)" : "transparent",
          cursor: fileName ? "default" : "pointer",
          transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
        }}
        onDrop={e => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => !fileName && inputRef.current?.click()}
      >
        {/* Subtle animated gradient border on hover */}
        {!fileName && !isParsing && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: "linear-gradient(135deg, rgba(99,91,255,0.04), rgba(0,212,170,0.04), rgba(0,115,230,0.04))" }} />
        )}

        <input ref={inputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

        {isParsing ? (
          <div className="py-8 text-center relative">
            <div className="w-10 h-10 mx-auto mb-3 rounded-xl shimmer" />
            <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Parsing file...</p>
          </div>
        ) : fileName ? (
          <div className="py-4 px-4 flex items-center justify-between relative">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, rgba(99,91,255,0.12), rgba(99,91,255,0.04))", border: "1px solid rgba(99,91,255,0.15)" }}>
                <FileSpreadsheet className="w-5 h-5" style={{ color: "#635BFF" }} />
              </div>
              <div className="text-left">
                <p className="text-[13px] font-semibold truncate max-w-[180px]" style={{ color: "var(--text-primary)" }}>{fileName}</p>
                {fileInfo && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--accent-subtle)", color: "#635BFF" }}>{fileInfo.rows.toLocaleString()} rows</span>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-tertiary)" }}>{fileInfo.cols} columns</span>
                  </div>
                )}
              </div>
            </div>
            <button onClick={e => { e.stopPropagation(); setFileName(null); setFileInfo(null); setError(null); if (inputRef.current) inputRef.current.value = ""; }}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200"
              style={{ color: "var(--text-tertiary)" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"; e.currentTarget.style.color = "var(--text-primary)"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--text-tertiary)"; }}>
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="py-8 text-center relative">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))", border: "1px solid var(--border-primary)" }}>
              <CloudUpload className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" style={{ color: "var(--text-tertiary)" }} />
            </div>
            <p className="text-[14px] font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Drop a CSV or Excel file</p>
            <p className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>or <span style={{ color: "#635BFF", fontWeight: 500 }}>browse</span> to upload</p>
            <div className="flex items-center justify-center gap-3 mt-3">
              {[".csv", ".xlsx", ".xls"].map(ext => (
                <span key={ext} className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-tertiary)", border: "1px solid var(--border-secondary)" }}>{ext}</span>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && <p className="mt-2 text-xs font-medium" style={{ color: "#DF1B41" }}>{error}</p>}
    </div>
  );
}
