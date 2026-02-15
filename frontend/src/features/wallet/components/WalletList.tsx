"use client";

import { useState } from "react";
import { Trash2, Edit2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallets, useDeleteWallet } from "../hooks/useWallets";
import type { Wallet } from "../types/wallet";

interface WalletListProps {
  onEdit?: (wallet: Wallet) => void;
}

export const WalletList = ({ onEdit }: WalletListProps) => {
  const { data: wallets } = useWallets();
  const deleteMutation = useDeleteWallet();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this wallet?")) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
  };

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(balance);
  };

  if (!wallets || wallets.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>No wallets found. Create your first wallet to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {wallets.map((wallet) => (
        <div
          key={wallet.id}
          className="p-4 border border-[#1F2937]/10 rounded-lg shadow-sm bg-[#FFFBEB] hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-[#1F2937]">{wallet.name}</h3>
              {wallet.description && (
                <p className="text-sm text-gray-600 mt-1">{wallet.description}</p>
              )}
              <p className="text-2xl font-bold text-[#FCD34D] mt-2">
                {formatBalance(wallet.balance)}
              </p>
              {wallet.parentWalletId && (
                <p className="text-xs text-gray-500 mt-1">
                  Sub-wallet of:{" "}
                  {wallets.find((w) => w.id === wallet.parentWalletId)?.name || "Unknown"}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => onEdit(wallet)}
                  className="border-[#1F2937]/10"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="destructive"
                size="icon-sm"
                onClick={() => handleDelete(wallet.id)}
                disabled={deletingId === wallet.id}
              >
                {deletingId === wallet.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
