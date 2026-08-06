"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

interface TransactionHeaderProps {
  isLocked: boolean;
  lockReason: string;
}

export const TransactionHeader: React.FC<TransactionHeaderProps> = ({ isLocked, lockReason }) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/history">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-ink-black">{t.history.page.detail.title}</h1>
      </div>
      <div className="flex items-center gap-2">
        {isLocked && (
          <span
            className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
            title={lockReason}
          >
            <Lock className="h-4 w-4" />
            {t.history.page.detail.lockedBadge}
          </span>
        )}
      </div>
    </div>
  );
};
