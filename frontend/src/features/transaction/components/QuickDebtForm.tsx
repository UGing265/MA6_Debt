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

const quickDebtFormSchema = z
  .object({
    walletId: z.string().min(1, "Child wallet is required"),
    total: z.preprocess(
      (value) => (value === "" || value == null ? undefined : Number(value)),
      z.number({ invalid_type_error: "Total is required" }).positive("Total must be greater than 0")
    ),
    debtTag: z.boolean().default(false),
    payerMode: z.nativeEnum(PayerMode).optional(),
    partnerId: z.string().optional(),
    debtAmount: z.preprocess(
      (value) => (value === "" || value == null ? undefined : Number(value)),
      z.number().positive("Debt amount must be greater than 0").optional()
    ),
    note: z.string().trim().max(300, "Note must be at most 300 characters").optional(),
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
        message: "Payer mode is required when debt-tag is ON",
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

  const form = useForm<QuickDebtFormValues>({
    resolver: zodResolver(quickDebtFormSchema),
    defaultValues: initialValues,
  });

  const debtTag = form.watch("debtTag") ?? false;

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
        : mapQuickDebtToPayloadOff(input);

      const response = await quickDeductSubmit.mutateAsync({
        ...mappedPayload,
        note: values.note?.trim() || undefined,
      });

      toast.success("Quick debt submitted successfully");
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
        toast.error(parsedError.general || "Failed to submit quick debt");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <label className="block text-center text-sm font-medium text-[#0B1B3A]">
          Số tiền (- chi / + thu)
        </label>
        <input
          data-testid="qd-total"
          disabled={isSubmitting}
          inputMode="decimal"
          placeholder="0"
          type="number"
          value={form.watch("total") ?? ""}
          onChange={(event) => form.setValue("total", event.target.value === "" ? undefined : Number(event.target.value), { shouldValidate: true })}
          className="h-[72px] w-full rounded-lg border-2 border-[#E68600] bg-[#FBF7EA] px-4 py-3 text-center text-3xl font-semibold text-[#0B1B3A] outline-none transition-colors placeholder:text-[#B8B8B8] focus:border-[#D97900] focus:ring-2 focus:ring-[#E68600]/20 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {form.formState.errors.total && (
          <p className="text-center text-sm text-red-500">{form.formState.errors.total.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-left text-sm font-medium text-[#0B1B3A]">
          Ví con nguồn
        </label>
        <select
          data-testid="qd-wallet"
          disabled={isSubmitting || isWalletsLoading || childWallets.length === 0}
          value={form.watch("walletId") ?? ""}
          onChange={(event) => form.setValue("walletId", event.target.value, { shouldValidate: true })}
          className="h-12 w-full rounded-lg border border-[#E5E0D5] bg-[#FBF7EA] px-4 py-2 text-sm text-[#0B1B3A] outline-none transition-colors focus:border-[#E68600] focus:ring-2 focus:ring-[#E68600]/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">{isWalletsLoading ? "Đang tải..." : childWallets.length === 0 ? "Chưa có ví con" : "Chọn ví con"}</option>
          {childWallets.map((wallet) => (
            <option key={wallet.id} value={wallet.id}>
              {wallet.name}
            </option>
          ))}
        </select>
        {form.formState.errors.walletId && (
          <p className="text-sm text-red-500">{form.formState.errors.walletId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-left text-sm font-medium text-[#0B1B3A]">
          Ghi chú
        </label>
        <input
          disabled={isSubmitting}
          placeholder="VD: Ăn trưa"
          value={form.watch("note") ?? ""}
          onChange={(event) => form.setValue("note", event.target.value, { shouldValidate: true })}
          className="h-12 w-full rounded-lg border border-[#E5E0D5] bg-[#FBF7EA] px-4 py-2 text-sm text-[#0B1B3A] outline-none transition-colors placeholder:text-[#B8B8B8] focus:border-[#E68600] focus:ring-2 focus:ring-[#E68600]/20 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {form.formState.errors.note && (
          <p className="text-sm text-red-500">{form.formState.errors.note.message}</p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => form.setValue("payerMode", PayerMode.ToiTra, { shouldValidate: true })}
          className={`h-10 flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            form.watch("payerMode") === PayerMode.ToiTra
              ? "bg-[#E68600] text-white hover:bg-[#D97900]"
              : "border border-[#E5E0D5] bg-transparent text-[#6B7485] hover:bg-[#F1EEE7]"
          }`}
        >
          Tôi trả
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => form.setValue("payerMode", PayerMode.PartnerTra, { shouldValidate: true })}
          className={`h-10 flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            form.watch("payerMode") === PayerMode.PartnerTra
              ? "bg-[#E68600] text-white hover:bg-[#D97900]"
              : "border border-[#E5E0D5] bg-transparent text-[#6B7485] hover:bg-[#F1EEE7]"
          }`}
        >
          Partner trả
        </button>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-[#F1EEE7] px-4 py-3">
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-[#6B7485]" />
          <span className="text-sm text-[#6B7485]">Gắn thẻ nợ</span>
        </div>
        <button
          type="button"
          data-testid="qd-debt-toggle"
          role="switch"
          aria-checked={debtTag}
          disabled={isSubmitting}
          onClick={() => form.setValue("debtTag", !debtTag, { shouldValidate: true })}
          className={`relative h-6 w-11 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            debtTag ? "bg-[#E68600]" : "bg-[#D1CCC1]"
          }`}
        >
          <span
            className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              debtTag ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {debtTag ? (
        <div className="space-y-4 rounded-lg border border-[#F2C38B] bg-[#FBF7EA]/50 p-4">
          <div className="space-y-2">
            <label className="block text-left text-sm font-medium text-[#0B1B3A]">
              Partner
            </label>
            <select
              data-testid="qd-partner"
              disabled={isSubmitting || isPartnersLoading}
              value={form.watch("partnerId") ?? ""}
              onChange={(event) => form.setValue("partnerId", event.target.value, { shouldValidate: true })}
              className="h-12 w-full rounded-lg border border-[#E5E0D5] bg-white px-4 py-2 text-sm text-[#0B1B3A] outline-none transition-colors focus:border-[#E68600] focus:ring-2 focus:ring-[#E68600]/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Chọn partner</option>
              {partners.map((partner) => (
                <option key={partner.id} value={partner.id}>
                  {partner.name}
                </option>
              ))}
            </select>
            {form.formState.errors.partnerId && (
              <p className="text-sm text-red-500">{form.formState.errors.partnerId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-left text-sm font-medium text-[#0B1B3A]">
              Số tiền nợ
            </label>
            <input
              data-testid="qd-debt-amount"
              disabled={isSubmitting}
              inputMode="decimal"
              placeholder="0"
              type="number"
              value={form.watch("debtAmount") ?? ""}
              onChange={(event) => form.setValue("debtAmount", event.target.value === "" ? undefined : Number(event.target.value), { shouldValidate: true })}
              className="h-12 w-full rounded-lg border border-[#E5E0D5] bg-white px-4 py-2 text-sm text-[#0B1B3A] outline-none transition-colors placeholder:text-[#B8B8B8] focus:border-[#E68600] focus:ring-2 focus:ring-[#E68600]/20 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {form.formState.errors.debtAmount && (
              <p className="text-sm text-red-500">{form.formState.errors.debtAmount.message}</p>
            )}
          </div>
        </div>
      ) : null}

      {notificationMessage ? (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {notificationMessage}
        </div>
      ) : null}

      <button
        data-testid="qd-submit"
        disabled={isSubmitting || isWalletsLoading || childWallets.length === 0}
        type="submit"
        className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#E68600] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#D97900] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Đang xử lý...
          </>
        ) : (
          <>
            <Zap className="h-5 w-5" />
            Ghi nhận
          </>
        )}
      </button>
    </form>
  );
}

export default QuickDebtForm;
