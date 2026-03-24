"use client";

import React, { Suspense } from "react";
import { HistoryPageContainer } from "@/features/history/components/HistoryPageContainer";

import { PageHeader } from "@/components/ui/page-header";

export default function HistoryPage() {
  return (
    <div className="space-y-6" data-testid="history-page">
      <PageHeader 
        title="Transaction History" 
        description="View, filter, and track all your transactions" 
      />
      <Suspense fallback={<div className="h-64 flex items-center justify-center text-pencil-gray">Loading history...</div>}>
        <HistoryPageContainer />
      </Suspense>
    </div>
  );
}
