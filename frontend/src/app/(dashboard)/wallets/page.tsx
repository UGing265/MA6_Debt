"use client";

import React from "react";
import Link from "next/link";
import { useWallets } from "@/features/wallet/hooks/useWallets";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet2, Plus, Pencil, Trash2, ChevronUp } from "lucide-react";

function formatVnd(value: number) {
  return `${value.toLocaleString("en-US")}d`;
}

export default function WalletsPage() {
  const { data: wallets, isLoading, error } = useWallets();

  const allWallets = wallets ?? [];
  const parentWallets = allWallets.filter((wallet) => !wallet.parentWalletId);

  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="parent-wallet-list">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-5xl font-bold text-ink-black">Wallet Management</h1>
            <p className="text-pencil-gray mt-2">Parent and child wallets</p>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse h-44" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6" data-testid="parent-wallet-list">
        <h1 className="text-5xl font-bold text-ink-black">Wallet Management</h1>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Failed to load wallets: {String(error)}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="parent-wallet-list">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-5xl font-bold text-ink-black">Wallet Management</h1>
          <p className="text-pencil-gray mt-2">Parent and child wallets</p>
        </div>
        <Link href="/workspace?tab=wallets">
          <Button className="rounded-full bg-note-yellow text-ink-black hover:bg-note-yellow/90">
            <Plus className="h-4 w-4 mr-2" />
            Create Parent Wallet
          </Button>
        </Link>
      </div>

      {parentWallets.length === 0 ? (
        <Card className="border-note-yellow/30">
          <CardContent className="p-10 text-center">
            <Wallet2 className="h-12 w-12 mx-auto text-note-yellow mb-3" />
            <p className="text-ink-black font-semibold">No parent wallets found</p>
            <p className="text-sm text-pencil-gray">Create a parent wallet to begin organizing child wallets.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {parentWallets.map((parent) => {
            const children = allWallets.filter((wallet) => wallet.parentWalletId === parent.id);
            return (
              <Card key={parent.id} className="border-note-yellow/25" data-testid="parent-wallet-card">
                <CardContent className="p-4 md:p-5 space-y-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-note-yellow/20 text-note-yellow flex items-center justify-center">
                        <Wallet2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-ink-black">{parent.name}</p>
                        <p className="text-sm text-pencil-gray">
                          {parent.description || "No description"} - {children.length} children
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-3xl font-bold text-orange-500">{formatVnd(parent.balance || 0)}</p>
                      <ChevronUp className="h-4 w-4 text-ink-black" />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/wallets/${parent.id}`}>
                      <Button variant="outline" className="border-note-yellow/40">
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button variant="outline" className="border-red-200 text-red-500 hover:text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                    <Link href={`/wallets/${parent.id}`}>
                      <Button variant="outline" className="border-note-yellow/40">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Child Wallet
                      </Button>
                    </Link>
                  </div>

                  {children.length > 0 ? (
                    <div className="space-y-2">
                      {children.map((child) => (
                        <div
                          key={child.id}
                          className="rounded-lg border border-note-yellow/20 px-3 py-3 flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium text-ink-black">{child.name}</p>
                            <p className="text-sm text-pencil-gray">{child.description || "No description"}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="font-bold text-ink-black">{formatVnd(child.balance || 0)}</p>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-note-yellow/35 px-3 py-4 text-sm text-pencil-gray">
                      No child wallets attached yet.
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
