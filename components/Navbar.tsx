"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Lock, Unlock } from "lucide-react";
import { useAccessCode } from "./AccessCodeProvider";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, clearAccessCode } = useAccessCode();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 h-16"
      style={{
        backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.85)" : "transparent",
        backdropFilter: isScrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: isScrolled ? "blur(12px)" : "none",
        borderBottom: `1px solid ${isScrolled ? "#E3E8EE" : "transparent"}`,
        transition: "all 250ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6 h-full flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 group rounded-lg"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm"
            style={{
              background: "linear-gradient(135deg, #635BFF, #8B5CF6)",
              transition: "transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            R
          </div>
          <span className="font-semibold text-[#0A2540] tracking-tight text-[15px]">
            ReportCraft AI
          </span>
        </Link>

        <div className="flex items-center gap-5">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-[#425466] hover:text-[#0A2540] rounded-sm"
            style={{ transition: "color 250ms cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            Dashboard
          </Link>

          <div className="w-px h-4 bg-[#E3E8EE]" />

          <button
            onClick={() => {
              if (isAuthenticated) clearAccessCode();
            }}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#F0F3F7]"
            style={{
              transition: "all 250ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            aria-label={isAuthenticated ? "Lock application" : "Application locked"}
          >
            {isAuthenticated ? (
              <Unlock size={16} color="#0E6245" strokeWidth={2.5} />
            ) : (
              <Lock size={16} color="#8898AA" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
