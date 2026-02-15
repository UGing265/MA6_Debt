"use client";

import { Suspense, useState } from "react";
import { Plus, Loader2, AlertCircle, Wallet as WalletIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { WalletList } from "@/features/wallet/components/WalletList";
import { WalletForm } from "@/features/wallet/components/WalletForm";
import { useWallets } from "@/features/wallet/hooks/useWallets";
import type { Wallet } from "@/features/wallet/types/wallet";

/**
 * WalletsTabContent - Main component for Wallets tab in workspace
 * 
 * Features:
 * - List all wallets with balances
 * - Create new wallet with parent wallet support
 * - Edit existing wallets
 * - Delete wallets (with constraints)
 * - Loading states and error handling
 */
export function WalletsTabContent() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
  };

  const handleEditSuccess = () => {
    setEditingWallet(null);
  };

  const handleEdit = (wallet: Wallet) => {
    setEditingWallet(wallet);
    setIsCreateDialogOpen(false);
  };

  const handleCancelEdit = () => {
    setEditingWallet(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-gray-200 bg-white rounded-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-gray-900 font-patrick lowercase">wallets</CardTitle>
              <CardDescription className="mt-1">
                manage your cash partitions and track balances
              </CardDescription>
            </div>
            <Button
              onClick={() => {
                setIsCreateDialogOpen(true);
                setEditingWallet(null);
              }}
              className="bg-[#FCD34D] hover:bg-[#FBBF24] text-[#1F2937] font-bold border border-[#1F2937]/20"
            >
              <Plus className="mr-2 h-4 w-4" />
              create wallet
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-[#FCD34D] mx-auto mb-4 animate-spin" />
                  <p className="text-gray-600 font-medium">Loading wallets...</p>
                </div>
              </div>
            }
          >
            <WalletListContent
              onEdit={handleEdit}
              onCreateClick={() => setIsCreateDialogOpen(true)}
            />
          </Suspense>
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogClose onClose={() => setIsCreateDialogOpen(false)} />
          <DialogHeader>
            <DialogTitle className="font-patrick lowercase">create new wallet</DialogTitle>
            <DialogDescription>
              create a wallet and optionally assign it under a parent wallet.
            </DialogDescription>
          </DialogHeader>
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-8 h-8 text-[#FCD34D] animate-spin" />
              </div>
            }
          >
            <WalletFormWrapper
              mode="create"
              onSuccess={handleCreateSuccess}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </Suspense>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(editingWallet)}
        onOpenChange={(open) => {
          if (!open) {
            handleCancelEdit();
          }
        }}
      >
        <DialogContent>
          <DialogClose onClose={handleCancelEdit} />
          <DialogHeader>
            <DialogTitle className="font-patrick lowercase">edit wallet</DialogTitle>
            <DialogDescription>
              update wallet name or description.
            </DialogDescription>
          </DialogHeader>
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-8 h-8 text-[#FCD34D] animate-spin" />
              </div>
            }
          >
            <WalletFormWrapper
              mode="edit"
              wallet={editingWallet ?? undefined}
              onSuccess={handleEditSuccess}
              onCancel={handleCancelEdit}
            />
          </Suspense>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const WalletListContent = ({
  onEdit,
  onCreateClick,
}: {
  onEdit: (wallet: Wallet) => void;
  onCreateClick: () => void;
}) => {
  const { data: wallets, isLoading, error } = useWallets();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#FCD34D] mx-auto mb-4 animate-spin" />
          <p className="text-gray-600 font-medium">Loading wallets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12 border-2 border-dashed border-red-200 rounded-lg bg-red-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">Failed to load wallets</p>
          <p className="text-sm text-red-500 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!wallets || wallets.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
        <div className="text-center">
          <WalletIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">No wallets yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Create your first wallet to start tracking your cash
          </p>
          <Button
            onClick={onCreateClick}
            className="mt-6 bg-amber-300 text-gray-900 font-semibold hover:bg-amber-400"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Wallet
          </Button>
        </div>
      </div>
    );
  }

  return <WalletList wallets={wallets} onEdit={onEdit} />;
};

const WalletFormWrapper = ({
  mode,
  wallet,
  onSuccess,
  onCancel,
}: {
  mode: "create" | "edit";
  wallet?: Wallet;
  onSuccess?: () => void;
  onCancel?: () => void;
}) => {
  const { data: wallets } = useWallets();

  return (
    <WalletForm
      mode={mode}
      wallet={wallet}
      availableWallets={wallets}
      onSuccess={onSuccess}
      onCancel={onCancel}
    />
  );
};
