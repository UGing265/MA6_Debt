"use client";

import React from "react";
import { useDeleteWallet, useWallets } from "@/features/wallet/hooks/useWallets";
import type { Wallet } from "@/features/wallet/types/wallet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  WalletsStats,
  WalletSearchSort,
  ParentWalletCard,
  WalletsDialogs,
  EmptyState,
} from "@/features/wallet/components/WalletsPage";
import { PageHeader } from "@/components/ui/page-header";

type SortOption = "name-asc" | "name-desc" | "balance-high" | "balance-low";

import { usePrivacy } from "@/context/PrivacyContext";

export default function WalletsPage() {
  const { tempShow } = usePrivacy();
  const [isCreateParentOpen, setIsCreateParentOpen] = React.useState(false);
  const [editingWallet, setEditingWallet] = React.useState<Wallet | null>(null);
  const [deletingWallet, setDeletingWallet] = React.useState<Wallet | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState<SortOption>("name-asc");
  const [defaultWalletId, setDefaultWalletId] = React.useState<string>("");

  const isMountedRef = React.useRef(true);
  const deleteInFlightRef = React.useRef(false);

  const { data: wallets, isLoading, error, refetch } = useWallets();
  const deleteWalletMutation = useDeleteWallet();

  // Load default wallet from API
  React.useEffect(() => {
    const loadPreferences = async () => {
      try {
        const prefs = await getUserPreferences();
        if (isMountedRef.current) {
          setDefaultWalletId(prefs.defaultWalletId || "");
        }
      } catch {
        const stored = localStorage.getItem("defaultWalletId") || "";
        if (isMountedRef.current) {
          setDefaultWalletId(stored);
        }
      }
    };
    loadPreferences();
  }, []);

  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const allWallets = wallets ?? [];
  const parentWallets = allWallets.filter((wallet) => !wallet.parentWalletId);

  // Filter by search query
  const filteredParentWallets = parentWallets.filter((wallet) =>
    wallet.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate total balance
  const totalBalance = parentWallets.reduce((sum, wallet) => {
    const children = allWallets.filter((w) => w.parentWalletId === wallet.id);
    const aggregated = (wallet.balance || 0) + children.reduce((sum, child) => sum + (child.balance || 0), 0);
    return sum + aggregated;
  }, 0);

  // Sort based on selected criteria
  const sortedParentWallets = [...filteredParentWallets].sort((a, b) => {
    const balanceA = (a.balance || 0) + allWallets
      .filter((w) => w.parentWalletId === a.id)
      .reduce((sum, w) => sum + (w.balance || 0), 0);
    const balanceB = (b.balance || 0) + allWallets
      .filter((w) => w.parentWalletId === b.id)
      .reduce((sum, w) => sum + (w.balance || 0), 0);

    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "balance-high":
        return balanceB - balanceA;
      case "balance-low":
        return balanceA - balanceB;
      default:
        return 0;
    }
  });

  const deletingChildCount = deletingWallet
    ? allWallets.filter((wallet) => wallet.parentWalletId === deletingWallet.id).length
    : 0;
  const canDeleteSelectedWallet = deletingWallet ? deletingChildCount === 0 : false;

  const handleDeleteWallet = async () => {
    if (!deletingWallet) return;
    if (!canDeleteSelectedWallet) return;
    if (deleteInFlightRef.current) return;

    deleteInFlightRef.current = true;

    try {
      setIsDeleting(true);
      await deleteWalletMutation.mutateAsync(deletingWallet.id);
      if (isMountedRef.current) {
        setDeletingWallet(null);
      }
    } finally {
      deleteInFlightRef.current = false;
      if (isMountedRef.current) {
        setIsDeleting(false);
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="parent-wallet-list">
        <PageHeader title="Wallet Management" description="Parent and child wallets" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse h-24" />
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse h-44" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6" data-testid="parent-wallet-list">
        <PageHeader title="Wallet Management" description="Parent and child wallets" />
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4 pb-4">
            <p className="text-red-600">Failed to load wallets: {String(error)}</p>
            <div className="pt-4">
              <Button variant="outline" onClick={() => void refetch()}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const showEmptyState = filteredParentWallets.length === 0;

  return (
    <div className="space-y-6" data-testid="parent-wallet-list">
      <PageHeader title="Wallet Management" description="Parent and child wallets">
        <Button
          className="rounded-full bg-note-yellow text-ink-black hover:bg-note-yellow/90 font-semibold"
          disabled={isDeleting}
          onClick={() => setIsCreateParentOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Parent Wallet
        </Button>
      </PageHeader>

      <WalletsStats
        parentWalletCount={parentWallets.length}
        childWalletCount={allWallets.filter((w) => w.parentWalletId).length}
        totalBalance={totalBalance}
      />

      <WalletSearchSort
        searchQuery={searchQuery}
        sortBy={sortBy}
        onSearchChange={setSearchQuery}
        onSortChange={setSortBy}
      />

      {showEmptyState ? (
        <EmptyState hasSearchQuery={!!searchQuery} hasWallets={parentWallets.length > 0} />
      ) : (
        <div className="space-y-4">
          {sortedParentWallets.map((parent) => {
            const children = allWallets.filter((wallet) => wallet.parentWalletId === parent.id);
            const aggregatedBalance =
              (parent.balance || 0) + children.reduce((sum, child) => sum + (child.balance || 0), 0);
            const hasDefaultChild = children.some((child) => defaultWalletId === child.id);

            return (
              <ParentWalletCard
                key={parent.id}
                wallet={parent}
                childCount={children.length}
                aggregatedBalance={aggregatedBalance}
                hasDefaultChild={hasDefaultChild}
                isDeleting={isDeleting}
                onEdit={setEditingWallet}
                onDelete={setDeletingWallet}
              />
            );
          })}
        </div>
      )}

      <WalletsDialogs
        isCreateOpen={isCreateParentOpen}
        editingWallet={editingWallet}
        deletingWallet={deletingWallet}
        isDeleting={isDeleting}
        deletingChildCount={deletingChildCount}
        canDeleteSelectedWallet={canDeleteSelectedWallet}
        onCloseCreate={() => setIsCreateParentOpen(false)}
        onCloseEdit={() => setEditingWallet(null)}
        onCloseDelete={() => setDeletingWallet(null)}
        onDeleteConfirm={handleDeleteWallet}
      />
    </div>
  );
}

// Import needed for getUserPreferences
import { getUserPreferences } from "@/features/user/api/userApi";
