"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import type { Wallet } from "@/features/wallet/types/wallet";
import { useLanguage } from "@/context/LanguageContext";

interface DebtPartner {
  id: string;
  name: string;
  balance: number;
}

interface StatsCardsProps {
  wallets: Wallet[];
  partners: DebtPartner[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ wallets, partners }) => {
  const { t } = useLanguage();

  const parentWallets = wallets.filter((wallet) => !wallet.parentWalletId);
  const childWallets = wallets.filter((wallet) => !!wallet.parentWalletId);
  const totalWallets = parentWallets.length + childWallets.length;

  const receivableCount = partners.filter((p) => p.balance > 0).length;
  const payableCount = partners.filter((p) => p.balance < 0).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card data-testid="stats-total-wallets" className="border-blue-100">
        <div className="p-5 text-center space-y-2">
          <p className="text-sm font-semibold text-pencil-gray">{t.wallets.page.stats.totalWallets}</p>
          <div className="text-4xl font-bold text-blue-600">{totalWallets}</div>
          <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80 text-xs font-bold">
              {parentWallets.length} ví cha
            </span>
            <span className="text-slate-400 font-bold">·</span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 text-xs font-bold">
              {childWallets.length} ví con
            </span>
          </div>
        </div>
      </Card>

      <Card data-testid="stats-debt-partners" className="border-emerald-100">
        <div className="p-5 text-center space-y-2">
          <p className="text-sm font-semibold text-pencil-gray">{t.partners.page.title}</p>
          <div className="text-4xl font-bold text-emerald-600">{partners.length}</div>
          <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 text-xs font-bold">
              {t.partners.page.receivable} {receivableCount}
            </span>
            <span className="text-slate-400 font-bold">·</span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/80 text-xs font-bold">
              {t.partners.page.payable} {payableCount}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};
