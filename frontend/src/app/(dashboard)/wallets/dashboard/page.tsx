"use client";

import React from "react";
import { useWallets } from "@/features/wallet/hooks/useWallets";
import { useDebtPartners } from "@/features/debt/hooks/useDebtPartners";
import { getHistory, subscribeToHistoryRefresh, getMonthlyStats, MonthlyStatsDto } from "@/features/history/api/history";
import { HistoryDto } from "@/features/history/types/history";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  SummaryCards,
  StatsCards,
  MonthlyChart,
  WalletsPanel,
  RecentHistoryPanel,
} from "./components";
import { PageHeader } from "@/components/ui/page-header";

const extractHistoryError = (error: unknown): string => {
  if (typeof error === "string") return error;
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

  // Calculate debt totals
  const totalReceivable = partners.filter((p) => p.balance > 0).reduce((sum, p) => sum + p.balance, 0);
  const totalPayable = partners.filter((p) => p.balance < 0).reduce((sum, p) => sum + Math.abs(p.balance), 0);
  const netWorth = totalCash + totalReceivable - totalPayable;

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="wallet-dashboard-summary">
        <PageHeader title="Dashboard" description="Financial overview of your wallets" />
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

  // Error state
  if (error) {
    return (
      <div className="space-y-6" data-testid="wallet-dashboard-summary">
        <PageHeader title="Dashboard" description="Financial overview of your wallets" />
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
      <PageHeader title="Dashboard" description="Financial overview of your wallets" className="mb-2 pb-3" />

      <SummaryCards
        netWorth={netWorth}
        totalCash={totalCash}
        receivable={totalReceivable}
        payable={totalPayable}
      />

      <StatsCards wallets={safeWallets} partners={partners} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <MonthlyChart monthlyStats={monthlyStats} isLoading={monthlyStatsLoading} />
        <WalletsPanel
          parentWallets={parentWallets}
          childWallets={childWallets}
          defaultWalletId={defaultWalletId}
        />
      </div>

      <RecentHistoryPanel history={recentHistory} isLoading={recentHistoryLoading} error={recentHistoryError} />
    </div>
  );
}
