import React from "react";
import { Loader2, Wallet2, ChevronRight } from "lucide-react";
import type { WalletDto } from "../types/transfer";

type GroupedWallets = {
  parent: WalletDto | null;
  children: WalletDto[];
};

const formatBalance = (balance: number): string => {
  return `${balance.toLocaleString("en-US")} VND`;
};

interface WalletBalancePanelProps {
  groupedWallets: GroupedWallets[];
  totalBalance: number;
  selectedFromId: string;
  selectedToId: string;
  isLoading: boolean;
  getParentTotalBalance: (parent: WalletDto, children: WalletDto[]) => number;
}

export const WalletBalancePanel: React.FC<WalletBalancePanelProps> = ({
  groupedWallets,
  totalBalance,
  selectedFromId,
  selectedToId,
  isLoading,
  getParentTotalBalance,
}) => {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-xl border border-note-yellow/20 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-note-yellow/10 to-note-yellow/5 px-4 py-3 border-b border-note-yellow/20">
          <h3 className="font-semibold text-ink-black flex items-center gap-2">
            <Wallet2 className="h-4 w-4 text-note-yellow" />
            Wallet Balances
          </h3>
        </div>

        <div className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-note-yellow" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Total Balance */}
              <div className="bg-gradient-to-r from-note-yellow/20 to-note-yellow/5 rounded-lg p-3 mb-4">
                <p className="text-xs text-pencil-gray mb-1">Total Balance</p>
                <p className="text-xl font-bold text-ink-black">{formatBalance(totalBalance)}</p>
              </div>

              {/* Grouped Wallets */}
              {groupedWallets.map((group, idx) => (
                <div key={group.parent?.id ?? `orphan-${idx}`} className="space-y-2">
                  {group.parent && (
                    <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3 text-pencil-gray" />
                        <span className="font-medium text-ink-black text-sm">{group.parent.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-ink-black">
                        {formatBalance(getParentTotalBalance(group.parent, group.children))}
                      </span>
                    </div>
                  )}

                  {group.children.length > 0 && (
                    <div className="ml-4 space-y-1">
                      {group.children.map((child) => (
                        <div
                          key={child.id}
                          className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
                            selectedFromId === child.id || selectedToId === child.id
                              ? "bg-note-yellow/20 border border-note-yellow/30"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <span className="text-sm text-pencil-gray">{child.name}</span>
                          <span className="text-sm font-medium text-ink-black">{formatBalance(child.balance)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {groupedWallets.length === 0 && (
                <p className="text-center text-pencil-gray py-4">No wallets available</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
