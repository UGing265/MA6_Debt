"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { refreshSession } from "../api/auth";
import { useLanguage } from "@/context/LanguageContext";

type RootAuthGateProps = {
  readonly children: ReactNode;
};

export const RootAuthGate = ({ children }: RootAuthGateProps) => {
  const router = useRouter();
  const [isSessionChecked, setIsSessionChecked] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    let isActive = true;

    refreshSession().then(
      () => {
        if (isActive) {
          router.replace("/dashboard");
        }
      },
      () => {
        if (isActive) {
          setIsSessionChecked(true);
        }
      }
    );

    return () => {
      isActive = false;
    };
  }, [router]);

  if (!isSessionChecked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFFBEB] font-quicksand text-[#1F2937]">
        <p className="text-sm font-semibold text-[#4B5563]">{t.auth.rootGate.checkingSession}</p>
      </main>
    );
  }

  return children;
};
