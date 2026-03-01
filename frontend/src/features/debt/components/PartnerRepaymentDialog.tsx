"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatVnd } from "@/lib/utils";
import { useWallets } from "@/features/wallet/hooks/useWallets";
import { useQuickDeductSubmit } from "@/features/transaction/hooks/useTransactionSubmit";
import { PayerMode } from "@/features/transaction/types/transaction";
import { parseErrorResponse } from "@/features/auth/utils/errorParser";
import type { DebtPartner } from "../types/debtPartner";

type PartnerRepaymentDialogProps = {
  open: boolean;
  partner: DebtPartner | null;
  onOpenChange: (open: boolean) => void;
};

const getAmountFromInput = (value: string): number => {
  const raw = value.replace(/,/g, "").replace(/[^\d]/g, "");
  if (!raw) {
    return 0;
  }
  return Number(raw);
};

const getDefaultPayerMode = (partner: DebtPartner | null): PayerMode => {
  if (!partner) {
    return PayerMode.ToiTra;
  }
  if (partner.balance > 0) {
    return PayerMode.PartnerTra;
  }
  return PayerMode.ToiTra;
};

const getProjectedBalance = (currentBalance: number, amount: number, payerMode: PayerMode): number => {
  const delta = payerMode === PayerMode.ToiTra ? amount : -amount;
  return currentBalance + delta;
};

