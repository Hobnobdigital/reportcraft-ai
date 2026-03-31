"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, ArrowRight, Command } from "lucide-react";

interface QueryInputProps { onQuery: (query: string) => void; isLoading: boolean; disabled?: boolean; }

export function QueryInput({ onQuery, isLoading, disabled }: QueryInputProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); inputRef.current?.focus(); } };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSubmit = () => { if (query.trim() && !isLoading && !disabled) onQuery(query.trim()); };

  return (
    <div className="relative w-full max-w-2xl group">
      <div className="absolute -inset-1 rounded-2xl blur-xl transition-opacity duration-700 pointer-events-none"
        style={{ background: "linear-gradient(135deg, rgba(99,91,255,0.15), rgba(0,212,170,0.1), rgba(99,91,255,0.15))", opacity: focused ? 1 : 0 }} />
      <div className="relative flex items-center overflow-hidden rounded-2xl transition-all duration-300"
        style={{
          backgroundColor: "var(--bg-elevated)",
          border: `1px solid ${focused ? "var(--stripe-purple)" : "var(--border-primary)"}`,
          boxShadow: focused ? "0 4px 16px rgba(99,91,255,0.1)" : "0 2px 8px rgba(10,37,64,0.04)",
        }}>
        <Sparkles className="absolute left-4 w-5 h-5" style={{ color: "var(--stripe-purple)" }} />
        <input ref={inputRef} type="text" value={query} onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          onKeyDown={e => { if (e.key === "Enter") handleSubmit(); }}
          placeholder="Ask your data anything... (e.g., 'Compare revenue by channel')"
          disabled={disabled || isLoading}
          className="w-full bg-transparent text-[15px] py-4 pl-12 pr-28 outline-none disabled:opacity-50"
          style={{ color: "var(--text-primary)" }} />
        <div className="absolute right-3 flex items-center gap-2">
          <kbd className="hidden sm:flex items-center justify-center h-6 px-2 rounded text-[10px] font-medium tracking-wider"
            style={{ backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border-primary)", color: "var(--text-tertiary)" }}>
            <Command size={10} className="mr-1" /> K
          </kbd>
          <button onClick={handleSubmit} disabled={!query.trim() || isLoading || disabled}
            className="p-1.5 rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-white"
            style={{ backgroundColor: "var(--stripe-purple)", boxShadow: "0 2px 6px rgba(99,91,255,0.3)" }}>
            {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
