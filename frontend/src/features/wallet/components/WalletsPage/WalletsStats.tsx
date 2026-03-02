import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatVnd } from "@/lib/utils";

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:max-w-2xl">
      <Card className="border-blue-100">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-sm text-pencil-gray">Total Wallets</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{parentWalletCount}</p>
            <p className="text-xs text-pencil-gray mt-3">+ {childWalletCount} sub-wallets</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-100">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-sm text-pencil-gray">Total Balance</p>
            <p className="text-3xl font-bold text-orange-500 mt-2">{formatVnd(totalBalance)}</p>
            <p className="text-xs text-pencil-gray mt-3">Aggregated</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
