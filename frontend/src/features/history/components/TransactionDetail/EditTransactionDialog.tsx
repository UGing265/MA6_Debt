"use client";

import React from "react";
import { Calendar, FileText, Loader2 } from "lucide-react";
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

interface EditTransactionDialogProps {
  isOpen: boolean;
  noteDraft: string;
  transactionDateDraft: string;
  isSaving: boolean;
  onNoteChange: (note: string) => void;
  onDateChange: (date: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const EditTransactionDialog: React.FC<EditTransactionDialogProps> = ({
  isOpen,
  noteDraft,
  transactionDateDraft,
  isSaving,
  onNoteChange,
  onDateChange,
  onSave,
  onCancel,
}) => {
  const { t } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogClose onClose={onCancel} />
        <DialogHeader>
          <DialogTitle>{t.history.page.detail.edit}</DialogTitle>
          <DialogDescription>{t.history.page.detail.updateDescription}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Transaction Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {t.history.page.detail.transactionDate}
            </label>
            <input
              type="datetime-local"
              value={transactionDateDraft}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-note-yellow focus-visible:ring-2 focus-visible:ring-note-yellow/30"
            />
          </div>

          {/* Note */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t.history.page.detail.note}
            </label>
            <textarea
              value={noteDraft}
              onChange={(e) => onNoteChange(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-note-yellow focus-visible:ring-2 focus-visible:ring-note-yellow/30"
              placeholder={t.history.page.detail.notePlaceholder}
            />
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="bg-note-yellow text-ink-black hover:bg-note-yellow/90"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {t.common.saving}
              </>
            ) : (
              t.common.save
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
