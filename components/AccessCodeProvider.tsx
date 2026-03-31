"use client";

import { createContext, useContext, ReactNode } from "react";

const AccessCodeContext = createContext({
  accessCode: "open" as string | null,
  isAuthenticated: true,
  setAccessCode: (_: string) => {},
  clearAccessCode: () => {},
});

export function useAccessCode() {
  return useContext(AccessCodeContext);
}

export function AccessCodeProvider({ children }: { children: ReactNode }) {
  return (
    <AccessCodeContext.Provider
      value={{
        accessCode: "open",
        isAuthenticated: true,
        setAccessCode: () => {},
        clearAccessCode: () => {},
      }}
    >
      {children}
    </AccessCodeContext.Provider>
  );
}
