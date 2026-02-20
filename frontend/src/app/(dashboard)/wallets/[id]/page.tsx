"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useWallets } from "@/features/wallet/hooks/useWallets";
import { WalletForm } from "@/features/wallet/components/WalletForm";
import { DetachWalletModal } from "@/features/wallet/components/DetachWalletModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Wallet } from "@/features/wallet/types/wallet";
import {
  WalletIcon,
  ArrowLeft,
  Users,
  Plus,
  Pencil,
  Trash2,
  Wallet2,
  DollarSign,
  Star,
} from "lucide-react";

function formatVnd(value: number) {
  return `${value.toLocaleString("en-US")}d`;
}

export default function WalletDetailPage() {
  const params = useParams();
  const walletId = params.id as string;
  const { data: wallets, isLoading, error, refetch } = useWallets();
  const [isCreateChildModalOpen, setIsCreateChildModalOpen] = useState(false);
  const [isDetachModalOpen, setIsDetachModalOpen] = useState(false);
  const [isEditChildModalOpen, setIsEditChildModalOpen] = useState(false);
  const [editingChildWallet, setEditingChildWallet] = useState<Wallet | null>(null);
  const [selectedChildWallet, setSelectedChildWallet] = useState<Wallet | null>(null);
  const [isEditParentModalOpen, setIsEditParentModalOpen] = useState(false);
  const [isAdjustBalanceModalOpen, setIsAdjustBalanceModalOpen] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [defaultWalletId, setDefaultWalletId] = React.useState<string>("");

  // Load default wallet from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem("defaultWalletId") || "";
    setDefaultWalletId(stored);
  }, []);

  // Save default wallet to localStorage
  const setAsDefault = (walletId: string) => {
    setDefaultWalletId(walletId);
    localStorage.setItem("defaultWalletId", walletId);
  };

  const clearDefault = () => {
    setDefaultWalletId("");
    localStorage.removeItem("defaultWalletId");
  };

  const parentWallet = wallets?.find((w) => w.id === walletId);
  const childWallets =
    wallets?.filter((w) => w.parentWalletId === walletId) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="animate-pulse h-48"></Card>
          <Card className="animate-pulse h-48"></Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Link href="/wallets">
          <Button variant="outline" className="border-note-yellow">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Wallets
          </Button>
        </Link>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Failed to load wallet: {String(error)}</p>
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

  if (!parentWallet) {
    return (
      <div className="space-y-6">
        <Link href="/wallets">
          <Button variant="outline" className="border-note-yellow">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Wallets
          </Button>
        </Link>
        <Card className="border-dashed border-2 border-note-yellow/30">
          <CardContent className="p-12 text-center">
            <WalletIcon className="h-12 w-12 text-pencil-gray mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-ink-black mb-2">
              Wallet not found
            </h3>
            <p className="text-pencil-gray">
              The wallet you are looking for does not exist
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/wallets">
            <Button
              variant="outline"
              size="icon"
              className="border-note-yellow hover:bg-note-yellow/10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-ink-black">
              {parentWallet.name}
            </h1>
            <p className="text-pencil-gray">{parentWallet.parentWalletId ? "Sub-wallet details" : "Parent wallet details and child management"}</p>
          </div>
        </div>
        <span className="inline-flex items-center rounded-md border border-note-yellow px-3 py-1 text-sm text-ink-black">
          <Wallet2 className="h-3 w-3 mr-1" />
          {parentWallet.parentWalletId ? "Sub-wallet" : "Parent"}
        </span>
      </div>

      <section data-testid="parent-overview">
        <Card
          className="border-note-yellow/30"
          data-testid="parent-overview-stats"
        >
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <CardTitle className="text-lg font-semibold text-ink-black flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-note-yellow" />
                Overview
              </CardTitle>
              <div className="flex items-center gap-2">
                {parentWallet.parentWalletId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`${
                      defaultWalletId === parentWallet.id
                        ? "text-yellow-500 hover:text-yellow-600"
                        : "text-pencil-gray hover:text-note-yellow"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      if (defaultWalletId === parentWallet.id) {
                        clearDefault();
                      } else {
                        setAsDefault(parentWallet.id);
                      }
                    }}
                    aria-label={defaultWalletId === parentWallet.id ? "Unset as default" : "Set as default"}
                  >
                    <Star className="h-4 w-4" fill={defaultWalletId === parentWallet.id ? "currentColor" : "none"} />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-ink-black hover:bg-note-yellow/10"
                  data-testid="edit-parent-wallet-button"
                  onClick={() => setIsEditParentModalOpen(true)}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-pencil-gray">
                  {parentWallet.parentWalletId ? "Current Balance (Own)" : "Current Balance"}
                </p>
                <p className="text-3xl font-bold text-ink-black">
                  {formatVnd(parentWallet.balance || 0)}
                </p>
                {parentWallet.parentWalletId ? (
                  <Button
                    variant="outline"
                    className="mt-3 border-note-yellow hover:bg-note-yellow/10"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setIsAdjustBalanceModalOpen(true);
                    }}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Adjust Balance
                  </Button>
                ) : null}
              </div>
              {parentWallet.description && (
                <div>
                  <p className="text-sm text-pencil-gray">Description</p>
                  <p className="text-ink-black">{parentWallet.description}</p>
                </div>
              )}
            </div>
            {!parentWallet.parentWalletId && (
              <div className="pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 md:pl-6">
                <p className="text-sm text-pencil-gray">Sub-wallets</p>
                <p className="text-3xl font-bold text-blue-600">
                  {childWallets.length}
                </p>
                <p className="text-xs text-pencil-gray mt-1">
                  {childWallets.length} wallet{childWallets.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      
      <Dialog
        open={isEditParentModalOpen}
        onOpenChange={(open) => {
          setIsEditParentModalOpen(open);
        }}
      >
        <DialogContent>
          <DialogClose
            onClose={() => {
              setIsEditParentModalOpen(false);
            }}
          />
          <DialogHeader>
            <DialogTitle>Edit Parent Wallet</DialogTitle>
            <DialogDescription>
              Update parent wallet name and description.
            </DialogDescription>
          </DialogHeader>
          {parentWallet ? (
            <WalletForm
              mode="edit"
              wallet={parentWallet}
              onSuccess={() => {
                setIsEditParentModalOpen(false);
                refetch();
              }}
              onCancel={() => setIsEditParentModalOpen(false)}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Adjust Balance Dialog (Mock for Quick Deduct feature) */}
      <Dialog
        open={isAdjustBalanceModalOpen}
        onOpenChange={(open) => {
          setIsAdjustBalanceModalOpen(open);
          if (!open) setAdjustAmount("");
        }}
      >
        <DialogContent>
          <DialogClose
            onClose={() => {
              setIsAdjustBalanceModalOpen(false);
              setAdjustAmount("");
            }}
          />
          <DialogHeader>
            <DialogTitle>
              {parentWallet?.parentWalletId ? "Adjust Sub-wallet Balance" : "Adjust Wallet Balance"}
            </DialogTitle>
            <DialogDescription>
              Quickly add or subtract amount from &quot;{parentWallet?.name}&quot;. 
              {parentWallet?.parentWalletId ? " (Sub-wallet)" : ""} 
              (This is a preview for Quick Deduct feature)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-2">
              {[100000, 500000, 1000000, 2000000, 5000000].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  className="text-xs border-note-yellow hover:bg-note-yellow/20"
                  onClick={() => {
                    setAdjustAmount(amount.toString());
                  }}
                >
                  {(amount / 1000000).toFixed(0)}M
                </Button>
              ))}
            </div>
            <input
              type="number"
              placeholder="Or enter custom amount"
              value={adjustAmount}
              onChange={(e) => setAdjustAmount(e.target.value)}
              className="w-full px-3 py-2 border border-note-yellow/30 rounded-lg focus:outline-none focus:border-note-yellow"
            />
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-pencil-gray mb-2">Preview: Quick Deduct amount</p>
              <p className="text-lg font-bold text-ink-black">
                {adjustAmount ? `${adjustAmount}d` : "No amount selected"}
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsAdjustBalanceModalOpen(false);
                  setAdjustAmount("");
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-note-yellow text-ink-black hover:bg-note-yellow/90"
                disabled={!adjustAmount}
                onClick={() => {
                  // Mock implementation - will connect to Quick Deduct backend later
                  console.log(`[MOCK] Adjusting ${parentWallet?.name} by ${adjustAmount}d`);
                  setIsAdjustBalanceModalOpen(false);
                  setAdjustAmount("");
                }}
              >
                Next
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <section data-testid="subwallet-section">
        <Card
          className="border-note-yellow/30"
          data-testid="child-wallet-management"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-semibold text-ink-black flex items-center gap-2">
              <Users className="h-5 w-5 text-note-yellow" />
              Sub-wallets
            </CardTitle>
            <Button
              size="sm"
              className="bg-note-yellow text-ink-black hover:bg-note-yellow/90 font-semibold"
              onClick={() => {
                setIsDetachModalOpen(false);
                setSelectedChildWallet(null);
                setIsEditChildModalOpen(false);
                setEditingChildWallet(null);
                setIsCreateChildModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Create
            </Button>
          </CardHeader>
          <CardContent>
            {childWallets.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-10 w-10 text-pencil-gray mx-auto mb-3" />
                <p className="text-pencil-gray text-sm">
                  No sub-wallets attached
                </p>
                <p className="text-xs text-pencil-gray mt-1">
                  Click Create Child Wallet to add sub-wallets
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {childWallets.map((child) => {
                  const isDefault = defaultWalletId === child.id;
                  return (
                    <div
                      key={child.id}
                      className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                        isDefault
                          ? "bg-yellow-50 border border-yellow-200"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                      data-testid={`child-wallet-row-${child.id}`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <WalletIcon className="h-4 w-4 text-note-yellow" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-ink-black">
                              {child.name}
                            </p>
                            {isDefault && (
                              <span className="inline-flex items-center gap-1 bg-yellow-200 text-yellow-900 text-xs font-semibold px-2 py-0.5 rounded-full">
                                <Star className="h-3 w-3 fill-current" />
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-pencil-gray">
                            {formatVnd(child.balance || 0)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-ink-black hover:bg-note-yellow/10"
                          data-testid={`detail-child-edit-${child.id}`}
                          onClick={() => {
                            setIsDetachModalOpen(false);
                            setSelectedChildWallet(null);
                            setIsCreateChildModalOpen(false);
                            setEditingChildWallet(child);
                            setIsEditChildModalOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          data-testid={`detail-child-delete-${child.id}`}
                          onClick={() => {
                            setIsEditChildModalOpen(false);
                            setEditingChildWallet(null);
                            setIsCreateChildModalOpen(false);
                            setSelectedChildWallet(child);
                            setIsDetachModalOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </CardContent>
        </Card>
      </section>

      <Dialog
        open={isCreateChildModalOpen}
        onOpenChange={(open) => {
          setIsCreateChildModalOpen(open);
        }}
      >
        <DialogContent>
          <DialogClose onClose={() => setIsCreateChildModalOpen(false)} />
          <DialogHeader>
            <DialogTitle>Create Child Wallet</DialogTitle>
            <DialogDescription>
              Create a new child wallet under this parent wallet.
            </DialogDescription>
          </DialogHeader>
          <WalletForm
            mode="create"
            fixedParentWalletId={walletId}
            onSuccess={() => {
              setIsCreateChildModalOpen(false);
              refetch();
            }}
            onCancel={() => setIsCreateChildModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEditChildModalOpen}
        onOpenChange={(open) => {
          setIsEditChildModalOpen(open);
          if (!open) {
            setEditingChildWallet(null);
          }
        }}
      >
        <DialogContent>
          <DialogClose
            onClose={() => {
              setIsEditChildModalOpen(false);
              setEditingChildWallet(null);
            }}
          />
          <DialogHeader>
            <DialogTitle>Edit Child Wallet</DialogTitle>
            <DialogDescription>
              Update child wallet name and description.
            </DialogDescription>
          </DialogHeader>
          {editingChildWallet ? (
            <WalletForm
              mode="edit"
              wallet={editingChildWallet}
              onSuccess={() => {
                setIsEditChildModalOpen(false);
                setEditingChildWallet(null);
                refetch();
              }}
              onCancel={() => {
                setIsEditChildModalOpen(false);
                setEditingChildWallet(null);
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <DetachWalletModal
        isOpen={isDetachModalOpen}
        onClose={() => {
          setIsDetachModalOpen(false);
          setSelectedChildWallet(null);
        }}
        wallet={selectedChildWallet}
        onSuccess={refetch}
      />
    </div>
  );
}
