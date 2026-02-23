"use client";

import React from "react";
import { TransferForm } from "@/features/transfers/components/TransferForm";

export default function TransferPage() {
  return (
    <div className="space-y-6" data-testid="transfer-page">
      <div>
        <h1 className="text-2xl font-bold text-ink-black">Chuyển tiền nội bộ</h1>
        <p className="text-pencil-gray mt-1">
          Chuyển tiền giữa các ví con của bạn một cách nhanh chóng
        </p>
      </div>
      <TransferForm />
    </div>
  );
}
