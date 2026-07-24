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
import { WalletSelect } from "@/features/transaction/components/QuickDebt/WalletSelect";

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
      const selectedWallet = availableWallets.find((w) => w.id === selectedWalletId);
      await updateWallet({
        id: selectedWalletId,
        data: {
          name: selectedWallet?.name || "",
          description: selectedWallet?.description || undefined,
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
              <WalletSelect
                value={selectedWalletId}
                onChange={(val) => setSelectedWalletId(val)}
                groupedWallets={[{ parent: null, children: eligibleWallets }]}
                isLoading={false}
                hasWallets={eligibleWallets.length > 0}
                disabled={isPending}
              />

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
