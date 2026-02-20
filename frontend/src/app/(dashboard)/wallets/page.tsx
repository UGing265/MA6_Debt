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
  const [editingWallet, setEditingWallet] = React.useState<Wallet | null>(null);
  const [deletingWallet, setDeletingWallet] = React.useState<Wallet | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [expandedParentId, setExpandedParentId] = React.useState<string | null>(null);
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

  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  React.useEffect(() => {
    if (!expandedParentId) return;

    const stillParentExists = allWallets.some(
      (wallet) => wallet.id === expandedParentId && !wallet.parentWalletId,
    );

    if (!stillParentExists) {
      setExpandedParentId(null);
    }
  }, [allWallets, expandedParentId]);

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
            setEditingWallet(null);
            setDeletingWallet(null);
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
            const isExpanded = expandedParentId === parent.id;
            return (
              // Wrap the card to enable full-area click while preserving existing selectors
              <div
                key={parent.id}
                data-testid={`parent-card-${parent.id}`}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  // If the click originated from a link, do nothing (navigation should occur)
                  if (target.closest?.(`[data-testid="parent-link-${parent.id}"]`)) return;
                  // If the click originated from the toggle button, let its handler manage state
                  if (target.closest?.(`[data-testid="parent-toggle-${parent.id}"]`)) return;
                  // Otherwise, toggle expand/collapse for this parent
                  setExpandedParentId((prev) => (prev === parent.id ? null : parent.id));
                }}
              >
                <Card className="border-note-yellow/25" data-testid="parent-wallet-card">
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
                          >
                            {parent.name}
                          </Link>
                          <p className="text-sm text-pencil-gray">
                            {parent.description || "No description"} - {children.length} children
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 self-start md:self-auto">
                        <p className="text-3xl font-bold text-orange-500">{formatVnd(parent.balance || 0)}</p>
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
                            if (isDeleting) return;
                            // Prevent card-level click from triggering
                            e.stopPropagation();
                            setExpandedParentId((prev) => (prev === parent.id ? null : parent.id));
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
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            variant="outline"
                            className="border-red-200 text-red-500 hover:text-red-600"
                            disabled={isDeleting || deletingWallet !== null || editingWallet !== null}
                            onClick={() => {
                              setEditingWallet(null);
                              setIsCreateParentOpen(false);
                              setDeletingWallet(parent);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Parent Wallet
                          </Button>
                          {isDeleting ? (
                            <Button variant="outline" className="border-note-yellow/40" disabled>
                              <Plus className="h-4 w-4 mr-2" />
                              Create Child Wallet
                            </Button>
                          ) : (
                            <Link href={`/wallets/${parent.id}`}>
                              <Button variant="outline" className="border-note-yellow/40">
                                <Plus className="h-4 w-4 mr-2" />
                                Create Child Wallet
                              </Button>
                            </Link>
                          )}
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
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-ink-black hover:text-note-yellow"
                                    data-testid={`child-edit-${child.id}`}
                                    disabled={isDeleting || deletingWallet !== null}
                                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                      e.stopPropagation();
                                      setDeletingWallet(null);
                                      setIsCreateParentOpen(false);
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
                                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                      e.stopPropagation();
                                      setEditingWallet(null);
                                      setIsCreateParentOpen(false);
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
                          <div className="rounded-lg border border-dashed border-note-yellow/35 px-3 py-4 text-sm text-pencil-gray">
                            No child wallets attached yet.
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

      <Dialog open={isCreateParentOpen} onOpenChange={setIsCreateParentOpen}>
        <DialogContent>
          <DialogClose onClose={() => setIsCreateParentOpen(false)} />
          <DialogHeader>
            <DialogTitle>Create Parent Wallet</DialogTitle>
            <DialogDescription>
              Create a new parent wallet. It will be added at root level.
            </DialogDescription>
          </DialogHeader>
          <WalletForm
            mode="create"
            onSuccess={() => setIsCreateParentOpen(false)}
            onCancel={() => setIsCreateParentOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={editingWallet !== null} onOpenChange={(open) => !open && setEditingWallet(null)}>
        <DialogContent>
          <DialogClose onClose={() => setEditingWallet(null)} />
          <DialogHeader>
            <DialogTitle>Edit Wallet</DialogTitle>
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
                This parent wallet has {deletingChildCount} child wallet(s). Remove or detach child wallets first.
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
