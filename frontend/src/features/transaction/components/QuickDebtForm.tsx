"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Zap } from "lucide-react";
import { toast } from "sonner";
import { parseErrorResponse } from "@/features/auth/utils/errorParser";
import { useWallets } from "@/features/wallet/hooks/useWallets";
import { useDebtPartners } from "@/features/debt/hooks/useDebtPartners";
import { useQuickDeductSubmit } from "../hooks/useTransactionSubmit";
import { mapQuickDebtToPayload } from "../model";
import { PayerMode } from "../types/transaction";
import { formatVnd } from "@/lib/utils";
import type { Wallet } from "@/features/wallet/types/wallet";

const quickDebtFormSchema = z.object({
  walletId: z.string().min(1, "Please select a wallet"),
  total: z.number().positive("Amount must be greater than 0"),
  payerMode: z.nativeEnum(PayerMode),
  partnerId: z.string().min(1, "Please select a partner"),
  debtAmount: z.number().min(0, "Debt amount cannot be negative"),
  note: z.string().trim().max(300, "Note max 300 characters").optional(),
});

type QuickDebtFormValues = z.infer<typeof quickDebtFormSchema>;

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

export function QuickDebtForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
  const { data: wallets, isLoading: isWalletsLoading } = useWallets();
  const { partners, isLoading: isPartnersLoading } = useDebtPartners();
  const quickDeductSubmit = useQuickDeductSubmit({
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

  const getDefaultPartnerId = (): string => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("defaultPartnerId") || "";
  };

  const getDefaultWalletId = (): string => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("defaultWalletId") || "";
  };

  const form = useForm<QuickDebtFormValues>({
    resolver: zodResolver(quickDebtFormSchema),
    defaultValues: {
      walletId: getDefaultWalletId(),
      total: 0,
      payerMode: PayerMode.ToiTra,
      partnerId: getDefaultPartnerId(),
      debtAmount: 0,
      note: "",
    },
  });

  const totalValue = form.watch("total");
  const debtAmountValue = form.watch("debtAmount");
  const payerMode = form.watch("payerMode");

  // Auto-select default partner and wallet on mount
  useEffect(() => {
    const defaultPartnerId = getDefaultPartnerId();
    const defaultWalletId = getDefaultWalletId();
    if (defaultPartnerId && !form.getValues("partnerId")) {
      form.setValue("partnerId", defaultPartnerId);
    }
    if (defaultWalletId && !form.getValues("walletId")) {
      // Only set if the wallet exists in childWallets
      const exists = childWallets.some(w => w.id === defaultWalletId);
      if (exists) {
        form.setValue("walletId", defaultWalletId);
      }
    }
  }, [form, childWallets]);

  const onSubmit = async (values: QuickDebtFormValues) => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setNotificationMessage(null);

    try {
      // Always send partnerId if user has selected one
      // This ensures transaction is tagged as "bill" in history
      const hasDebt = values.debtAmount > 0;
      const selectedPartner = values.partnerId;

      const input = {
        walletId: values.walletId,
        total: values.total,
        debtTag: hasDebt,
        payerMode: values.payerMode,
        partnerId: selectedPartner || undefined,
        debtAmount: hasDebt ? values.debtAmount : undefined,
      };

      const mappedPayload = mapQuickDebtToPayload(input);

      const response = await quickDeductSubmit.mutateAsync({
        ...mappedPayload,
        payerMode: mappedPayload.payerMode ?? PayerMode.ToiTra,
        note: values.note?.trim() || undefined,
      });

      toast.success("Transaction recorded");
      setNotificationMessage(response.notification?.message ?? null);
      form.reset({
        walletId: getDefaultWalletId(),
        total: 0,
        payerMode: PayerMode.ToiTra,
        partnerId: getDefaultPartnerId(),
        debtAmount: 0,
        note: "",
      });
    } catch (error: unknown) {
      const parsedError = parseErrorResponse(error);
      const normalizeFieldKey = (field: string) => field.replace(/[^a-z0-9]/gi, "").toLowerCase();
      const fieldMap: Record<string, keyof QuickDebtFormValues> = {
        walletid: "walletId",
        total: "total",
        note: "note",
        payermode: "payerMode",
        partnerid: "partnerId",
        debtamount: "debtAmount",
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
        toast.error(parsedError.general || "Failed to record transaction");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      {/* Total Amount */}
      <div className="space-y-1.5">
        <label className="block text-center text-sm font-medium text-ink-black">
          Total
        </label>
        <div className="relative">
          <input
            data-testid="qd-total"
            disabled={isSubmitting}
            inputMode="numeric"
            placeholder="0"
            type="text"
            value={totalValue ? Number(totalValue).toLocaleString("en-US") : ""}
            onChange={(event) => {
              const raw = event.target.value.replace(/,/g, "").replace(/[^\d]/g, "");
              form.setValue("total", raw === "" ? 0 : Number(raw), { shouldValidate: true });
            }}
            onKeyDown={handleNumericKeyDown}
            className="h-14 w-full rounded-lg border-2 border-note-yellow bg-white px-4 py-3 text-center text-2xl font-semibold text-ink-black outline-none transition-colors placeholder:text-pencil-gray focus:border-amber-500 focus:ring-2 focus:ring-note-yellow/30 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-pencil-gray">
            vnd
          </span>
        </div>
        {form.formState.errors.total && (
          <p className="text-center text-xs text-red-500">{form.formState.errors.total.message}</p>
        )}
      </div>

      {/* Child Wallet */}
      <div className="space-y-1.5">
        <label className="block text-left text-xs font-medium text-pencil-gray">
          Child Wallet
        </label>
        <select
          data-testid="qd-wallet"
          disabled={isSubmitting || isWalletsLoading || childWallets.length === 0}
          value={form.watch("walletId") ?? ""}
          onChange={(event) => form.setValue("walletId", event.target.value, { shouldValidate: true })}
          className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-ink-black outline-none transition-colors focus:border-note-yellow focus:ring-2 focus:ring-note-yellow/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">{isWalletsLoading ? "Loading..." : childWallets.length === 0 ? "No child wallets" : "Select wallet"}</option>
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

      {/* Partner (Required) */}
      <div className="space-y-1.5">
        <label className="block text-left text-xs font-medium text-pencil-gray">
          Partner
        </label>
        <select
          data-testid="qd-partner"
          disabled={isSubmitting || isPartnersLoading}
          value={form.watch("partnerId") ?? ""}
          onChange={(event) => form.setValue("partnerId", event.target.value, { shouldValidate: true })}
          className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-ink-black outline-none transition-colors focus:border-note-yellow focus:ring-2 focus:ring-note-yellow/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">{isPartnersLoading ? "Loading..." : "Select partner"}</option>
          {partners.map((partner) => (
            <option key={partner.id} value={partner.id}>
              {partner.name} ({formatVnd(partner.balance)})
            </option>
          ))}
        </select>
        {form.formState.errors.partnerId && (
          <p className="text-xs text-red-500">{form.formState.errors.partnerId.message}</p>
        )}
      </div>

      {/* Payer Mode (Always visible) */}
      <div className="space-y-1.5">
        <label className="block text-left text-xs font-medium text-pencil-gray">
          Who Paid?
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => form.setValue("payerMode", PayerMode.ToiTra)}
            className={`h-10 flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              payerMode === PayerMode.ToiTra
                ? "bg-note-yellow text-ink-black hover:bg-amber-400"
                : "border border-gray-200 bg-white text-pencil-gray hover:bg-gray-50"
            }`}
          >
            I Pay
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => form.setValue("payerMode", PayerMode.PartnerTra)}
            className={`h-10 flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              payerMode === PayerMode.PartnerTra
                ? "bg-note-yellow text-ink-black hover:bg-amber-400"
                : "border border-gray-200 bg-white text-pencil-gray hover:bg-gray-50"
            }`}
          >
            Partner Pays
          </button>
        </div>
      </div>

      {/* Debt Amount (optional, default 0) */}
      <div className="space-y-1.5">
        <label className="block text-left text-xs font-medium text-pencil-gray">
          Debt Amount
        </label>
        <div className="relative">
          <input
            data-testid="qd-debt-amount"
            disabled={isSubmitting}
            inputMode="numeric"
            placeholder="0"
            type="text"
            value={debtAmountValue ? debtAmountValue.toLocaleString("en-US") : ""}
            onChange={(event) => {
              const raw = event.target.value.replace(/,/g, "").replace(/[^\d]/g, "");
              form.setValue("debtAmount", raw === "" ? 0 : Number(raw), { shouldValidate: true });
            }}
            onKeyDown={handleNumericKeyDown}
            className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pr-10 text-sm text-ink-black outline-none transition-colors placeholder:text-pencil-gray focus:border-note-yellow focus:ring-2 focus:ring-note-yellow/30 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-pencil-gray">
            vnd
          </span>
        </div>
        {form.formState.errors.debtAmount && (
          <p className="text-xs text-red-500">{form.formState.errors.debtAmount.message}</p>
        )}
      </div>

      {/* Note */}
      <div className="space-y-1.5">
        <label className="block text-left text-xs font-medium text-pencil-gray">
          Note
        </label>
        <input
          disabled={isSubmitting}
          placeholder="e.g. Lunch"
          value={form.watch("note") ?? ""}
          onChange={(event) => form.setValue("note", event.target.value, { shouldValidate: true })}
          className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-ink-black outline-none transition-colors placeholder:text-pencil-gray focus:border-note-yellow focus:ring-2 focus:ring-note-yellow/30 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {form.formState.errors.note && (
          <p className="text-xs text-red-500">{form.formState.errors.note.message}</p>
        )}
      </div>

      {/* Notification */}
      {notificationMessage ? (
        <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
          {notificationMessage}
        </div>
      ) : null}

      {/* Submit Button */}
      <button
        data-testid="qd-submit"
        disabled={isSubmitting || isWalletsLoading || childWallets.length === 0}
        type="submit"
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-note-yellow px-6 py-3 text-sm font-semibold text-ink-black transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Zap className="h-4 w-4" />
            Submit
          </>
        )}
      </button>
    </form>
  );
}

export default QuickDebtForm;
