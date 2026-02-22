"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { QuickDebtForm } from "@/features/transaction/components/QuickDebtForm";
import { AdjustmentForm } from "@/features/transaction/components/AdjustmentForm";

// Quick Deduct page: two-tab composition using existing forms
export default function QuickDeductPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-4xl font-bold text-ink-black">Quick Deduct</h1>
        <p className="text-pencil-gray mt-1">Two-tab composition using existing forms</p>
      </div>

      <Tabs defaultValue="quick-deduct" className="mt-2">
        <TabsList>
          <TabsTrigger value="quick-deduct" data-testid="tab-quick-debt">
            Quick Debt
          </TabsTrigger>
          <TabsTrigger value="adjustment" data-testid="tab-adjustment">
            Dieu chinh vi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quick-deduct">
          <div className="p-4">
            <div className="mb-4 text-sm text-pencil-gray">
              No child wallets or partners? Use the forms to create or connect them.
            </div>
            <QuickDebtForm />
          </div>
        </TabsContent>

        <TabsContent value="adjustment">
          <div className="p-4">
            <div className="mb-4 text-sm text-pencil-gray">
              No child wallets or partners? Use the forms to create or connect them.
            </div>
            <AdjustmentForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
