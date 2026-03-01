"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Lock, Users, AlertCircle } from "lucide-react";
import { HistoryDto, TransferDirection, PayerMode } from "../types/history";
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

  // Check if this is a debt transaction with partner
  const hasPartner = item.partnerId != null;
  const hasDebt = item.debtAmount != null && item.debtAmount !== 0;
  const missingDebtAmount = hasPartner && !hasDebt; // Partner selected but no debt amount

  // Determine debt relationship based on payerMode
  const payerMode = item.payerMode ?? null;
  const isUserPaying = payerMode === PayerMode.ToiTra; // User paid, partner owes them
  const isPartnerPaying = payerMode === PayerMode.PartnerTra; // Partner paid, user owes them

  const sign = isTransfer
    ? direction === TransferDirection.Incoming ? "+" : "-"
    : amount >= 0 ? "+" : "-";

  const transferLabel = isTransfer
    ? direction === TransferDirection.Incoming ? "Transfer In" : "Transfer Out"
    : "";

  const amountColor = isTransfer
    ? direction === TransferDirection.Incoming ? "text-green-600" : "text-red-600"
    : amount >= 0 ? "text-green-600" : "text-red-600";

  const handleRowClick = React.useCallback(() => {
    router.push(`/history/${item.id}`);
  }, [router, item.id]);

  // For debt transactions (with partner), show compact layout
  if (hasPartner && item.partnerName) {
    const totalAmount = item.totalAmount ?? absAmount;
    const debtAbsAmount = Math.abs(item.debtAmount ?? 0);

    return (
      <div
        className={`rounded-md px-3 py-2 border cursor-pointer transition-colors ${
          missingDebtAmount
            ? "border-amber-300 bg-amber-50 hover:bg-amber-100"
            : "border-purple-200 bg-purple-50/30 hover:bg-purple-100/50"
        }`}
        onClick={handleRowClick}
      >
        <div className="flex items-center justify-between gap-3">
          {/* Left side: Info */}
          <div className="flex-1 min-w-0">
            {/* Note at top */}
            {item.note && (
              <p className="text-sm text-ink-black truncate mb-0.5">{item.note}</p>
            )}

            {/* Debt relationship line */}
            <div className="flex items-center gap-2 text-sm">
              {isUserPaying ? (
                <span>
                  <span className="text-purple-700 font-semibold">{item.partnerName}</span>
                  <span className="text-gray-600"> owes you</span>
                </span>
              ) : isPartnerPaying ? (
                <span>
                  <span className="text-gray-600">You owe </span>
                  <span className="text-purple-700 font-semibold">{item.partnerName}</span>
                </span>
              ) : (
                <span className="text-purple-700 font-semibold">{item.partnerName}</span>
              )}

              {hasDebt && (
                <span className="text-xs text-pencil-gray">
                  • {formatVnd(debtAbsAmount)}
                </span>
              )}

              {isLocked && (
                <span title={lockReason}>
                  <Lock className="h-3 w-3 text-gray-400" />
                </span>
              )}
            </div>

            {/* Missing debt warning */}
            {missingDebtAmount && (
              <div className="flex items-center gap-1 mt-1 text-xs text-amber-700">
                <AlertCircle className="h-3 w-3" />
                <span>Missing debt amount - Click to add</span>
              </div>
            )}
          </div>

          {/* Right side: Amount */}
          <div className="text-right whitespace-nowrap">
            <span className={`font-semibold ${amountColor}`} aria-label="amount">
              {sign}{formatVnd(absAmount)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Default layout for non-debt transactions
  return (
    <div
      className="flex items-center justify-between gap-3 rounded-md px-3 py-2 border border-dashed border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={handleRowClick}
    >
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-2 min-w-0">
          <div className="font-medium text-ink-black truncate">
            {item.note ?? "Transaction"}
          </div>
          {isLocked && (
            <span title={lockReason}>
              <Lock className="h-3 w-3 text-gray-400" />
            </span>
          )}
        </div>
        <p className="text-xs text-pencil-gray truncate">
          {item.walletName ?? "Wallet"}
          {isTransfer && (
            <span className={`ml-2 ${direction === TransferDirection.Incoming ? "text-green-600" : "text-red-600"}`}>
              • {transferLabel}
            </span>
          )}
        </p>
      </div>

      <div className="text-right whitespace-nowrap">
        <span className={`font-semibold ${amountColor}`} aria-label="amount">
          {sign}{formatVnd(absAmount)}
        </span>
      </div>
    </div>
  );
};

export default HistoryRow;
