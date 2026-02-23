"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Edit2, Loader2, Lock, Trash2 } from "lucide-react";
import { HistoryDto, TransferDirection } from "../types/history";
import { formatVnd } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { deleteHistoryItem, updateHistoryNote } from "../api/history";

type HistoryRowProps = {
  item: HistoryDto;
  onRefresh?: () => void | Promise<void>;
};

const extractGeneralError = (e: any): string => {
  if (!e) return "An error occurred. Please try again.";
  if (typeof e === "string") return e;

  if (typeof e.general === "string" && e.general.trim().length > 0) {
    return e.general;
  }

  if (typeof e.message === "string" && e.message.trim().length > 0) {
    return e.message;
  }

  if (typeof e.raw?.message === "string" && e.raw.message.trim().length > 0) {
    return e.raw.message;
  }

  return "An error occurred. Please try again.";
};

const isLockLikeMessage = (msg: string): boolean => {
  const m = (msg ?? "").toLowerCase();
  return m.includes("lock") || m.includes("locked") || m.includes("conflict") || m.includes("closed") || m.includes("settled");
};

export const HistoryRow: React.FC<HistoryRowProps> = ({ item, onRefresh }) => {
  const router = useRouter();
  const amount = item.amount ?? 0;
  const isTransfer = item.transferId != null;
  const direction = item.transferDirection ?? null;
  const absAmount = Math.abs(amount);
  const isLocked = Boolean(item.isLocked);
  const lockReason = "This transaction is locked and can't be edited or deleted.";

  const [isEditOpen, setIsEditOpen] = React.useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState<boolean>(false);
  const [noteDraft, setNoteDraft] = React.useState<string>(item.note ?? "");
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);

  // Determine sign based on transfer direction when present to ensure deterministic rendering
  const sign = isTransfer
    ? direction === TransferDirection.Incoming
      ? "+"
      : "-"
    : amount >= 0
    ? "+"
    : "-";

  // Label for transfer rows; only applicable when transfer metadata exists
  const transferLabel = isTransfer
    ? direction === TransferDirection.Incoming
      ? "Transfer In"
      : "Transfer Out"
    : "";

  const dateStr = item.transactionDate ?? item.createdAt ?? "";

  // Visual color for amount: transfers use direction color, others use numeric sign
  const amountColor = isTransfer
    ? (direction === TransferDirection.Incoming ? "text-green-600" : "text-red-600")
    : amount >= 0
    ? "text-green-600"
    : "text-red-600";

  const handleRowClick = React.useCallback(() => {
    router.push(`/history/${item.id}`);
  }, [router, item.id]);

  const handleOpenEdit = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setNoteDraft(item.note ?? "");
    setIsEditOpen(true);
  }, [item.note]);

  const handleSaveNote = React.useCallback(async () => {
    if (isLocked) return;

    setIsSaving(true);
    try {
      await updateHistoryNote(item.id, noteDraft);
      toast.success("Note updated");
      setIsEditOpen(false);
      await onRefresh?.();
    } catch (e: any) {
      const msg = extractGeneralError(e);
      if (isLockLikeMessage(msg)) {
        toast.error("This transaction is locked and can't be changed.");
        await onRefresh?.();
        return;
      }
      toast.error(msg || "Failed to update note");
    } finally {
      setIsSaving(false);
    }
  }, [isLocked, item.id, noteDraft, onRefresh]);

  const handleDelete = React.useCallback(async () => {
    if (isLocked) return;

    setIsDeleting(true);
    try {
      await deleteHistoryItem(item.id);
      toast.success("Transaction deleted");
      setIsDeleteOpen(false);
      await onRefresh?.();
    } catch (e: any) {
      const msg = extractGeneralError(e);
      if (isLockLikeMessage(msg)) {
        toast.error("This transaction is locked and can't be changed.");
        await onRefresh?.();
        return;
      }
      toast.error(msg || "Failed to delete transaction");
    } finally {
      setIsDeleting(false);
    }
  }, [isLocked, item.id, onRefresh]);

  const handleOpenDelete = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteOpen(true);
  }, []);

  return (
    <>
      <div
        className="flex items-center justify-between gap-3 rounded-md px-3 py-2 border border-dashed border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={handleRowClick}
      >
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-2 min-w-0">
            <div className="font-medium text-ink-black truncate">
              {item.note ?? item.partnerName ?? "Transaction"}
            </div>
            {isLocked ? (
              <span
                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                title={lockReason}
                aria-label="locked"
              >
                <Lock className="h-3 w-3" />
                Locked
              </span>
            ) : null}
          </div>
          <p className="text-xs text-pencil-gray truncate">
            {item.partnerName ? `Partner: ${item.partnerName}` : ""}
            {item.debtAmount != null ? ` • Debt: ${formatVnd(Math.abs(item.debtAmount))}` : ""}
            {dateStr ? ` • ${new Date(dateStr).toLocaleDateString()}` : ""}
            {isLocked ? " • Locked (no changes)" : ""}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right whitespace-nowrap">
            <div className="flex items-center justify-end gap-2">
              <span className={`font-semibold ${amountColor}`} aria-label="amount">
                {sign}
                {formatVnd(absAmount)}
              </span>
              {isTransfer ? (
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                    direction === TransferDirection.Incoming
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {transferLabel}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <span className={`inline-flex ${isLocked ? "cursor-not-allowed" : ""}`} title={isLocked ? lockReason : "Edit note"}>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                disabled={isLocked}
                onClick={handleOpenEdit}
                className="border-gray-200 bg-white hover:bg-gray-50"
                aria-label="edit note"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </span>

            <span className={`inline-flex ${isLocked ? "cursor-not-allowed" : ""}`} title={isLocked ? lockReason : "Delete transaction"}>
              <Button
                type="button"
                variant="destructive"
                size="icon-sm"
                disabled={isLocked}
                onClick={handleOpenDelete}
                className="border border-red-700/40"
                aria-label="delete transaction"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </span>
          </div>
        </div>
      </div>

      <Dialog
        open={isEditOpen}
        onOpenChange={(open) => {
          if (!open && isSaving) return;
          setIsEditOpen(open);
          if (open) setNoteDraft(item.note ?? "");
        }}
      >
        <DialogContent>
          <DialogClose onClose={() => setIsEditOpen(false)} />
          <DialogHeader>
            <DialogTitle>Edit note</DialogTitle>
            <DialogDescription>Update the note for this transaction.</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700" htmlFor={`history-note-${item.id}`}>
              Note
            </label>
            <textarea
              id={`history-note-${item.id}`}
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              placeholder="Add a note..."
            />
            {isLocked ? (
              <p className="text-xs text-pencil-gray" title={lockReason}>
                Locked: editing is disabled.
              </p>
            ) : null}
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveNote} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDeleteOpen}
        onOpenChange={(open) => {
          if (!open && isDeleting) return;
          setIsDeleteOpen(open);
        }}
      >
        <DialogContent>
          <DialogClose onClose={() => setIsDeleteOpen(false)} />
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle>Delete transaction</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>

          {isLocked ? (
            <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700" title={lockReason}>
              Locked: deletion is disabled.
            </div>
          ) : null}

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting || isLocked}>
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HistoryRow;
