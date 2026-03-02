import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WalletForm } from "@/features/wallet/components/WalletForm";
import type { Wallet } from "@/features/wallet/types/wallet";

interface WalletsDialogsProps {
  isCreateOpen: boolean;
  editingWallet: Wallet | null;
  deletingWallet: Wallet | null;
  isDeleting: boolean;
  deletingChildCount: number;
  canDeleteSelectedWallet: boolean;
  onCloseCreate: () => void;
  onCloseEdit: () => void;
  onCloseDelete: () => void;
  onDeleteConfirm: () => void;
}

export const WalletsDialogs: React.FC<WalletsDialogsProps> = ({
  isCreateOpen,
  editingWallet,
  deletingWallet,
  isDeleting,
  deletingChildCount,
  canDeleteSelectedWallet,
  onCloseCreate,
  onCloseEdit,
  onCloseDelete,
  onDeleteConfirm,
}) => {
  return (
    <>
      {/* Create Parent Wallet Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={(open) => !open && onCloseCreate()}>
        <DialogContent>
          <DialogClose onClose={onCloseCreate} />
          <DialogHeader>
            <DialogTitle>Create Parent Wallet</DialogTitle>
            <DialogDescription>Create a new parent wallet to organize your cash.</DialogDescription>
          </DialogHeader>
          <WalletForm mode="create" onSuccess={onCloseCreate} onCancel={onCloseCreate} />
        </DialogContent>
      </Dialog>

      {/* Edit Wallet Dialog */}
      <Dialog open={editingWallet !== null} onOpenChange={(open) => !open && onCloseEdit()}>
        <DialogContent>
          <DialogClose onClose={onCloseEdit} />
          <DialogHeader>
            <DialogTitle>Edit {editingWallet?.parentWalletId ? "Sub-wallet" : "Parent Wallet"}</DialogTitle>
            <DialogDescription>Update wallet name and description.</DialogDescription>
          </DialogHeader>
          {editingWallet && (
            <WalletForm mode="edit" wallet={editingWallet} onSuccess={onCloseEdit} onCancel={onCloseEdit} />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Wallet Dialog */}
      <Dialog
        open={deletingWallet !== null}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            onCloseDelete();
          }
        }}
      >
        <DialogContent>
          <DialogClose
            onClose={() => {
              if (!isDeleting) {
                onCloseDelete();
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
            <Button variant="outline" onClick={onCloseDelete} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onDeleteConfirm} disabled={isDeleting || !canDeleteSelectedWallet}>
              {isDeleting ? "Deleting..." : canDeleteSelectedWallet ? "Delete" : "Cannot Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
