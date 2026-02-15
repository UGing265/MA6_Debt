"use client";

import React from "react";
import Link from "next/link";
import { useWallets } from "@/features/wallet/hooks/useWallets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Plus, ArrowRight, Wallet2 } from "lucide-react";

export default function WalletsPage() {
  const { data: wallets, isLoading, error } = useWallets();

  const parentWallets = wallets?.filter((wallet) => !wallet.parentWalletId) || [];

  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="parent-wallet-list">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-ink-black">Parent Wallets</h1>
          <Button disabled className="bg-note-yellow text-ink-black">
            <Plus className="h-4 w-4 mr-2" />
            Add Wallet
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-6 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-full bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6" data-testid="parent-wallet-list">
        <h1 className="text-3xl font-bold text-ink-black">Parent Wallets</h1>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Failed to load wallets: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="parent-wallet-list">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink-black">Parent Wallets</h1>
          <p className="text-pencil-gray mt-1">
            Manage your root-level wallets
          </p>
        </div>
        <Link href="/wallets/dashboard">
          <Button variant="outline" className="border-note-yellow hover:bg-note-yellow/10">
            <Wallet2 className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </Link>
      </div>

      {parentWallets.length === 0 ? (
        <Card className="border-dashed border-2 border-note-yellow/30">
          <CardContent className="p-12 text-center">
            <Wallet className="h-12 w-12 text-note-yellow mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-ink-black mb-2">
              No parent wallets yet
            </h3>
            <p className="text-pencil-gray mb-4">
              Create your first parent wallet to get started
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parentWallets.map((wallet) => (
            <Link key={wallet.id} href={`/wallets/${wallet.id}`}>
              <Card
                className="cursor-pointer hover:border-note-yellow/50 transition-colors group h-full"
                data-testid="parent-wallet-card"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-ink-black group-hover:text-note-yellow transition-colors">
                      {wallet.name}
                    </CardTitle>
                    <ArrowRight className="h-4 w-4 text-pencil-gray group-hover:text-note-yellow transition-colors" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-ink-black mb-2">
                    ${(wallet.balance || 0).toLocaleString()}
                  </div>
                  {wallet.description && (
                    <p className="text-sm text-pencil-gray line-clamp-2">
                      {wallet.description}
                    </p>
                  )}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-pencil-gray">
                      Click to manage sub-wallets
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
