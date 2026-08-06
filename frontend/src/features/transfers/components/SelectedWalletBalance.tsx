import React from "react";
import type { WalletDto } from "../types/transfer";
import { formatVnd } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

const formatBalance = (balance: number): string => {
  return formatVnd(balance);
};

interface SelectedWalletBalanceProps {
  wallet: WalletDto | undefined;
}

export const SelectedWalletBalance: React.FC<SelectedWalletBalanceProps> = ({ wallet }) => {
  const { t } = useLanguage();

  if (!wallet) return null;

  return (
    <div className="bg-gradient-to-r from-note-yellow/10 to-transparent rounded-lg p-3 flex items-center justify-between">
      <span className="text-sm text-pencil-gray">{t.transfer.page.availableBalance}</span>
      <span className="font-semibold text-ink-black">{formatBalance(wallet.balance)}</span>
    </div>
  );
};
