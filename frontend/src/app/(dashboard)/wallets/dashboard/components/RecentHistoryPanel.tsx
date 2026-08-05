import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock3, ArrowRight } from "lucide-react";
import { HistoryDto, PayerMode } from "@/features/history/types/history";
import { getHistoryKindTag, getHistoryKindTagClasses, stripRepayMarker } from "@/features/history/utils/historyKind";
import { formatVnd } from "@/lib/utils";

const getHistoryTitle = (item: HistoryDto): string => {
  const note = stripRepayMarker(item.note);
  if (note) return note;
  if (item.transferId) return "Wallet Transfer";
  if (item.partnerName) return `With ${item.partnerName}`;
  return "Transaction";
};

const formatHistoryDate = (dateInput: string): string => {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getPayerModeTag = (item: HistoryDto): string | null => {
  if (!item.partnerName) return null;
  if (item.payerMode === PayerMode.ToiTra) return "I paid";
  if (item.payerMode === PayerMode.PartnerTra) return "Partner paid";
  return null;
};

interface RecentHistoryPanelProps {
  history: HistoryDto[];
  isLoading: boolean;
  error: string | null;
}

export const RecentHistoryPanel: React.FC<RecentHistoryPanelProps> = ({
  history,
  isLoading,
  error,
}) => {
  return (
    <Card data-testid="recent-history-section">
      <CardHeader className="pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <CardTitle className="text-2xl font-bold text-ink-black flex items-center gap-2">
            <Clock3 className="h-6 w-6 text-note-yellow" />
            Recent History
          </CardTitle>
          <p className="text-sm text-pencil-gray">Latest transactions from your account</p>
        </div>
        <Link href="/history">
          <Button variant="outline" className="border-note-yellow text-ink-black hover:bg-note-yellow/20 flex items-center gap-2 text-xs font-semibold cursor-pointer">
            View All History
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={`recent-loading-${index}`} className="flex items-center justify-between rounded-md px-2 py-2">
                <div className="space-y-2">
                  <div className="h-4 w-36 rounded bg-gray-200" />
                  <div className="h-3 w-28 rounded bg-gray-100" />
                </div>
                <div className="h-4 w-24 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : history.length === 0 ? (
          <p className="text-sm text-pencil-gray">No transactions yet.</p>
        ) : (
          <div className="space-y-3">
            {history.map((item) => {
              const positive = item.amount > 0;
              const title = getHistoryTitle(item);
              const walletLabel = item.parentWalletName
                ? `${item.walletName ?? "Unknown Wallet"} (${item.parentWalletName})`
                : item.walletName ?? "Unknown Wallet";
              const dateLabel = formatHistoryDate(item.transactionDate || item.createdAt);
              const payerModeTag = getPayerModeTag(item);
              const historyKindTag = getHistoryKindTag(item);

              return (
                <div key={item.id} className="flex items-center justify-between rounded-md px-2 py-2">
                  <div>
                    <p className="text-base font-semibold text-ink-black">{title}</p>
                    <p className="text-xs text-pencil-gray">
                      {walletLabel} - {dateLabel}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${positive ? "text-green-600" : "text-red-600"}`}>
                      {positive ? "+" : ""}
                      {formatVnd(item.amount)}
                    </p>
                    {item.partnerName || historyKindTag || payerModeTag ? (
                      <div className="mt-0.5 flex items-center justify-end gap-1">
                        {item.partnerName ? (
                          <p className="text-xs text-pencil-gray">{item.partnerName}</p>
                        ) : null}
                        {historyKindTag ? (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${getHistoryKindTagClasses(
                              historyKindTag
                            )}`}
                          >
                            {historyKindTag}
                          </span>
                        ) : null}
                        {payerModeTag ? (
                          <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[11px] font-medium text-purple-700">
                            {payerModeTag}
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
