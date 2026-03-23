"use client";

import React from "react";
import { HistoryPageContainer } from "@/features/history/components/HistoryPageContainer";

import { PageHeader } from "@/components/ui/page-header";

export default function HistoryPage() {
  return (
    <div className="space-y-6" data-testid="history-page">
      <PageHeader 
        title="Transaction History" 
        description="View, filter, and track all your transactions" 
      />
      <HistoryPageContainer />
    </div>
  );
}
