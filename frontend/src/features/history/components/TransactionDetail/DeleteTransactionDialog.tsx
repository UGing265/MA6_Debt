import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

interface DeleteTransactionDialogProps {
  isOpen: boolean;
  isDeleting: boolean;
  onDelete: () => void;
  onCancel: () => void;
}

export const DeleteTransactionDialog: React.FC<DeleteTransactionDialogProps> = ({
  isOpen,
  isDeleting,
  onDelete,
  onCancel,
}) => {
  const { t } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogClose onClose={onCancel} />
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <DialogTitle>{t.history.page.detail.delete}</DialogTitle>
          <DialogDescription>{t.history.page.detail.deleteDescription}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isDeleting}>
            {t.common.cancel}
          </Button>
          <Button type="button" variant="destructive" onClick={onDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {t.common.deleting}
              </>
            ) : (
              t.common.delete
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
