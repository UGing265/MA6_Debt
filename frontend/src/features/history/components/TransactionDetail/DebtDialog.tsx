import React from "react";
import { Loader2 } from "lucide-react";
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
import { PayerMode } from "@/features/transaction/types/transaction";
import { formatVnd } from "@/lib/utils";
import { PartnerSelect } from "@/features/transaction/components/QuickDebt/PartnerSelect";
import { handleNumericKeyDown, parseNumericInput } from "@/lib/utils/numericInput";

interface Partner {
  id: string;
  name: string;
  balance: number;
}

interface DebtDialogProps {
  isOpen: boolean;
  hasExistingDebt: boolean;
  debtPartnerId: string;
  debtPayerMode: PayerMode;
  debtAmount: string;
  partners: Partner[];
  isSaving: boolean;
  onPartnerChange: (partnerId: string) => void;
  onPayerModeChange: (mode: PayerMode) => void;
  onDebtAmountChange: (amount: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const DebtDialog: React.FC<DebtDialogProps> = ({
  isOpen,
  hasExistingDebt,
  debtPartnerId,
  debtPayerMode,
  debtAmount,
  partners,
  isSaving,
  onPartnerChange,
  onPayerModeChange,
  onDebtAmountChange,
  onSave,
  onCancel,
}) => {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseNumericInput(e.target.value);
    onDebtAmountChange(raw);
  };

  const displayAmount = debtAmount ? Number(debtAmount).toLocaleString("en-US") : "";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogClose onClose={onCancel} />
        <DialogHeader>
          <DialogTitle>{hasExistingDebt ? "Edit Debt Info" : "Add Debt Info"}</DialogTitle>
          <DialogDescription>
            {hasExistingDebt
              ? "Update debt information for this transaction."
              : "Add debt information to track who owes whom."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Partner - Hybrid Search Combobox */}
          <PartnerSelect
            value={debtPartnerId}
            onChange={(val) => onPartnerChange(val)}
            partners={partners}
            isLoading={false}
            disabled={isSaving}
          />

          {/* Payer Mode */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Who Paid?</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onPayerModeChange(PayerMode.ToiTra)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  debtPayerMode === PayerMode.ToiTra
                    ? "bg-note-yellow text-ink-black"
                    : "border border-gray-200 bg-white text-pencil-gray hover:bg-gray-50"
                }`}
              >
                I Paid
              </button>
              <button
                type="button"
                onClick={() => onPayerModeChange(PayerMode.PartnerTra)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  debtPayerMode === PayerMode.PartnerTra
                    ? "bg-note-yellow text-ink-black"
                    : "border border-gray-200 bg-white text-pencil-gray hover:bg-gray-50"
                }`}
              >
                Partner Paid
              </button>
            </div>
          </div>

          {/* Debt Amount */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              {debtPayerMode === PayerMode.ToiTra ? "Partner Owes Me" : "I Owe Partner"}
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={displayAmount}
                onChange={handleAmountChange}
                onKeyDown={handleNumericKeyDown}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 pr-12 text-sm shadow-xs outline-none focus-visible:border-note-yellow focus-visible:ring-2 focus-visible:ring-note-yellow/30"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-pencil-gray">vnd</span>
            </div>
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
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
