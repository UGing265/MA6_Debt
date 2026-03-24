import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Wallet2, Star } from "lucide-react";
import type { Wallet } from "@/features/wallet/types/wallet";
import { formatVnd } from "@/lib/utils";

interface WalletsPanelProps {
  parentWallets: Wallet[];
  childWallets: Wallet[];
  defaultWalletId: string;
}

export const WalletsPanel: React.FC<WalletsPanelProps> = ({
  parentWallets,
  childWallets,
  defaultWalletId,
}) => {
  return (
    <Card data-testid="wallet-panel">
      <CardHeader className="pb-1">
        <CardTitle className="text-3xl font-bold text-ink-black flex items-center gap-2">
          <Wallet2 className="h-5 w-5 text-note-yellow" />
          Your Wallets
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-3 space-y-3">
        {parentWallets.slice(0, 6).map((wallet) => {
          const walletChildren = childWallets.filter((child) => child.parentWalletId === wallet.id);
          const aggregatedBalance =
            (wallet.balance || 0) +
            walletChildren.reduce((sum, child) => sum + (child.balance || 0), 0);
          const isDefault = defaultWalletId === wallet.id;

          return (
            <div
              key={wallet.id}
              className={`rounded-md border px-3 py-2 transition-colors ${
                isDefault ? "border-yellow-300 bg-yellow-50" : "border-note-yellow/20"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-ink-black">{wallet.name}</p>
                    {isDefault && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                  </div>
                  <p className="text-xs text-pencil-gray">
                    {walletChildren.length} sub-wallet{walletChildren.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <p className="font-semibold text-orange-500">{formatVnd(aggregatedBalance)}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
