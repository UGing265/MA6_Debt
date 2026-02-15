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
import { Wallet2, Loader2 } from "lucide-react";

interface AttachWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentId: string;
  availableWallets: Wallet[];
  onSuccess: () => void;
}

export function AttachWalletModal({
  isOpen,
  onClose,
  parentId,
  availableWallets,
  onSuccess,
}: AttachWalletModalProps) {
  const [selectedWalletId, setSelectedWalletId] = useState<string>("");
  const [isPending, setIsPending] = useState(false);
  const { mutateAsync: updateWallet } = useUpdateWallet();

  const handleAttach = async () => {
    if (!selectedWalletId) return;

    try {
      setIsPending(true);
      await updateWallet({
        id: selectedWalletId,
        data: {
          name: availableWallets.find((w) => w.id === selectedWalletId)?.name || "",
          parentWalletId: parentId,
        },
      });
      onSuccess();
      onClose();
      setSelectedWalletId("");
    } catch {
    } finally {
      setIsPending(false);
    }
  };

  const eligibleWallets = availableWallets.filter(
    (w) => !w.parentWalletId && w.id !== parentId
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-ink-black flex items-center gap-2">
            <Wallet2 className="h-5 w-5 text-note-yellow" />
            Attach Sub-wallet
          </DialogTitle>
          <DialogDescription className="text-pencil-gray">
            Select a wallet to attach as a sub-wallet to this parent wallet.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {eligibleWallets.length === 0 ? (
            <div className="text-center py-6">
              <Wallet2 className="h-10 w-10 text-pencil-gray mx-auto mb-3" />
              <p className="text-pencil-gray text-sm">
                No eligible wallets available
              </p>
              <p className="text-xs text-pencil-gray mt-1">
                All available wallets are already attached
              </p>
            </div>
          ) : (
            <>
              <div>
                <select
                  value={selectedWalletId}
                  onChange={(e) => setSelectedWalletId(e.target.value)}
                  className="w-full rounded-md border border-note-yellow/30 bg-white px-3 py-2 text-sm text-ink-black focus:outline-none focus:ring-2 focus:ring-note-yellow"
                  data-testid="attach-child-select"
                >
                  <option value="">Select a wallet to attach</option>
                  {eligibleWallets.map((wallet) => (
                    <option key={wallet.id} value={wallet.id}>
                      {wallet.name} - ${(wallet.balance || 0).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

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
                  onClick={handleAttach}
                  disabled={!selectedWalletId || isPending}
                  className="bg-note-yellow text-ink-black hover:bg-note-yellow/90"
                  data-testid="attach-child-confirm"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Attaching...
                    </>
                  ) : (
                    "Attach Wallet"
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
