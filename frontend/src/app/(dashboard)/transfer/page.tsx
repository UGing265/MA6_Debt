"use client";

import React from "react";
import { TransferForm } from "@/features/transfers/components/TransferForm";
import { PageHeader } from "@/components/ui/page-header";

import { usePrivacy } from "@/context/PrivacyContext";
import { useLanguage } from "@/context/LanguageContext";

export default function TransferPage() {
  const { tempShow } = usePrivacy();
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-5xl space-y-6" data-testid="transfer-page">
      <PageHeader title={t.dashboard.page.transferTitle} description={t.dashboard.page.transferDescription} />
      <TransferForm />
    </div>
  );
}