export function PartnerRepaymentDialog({ open, partner, onOpenChange }: PartnerRepaymentDialogProps) {
  const { data: wallets, isLoading: isWalletsLoading } = useWallets();
  const quickDeductSubmit = useQuickDeductSubmit();

  const childWallets = React.useMemo(
    () => wallets.filter((wallet) => wallet.parentWalletId != null),
    [wallets]
  );

  const [walletId, setWalletId] = React.useState<string>("");
  const [amountText, setAmountText] = React.useState<string>("");
  const [note, setNote] = React.useState<string>("");
  const [payerMode, setPayerMode] = React.useState<PayerMode>(getDefaultPayerMode(partner));
  const [walletError, setWalletError] = React.useState<string | null>(null);
  const [amountError, setAmountError] = React.useState<string | null>(null);
  const [generalError, setGeneralError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!open) {
      return;
    }
    setPayerMode(getDefaultPayerMode(partner));
    setAmountText("");
    setNote("");
    setWalletError(null);
    setAmountError(null);
    setGeneralError(null);
  }, [open, partner]);

  React.useEffect(() => {
    if (!open) {
      return;
    }
    const defaultWalletId = typeof window !== "undefined" ? localStorage.getItem("defaultWalletId") || "" : "";
    if (defaultWalletId && childWallets.some((wallet) => wallet.id === defaultWalletId)) {
      setWalletId(defaultWalletId);
      return;
    }
    if (childWallets.length > 0) {
      setWalletId(childWallets[0].id);
    } else {
      setWalletId("");
    }
  }, [open, childWallets]);

  const amount = React.useMemo(() => getAmountFromInput(amountText), [amountText]);
  const outstanding = Math.abs(partner?.balance ?? 0);
  const projectedBalance = React.useMemo(
    () => getProjectedBalance(partner?.balance ?? 0, amount, payerMode),
    [partner?.balance, amount, payerMode]
  );
  const projectedOutstanding = Math.abs(projectedBalance);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!partner) {
      return;
    }

    setWalletError(null);
    setAmountError(null);
    setGeneralError(null);

    if (!walletId) {
      setWalletError("Please select a wallet");
      return;
    }
    if (amount <= 0) {
      setAmountError("Amount must be greater than 0");
      return;
    }
    if (outstanding <= 0) {
      setAmountError("This partner has no outstanding debt");
      return;
    }
    if (amount > outstanding) {
      setAmountError(`Amount cannot exceed outstanding debt (${formatVnd(outstanding)})`);
      return;
    }
    if (projectedOutstanding >= outstanding) {
      setAmountError("Selected payer mode does not reduce current debt. Please switch who paid.");
      return;
    }

    setIsSubmitting(true);
    try {
      await quickDeductSubmit.mutateAsync({
        walletId,
        partnerId: partner.id,
        payerMode,
        total: amount,
        debtAmount: amount,
        note: note.trim() ? note.trim() : undefined,
      });
      onOpenChange(false);
    } catch (error) {
      const parsedError = parseErrorResponse(error);
      setGeneralError(parsedError.general || "Failed to submit repayment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogClose onClose={() => onOpenChange(false)} />
        <DialogHeader>
          <DialogTitle>Repay Debt</DialogTitle>
          <DialogDescription>
            Record a repayment for {partner?.name ?? "this partner"} with amount, note, and who paid.
          </DialogDescription>
        </DialogHeader>

        {partner ? (
          <form className="space-y-4" onSubmit={submit}>
            <div className="rounded-md border border-note-yellow/30 bg-note-yellow/10 px-3 py-2 text-sm">
              <p className="text-ink-black">
                Outstanding: <span className="font-semibold">{formatVnd(outstanding)}</span>
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-pencil-gray">Child Wallet</label>
              <select
                disabled={isSubmitting || isWalletsLoading || childWallets.length === 0}
                value={walletId}
                onChange={(event) => setWalletId(event.target.value)}
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-ink-black outline-none transition-colors focus:border-note-yellow focus:ring-2 focus:ring-note-yellow/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">
                  {isWalletsLoading ? "Loading..." : childWallets.length === 0 ? "No child wallets" : "Select wallet"}
                </option>
                {childWallets.map((wallet) => (
                  <option key={wallet.id} value={wallet.id}>
                    {wallet.name} ({formatVnd(wallet.balance)})
                  </option>
                ))}
              </select>
              {walletError ? <p className="text-xs text-red-500">{walletError}</p> : null}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-pencil-gray">Amount Repaid</label>
              <div className="relative">
                <input
                  disabled={isSubmitting}
                  inputMode="numeric"
                  placeholder="0"
                  type="text"
                  value={amountText ? amount.toLocaleString("en-US") : ""}
                  onChange={(event) => {
                    const raw = event.target.value.replace(/,/g, "").replace(/[^\d]/g, "");
                    setAmountText(raw);
                  }}
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pr-12 text-sm text-ink-black outline-none transition-colors placeholder:text-pencil-gray focus:border-note-yellow focus:ring-2 focus:ring-note-yellow/30 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-pencil-gray">
                  vnd
                </span>
              </div>
              {amountError ? <p className="text-xs text-red-500">{amountError}</p> : null}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-pencil-gray">Who Paid?</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setPayerMode(PayerMode.ToiTra)}
                  className={`h-10 flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    payerMode === PayerMode.ToiTra
                      ? "bg-note-yellow text-ink-black hover:bg-amber-400"
                      : "border border-gray-200 bg-white text-pencil-gray hover:bg-gray-50"
                  }`}
                >
                  I Paid
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setPayerMode(PayerMode.PartnerTra)}
                  className={`h-10 flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    payerMode === PayerMode.PartnerTra
                      ? "bg-note-yellow text-ink-black hover:bg-amber-400"
                      : "border border-gray-200 bg-white text-pencil-gray hover:bg-gray-50"
                  }`}
                >
                  Partner Paid
                </button>
              </div>
              <p className="text-xs text-pencil-gray">
                Default is auto-suggested by current balance, but you can choose manually.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-pencil-gray">Note</label>
              <textarea
                disabled={isSubmitting}
                rows={3}
                maxLength={300}
                placeholder="Add repayment note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-ink-black outline-none transition-colors placeholder:text-pencil-gray focus:border-note-yellow focus:ring-2 focus:ring-note-yellow/30 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-pencil-gray">
              Projected balance after submit: <span className="font-semibold text-ink-black">{formatVnd(projectedBalance)}</span>
            </div>
            {amount > 0 && projectedOutstanding >= outstanding ? (
              <p className="text-xs text-amber-700">
                This payer choice increases debt instead of repaying it.
              </p>
            ) : null}

            {generalError ? <p className="text-xs text-red-500">{generalError}</p> : null}

            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" className="bg-note-yellow text-ink-black hover:bg-amber-400" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Repayment"
                )}
              </Button>
            </div>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export default PartnerRepaymentDialog;
