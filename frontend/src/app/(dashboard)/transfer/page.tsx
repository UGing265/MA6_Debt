"use client";

import React from "react";
import { TransferForm } from "@/features/transfers/components/TransferForm";
import { PageHeader } from "@/components/ui/page-header";

import { usePrivacy } from "@/context/PrivacyContext";

export default function TransferPage() {
  const { tempShow } = usePrivacy();
  return (
    <div className="mx-auto max-w-5xl space-y-6" data-testid="transfer-page">
      <PageHeader title="Internal Transfer" description="Transfer between your wallets quickly and easily" />
      <TransferForm />
    </div>
  );
}
