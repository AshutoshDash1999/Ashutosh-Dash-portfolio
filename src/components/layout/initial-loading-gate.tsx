"use client";

import { useState, type ReactNode } from "react";
import { LoadingScreen } from "./loading-screen";

export function InitialLoadingGate({
  userName,
  children,
}: {
  userName: string;
  children: ReactNode;
}) {
  const [loadingComplete, setLoadingComplete] = useState(false);

  if (!loadingComplete) {
    return (
      <LoadingScreen
        userName={userName}
        onComplete={() => setLoadingComplete(true)}
      />
    );
  }

  return <>{children}</>;
}
