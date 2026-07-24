"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { refreshSession } from "../api/auth";

type RootAuthGateProps = {
  readonly children: ReactNode;
};

export const RootAuthGate = ({ children }: RootAuthGateProps) => {
  const router = useRouter();
  const [isSessionChecked, setIsSessionChecked] = useState(false);

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
        <p className="text-sm font-semibold text-[#4B5563]">Checking session...</p>
      </main>
    );
  }

  return children;
};
