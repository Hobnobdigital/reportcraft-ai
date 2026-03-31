"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, FileSpreadsheet, X } from "lucide-react";
import { parseFile } from "@/lib/parseData";
import { ParsedData } from "@/lib/types";

interface FileUploadProps {
  onDataParsed: (data: ParsedData, fileName: string) => void;
}

export function FileUpload({ onDataParsed }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{ rows: number; cols: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    setIsParsing(true);
    try {
      const result = await parseFile(file);
      setFileName(file.name);
      setFileInfo({ rows: result.data.length, cols: result.columns.length });
      onDataParsed(result, file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse file");
      setFileName(null);
      setFileInfo(null);
    }
    setIsParsing(false);
  }, [onDataParsed]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFileName(null);
    setFileInfo(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <div
        className="relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200"
        style={{
          borderColor: isDragging ? "#635BFF" : error ? "#DF1B41" : "rgba(255,255,255,0.1)",
          backgroundColor: isDragging ? "rgba(99,91,255,0.08)" : "transparent",
          cursor: fileName ? "default" : "pointer",
        }}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => !fileName && inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        {isParsing ? (
          <div className="py-4">
            <div className="w-8 h-8 mx-auto mb-3 rounded-lg shimmer" />
            <p className="text-sm text-white/50">Parsing file...</p>
          </div>
        ) : fileName ? (
          <div className="py-2 flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#635BFF]/15 border border-[#635BFF]/25">
                <FileSpreadsheet className="w-5 h-5 text-[#635BFF]" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white/90 truncate max-w-[200px]">{fileName}</p>
                {fileInfo && <p className="text-xs text-white/40 mt-0.5" style={{ fontVariantNumeric: "tabular-nums" }}>{fileInfo.rows.toLocaleString()} rows &middot; {fileInfo.cols} columns</p>}
              </div>
            </div>
            <button onClick={clearFile} className="w-8 h-8 flex items-center justify-center rounded-md text-white/40 hover:text-white hover:bg-white/5 transition-all duration-150">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="py-4">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white/5 border border-white/8 flex items-center justify-center">
              <Upload className="w-5 h-5 text-white/40" />
            </div>
            <p className="text-[15px] font-medium text-white/80 tracking-tight">Drop a CSV or Excel file here</p>
            <p className="text-sm text-white/40 mt-1">or click to browse</p>
          </div>
        )}
      </div>
      {error && <p className="mt-2 text-xs text-[#DF1B41] font-medium">{error}</p>}
    </div>
  );
}
