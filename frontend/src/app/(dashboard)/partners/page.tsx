"use client";

import React, { Suspense } from "react";
import { DebtPartnersTabContent } from "@/features/workspace/components/DebtPartnersTabContent";

export default function PartnersPage() {
  return (
    <div data-testid="partners-page-root">
      <Suspense fallback={<div className="p-6 text-center">Loading partners...</div>}>
        <DebtPartnersTabContent />
      </Suspense>
    </div>
  );
}
