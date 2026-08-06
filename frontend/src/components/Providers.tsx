"use client";

import type { ReactNode } from "react";
import { LanguageProvider } from "@/context/LanguageContext";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
