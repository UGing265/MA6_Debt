"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { parseErrorResponse } from "@/features/auth/utils/errorParser";
import { useWallets } from "@/features/wallet/hooks/useWallets";
import { useCashAdjustmentSubmit } from "../hooks/useTransactionSubmit";
import { AdjustmentSchema, mapAdjustmentToPayload } from "../model";
import { AdjustmentDirection } from "../types/transaction";
import { formatVnd } from "@/lib/utils";
import type { Wallet } from "@/features/wallet/types/wallet";

type AdjustmentFormInput = z.infer<typeof AdjustmentSchema>;

const defaultValues: AdjustmentFormInput = {
  walletId: "",
  direction: AdjustmentDirection.Credit,
  amount: Number.NaN,
  note: "",
};

type GroupedWallets = {
  parent: Wallet | null;
  children: Wallet[];
};

const handleNumericKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  // Allow: backspace, delete, tab, escape, enter, arrows
  if (
    e.key === "Backspace" ||
    e.key === "Delete" ||
    e.key === "Tab" ||
    e.key === "Escape" ||
    e.key === "Enter" ||
    e.key === "ArrowLeft" ||
    e.key === "ArrowRight" ||
    e.key === "ArrowUp" ||
    e.key === "ArrowDown" ||
    (e.ctrlKey && (e.key === "a" || e.key === "c" || e.key === "v" || e.key === "x"))
  ) {
    return;
  }
  // Block if not a number
  if (!/^\d$/.test(e.key)) {
    e.preventDefault();
  }
};

