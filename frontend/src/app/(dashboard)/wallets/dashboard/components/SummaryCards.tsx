"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { formatVnd } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface SummaryCardsProps {
  netWorth: number;
  totalCash: number;
  receivable: number;
  payable: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  netWorth,
  totalCash,
  receivable,
  payable,
}) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <Card data-testid="summary-net-worth" className="border-note-yellow/30">
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium text-pencil-gray">{t.wallets.page.stats.netWorth}</CardTitle>
          <TrendingUp className="h-4 w-4 text-note-yellow" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-500">{formatVnd(netWorth)}</div>
        </CardContent>
      </Card>

      <Card data-testid="summary-total-cash" className="border-note-yellow/30">
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium text-pencil-gray">{t.wallets.page.stats.totalCash}</CardTitle>
          <Wallet className="h-4 w-4 text-note-yellow" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-ink-black">{formatVnd(totalCash)}</div>
        </CardContent>
      </Card>

      <Card data-testid="summary-receivable" className="border-note-yellow/30">
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium text-pencil-gray">{t.wallets.page.stats.receivable}</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-500">{formatVnd(receivable)}</div>
        </CardContent>
      </Card>

      <Card data-testid="summary-payable" className="border-note-yellow/30">
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium text-pencil-gray">{t.wallets.page.stats.payable}</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-500">{formatVnd(payable)}</div>
        </CardContent>
      </Card>
    </div>
  );
};
