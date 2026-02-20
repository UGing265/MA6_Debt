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
import { Wallet2, Plus, Pencil, Trash2, ChevronDown, ChevronRight } from "lucide-react";

function formatVnd(value: number) {
  return `${value.toLocaleString("en-US")}d`;
}

export default function WalletsPage() {
  const [isCreateParentOpen, setIsCreateParentOpen] = React.useState(false);
  // inline create child: stores parent ID to create child under
  const [createChildForParentId, setCreateChildForParentId] = React.useState<string | null>(null);
  const [editingWallet, setEditingWallet] = React.useState<Wallet | null>(null);
  const [deletingWallet, setDeletingWallet] = React.useState<Wallet | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  // FIX 1: Allow multiple parents expanded at once (Set instead of single string)
  const [expandedParentIds, setExpandedParentIds] = React.useState<Set<string>>(new Set());
  const isMountedRef = React.useRef(true);
  const deleteInFlightRef = React.useRef(false);
  const { data: wallets, isLoading, error, refetch } = useWallets();
  const deleteWalletMutation = useDeleteWallet();

  const allWallets = wallets ?? [];
  const parentWallets = allWallets.filter((wallet) => !wallet.parentWalletId);
  const deletingChildCount = deletingWallet
    ? allWallets.filter((wallet) => wallet.parentWalletId === deletingWallet.id).length
    : 0;
  const canDeleteSelectedWallet = deletingWallet ? deletingChildCount === 0 : false;

  const toggleExpand = (parentId: string) => {
    setExpandedParentIds((prev) => {
      const next = new Set(prev);
      if (next.has(parentId)) {
        next.delete(parentId);
      } else {
        next.add(parentId);
      }
      return next;
    });
  };

  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Clean up expanded IDs for deleted parents
  React.useEffect(() => {
    setExpandedParentIds((prev) => {
      const validIds = new Set(
        allWallets.filter((w) => !w.parentWalletId).map((w) => w.id),
      );
      const next = new Set([...prev].filter((id) => validIds.has(id)));
      if (next.size !== prev.size) return next;
      return prev;
    });
  }, [allWallets]);

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

  // helper: close all dialogs cleanly
  const closeAllDialogs = () => {
    setIsCreateParentOpen(false);
    setCreateChildForParentId(null);
    setEditingWallet(null);
    setDeletingWallet(null);
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
            closeAllDialogs();
            setIsCreateParentOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Parent Wallet
        </Button>
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
            const isExpanded = expandedParentIds.has(parent.id);

            // FIX 4: Aggregate balance = parent's own balance + sum of children balances
            // (SRS: "Hệ thống phải tự động cộng dồn số dư từ các Ví con để hiển thị tổng")
            const aggregatedBalance =
              (parent.balance || 0) +
              children.reduce((sum, child) => sum + (child.balance || 0), 0);

            return (
              <div
                key={parent.id}
                data-testid={`parent-card-${parent.id}`}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.closest?.("a")) return;
                  if (target.closest?.("button")) return;
                  if (target.closest?.("[role='dialog']")) return;
                  toggleExpand(parent.id);
                }}
              >
                <Card className="border-note-yellow/25 cursor-pointer hover:border-note-yellow/50 transition-colors" data-testid="parent-wallet-card">
                  <CardContent className="p-4 md:p-5 space-y-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-xl bg-note-yellow/20 text-note-yellow flex items-center justify-center">
                          <Wallet2 className="h-5 w-5" />
                        </div>
                        <div>
                          <Link
                            href={`/wallets/${parent.id}`}
                            data-testid={`parent-link-${parent.id}`}
                            className="inline-block cursor-pointer text-left text-2xl font-bold text-ink-black hover:text-[#D97706]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {parent.name}
                          </Link>
                          <p className="text-sm text-pencil-gray">
                            {parent.description || "No description"} · {children.length} sub-wallet{children.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 self-start md:self-auto">
                        <p className="text-3xl font-bold text-orange-500">{formatVnd(aggregatedBalance)}</p>
                        {/* FIX 3: inline edit parent button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-ink-black hover:text-note-yellow"
                          disabled={isDeleting}
                          onClick={(e) => {
                            e.stopPropagation();
                            closeAllDialogs();
                            setEditingWallet(parent);
                          }}
                          aria-label={`Edit ${parent.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          aria-label={isExpanded ? "Collapse child wallets" : "Expand child wallets"}
                          aria-expanded={isExpanded}
                          aria-controls={`child-list-${parent.id}`}
                          data-testid={`parent-toggle-${parent.id}`}
                          disabled={isDeleting}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(parent.id);
                          }}
                          className="h-8 w-8 border border-note-yellow/30 hover:bg-note-yellow/10"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {isExpanded ? (
                      <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-wrap items-center gap-2">
                          {/* FIX 2: Create child wallet inline (dialog on this page) */}
                          <Button
                            variant="outline"
                            className="border-note-yellow/40"
                            disabled={isDeleting}
                            onClick={() => {
                              closeAllDialogs();
                              setCreateChildForParentId(parent.id);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Sub-wallet
                          </Button>
                          <Button
                            variant="outline"
                            className="border-red-200 text-red-500 hover:text-red-600"
                            disabled={isDeleting || deletingWallet !== null || editingWallet !== null}
                            onClick={() => {
                              closeAllDialogs();
                              setDeletingWallet(parent);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>

                        {children.length > 0 ? (
                          <div
                            id={`child-list-${parent.id}`}
                            data-testid={`child-list-${parent.id}`}
                            className="space-y-2"
                          >
                            {children.map((child) => (
                              <div
                                key={child.id}
                                data-testid={`child-wallet-row-${child.id}`}
                                className="rounded-lg border border-note-yellow/20 px-3 py-3 flex items-center justify-between"
                              >
                                <div>
                                  <p className="font-medium text-ink-black">{child.name}</p>
                                  <p className="text-sm text-pencil-gray">
                                    {child.description || "No description"}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-semibold text-orange-500 mr-2">
                                    {formatVnd(child.balance || 0)}
                                  </p>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-ink-black hover:text-note-yellow"
                                    data-testid={`child-edit-${child.id}`}
                                    disabled={isDeleting || deletingWallet !== null}
                                    onClick={() => {
                                      closeAllDialogs();
                                      setEditingWallet(child);
                                    }}
                                    aria-label={`Edit ${child.name}`}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                    data-testid={`child-delete-${child.id}`}
                                    disabled={isDeleting || deletingWallet !== null || editingWallet !== null}
                                    onClick={() => {
                                      closeAllDialogs();
                                      setDeletingWallet(child);
                                    }}
                                    aria-label={`Delete ${child.name}`}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="rounded-lg border border-dashed border-note-yellow/35 px-3 py-4 text-sm text-pencil-gray text-center">
                            No sub-wallets yet. Click &quot;Add Sub-wallet&quot; to create one.
                          </div>
                        )}
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              </div>
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

      {/* FIX 2: Create Child Wallet Dialog (inline, no navigate) */}
      <Dialog
        open={createChildForParentId !== null}
        onOpenChange={(open) => !open && setCreateChildForParentId(null)}
      >
        <DialogContent>
          <DialogClose onClose={() => setCreateChildForParentId(null)} />
          <DialogHeader>
            <DialogTitle>Create Sub-wallet</DialogTitle>
            <DialogDescription>
              Add a sub-wallet under{" "}
              {allWallets.find((w) => w.id === createChildForParentId)?.name || "this parent"}.
            </DialogDescription>
          </DialogHeader>
          {createChildForParentId ? (
            <WalletForm
              mode="create"
              fixedParentWalletId={createChildForParentId}
              onSuccess={() => setCreateChildForParentId(null)}
              onCancel={() => setCreateChildForParentId(null)}
            />
          ) : null}
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
