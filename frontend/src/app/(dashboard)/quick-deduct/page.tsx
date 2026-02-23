"use client";

import React, { useState } from "react";
import { QuickDebtForm } from "@/features/transaction/components/QuickDebtForm";
import { AdjustmentForm } from "@/features/transaction/components/AdjustmentForm";

export default function QuickDeductPage() {
  const [activeTab, setActiveTab] = useState<"quick-debt" | "adjustment">("quick-debt");

  return (
    <div className="min-h-screen bg-[#FBF6E9] px-4 py-8">
      <div className="mx-auto max-w-[480px]">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-[34px] font-bold leading-tight text-[#0B1B3A]">
            Quick Deduct
          </h1>
          <p className="mt-1 text-base text-[#6B7485]">Ghi nhanh giao dịch</p>
        </div>

        {/* Tabs */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setActiveTab("quick-debt")}
            data-testid="tab-quick-debt"
            className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "quick-debt"
                ? "bg-[#E68600] text-white"
                : "bg-[#F1EEE7] text-[#6B7485] hover:bg-[#E6DED1]"
            }`}
          >
            Quick Debt
          </button>
          <button
            onClick={() => setActiveTab("adjustment")}
            data-testid="tab-adjustment"
            className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "adjustment"
                ? "bg-[#E68600] text-white"
                : "bg-[#F1EEE7] text-[#6B7485] hover:bg-[#E6DED1]"
            }`}
          >
            Điều chỉnh ví
          </button>
        </div>

        {/* Card */}
        <div className="rounded-[14px] border-2 border-[#F2C38B] bg-[#F9F6EF] p-6">
          {activeTab === "quick-debt" ? <QuickDebtForm /> : <AdjustmentForm />}
        </div>
      </div>
    </div>
  );
}
