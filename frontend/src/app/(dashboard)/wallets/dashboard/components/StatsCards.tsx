import React from "react";
import { Card } from "@/components/ui/card";
import type { Wallet } from "@/features/wallet/types/wallet";

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
  const parentWallets = wallets.filter((wallet) => !wallet.parentWalletId);
  const childWallets = wallets.filter((wallet) => !!wallet.parentWalletId);
  const totalWallets = parentWallets.length + childWallets.length;

  const parentWalletsCount = parentWallets.length;
  const avgSubWalletsDisplay =
    parentWalletsCount > 0 ? (childWallets.length / parentWalletsCount).toFixed(1) : "0";

  const receivableCount = partners.filter((p) => p.balance > 0).length;
  const payableCount = partners.filter((p) => p.balance < 0).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card data-testid="stats-total-wallets" className="border-blue-100">
        <div className="p-5 text-center space-y-1">
          <p className="text-sm font-medium text-pencil-gray">Total Wallets</p>
          <div className="text-4xl font-bold text-blue-600">{totalWallets}</div>
          <p className="text-xs text-pencil-gray">
            {parentWallets.length} parent · {childWallets.length} sub
          </p>
        </div>
      </Card>

      <Card data-testid="stats-parent-wallets" className="border-purple-100">
        <div className="p-5 text-center space-y-1">
          <p className="text-sm font-medium text-pencil-gray">Parent Wallets</p>
          <div className="text-4xl font-bold text-purple-600">{parentWallets.length}</div>
          <p className="text-xs text-pencil-gray">Avg {avgSubWalletsDisplay} sub-wallet(s)</p>
        </div>
      </Card>

      <Card data-testid="stats-debt-partners" className="border-emerald-100">
        <div className="p-5 text-center space-y-1">
          <p className="text-sm font-medium text-pencil-gray">Debt Partners</p>
          <div className="text-4xl font-bold text-emerald-600">{partners.length}</div>
          <p className="text-xs text-pencil-gray">
            {receivableCount} receivable · {payableCount} payable
          </p>
        </div>
      </Card>
    </div>
  );
};
