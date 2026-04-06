"use client";

import type React from "react";
import { createContext, useContext, useMemo, useState } from "react";
import type { InsightsPeriod } from "@/lib/api/stats-days";

type InsightsPeriodContextValue = {
  period: InsightsPeriod;
  setPeriod: (period: InsightsPeriod) => void;
};

const InsightsPeriodContext = createContext<InsightsPeriodContextValue | null>(
  null,
);

export function InsightsPeriodProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [period, setPeriod] = useState<InsightsPeriod>(30);

  const value = useMemo(() => ({ period, setPeriod }), [period]);

  return (
    <InsightsPeriodContext.Provider value={value}>
      {children}
    </InsightsPeriodContext.Provider>
  );
}

export function useInsightsPeriod(): InsightsPeriodContextValue {
  const ctx = useContext(InsightsPeriodContext);
  if (!ctx) {
    throw new Error(
      "useInsightsPeriod must be used within InsightsPeriodProvider",
    );
  }
  return ctx;
}
