"use client";

import React from "react";
import { useWallets } from "@/features/wallet/hooks/useWallets";
import { useDebtPartners } from "@/features/debt/hooks/useDebtPartners";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Wallet2, TrendingUp, TrendingDown, Clock3 } from "lucide-react";

const mockRecentHistory = [
  { id: "t1", title: "Team Lunch", wallet: "Main Wallet", date: "16 Feb", amount: -150000, actor: "Minh" },
  { id: "t2", title: "Monthly Salary", wallet: "Savings", date: "15 Feb", amount: 5000000, actor: "" },
  { id: "t3", title: "Coffee", wallet: "Main Wallet", date: "14 Feb", amount: -80000, actor: "" },
  { id: "t4", title: "Books", wallet: "Daily Wallet", date: "13 Feb", amount: -300000, actor: "Lan" },
  { id: "t5", title: "Savings Transfer", wallet: "Main Wallet", date: "11 Feb", amount: -1000000, actor: "" },
];

function formatVnd(value: number) {
  return `${value.toLocaleString("en-US")}d`;
}

export default function WalletDashboardPage() {
  const { data: wallets, isLoading: walletsLoading, error: walletsError } = useWallets();
  const { partners, isLoading: partnersLoading, error: partnersError } = useDebtPartners();

  const isLoading = walletsLoading || partnersLoading;
  const error = walletsError || partnersError;

  const safeWallets = wallets ?? [];
  const totalCash = safeWallets.reduce((sum, wallet) => sum + (wallet.balance || 0), 0);
  const parentWallets = safeWallets.filter((wallet) => !wallet.parentWalletId);
  const childWallets = safeWallets.filter((wallet) => !!wallet.parentWalletId);

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
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6" data-testid="wallet-dashboard-summary">
        <h1 className="text-3xl font-bold text-ink-black">Dashboard</h1>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2" data-testid="chart-container">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-ink-black">Asset Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-72 rounded-md border border-note-yellow/20 bg-gradient-to-b from-orange-50 to-white overflow-hidden">
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-4">
                {Array.from({ length: 24 }).map((_, index) => (
                  <div key={index} className="border-[0.5px] border-dashed border-note-yellow/20" />
                ))}
              </div>
              <div className="absolute left-4 right-4 bottom-12 h-24 border-t-2 border-orange-300 rounded-t-full" />
              <div className="absolute left-4 right-4 bottom-6 flex justify-between text-xs text-pencil-gray">
                <span>T8</span>
                <span>T9</span>
                <span>T10</span>
                <span>T11</span>
                <span>T12</span>
                <span>T1</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="wallet-panel">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-ink-black flex items-center gap-2">
              <Wallet2 className="h-5 w-5 text-note-yellow" />
              Your Wallets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {parentWallets.slice(0, 6).map((wallet) => {
              const childCount = childWallets.filter((child) => child.parentWalletId === wallet.id).length;
              return (
                <div key={wallet.id} className="rounded-md border border-note-yellow/20 px-3 py-2">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-ink-black">{wallet.name}</p>
                      <p className="text-xs text-pencil-gray">{childCount} children</p>
                    </div>
                    <p className="font-semibold text-orange-500">{formatVnd(wallet.balance || 0)}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card data-testid="recent-history-section">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-ink-black flex items-center gap-2">
            <Clock3 className="h-6 w-6 text-note-yellow" />
            Recent History
          </CardTitle>
          <p className="text-sm text-pencil-gray">Mock entries for current redesign phase</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockRecentHistory.map((item) => {
              const positive = item.amount > 0;
              return (
                <div key={item.id} className="flex items-center justify-between rounded-md px-2 py-2">
                  <div>
                    <p className="font-medium text-ink-black">{item.title}</p>
                    <p className="text-xs text-pencil-gray">{item.wallet} - {item.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${positive ? "text-green-600" : "text-red-600"}`}>
                      {positive ? "+" : ""}{formatVnd(item.amount)}
                    </p>
                    {item.actor ? <p className="text-xs text-pencil-gray">{item.actor}</p> : null}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
