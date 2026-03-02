import React from "react";
import { Wallet2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { HistoryDto } from "../../types/history";

const formatDateTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

interface WalletInfoCardProps {
  transaction: HistoryDto;
}

export const WalletInfoCard: React.FC<WalletInfoCardProps> = ({ transaction }) => {
  const walletDisplay = transaction.walletName ?? "";

  return (
    <Card className="border-note-yellow/30 bg-note-yellow/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2 text-amber-700">
          <Wallet2 className="h-5 w-5" />
          Wallet Info
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Wallet */}
        <div className="p-3 rounded-lg bg-white border border-amber-200">
          <p className="text-xs text-pencil-gray mb-1">Wallet</p>
          <p className="text-lg font-bold text-ink-black">{walletDisplay}</p>
          {transaction.parentWalletName && (
            <p className="text-xs text-pencil-gray mt-1">Parent: {transaction.parentWalletName}</p>
          )}
        </div>

        {/* Date & Created */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-2 rounded-lg bg-white border border-gray-200">
            <p className="text-xs text-pencil-gray">Date</p>
            <p className="text-sm font-semibold text-ink-black">
              {formatDateTime(transaction.transactionDate)}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-white border border-gray-200">
            <p className="text-xs text-pencil-gray">Created</p>
            <p className="text-sm font-semibold text-ink-black">
              {formatDateTime(transaction.createdAt)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
