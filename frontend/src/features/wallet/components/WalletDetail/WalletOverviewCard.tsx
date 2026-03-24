import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Pencil, Star } from "lucide-react";
import type { Wallet } from "@/features/wallet/types/wallet";
import { formatVnd } from "@/lib/utils";

interface WalletOverviewCardProps {
  wallet: Wallet;
  childWallets: Wallet[];
  defaultWalletId: string;
  onEdit: () => void;
  onSetDefault: (walletId: string) => void;
  onClearDefault: () => void;
}

export const WalletOverviewCard: React.FC<WalletOverviewCardProps> = ({
  wallet,
  childWallets,
  defaultWalletId,
  onEdit,
  onSetDefault,
  onClearDefault,
}) => {
  const isParent = !wallet.parentWalletId;
  const isDefault = defaultWalletId === wallet.id;
  const hasDefaultChild = isParent && defaultWalletId && childWallets.some((child) => defaultWalletId === child.id);

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isDefault) {
      onClearDefault();
    } else {
      onSetDefault(wallet.id);
    }
  };

  return (
    <section data-testid="parent-overview">
      <Card className="border-note-yellow/30" data-testid="parent-overview-stats">
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <CardTitle className="text-lg font-semibold text-ink-black flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-note-yellow" />
              Overview
            </CardTitle>
            <div className="flex items-center gap-2">
              {!isParent && (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${
                    isDefault
                      ? "text-yellow-500 hover:text-yellow-600"
                      : "text-pencil-gray hover:text-note-yellow"
                  }`}
                  onClick={handleStarClick}
                  aria-label={isDefault ? "Unset as default" : "Set as default"}
                >
                  <Star className="h-4 w-4" fill={isDefault ? "currentColor" : "none"} />
                </Button>
              )}
              {hasDefaultChild && (
                <div className="flex items-center gap-1 bg-yellow-200 text-yellow-900 text-xs font-semibold px-2 py-1 rounded-full">
                  <Star className="h-3 w-3 fill-current" />
                  Has Default
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-ink-black hover:bg-note-yellow/10"
                data-testid="edit-parent-wallet-button"
                onClick={onEdit}
              >
                <Pencil className="h-4 w-4 mr-1" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-pencil-gray">
                {isParent ? "Current Balance" : "Current Balance (Own)"}
              </p>
              <p className="text-3xl font-bold text-ink-black">
                {formatVnd(wallet.balance || 0)}
              </p>
            </div>
            {wallet.description && (
              <div>
                <p className="text-sm text-pencil-gray">Description</p>
                <p className="text-ink-black">{wallet.description}</p>
              </div>
            )}
          </div>
          {isParent && (
            <div className="pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 md:pl-6">
              <p className="text-sm text-pencil-gray">Sub-wallets</p>
              <p className="text-3xl font-bold text-blue-600">{childWallets.length}</p>
              <p className="text-xs text-pencil-gray mt-1">
                {childWallets.length} wallet{childWallets.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};
