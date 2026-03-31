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
    setError(""); setIsValidating(true);
    try {
      const res = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json", "x-access-code": code }, body: JSON.stringify({ data: [], columns: [], validate: true }) });
      if (res.status === 401) { setError("Invalid access code. Please try again."); setIsValidating(false); return; }
      setAccessCode(code);
    } catch { setAccessCode(code); }
    setIsValidating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(10,37,64,0.6)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
      <div className="relative w-full max-w-md animate-scaleIn overflow-hidden"
        style={{ backgroundColor: "var(--bg-primary)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-primary)", boxShadow: "0 20px 40px rgba(10,37,64,0.15)" }}>
        <div className="p-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: "var(--accent-subtle)" }}>
            <Lock size={22} style={{ color: "var(--stripe-purple)" }} />
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Enter access code</h2>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--text-secondary)" }}>Enter your access code to use AI-powered features.</p>
          <form onSubmit={handleSubmit}>
            <input type="password" value={code} onChange={e => { setCode(e.target.value); setError(""); }} placeholder="Enter access code" autoFocus
              className="w-full px-4 py-3 text-sm transition-all duration-150"
              style={{ height: 44, borderRadius: "var(--radius-md)", border: `1px solid ${error ? "var(--stripe-red)" : "var(--border-primary)"}`, backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }} />
            {error && <p className="mt-2 text-xs font-medium" style={{ color: "var(--stripe-red)" }}>{error}</p>}
            <button type="submit" disabled={!code.trim() || isValidating} className="btn-primary w-full mt-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed">
              {isValidating ? "Validating..." : <><span>Continue</span><ArrowRight size={16} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
