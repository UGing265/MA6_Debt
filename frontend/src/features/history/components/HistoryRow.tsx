"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Lock, AlertCircle } from "lucide-react";
import { HistoryDto, TransferDirection, PayerMode } from "../types/history";
import { getHistoryKindTag, getHistoryKindTagClasses, stripRepayMarker } from "../utils/historyKind";
import { formatVnd, cn } from "@/lib/utils";

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
    ? direction === TransferDirection.Incoming ? "text-green-600 font-bold" : "text-red-600 font-bold"
    : amount >= 0 ? "text-green-600 font-bold" : "text-red-600 font-bold";

  const handleRowClick = React.useCallback(() => {
    router.push(`/history/${item.id}`);
  }, [router, item.id]);

  if (hasPartner && item.partnerName) {
    return (
      <div
        className={cn(
          "rounded-xl px-4 py-3 border transition-all shadow-xs cursor-pointer bg-white hover:shadow-md",
          missingDebtAmount
            ? "border-2 border-amber-400 hover:bg-amber-50/50"
            : "border-gray-200 hover:border-amber-300 hover:bg-amber-50/30"
        )}
        onClick={handleRowClick}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 min-w-0 mb-0.5">
              <p className="text-base font-bold text-ink-black truncate">{title}</p>
              {payerModeTag ? (
                <span className="rounded-full bg-amber-100 border border-amber-300/60 px-2.5 py-0.5 text-[11px] font-semibold text-amber-900 shrink-0">
                  {payerModeTag}
                </span>
              ) : null}
              {historyKindTag ? (
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold shrink-0 ${getHistoryKindTagClasses(historyKindTag)}`}
                >
                  {historyKindTag}
                </span>
              ) : null}
              {isLocked ? (
                <span title={lockReason} className="shrink-0">
                  <Lock className="h-3.5 w-3.5 text-gray-400" />
                </span>
              ) : null}
            </div>
            <p className="text-xs font-medium text-pencil-gray truncate">
              {item.walletName ?? "Wallet"} • {dateLabel}
            </p>

            {missingDebtAmount ? (
              <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-amber-700">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Missing debt amount - Click to add</span>
              </div>
            ) : null}
          </div>

          <div className="text-right whitespace-nowrap">
            <span className={`text-base font-bold ${amountColor}`} aria-label="amount">
              {sign}{formatVnd(absAmount)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 border border-gray-200 bg-white hover:border-amber-300 hover:bg-amber-50/30 transition-all shadow-xs hover:shadow-md cursor-pointer"
      onClick={handleRowClick}
    >
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-2 min-w-0 mb-0.5">
          <div className="text-base font-bold text-ink-black truncate">{title}</div>
          {hasPartner && payerModeTag ? (
            <span className="rounded-full bg-amber-100 border border-amber-300/60 px-2.5 py-0.5 text-[11px] font-semibold text-amber-900 shrink-0">
              {payerModeTag}
            </span>
          ) : null}
          {historyKindTag ? (
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getHistoryKindTagClasses(historyKindTag)}`}
            >
              {historyKindTag}
            </span>
          ) : null}
          {isLocked ? (
            <span title={lockReason}>
              <Lock className="h-3.5 w-3.5 text-gray-400" />
            </span>
          ) : null}
        </div>
        <p className="text-xs font-medium text-pencil-gray truncate">
          {item.walletName ?? "Wallet"}
          <span className="ml-2">• {dateLabel}</span>
          {isTransfer ? (
            <span className={`ml-2 font-semibold ${direction === TransferDirection.Incoming ? "text-green-600" : "text-red-600"}`}>
              • {transferLabel}
            </span>
          ) : null}
        </p>
      </div>

      <div className="text-right whitespace-nowrap">
        <span className={`text-base font-bold ${amountColor}`} aria-label="amount">
          {sign}{formatVnd(absAmount)}
        </span>
      </div>
    </div>
  );
};

export default HistoryRow;