export const AdjustmentForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: wallets, isLoading: walletsLoading, error: walletsError } = useWallets();
  const cashAdjustmentSubmit = useCashAdjustmentSubmit({
    showSuccessToast: false,
    showErrorToast: false,
  });

  const childWallets = useMemo(
    () => wallets.filter((wallet) => wallet.parentWalletId != null),
    [wallets]
  );

  const groupedWallets = useMemo((): GroupedWallets[] => {
    const parentWallets = wallets.filter((w) => !w.parentWalletId);
    const groups: GroupedWallets[] = [];

    for (const parent of parentWallets) {
      const directChildren = wallets.filter((w) => w.parentWalletId === parent.id);
      groups.push({ parent, children: directChildren });
    }

    return groups;
  }, [wallets]);

  const form = useForm<AdjustmentFormInput>({
    resolver: zodResolver(AdjustmentSchema),
    defaultValues,
  });

  const amountValue = form.watch("amount");

  // Get default wallet ID from localStorage
  const getDefaultWalletId = (): string => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("defaultWalletId") || "";
  };

  // Auto-select default wallet on mount
  useEffect(() => {
    const defaultWalletId = getDefaultWalletId();
    if (defaultWalletId) {
      const walletExists = childWallets.some(w => w.id === defaultWalletId);
      if (walletExists) {
        form.setValue("walletId", defaultWalletId);
      }
    }
  }, [form, childWallets]);

  const onSubmit = async (values: AdjustmentFormInput) => {
    setIsSubmitting(true);
    try {
      const payload = mapAdjustmentToPayload(values);
      await cashAdjustmentSubmit.mutateAsync(payload);
      toast.success("Adjustment submitted!");
      form.reset(defaultValues);
    } catch (error: unknown) {
      const parsedError = parseErrorResponse(error);
      const normalizeFieldKey = (field: string) => field.replace(/[^a-z0-9]/gi, "").toLowerCase();
      const fieldMap: Record<string, keyof AdjustmentFormInput> = {
        walletid: "walletId",
        direction: "direction",
        amount: "amount",
        note: "note",
      };
      let hasHandledFieldError = false;
      let hasUnknownFieldError = false;

      Object.entries(parsedError.fields).forEach(([field, messages]) => {
        const fieldName = fieldMap[normalizeFieldKey(field)];
        if (fieldName && messages.length > 0) {
          hasHandledFieldError = true;
          form.setError(fieldName, {
            type: "server",
            message: messages[0],
          });
          return;
        }

        if (messages.length > 0) {
          hasUnknownFieldError = true;
        }
      });

      if (!hasHandledFieldError || hasUnknownFieldError) {
        toast.error(parsedError.general || "Failed to submit adjustment");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      {/* Amount - on top */}
      <div className="space-y-1.5">
        <label className="block text-center text-sm font-medium text-ink-black">
          Amount
        </label>
        <div className="relative">
          <input
            data-testid="adj-amount"
            disabled={isSubmitting}
            inputMode="numeric"
            placeholder="0"
            type="text"
            value={!Number.isNaN(amountValue) ? amountValue.toLocaleString("en-US") : ""}
            onChange={(event) => {
              const raw = event.target.value.replace(/,/g, "").replace(/[^\d]/g, "");
              form.setValue("amount", raw === "" ? Number.NaN : Number(raw), { shouldValidate: true });
            }}
            onKeyDown={handleNumericKeyDown}
            className="h-14 w-full rounded-lg border-2 border-note-yellow bg-white px-4 py-3 text-center text-2xl font-semibold text-ink-black outline-none transition-colors placeholder:text-pencil-gray focus:border-amber-500 focus:ring-2 focus:ring-note-yellow/30 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-pencil-gray">
            vnd
          </span>
        </div>
        {form.formState.errors.amount && (
          <p className="text-center text-xs text-red-500">{form.formState.errors.amount.message}</p>
        )}
      </div>

      {/* Direction - Add/Subtract Money */}
      <div className="space-y-1.5">
        <label className="block text-left text-xs font-medium text-pencil-gray">
          Direction
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => form.setValue("direction", AdjustmentDirection.Credit, { shouldValidate: true })}
            className={`h-10 flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              form.watch("direction") === AdjustmentDirection.Credit
                ? "bg-note-yellow text-ink-black hover:bg-amber-400"
                : "border border-gray-200 bg-white text-pencil-gray hover:bg-gray-50"
            }`}
          >
            Add Money
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => form.setValue("direction", AdjustmentDirection.Debit, { shouldValidate: true })}
            className={`h-10 flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              form.watch("direction") === AdjustmentDirection.Debit
                ? "bg-note-yellow text-ink-black hover:bg-amber-400"
                : "border border-gray-200 bg-white text-pencil-gray hover:bg-gray-50"
            }`}
          >
            Subtract Money
          </button>
        </div>
        {form.formState.errors.direction && (
          <p className="text-xs text-red-500">{form.formState.errors.direction.message}</p>
        )}
      </div>

      {/* Child Wallet */}
      <div className="space-y-1.5">
        <label className="block text-left text-xs font-medium text-pencil-gray">
          Child Wallet
        </label>
        <select
          data-testid="adj-wallet"
          value={form.watch("walletId") ?? ""}
          onChange={(e) => form.setValue("walletId", e.target.value, { shouldValidate: true })}
          disabled={isSubmitting || walletsLoading || childWallets.length === 0}
          className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-ink-black outline-none transition-colors focus:border-note-yellow focus:ring-2 focus:ring-note-yellow/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">
            {walletsLoading
              ? "Loading..."
              : childWallets.length === 0
              ? "No child wallets"
              : "Select wallet"}
          </option>
          {groupedWallets.map((group, idx) => (
            <optgroup
              key={group.parent?.id ?? `orphan-${idx}`}
              label={group.parent?.name ?? "Other"}
            >
              {group.children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name} ({formatVnd(child.balance)})
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        {form.formState.errors.walletId && (
          <p className="text-xs text-red-500">{form.formState.errors.walletId.message}</p>
        )}
      </div>
      {/* Note */}
      <div className="space-y-1.5">
        <label className="block text-left text-xs font-medium text-pencil-gray">
          Note
        </label>
        <input
          data-testid="adj-note"
          disabled={isSubmitting}
          placeholder="e.g. Cash adjustment"
          value={form.watch("note") ?? ""}
          onChange={(e) => form.setValue("note", e.target.value, { shouldValidate: true })}
          className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-ink-black outline-none transition-colors placeholder:text-pencil-gray focus:border-note-yellow focus:ring-2 focus:ring-note-yellow/30 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {form.formState.errors.note && (
          <p className="text-xs text-red-500">{form.formState.errors.note.message}</p>
        )}
      </div>

      {walletsError ? <p className="text-xs text-red-600">{walletsError}</p> : null}

      <button
        data-testid="adj-submit"
        type="submit"
        disabled={isSubmitting || walletsLoading || childWallets.length === 0}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-note-yellow px-6 py-3 text-sm font-semibold text-ink-black transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Settings2 className="h-4 w-4" />
            Submit Adjustment
          </>
        )}
      </button>
    </form>
  );
};

export default AdjustmentForm;
