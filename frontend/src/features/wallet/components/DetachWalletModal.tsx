"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Wallet } from "@/features/wallet/types/wallet";
import { useUpdateWallet } from "@/features/wallet/hooks/useWallets";
import { AlertTriangle, Loader2, Wallet2 } from "lucide-react";

interface DetachWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: Wallet | null;
  onSuccess: () => void;
}

export function DetachWalletModal({
  isOpen,
  onClose,
  wallet,
  onSuccess,
}: DetachWalletModalProps) {
  const [isPending, setIsPending] = useState(false);
  const { mutateAsync: updateWallet } = useUpdateWallet();

  const handleDetach = async () => {
    if (!wallet) return;

    try {
      setIsPending(true);
      await updateWallet({
        id: wallet.id,
        data: {
          name: wallet.name,
          description: wallet.description || undefined,
          parentWalletId: null,
        },
      });
      onSuccess();
      onClose();
    } catch {
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-ink-black flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Detach Sub-wallet
          </DialogTitle>
          <DialogDescription className="text-pencil-gray">
            Are you sure you want to detach this sub-wallet? It will become a
            standalone parent wallet.
          </DialogDescription>
        </DialogHeader>

        {wallet && (
          <div className="py-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Wallet2 className="h-5 w-5 text-note-yellow" />
              <div>
                <p className="font-medium text-ink-black">{wallet.name}</p>
                <p className="text-sm text-pencil-gray">
                  ${(wallet.balance || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="border-gray-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDetach}
            disabled={isPending}
            variant="destructive"
            data-testid="detach-child-confirm"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Detaching...
              </>
            ) : (
              "Detach Wallet"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
