"use client";

import React from "react";
import { useWallets } from "@/features/wallet/hooks/useWallets";
import { useDebtPartners } from "@/features/debt/hooks/useDebtPartners";
import { getHistory, subscribeToHistoryRefresh, getMonthlyStats, MonthlyStatsDto } from "@/features/history/api/history";
import { HistoryDto, PayerMode } from "@/features/history/types/history";
import { getHistoryKindTag, getHistoryKindTagClasses, stripRepayMarker } from "@/features/history/utils/historyKind";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Wallet2, TrendingUp, TrendingDown, Clock3, Users, Star } from "lucide-react";
import { formatVnd } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// formatVnd centralized via '@/lib/utils'

const extractHistoryError = (error: unknown): string => {
  if (typeof error === "string") {
    return error;
  }
  if (error && typeof error === "object") {
    const maybeError = error as { general?: unknown; message?: unknown };
    if (typeof maybeError.general === "string" && maybeError.general.trim().length > 0) {
      return maybeError.general;
    }
    if (typeof maybeError.message === "string" && maybeError.message.trim().length > 0) {
      return maybeError.message;
    }
  }
  return "Failed to load recent history";
};

const getHistoryTitle = (item: HistoryDto): string => {
  const note = stripRepayMarker(item.note);
  if (note) {
    return note;
  }
  if (item.transferId) {
    return "Wallet Transfer";
  }
  if (item.partnerName) {
    return `With ${item.partnerName}`;
  }
  return "Transaction";
};

