"use client";

import { useState } from "react";
import { Lock, ArrowRight } from "lucide-react";
import { useAccessCode } from "./AccessCodeProvider";

export function AccessCodeModal() {
  const { isAuthenticated, setAccessCode } = useAccessCode();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  if (isAuthenticated) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setError("");
    setIsValidating(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-access-code": code },
        body: JSON.stringify({ data: [], columns: [], validate: true }),
      });
      if (res.status === 401) {
        setError("Invalid access code. Please try again.");
        setIsValidating(false);
        return;
      }
      setAccessCode(code);
    } catch {
      setAccessCode(code);
    }
    setIsValidating(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(5,5,16,0.8)", backdropFilter: "blur(12px)" }}
    >
      <div
        className="glass-panel relative w-full max-w-md overflow-hidden"
        style={{ animation: "scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both" }}
      >
        <div className="p-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-white/5 border border-white/10">
            <Lock size={22} className="text-[#635BFF]" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2 tracking-tight">
            Enter access code
          </h2>
          <p className="text-sm text-white/50 mb-6 leading-relaxed">
            Enter your access code to use AI-powered features.
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(""); }}
              placeholder="Enter access code"
              className="w-full px-4 py-3 text-sm text-white bg-white/5 rounded-lg transition-all duration-200"
              style={{
                height: 44,
                border: `1px solid ${error ? "#DF1B41" : "rgba(255,255,255,0.1)"}`,
              }}
              autoFocus
            />
            {error && <p className="mt-2 text-xs text-[#DF1B41] font-medium">{error}</p>}
            <button
              type="submit"
              disabled={!code.trim() || isValidating}
              className="btn-primary w-full mt-4 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isValidating ? "Validating..." : <><span>Continue</span><ArrowRight size={16} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
