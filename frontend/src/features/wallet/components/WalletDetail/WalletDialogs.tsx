"use client";

import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { WalletForm } from "@/features/wallet/components/WalletForm";
import { DetachWalletModal } from "@/features/wallet/components/DetachWalletModal";
import type { Wallet } from "@/features/wallet/types/wallet";
import { useLanguage } from "@/context/LanguageContext";

interface WalletDialogsProps {
  walletId: string;
  parentWallet: Wallet | undefined;
  editingChildWallet: Wallet | null;
  selectedChildWallet: Wallet | null;
  isEditParentOpen: boolean;
  isCreateChildOpen: boolean;
  isEditChildOpen: boolean;
  isDetachOpen: boolean;
  onCloseEditParent: () => void;
  onCloseCreateChild: () => void;
  onCloseEditChild: () => void;
  onCloseDetach: () => void;
  onRefetch: () => void;
}

export const WalletDialogs: React.FC<WalletDialogsProps> = ({
  walletId,
  parentWallet,
  editingChildWallet,
  selectedChildWallet,
  isEditParentOpen,
  isCreateChildOpen,
  isEditChildOpen,
  isDetachOpen,
  onCloseEditParent,
  onCloseCreateChild,
  onCloseEditChild,
  onCloseDetach,
  onRefetch,
}) => {
  const { t } = useLanguage();

  return (
    <>
      {/* Edit Parent Dialog */}
      <Dialog open={isEditParentOpen} onOpenChange={(open) => !open && onCloseEditParent()}>
        <DialogContent>
          <DialogClose onClose={onCloseEditParent} />
          <DialogHeader>
            <DialogTitle>{t.wallets.page.editParent}</DialogTitle>
            <DialogDescription>{t.wallets.page.detail.editParentDescription}</DialogDescription>
          </DialogHeader>
          {parentWallet && (
            <WalletForm
              mode="edit"
              wallet={parentWallet}
              onSuccess={() => {
                onCloseEditParent();
                onRefetch();
              }}
              onCancel={onCloseEditParent}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Create Child Dialog */}
      <Dialog open={isCreateChildOpen} onOpenChange={(open) => !open && onCloseCreateChild()}>
        <DialogContent>
          <DialogClose onClose={onCloseCreateChild} />
          <DialogHeader>
            <DialogTitle>{t.wallets.page.createChild}</DialogTitle>
            <DialogDescription>{t.wallets.page.detail.createChildDescription}</DialogDescription>
          </DialogHeader>
          <WalletForm
            mode="create"
            fixedParentWalletId={walletId}
            onSuccess={() => {
              onCloseCreateChild();
              onRefetch();
            }}
            onCancel={onCloseCreateChild}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Child Dialog */}
      <Dialog
        open={isEditChildOpen}
        onOpenChange={(open) => {
          if (!open) onCloseEditChild();
        }}
      >
        <DialogContent>
          <DialogClose onClose={onCloseEditChild} />
          <DialogHeader>
            <DialogTitle>{t.wallets.page.editChild}</DialogTitle>
            <DialogDescription>{t.wallets.page.detail.editChildDescription}</DialogDescription>
          </DialogHeader>
          {editingChildWallet && (
            <WalletForm
              mode="edit"
              wallet={editingChildWallet}
              onSuccess={() => {
                onCloseEditChild();
                onRefetch();
              }}
              onCancel={onCloseEditChild}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Detach/Delete Wallet Modal */}
      <DetachWalletModal
        isOpen={isDetachOpen}
        onClose={onCloseDetach}
        wallet={selectedChildWallet}
        onSuccess={onRefetch}
      />
    </>
  );
};
