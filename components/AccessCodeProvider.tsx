"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AccessCodeContextType {
  accessCode: string | null;
  isAuthenticated: boolean;
  setAccessCode: (code: string) => void;
  clearAccessCode: () => void;
}

const AccessCodeContext = createContext<AccessCodeContextType>({
  accessCode: null,
  isAuthenticated: false,
  setAccessCode: () => {},
  clearAccessCode: () => {},
});

export function useAccessCode() {
  return useContext(AccessCodeContext);
}

export function AccessCodeProvider({ children }: { children: ReactNode }) {
  const [accessCode, setAccessCodeState] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("reportcraft-access-code");
    if (stored) {
      setAccessCodeState(stored);
    }
  }, []);

  const setAccessCode = (code: string) => {
    localStorage.setItem("reportcraft-access-code", code);
    setAccessCodeState(code);
  };

  const clearAccessCode = () => {
    localStorage.removeItem("reportcraft-access-code");
    setAccessCodeState(null);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <AccessCodeContext.Provider
      value={{
        accessCode,
        isAuthenticated: !!accessCode,
        setAccessCode,
        clearAccessCode,
      }}
    >
      {children}
    </AccessCodeContext.Provider>
  );
}
