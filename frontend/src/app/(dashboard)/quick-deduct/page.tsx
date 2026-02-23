"use client";

import React, { useState } from "react";
import { QuickDebtForm } from "@/features/transaction/components/QuickDebtForm";
import { AdjustmentForm } from "@/features/transaction/components/AdjustmentForm";

export default function QuickDeductPage() {
  const [activeTab, setActiveTab] = useState<"quick-debt" | "adjustment">("quick-debt");

  return (
    <div className="mx-auto max-w-md space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink-black">Quick Deduct</h1>
        <p className="text-pencil-gray mt-1 text-sm">Fast bill entry with debt tagging</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("quick-debt")}
          data-testid="tab-quick-debt"
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === "quick-debt"
              ? "bg-note-yellow text-ink-black"
              : "bg-gray-100 text-pencil-gray hover:bg-gray-200"
          }`}
        >
          Quick Debt
        </button>
        <button
          onClick={() => setActiveTab("adjustment")}
          data-testid="tab-adjustment"
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === "adjustment"
              ? "bg-note-yellow text-ink-black"
              : "bg-gray-100 text-pencil-gray hover:bg-gray-200"
          }`}
        >
          Adjustment
        </button>
      </div>
      <div className="rounded-xl border border-note-yellow/30 bg-white p-5 shadow-sm">
        {activeTab === "quick-debt" ? <QuickDebtForm /> : <AdjustmentForm />}
      </div>
    </div>
  );
}
