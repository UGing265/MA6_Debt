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
import { Button } from "@/components/ui/button";
import { WalletForm } from "@/features/wallet/components/WalletForm";
import type { Wallet } from "@/features/wallet/types/wallet";
import { useLanguage } from "@/context/LanguageContext";

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
  const { t } = useLanguage();
  let deleteButtonLabel = t.wallets.page.dialog.cannotDelete;
  if (isDeleting) {
    deleteButtonLabel = t.wallets.page.dialog.deleteing;
  } else if (canDeleteSelectedWallet) {
    deleteButtonLabel = t.wallets.page.dialog.deleteButton;
  }

  return (
    <>
      {/* Create Parent Wallet Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={(open) => !open && onCloseCreate()}>
        <DialogContent>
          <DialogClose onClose={onCloseCreate} />
          <DialogHeader>
            <DialogTitle>{t.wallets.page.dialog.createParentTitle}</DialogTitle>
            <DialogDescription>{t.wallets.page.dialog.createParentDescription}</DialogDescription>
          </DialogHeader>
          <WalletForm mode="create" onSuccess={onCloseCreate} onCancel={onCloseCreate} />
        </DialogContent>
      </Dialog>

      {/* Edit Wallet Dialog */}
      <Dialog open={editingWallet !== null} onOpenChange={(open) => !open && onCloseEdit()}>
        <DialogContent>
          <DialogClose onClose={onCloseEdit} />
          <DialogHeader>
            <DialogTitle>
              {editingWallet?.parentWalletId
                ? t.wallets.page.dialog.editChildTitle
                : t.wallets.page.dialog.editParentTitle}
            </DialogTitle>
            <DialogDescription>{t.wallets.page.dialog.updateNameAndDescription}</DialogDescription>
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
            <DialogTitle>{t.wallets.page.dialog.deleteTitle}</DialogTitle>
            <DialogDescription>
              {t.wallets.page.dialog.deleteDescription.replace("{name}", deletingWallet?.name ?? "")}
            </DialogDescription>
            {deletingWallet && deletingChildCount > 0 ? (
              <p className="text-sm text-red-600">
                {t.wallets.page.dialog.deleteChildrenWarning.replace("{count}", String(deletingChildCount))}
              </p>
            ) : null}
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onCloseDelete} disabled={isDeleting}>
              {t.common.cancel}
            </Button>
            <Button variant="destructive" onClick={onDeleteConfirm} disabled={isDeleting || !canDeleteSelectedWallet}>
              {deleteButtonLabel}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
