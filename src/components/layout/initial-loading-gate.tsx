"use client";

import { type ReactNode, useState } from "react";
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
