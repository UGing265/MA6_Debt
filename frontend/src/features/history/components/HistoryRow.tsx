"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Lock, AlertCircle } from "lucide-react";
import { HistoryDto, TransferDirection, PayerMode } from "../types/history";
import { getHistoryKindTag, getHistoryKindTagClasses, stripRepayMarker } from "../utils/historyKind";
import { formatVnd } from "@/lib/utils";

type HistoryRowProps = {
  item: HistoryDto;
};

const formatHistoryDate = (dateInput?: string | null): string => {
  if (!dateInput) {
    return "-";
  }
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getPayerModeTag = (payerMode: PayerMode | null): string | null => {
  if (payerMode === PayerMode.ToiTra) {
    return "Toi tra";
  }
  if (payerMode === PayerMode.PartnerTra) {
    return "Partner tra";
  }
  return null;
};

export const HistoryRow: React.FC<HistoryRowProps> = ({ item }) => {
  const router = useRouter();
  const amount = item.amount ?? 0;
  const isTransfer = item.transferId != null;
  const direction = item.transferDirection ?? null;
  const absAmount = Math.abs(amount);
  const isLocked = Boolean(item.isLocked);
  const lockReason = "This transaction is locked and can't be edited or deleted.";

  const hasPartner = item.partnerId != null;
  const hasDebt = item.debtAmount != null && item.debtAmount !== 0;
  const missingDebtAmount = hasPartner && !hasDebt;

  const payerMode = item.payerMode ?? null;
  const payerModeTag = getPayerModeTag(payerMode);
  const historyKindTag = getHistoryKindTag(item);
  const title = stripRepayMarker(item.note) || "Transaction";
  const dateLabel = formatHistoryDate(item.transactionDate || item.createdAt);

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

  if (hasPartner && item.partnerName) {
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
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 min-w-0 mb-0.5">
              <p className="text-base font-semibold text-ink-black truncate">{title}</p>
              {payerModeTag ? (
                <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[11px] font-medium text-purple-700 shrink-0">
                  {payerModeTag}
                </span>
              ) : null}
              {historyKindTag ? (
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium shrink-0 ${getHistoryKindTagClasses(historyKindTag)}`}
                >
                  {historyKindTag}
                </span>
              ) : null}
              {isLocked ? (
                <span title={lockReason} className="shrink-0">
                  <Lock className="h-3 w-3 text-gray-400" />
                </span>
              ) : null}
            </div>
            <p className="text-xs text-pencil-gray truncate">
              {item.walletName ?? "Wallet"} - {dateLabel}
            </p>

            {missingDebtAmount ? (
              <div className="flex items-center gap-1 mt-1 text-xs text-amber-700">
                <AlertCircle className="h-3 w-3" />
                <span>Missing debt amount - Click to add</span>
              </div>
            ) : null}
          </div>

          <div className="text-right whitespace-nowrap">
            <span className={`font-semibold ${amountColor}`} aria-label="amount">
              {sign}{formatVnd(absAmount)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-between gap-3 rounded-md px-3 py-2 border border-dashed border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={handleRowClick}
    >
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-2 min-w-0">
          <div className="text-base font-semibold text-ink-black truncate">{title}</div>
          {hasPartner && payerModeTag ? (
            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[11px] font-medium text-purple-700">
              {payerModeTag}
            </span>
          ) : null}
          {historyKindTag ? (
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${getHistoryKindTagClasses(historyKindTag)}`}
            >
              {historyKindTag}
            </span>
          ) : null}
          {isLocked ? (
            <span title={lockReason}>
              <Lock className="h-3 w-3 text-gray-400" />
            </span>
          ) : null}
        </div>
        <p className="text-xs text-pencil-gray truncate">
          {item.walletName ?? "Wallet"}
          <span className="ml-2">• {dateLabel}</span>
          {isTransfer ? (
            <span className={`ml-2 ${direction === TransferDirection.Incoming ? "text-green-600" : "text-red-600"}`}>
              • {transferLabel}
            </span>
          ) : null}
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
