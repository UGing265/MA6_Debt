"use client";

import React from "react";
import Link from "next/link";
import { useWallets } from "@/features/wallet/hooks/useWallets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Users, ArrowRight, Wallet2 } from "lucide-react";

export default function WalletDashboardPage() {
  const { data: wallets, isLoading, error } = useWallets();

  const totalCash = wallets?.reduce((sum, wallet) => sum + (wallet.balance || 0), 0) || 0;
  const parentCount = wallets?.filter((wallet) => !wallet.parentWalletId).length || 0;
  const childCount = wallets?.filter((wallet) => wallet.parentWalletId).length || 0;

  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="wallet-dashboard-summary">
        <h1 className="text-3xl font-bold text-ink-black">Wallet Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-32 bg-gray-200 rounded"></div>
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
        <h1 className="text-3xl font-bold text-ink-black">Wallet Dashboard</h1>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Failed to load wallet data: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8" data-testid="wallet-dashboard-summary">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-ink-black">Wallet Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          className="border-note-yellow/30 hover:border-note-yellow/50 transition-colors"
          data-testid="summary-total-cash"
        >
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-pencil-gray">
              Total Cash
            </CardTitle>
            <Wallet className="h-4 w-4 text-note-yellow" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-ink-black">
              ${totalCash.toLocaleString()}
            </div>
            <p className="text-xs text-pencil-gray mt-1">
              Across all wallets
            </p>
          </CardContent>
        </Card>

        <Card
          className="border-note-yellow/30 hover:border-note-yellow/50 transition-colors"
          data-testid="summary-parent-count"
        >
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-pencil-gray">
              Parent Wallets
            </CardTitle>
            <Wallet2 className="h-4 w-4 text-note-yellow" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-ink-black">
              {parentCount}
            </div>
            <p className="text-xs text-pencil-gray mt-1">
              Root-level wallets
            </p>
          </CardContent>
        </Card>

        <Card
          className="border-note-yellow/30 hover:border-note-yellow/50 transition-colors"
          data-testid="summary-child-count"
        >
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-pencil-gray">
              Sub-wallets
            </CardTitle>
            <Users className="h-4 w-4 text-note-yellow" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-ink-black">
              {childCount}
            </div>
            <p className="text-xs text-pencil-gray mt-1">
              Attached to parents
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-ink-black">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/wallets" data-testid="nav-to-wallets">
            <Card className="cursor-pointer hover:border-note-yellow/50 transition-colors group">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-ink-black group-hover:text-note-yellow transition-colors">
                    Manage Parent Wallets
                  </h3>
                  <p className="text-sm text-pencil-gray">
                    View and manage your parent wallets
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-pencil-gray group-hover:text-note-yellow transition-colors" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/partners" data-testid="nav-to-partners">
            <Card className="cursor-pointer hover:border-note-yellow/50 transition-colors group">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-ink-black group-hover:text-note-yellow transition-colors">
                    Manage Partners
                  </h3>
                  <p className="text-sm text-pencil-gray">
                    View and manage your debt partners
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-pencil-gray group-hover:text-note-yellow transition-colors" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {wallets && wallets.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-ink-black">Your Wallets</h2>
          <Card className="border-note-yellow/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-pencil-gray">
                    You have <span className="font-semibold text-ink-black">{wallets.length}</span> total wallets
                  </p>
                  <p className="text-xs text-pencil-gray mt-1">
                    {parentCount} parent wallets and {childCount} sub-wallets
                  </p>
                </div>
                <Link href="/wallets">
                  <Button
                    variant="outline"
                    className="border-note-yellow hover:bg-note-yellow/10"
                  >
                    View All
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
