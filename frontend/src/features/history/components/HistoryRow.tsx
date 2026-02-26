"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { HistoryDto, TransferDirection } from "../types/history";
import { formatVnd } from "@/lib/utils";

type HistoryRowProps = {
  item: HistoryDto;
};

export const HistoryRow: React.FC<HistoryRowProps> = ({ item }) => {
  const router = useRouter();
  const amount = item.amount ?? 0;
  const isTransfer = item.transferId != null;
  const direction = item.transferDirection ?? null;
  const absAmount = Math.abs(amount);
  const isLocked = Boolean(item.isLocked);
  const lockReason = "This transaction is locked and can't be edited or deleted.";
  const walletDisplay = item.walletName ?? "";

  const sign = isTransfer
    ? direction === TransferDirection.Incoming ? "+" : "-"
    : amount >= 0 ? "+" : "-";

  const transferLabel = isTransfer
    ? direction === TransferDirection.Incoming ? "Transfer In" : "Transfer Out"
    : "";

  const dateStr = item.transactionDate ?? item.createdAt ?? "";

  const amountColor = isTransfer
    ? direction === TransferDirection.Incoming ? "text-green-600" : "text-red-600"
    : amount >= 0 ? "text-green-600" : "text-red-600";

  const handleRowClick = React.useCallback(() => {
    router.push(`/history/${item.id}`);
  }, [router, item.id]);

  return (
    <div
      className="flex items-center justify-between gap-3 rounded-md px-3 py-2 border border-dashed border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={handleRowClick}
    >
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-2 min-w-0">
          <div className="font-medium text-ink-black truncate">
            {item.note ?? item.partnerName ?? "Transaction"}
          </div>
          {isLocked ? (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
              title={lockReason}
              aria-label="locked"
            >
              <Lock className="h-3 w-3" />
              Locked
            </span>
          ) : null}
        </div>
        <p className="text-xs text-pencil-gray truncate">
          <span className="font-semibold text-ink-black">{walletDisplay}</span>
          {item.partnerName ? ` • Partner: ${item.partnerName}` : ""}
          {item.debtAmount != null ? ` • Debt: ${formatVnd(Math.abs(item.debtAmount))}` : ""}
          {dateStr ? ` • ${new Date(dateStr).toLocaleDateString()}` : ""}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right whitespace-nowrap">
          <div className="flex items-center justify-end gap-2">
            <span className={`font-semibold ${amountColor}`} aria-label="amount">
              {sign}
              {formatVnd(absAmount)}
            </span>
            {isTransfer ? (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                  direction === TransferDirection.Incoming
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {transferLabel}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryRow;
