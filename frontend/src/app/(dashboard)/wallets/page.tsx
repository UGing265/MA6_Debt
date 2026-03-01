"use client";

import React from "react";
import Link from "next/link";
import { useDeleteWallet, useWallets } from "@/features/wallet/hooks/useWallets";
import { WalletForm } from "@/features/wallet/components/WalletForm";
import type { Wallet } from "@/features/wallet/types/wallet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatVnd } from "@/lib/utils";
import { Wallet2, Plus, Pencil, Trash2, Search, Star } from "lucide-react";
import { getUserPreferences, updateDefaultWallet } from "@/features/user/api/userApi";


export default function WalletsPage() {
  const [isCreateParentOpen, setIsCreateParentOpen] = React.useState(false);
  const [editingWallet, setEditingWallet] = React.useState<Wallet | null>(null);
  const [deletingWallet, setDeletingWallet] = React.useState<Wallet | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"name-asc" | "name-desc" | "balance-high" | "balance-low">("name-asc");
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
        // Fallback to localStorage if API fails
        const stored = localStorage.getItem("defaultWalletId") || "";
        if (isMountedRef.current) {
          setDefaultWalletId(stored);
        }
      }
    };
    loadPreferences();
  }, []);

  // Save default wallet to DB via API (also update localStorage for other components)
  const setAsDefault = async (walletId: string) => {
    setDefaultWalletId(walletId);
    localStorage.setItem("defaultWalletId", walletId);
    try {
      await updateDefaultWallet(walletId);
    } catch {
      // Silently fail, keep local state
    }
  };

  const clearDefault = async () => {
    setDefaultWalletId("");
    localStorage.removeItem("defaultWalletId");
    try {
      await updateDefaultWallet(null);
    } catch {
      // Silently fail, keep local state
    }
  };

  const allWallets = wallets ?? [];
  const parentWallets = allWallets.filter((wallet) => !wallet.parentWalletId);
  
  // Filter by search query
  const filteredParentWallets = parentWallets.filter((wallet) =>
    wallet.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats
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

  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

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

  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="parent-wallet-list">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-5xl font-bold text-ink-black">Wallet Management</h1>
            <p className="text-pencil-gray mt-2">Parent and child wallets</p>
          </div>
        </div>
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

  if (error) {
    return (
      <div className="space-y-6" data-testid="parent-wallet-list">
        <h1 className="text-5xl font-bold text-ink-black">Wallet Management</h1>
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

  return (
    <div className="space-y-6" data-testid="parent-wallet-list">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-5xl font-bold text-ink-black">Wallet Management</h1>
          <p className="text-pencil-gray mt-2">Parent and child wallets</p>
        </div>
        <Button
          className="rounded-full bg-note-yellow text-ink-black hover:bg-note-yellow/90"
          disabled={isDeleting}
          onClick={() => {
            setIsCreateParentOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Parent Wallet
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:max-w-2xl">
        <Card className="border-blue-100">
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-sm text-pencil-gray">Total Wallets</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{parentWallets.length}</p>
              <p className="text-xs text-pencil-gray mt-3">+ {allWallets.filter((w) => w.parentWalletId).length} sub-wallets</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-100">
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-sm text-pencil-gray">Total Balance</p>
              <p className="text-3xl font-bold text-orange-500 mt-2">{formatVnd(totalBalance)}</p>
              <p className="text-xs text-pencil-gray mt-3">Aggregated</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Sort Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-note-yellow" />
          <input
            type="text"
            placeholder="Search wallet by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search wallets by name"
            className="w-full pl-11 pr-4 py-3 border-2 border-note-yellow/50 rounded-lg bg-white focus:outline-none focus:border-note-yellow focus:ring-1 focus:ring-note-yellow text-ink-black font-medium placeholder:text-pencil-gray/70"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-4 py-2.5 text-sm border-2 border-note-yellow/50 rounded-lg bg-white focus:outline-none focus:border-note-yellow text-ink-black font-medium cursor-pointer min-w-[180px]"
          aria-label="Sort wallets"
        >
          <option value="name-asc">Name A → Z</option>
          <option value="name-desc">Name Z → A</option>
          <option value="balance-high">Balance: High to Low</option>
          <option value="balance-low">Balance: Low to High</option>
        </select>
      </div>

      {filteredParentWallets.length === 0 && searchQuery ? (
        <Card className="border-note-yellow/30">
          <CardContent className="p-6 text-center">
            <Search className="h-12 w-12 mx-auto text-pencil-gray mb-3 opacity-50" />
            <p className="text-ink-black font-semibold">No wallets found</p>
            <p className="text-sm text-pencil-gray">Try adjusting your search query</p>
          </CardContent>
        </Card>
      ) : parentWallets.length === 0 ? (
        <Card className="border-note-yellow/30">
          <CardContent className="p-6 text-center">
            <Wallet2 className="h-12 w-12 mx-auto text-note-yellow mb-3" />
            <p className="text-ink-black font-semibold">No parent wallets found</p>
            <p className="text-sm text-pencil-gray">Create a parent wallet to begin organizing child wallets.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedParentWallets.map((parent) => {
            const children = allWallets.filter((wallet) => wallet.parentWalletId === parent.id);
            // FIX 4: Aggregate balance = parent's own balance + sum of children balances
            // (SRS: "Hệ thống phải tự động cộng dồn số dư từ các Ví con để hiển thị tổng")
            const aggregatedBalance =
              (parent.balance || 0) +
              children.reduce((sum, child) => sum + (child.balance || 0), 0);
            const hasDefaultChild = children.some((child) => defaultWalletId === child.id);

            return (
              <Link
                key={parent.id}
                href={`/wallets/${parent.id}`}
                data-testid={`parent-wallet-card-${parent.id}`}
              >
                <Card className={`border-note-yellow/25 cursor-pointer transition-all duration-200 hover:border-note-yellow/60 hover:shadow-md hover:-translate-y-0.5 ${
                  hasDefaultChild ? "border-yellow-200 bg-yellow-50/50" : ""
                }`}>
                  <CardContent className="p-3 md:p-4 space-y-2">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="h-10 w-10 rounded-xl bg-note-yellow/20 text-note-yellow flex items-center justify-center shrink-0">
                          <Wallet2 className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-left text-2xl font-bold text-ink-black group-hover:text-[#D97706]">
                              {parent.name}
                            </p>
                            {hasDefaultChild && (
                              <span className="inline-flex items-center gap-1 bg-yellow-300 text-yellow-900 text-xs font-semibold px-2 py-0.5 rounded-full">
                                <Star className="h-3 w-3 fill-current" />
                                Has Default
                              </span>
                            )}
                          </div>
                        <p className="text-sm text-pencil-gray">
                          {parent.description || "No description"} · {children.length} sub-wallet{children.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-3xl font-bold text-orange-500 text-right">{formatVnd(aggregatedBalance)}</p>
                      {/* Edit parent button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-ink-black hover:text-note-yellow shrink-0"
                        disabled={isDeleting}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setEditingWallet(parent);
                        }}
                        aria-label={`Edit ${parent.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {/* Delete parent button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                        disabled={isDeleting}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setDeletingWallet(parent);
                        }}
                        aria-label={`Delete ${parent.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            );
          })}
        </div>
      )}

      {/* Create Parent Wallet Dialog */}
      <Dialog open={isCreateParentOpen} onOpenChange={setIsCreateParentOpen}>
        <DialogContent>
          <DialogClose onClose={() => setIsCreateParentOpen(false)} />
          <DialogHeader>
            <DialogTitle>Create Parent Wallet</DialogTitle>
            <DialogDescription>
              Create a new parent wallet to organize your cash.
            </DialogDescription>
          </DialogHeader>
          <WalletForm
            mode="create"
            onSuccess={() => setIsCreateParentOpen(false)}
            onCancel={() => setIsCreateParentOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Wallet Dialog (works for both parent and child) */}
      <Dialog open={editingWallet !== null} onOpenChange={(open) => !open && setEditingWallet(null)}>
        <DialogContent>
          <DialogClose onClose={() => setEditingWallet(null)} />
          <DialogHeader>
            <DialogTitle>
              Edit {editingWallet?.parentWalletId ? "Sub-wallet" : "Parent Wallet"}
            </DialogTitle>
            <DialogDescription>
              Update wallet name and description.
            </DialogDescription>
          </DialogHeader>
          {editingWallet ? (
            <WalletForm
              mode="edit"
              wallet={editingWallet}
              onSuccess={() => setEditingWallet(null)}
              onCancel={() => setEditingWallet(null)}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Delete Wallet Dialog */}
      <Dialog
        open={deletingWallet !== null}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setDeletingWallet(null);
          }
        }}
      >
        <DialogContent>
          <DialogClose
            onClose={() => {
              if (!isDeleting) {
                setDeletingWallet(null);
              }
            }}
          />
          <DialogHeader>
            <DialogTitle>Delete Wallet</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deletingWallet?.name}? This action cannot be undone.
            </DialogDescription>
            {deletingWallet && deletingChildCount > 0 ? (
              <p className="text-sm text-red-600">
                This parent wallet has {deletingChildCount} sub-wallet(s). Remove sub-wallets first.
              </p>
            ) : null}
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setDeletingWallet(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteWallet}
              disabled={isDeleting || !canDeleteSelectedWallet}
            >
              {isDeleting ? "Deleting..." : canDeleteSelectedWallet ? "Delete" : "Cannot Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
