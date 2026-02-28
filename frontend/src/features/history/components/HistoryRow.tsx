"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Lock, Users } from "lucide-react";
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
  const walletDisplay = item.walletName ?? "";

  // Check if this is a debt transaction with partner
  const isDebtTransaction = item.partnerId != null && item.debtAmount != null;
  const hasDebt = item.debtAmount != null && item.debtAmount !== 0;

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

  const dateStr = item.transactionDate ?? item.createdAt ?? "";

  const amountColor = isTransfer
    ? direction === TransferDirection.Incoming ? "text-green-600" : "text-red-600"
    : amount >= 0 ? "text-green-600" : "text-red-600";

  const handleRowClick = React.useCallback(() => {
    router.push(`/history/${item.id}`);
  }, [router, item.id]);

  // For debt transactions, show enhanced layout
  if (isDebtTransaction && item.partnerName) {
    const totalAmount = item.totalAmount ?? amount;
    const debtAbsAmount = Math.abs(item.debtAmount ?? 0);

    return (
      <div
        className="rounded-md px-3 py-2 border border-purple-200 bg-purple-50/30 cursor-pointer hover:bg-purple-100/50 transition-colors"
        onClick={handleRowClick}
      >
        <div className="flex items-center justify-between gap-3">
          {/* Left side: Debt info */}
          <div className="flex-1 min-w-0">
            {/* Header row: Partner icon + debt relationship */}
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                <Users className="h-3 w-3" />
                Debt
              </span>
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

            {/* Partner relationship - clear "who owes whom" */}
            <div className="font-medium text-ink-black mb-1">
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
            </div>

            {/* Note if present */}
            {item.note && (
              <p className="text-sm text-gray-600 truncate mb-1">{item.note}</p>
            )}

            {/* Amount breakdown */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-pencil-gray">
              <span>
                Total: <span className="font-semibold text-ink-black">{formatVnd(totalAmount)}</span>
              </span>
              {hasDebt && (
                <span>
                  Debt: <span className="font-semibold text-purple-700">{formatVnd(debtAbsAmount)}</span>
                </span>
              )}
              <span>
                Wallet: <span className="font-medium text-ink-black">{walletDisplay}</span>
              </span>
              {dateStr && (
                <span>{new Date(dateStr).toLocaleDateString()}</span>
              )}
            </div>
          </div>

          {/* Right side: Net amount */}
          <div className="text-right whitespace-nowrap">
            <div className="flex items-center justify-end gap-2">
              <span className={`font-semibold ${amountColor}`} aria-label="amount">
                {sign}
                {formatVnd(absAmount)}
              </span>
            </div>
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
