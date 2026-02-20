"use client";

import React from "react";
import { useWallets } from "@/features/wallet/hooks/useWallets";
import { useDebtPartners } from "@/features/debt/hooks/useDebtPartners";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Wallet2, TrendingUp, TrendingDown, Clock3, Users, Star } from "lucide-react";

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
  const [defaultWalletId, setDefaultWalletId] = React.useState<string>("");
  const [defaultPartnerId, setDefaultPartnerId] = React.useState<string>("");

  // Load defaults from localStorage
  React.useEffect(() => {
    setDefaultWalletId(localStorage.getItem("defaultWalletId") || "");
    setDefaultPartnerId(localStorage.getItem("defaultPartnerId") || "");
  }, []);

  const isLoading = walletsLoading || partnersLoading;
  const error = walletsError || partnersError;

  const safeWallets = wallets ?? [];
  const totalCash = safeWallets.reduce((sum, wallet) => sum + (wallet.balance || 0), 0);
  const parentWallets = safeWallets.filter((wallet) => !wallet.parentWalletId);
  const childWallets = safeWallets.filter((wallet) => !!wallet.parentWalletId);
  const totalWallets = parentWallets.length + childWallets.length;

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
            <p className="text-xs text-pencil-gray">
              Avg {childWallets.length > 0 ? (childWallets.length / parentWallets.length).toFixed(1) : 0} sub-wallet(s)
            </p>
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
