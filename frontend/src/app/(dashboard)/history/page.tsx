"use client";

import React, { Suspense } from "react";
import { HistoryPageContainer } from "@/features/history/components/HistoryPageContainer";

import { PageHeader } from "@/components/ui/page-header";

import { usePrivacy } from "@/context/PrivacyContext";
import { useLanguage } from "@/context/LanguageContext";

export default function HistoryPage() {
  const { tempShow } = usePrivacy();
  const { t } = useLanguage();
  return (
    <div className="space-y-6" data-testid="history-page">
      <PageHeader
        title={t.dashboard.page.historyTitle}
        description={t.dashboard.page.historyDescription}
      />
      <Suspense fallback={<div className="h-64 flex items-center justify-center text-pencil-gray">{t.dashboard.page.loadingHistory}</div>}>
        <HistoryPageContainer />
      </Suspense>
    </div>
  );
}
