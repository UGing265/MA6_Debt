"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Zap, Tag } from "lucide-react";
import { toast } from "sonner";
import { parseErrorResponse } from "@/features/auth/utils/errorParser";
import { useWallets } from "@/features/wallet/hooks/useWallets";
import { useDebtPartners } from "@/features/debt/hooks/useDebtPartners";
import { useQuickDeductSubmit } from "../hooks/useTransactionSubmit";
import {
  QuickDebtSchema,
  mapQuickDebtToPayload,
  mapQuickDebtToPayloadOff,
} from "../model";
import { PayerMode } from "../types/transaction";
import { formatVnd } from "@/lib/utils";

const quickDebtFormSchema = z
  .object({
    walletId: z.string().min(1, "Please select a wallet"),
    total: z.preprocess(
      (value) => (value === "" || value == null ? undefined : Number(value)),
      z.number({ invalid_type_error: "Please enter amount" }).positive("Amount must be greater than 0")
    ),
    debtTag: z.boolean().default(false),
    payerMode: z.nativeEnum(PayerMode).optional(),
    partnerId: z.string().optional(),
    debtAmount: z.preprocess(
      (value) => (value === "" || value == null ? undefined : Number(value)),
      z.number().positive("Debt amount must be greater than 0").optional()
    ),
    note: z.string().trim().max(300, "Note max 300 characters").optional(),
  })
  .superRefine((data, ctx) => {
    const modelValidation = QuickDebtSchema.safeParse(data);
    if (!modelValidation.success) {
      modelValidation.error.issues.forEach((issue) => {
        ctx.addIssue(issue);
      });
    }

    if (data.debtTag && data.payerMode === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select payer",
        path: ["payerMode"],
      });
    }
  });

type QuickDebtFormValues = z.infer<typeof quickDebtFormSchema>;

const initialValues: Partial<QuickDebtFormValues> = {
  walletId: "",
  debtTag: false,
  payerMode: PayerMode.ToiTra,
  note: "",
};

type GroupedWallets = {
  parent: { id: string; name: string; balance: number } | null;
  children: { id: string; name: string; balance: number; parentWalletId: string }[];
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

  const form = useForm<QuickDebtFormValues>({
    resolver: zodResolver(quickDebtFormSchema),
    defaultValues: initialValues,
  });

  const debtTag = form.watch("debtTag") ?? false;
  const totalValue = form.watch("total");

  useEffect(() => {
    if (!debtTag) {
      form.setValue("payerMode", PayerMode.ToiTra, { shouldValidate: true });
      form.setValue("partnerId", undefined, { shouldValidate: true });
      form.setValue("debtAmount", undefined, { shouldValidate: true });
    }
  }, [debtTag, form]);

  const onSubmit = async (values: QuickDebtFormValues) => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setNotificationMessage(null);

    try {
      const input = {
        walletId: values.walletId,
        total: values.total,
        debtTag: values.debtTag,
        payerMode: values.debtTag ? values.payerMode : undefined,
        partnerId: values.debtTag ? values.partnerId : undefined,
        debtAmount: values.debtTag ? values.debtAmount : undefined,
      };

      const mappedPayload = values.debtTag
        ? mapQuickDebtToPayload(input)
        : mapQuickDeductToPayloadOff(input);

      const response = await quickDeductSubmit.mutateAsync({
        ...mappedPayload,
        note: values.note?.trim() || undefined,
      });

      toast.success("Transaction recorded");
      setNotificationMessage(response.notification?.message ?? null);
      form.reset(initialValues);
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
            value={totalValue !== undefined ? totalValue.toLocaleString("en-US") : ""}
            onChange={(event) => {
              const raw = event.target.value.replace(/,/g, "").replace(/[^\d]/g, "");
              form.setValue("total", raw === "" ? undefined : Number(raw), { shouldValidate: true });
            }}
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

      <div className="flex gap-2">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => form.setValue("payerMode", PayerMode.ToiTra, { shouldValidate: true })}
          className={`h-9 flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            form.watch("payerMode") === PayerMode.ToiTra
              ? "bg-note-yellow text-ink-black hover:bg-amber-400"
              : "border border-gray-200 bg-white text-pencil-gray hover:bg-gray-50"
          }`}
        >
          I Pay
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => form.setValue("payerMode", PayerMode.PartnerTra, { shouldValidate: true })}
          className={`h-9 flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            form.watch("payerMode") === PayerMode.PartnerTra
              ? "bg-note-yellow text-ink-black hover:bg-amber-400"
              : "border border-gray-200 bg-white text-pencil-gray hover:bg-gray-50"
          }`}
        >
          Partner Pays
        </button>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-pencil-gray" />
          <span className="text-xs text-pencil-gray">Tag as debt</span>
        </div>
        <button
          type="button"
          data-testid="qd-debt-toggle"
          role="switch"
          aria-checked={debtTag}
          disabled={isSubmitting}
          onClick={() => form.setValue("debtTag", !debtTag, { shouldValidate: true })}
          className={`relative h-5 w-9 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            debtTag ? "bg-note-yellow" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
              debtTag ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {debtTag ? (
        <div className="space-y-3 rounded-lg border border-note-yellow/30 bg-gray-50 p-3">
          <div className="space-y-1.5">
            <label className="block text-left text-xs font-medium text-pencil-gray">
              Debt Partner
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
                value={form.watch("debtAmount") !== undefined ? form.watch("debtAmount")?.toLocaleString("en-US") : ""}
                onChange={(event) => {
                  const raw = event.target.value.replace(/,/g, "").replace(/[^\d]/g, "");
                  form.setValue("debtAmount", raw === "" ? undefined : Number(raw), { shouldValidate: true });
                }}
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
        </div>
      ) : null}

      {notificationMessage ? (
        <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
          {notificationMessage}
        </div>
      ) : null}

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
