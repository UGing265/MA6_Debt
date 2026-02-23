"use client";

import React from "react";
import { TransferForm } from "@/features/transfers/components/TransferForm";

export default function TransferPage() {
  return (
    <div className="space-y-6" data-testid="transfer-page">
      <h1 className="text-2xl font-semibold text-ink-black">Transfer</h1>
      <TransferForm />
    </div>
  );
}
