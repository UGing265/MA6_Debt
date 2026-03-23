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
  return (
    <>
      {/* Edit Parent Dialog */}
      <Dialog open={isEditParentOpen} onOpenChange={(open) => !open && onCloseEditParent()}>
        <DialogContent>
          <DialogClose onClose={onCloseEditParent} />
          <DialogHeader>
            <DialogTitle>Edit Parent Wallet</DialogTitle>
            <DialogDescription>Update parent wallet name and description.</DialogDescription>
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
            <DialogTitle>Create Child Wallet</DialogTitle>
            <DialogDescription>Create a new child wallet under this parent wallet.</DialogDescription>
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
            <DialogTitle>Edit Child Wallet</DialogTitle>
            <DialogDescription>Update child wallet name and description.</DialogDescription>
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
