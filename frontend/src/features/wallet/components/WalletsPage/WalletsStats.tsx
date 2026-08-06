"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatVnd } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface WalletsStatsProps {
  parentWalletCount: number;
  childWalletCount: number;
  totalBalance: number;
}

export const WalletsStats: React.FC<WalletsStatsProps> = ({
  parentWalletCount,
  childWalletCount,
  totalBalance,
}) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:max-w-2xl">
      <Card className="border-blue-100">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-sm text-pencil-gray">{t.wallets.page.stats.totalWallets}</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{parentWalletCount}</p>
            <p className="text-xs text-pencil-gray mt-3">{t.wallets.page.stats.subWallets.replace("{count}", String(childWalletCount))}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-100">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-sm text-pencil-gray">{t.wallets.page.stats.totalBalance}</p>
            <p className="text-3xl font-bold text-orange-500 mt-2">{formatVnd(totalBalance)}</p>
            <p className="text-xs text-pencil-gray mt-3">{t.wallets.page.stats.aggregated}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
