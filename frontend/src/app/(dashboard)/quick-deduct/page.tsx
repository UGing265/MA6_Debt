"use client";

import React, { useState } from "react";
import { QuickDebtForm } from "@/features/transaction/components/QuickDebtForm";
import { AdjustmentForm } from "@/features/transaction/components/AdjustmentForm";
import { PageHeader } from "@/components/ui/page-header";

import { usePrivacy } from "@/context/PrivacyContext";
import { useLanguage } from "@/context/LanguageContext";

export default function QuickDeductPage() {
  const { tempShow } = usePrivacy();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"quick-debt" | "adjustment">("quick-debt");

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageHeader title={t.dashboard.page.quickDeductTitle} description={t.dashboard.page.quickDeductDescription} />
      <div className="space-y-5">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("quick-debt")}
            data-testid="tab-quick-debt"
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === "quick-debt"
                ? "bg-note-yellow text-ink-black shadow-sm"
                : "bg-gray-100 text-pencil-gray hover:bg-gray-200"
            }`}
          >
            {t.dashboard.page.quickDebtTab}
          </button>
          <button
            onClick={() => setActiveTab("adjustment")}
            data-testid="tab-adjustment"
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === "adjustment"
                ? "bg-note-yellow text-ink-black shadow-sm"
                : "bg-gray-100 text-pencil-gray hover:bg-gray-200"
            }`}
          >
            {t.dashboard.page.adjustmentTab}
          </button>
        </div>
        <div className="rounded-xl border border-note-yellow/30 bg-white p-5 shadow-sm">
          {activeTab === "quick-debt" ? <QuickDebtForm /> : <AdjustmentForm />}
        </div>
      </div>
    </div>
  );
}