const formatHistoryDate = (dateInput: string): string => {
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

const getPayerModeTag = (item: HistoryDto): string | null => {
  if (!item.partnerName) {
    return null;
  }
  if (item.payerMode === PayerMode.ToiTra) {
    return "Toi tra";
  }
  if (item.payerMode === PayerMode.PartnerTra) {
    return "Partner tra";
  }
  return null;
};

export default function WalletDashboardPage() {
  const { data: wallets, isLoading: walletsLoading, error: walletsError } = useWallets();
  const { partners, isLoading: partnersLoading, error: partnersError } = useDebtPartners();
  const [defaultWalletId, setDefaultWalletId] = React.useState<string>("");
  const [recentHistory, setRecentHistory] = React.useState<HistoryDto[]>([]);
  const [recentHistoryLoading, setRecentHistoryLoading] = React.useState<boolean>(true);
  const [recentHistoryError, setRecentHistoryError] = React.useState<string | null>(null);
  const [monthlyStats, setMonthlyStats] = React.useState<MonthlyStatsDto[]>([]);
  const [monthlyStatsLoading, setMonthlyStatsLoading] = React.useState<boolean>(true);

  // Load defaults from localStorage
  React.useEffect(() => {
    setDefaultWalletId(localStorage.getItem("defaultWalletId") || "");
  }, []);

  const fetchRecentHistory = React.useCallback(async () => {
    setRecentHistoryLoading(true);
    setRecentHistoryError(null);
    try {
      const result = await getHistory({ page: 1, pageSize: 5 });
      setRecentHistory(result.items ?? []);
    } catch (error) {
      setRecentHistoryError(extractHistoryError(error));
      setRecentHistory([]);
    } finally {
      setRecentHistoryLoading(false);
    }
  }, []);

  const fetchMonthlyStats = React.useCallback(async () => {
    setMonthlyStatsLoading(true);
    try {
      const result = await getMonthlyStats(6);
      setMonthlyStats(result);
    } catch {
      setMonthlyStats([]);
    } finally {
      setMonthlyStatsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void fetchRecentHistory();
    void fetchMonthlyStats();
    const unsubscribe = subscribeToHistoryRefresh(() => {
      void fetchRecentHistory();
      void fetchMonthlyStats();
    });
    return unsubscribe;
  }, [fetchRecentHistory, fetchMonthlyStats]);

  const isLoading = walletsLoading || partnersLoading;
  const error = walletsError || partnersError;

  const safeWallets = wallets ?? [];
  const totalCash = safeWallets.reduce((sum, wallet) => sum + (wallet.balance || 0), 0);
  const parentWallets = safeWallets.filter((wallet) => !wallet.parentWalletId);
  const childWallets = safeWallets.filter((wallet) => !!wallet.parentWalletId);
  const totalWallets = parentWallets.length + childWallets.length;

  // Safeguard: avoid divide-by-zero when computing average sub-wallets per parent wallet
  const parentWalletsCount = parentWallets.length;
  const avgSubWalletsDisplay = parentWalletsCount > 0 ? (childWallets.length / parentWalletsCount).toFixed(1) : "0";

  // SRS: Total = Σ(Tất cả Ví con) + (Tiền nợ)
  // Receivable = partner balance > 0 (họ nợ mình)
  // Payable = partner balance < 0 (mình nợ họ)
  const totalReceivable = partners
    .filter((p) => p.balance > 0)
    .reduce((sum, p) => sum + p.balance, 0);
  const totalPayable = partners
    .filter((p) => p.balance < 0)
    .reduce((sum, p) => sum + Math.abs(p.balance), 0);
  const netWorth = totalCash + totalReceivable - totalPayable;

  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="wallet-dashboard-summary">
        <h1 className="text-3xl font-bold text-ink-black">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <Card key={item} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-7 w-36 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <Card key={`stats-${item}`} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-7 w-36 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6" data-testid="wallet-dashboard-summary">
        <h1 className="text-3xl font-bold text-ink-black">Dashboard</h1>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4 pb-4">
            <p className="text-red-600">Failed to load wallet data: {String(error)}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="wallet-dashboard-summary">
      <div>
        <h1 className="text-4xl font-bold text-ink-black">Dashboard</h1>
        <p className="text-pencil-gray mt-1">Financial overview of your wallets</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card data-testid="summary-net-worth" className="border-note-yellow/30">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-pencil-gray">Net Worth</CardTitle>
            <TrendingUp className="h-4 w-4 text-note-yellow" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">{formatVnd(netWorth)}</div>
          </CardContent>
        </Card>

        <Card data-testid="summary-total-cash" className="border-note-yellow/30">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-pencil-gray">Total Cash</CardTitle>
            <Wallet className="h-4 w-4 text-note-yellow" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-ink-black">{formatVnd(totalCash)}</div>
          </CardContent>
        </Card>

        <Card data-testid="summary-receivable" className="border-note-yellow/30">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-pencil-gray">Receivable</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{formatVnd(totalReceivable)}</div>
          </CardContent>
        </Card>

        <Card data-testid="summary-payable" className="border-note-yellow/30">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-pencil-gray">Payable</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{formatVnd(totalPayable)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card data-testid="stats-total-wallets" className="border-blue-100">
          <div className="p-5 text-center space-y-1">
            <p className="text-sm font-medium text-pencil-gray">Total Wallets</p>
            <div className="text-4xl font-bold text-blue-600">{totalWallets}</div>
            <p className="text-xs text-pencil-gray">
              {parentWallets.length} parent · {childWallets.length} sub
            </p>
          </div>
        </Card>

        <Card data-testid="stats-parent-wallets" className="border-purple-100">
          <div className="p-5 text-center space-y-1">
            <p className="text-sm font-medium text-pencil-gray">Parent Wallets</p>
            <div className="text-4xl font-bold text-purple-600">{parentWallets.length}</div>
            <p className="text-xs text-pencil-gray">Avg {avgSubWalletsDisplay} sub-wallet(s)</p>
          </div>
        </Card>

        <Card data-testid="stats-debt-partners" className="border-emerald-100">
          <div className="p-5 text-center space-y-1">
            <p className="text-sm font-medium text-pencil-gray">Debt Partners</p>
            <div className="text-4xl font-bold text-emerald-600">{partners.length}</div>
            <p className="text-xs text-pencil-gray">
              {partners.filter((p) => p.balance > 0).length} receivable · {partners.filter((p) => p.balance < 0).length} payable
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2" data-testid="chart-container">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl font-bold text-ink-black">Monthly Overview</CardTitle>
            <p className="text-sm text-pencil-gray">Expenses and debt activity over the last 6 months</p>
          </CardHeader>
          <CardContent>
            {monthlyStatsLoading ? (
              <div className="h-72 rounded-md border border-note-yellow/20 bg-gray-50 animate-pulse" />
            ) : monthlyStats.length === 0 ? (
              <div className="h-72 rounded-md border border-note-yellow/20 bg-gray-50 flex flex-col items-center justify-center gap-2">
                <p className="text-pencil-gray">No data available</p>
                <p className="text-xs text-pencil-gray/60">Make sure backend API is running and restarted</p>
              </div>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#fcd34d" opacity={0.3} />
                    <XAxis dataKey="monthLabel" tick={{ fill: "#374151", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#374151", fontSize: 12 }} tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                    <Tooltip
                      formatter={(value) => formatVnd(Number(value))}
                      labelStyle={{ color: "#1f2937" }}
                      contentStyle={{ backgroundColor: "#fffbeb", border: "1px solid #fcd34d", borderRadius: "8px" }}
                    />
                    <Legend />
                    <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="debtIncrease" name="New Debt" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="debtDecrease" name="Repaid" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="wallet-panel">
          <CardHeader className="pb-1">
            <CardTitle className="text-3xl font-bold text-ink-black flex items-center gap-2">
              <Wallet2 className="h-5 w-5 text-note-yellow" />
              Your Wallets
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 pb-3 space-y-3">
            {parentWallets.slice(0, 6).map((wallet) => {
              const walletChildren = childWallets.filter((child) => child.parentWalletId === wallet.id);
              const aggregatedBalance =
                (wallet.balance || 0) +
                walletChildren.reduce((sum, child) => sum + (child.balance || 0), 0);
              const isDefault = defaultWalletId === wallet.id;
              return (
                <div 
                  key={wallet.id} 
                  className={`rounded-md border px-3 py-2 transition-colors ${
                    isDefault 
                      ? "border-yellow-300 bg-yellow-50" 
                      : "border-note-yellow/20"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-ink-black">{wallet.name}</p>
                        {isDefault && (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      <p className="text-xs text-pencil-gray">{walletChildren.length} sub-wallet{walletChildren.length !== 1 ? "s" : ""}</p>
                    </div>
                    <p className="font-semibold text-orange-500">{formatVnd(aggregatedBalance)}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card data-testid="recent-history-section">
        <CardHeader className="pb-2">
          <CardTitle className="text-4xl font-bold text-ink-black flex items-center gap-2">
            <Clock3 className="h-6 w-6 text-note-yellow" />
            Recent History
          </CardTitle>
          <p className="text-sm text-pencil-gray">Latest transactions from your account</p>
        </CardHeader>
        <CardContent>
          {recentHistoryLoading ? (
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
          ) : recentHistoryError ? (
            <p className="text-sm text-red-600">{recentHistoryError}</p>
          ) : recentHistory.length === 0 ? (
            <p className="text-sm text-pencil-gray">No transactions yet.</p>
          ) : (
            <div className="space-y-3">
              {recentHistory.map((item) => {
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
                      <p className="text-xs text-pencil-gray">{walletLabel} - {dateLabel}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${positive ? "text-green-600" : "text-red-600"}`}>
                        {positive ? "+" : ""}
                        {formatVnd(item.amount)}
                      </p>
                      {item.partnerName || historyKindTag || payerModeTag ? (
                        <div className="mt-0.5 flex items-center justify-end gap-1">
                          {item.partnerName ? <p className="text-xs text-pencil-gray">{item.partnerName}</p> : null}
                          {historyKindTag ? (
                            <span
                              className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${getHistoryKindTagClasses(historyKindTag)}`}
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
    </div>
  );
}
