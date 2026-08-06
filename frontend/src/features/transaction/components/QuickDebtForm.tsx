"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { parseErrorResponse } from "@/features/auth/utils/errorParser";
import { useWallets } from "@/features/wallet/hooks/useWallets";
import { useDebtPartners } from "@/features/debt/hooks/useDebtPartners";
import { useQuickDeductSubmit } from "../hooks/useTransactionSubmit";
import { mapQuickDebtToPayload } from "../model";
import { PayerMode } from "../types/transaction";
import type { Wallet } from "@/features/wallet/types/wallet";
import {
  AmountInput,
  WalletSelect,
  PartnerSelect,
  PayerModeToggle,
  DebtAmountInput,
  NoteInput,
  FormSubmitButton,
} from "./QuickDebt";
import { useLanguage } from "@/context/LanguageContext";

const buildQuickDebtFormSchema = (messages: {
  wallet: string;
  amount: string;
  partner: string;
  debtAmount: string;
  note: string;
}) =>
  z.object({
    walletId: z.string().min(1, messages.wallet),
    total: z.number().positive(messages.amount),
    payerMode: z.nativeEnum(PayerMode),
    partnerId: z.string().min(1, messages.partner),
    debtAmount: z.number().min(0, messages.debtAmount),
    note: z.string().trim().max(300, messages.note).optional(),
  });

type QuickDebtFormValues = z.infer<ReturnType<typeof buildQuickDebtFormSchema>>;

type GroupedWallets = {
  parent: Wallet | null;
  children: Wallet[];
};

export function QuickDebtForm() {
  const { t } = useLanguage();
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

  const quickDebtFormSchema = buildQuickDebtFormSchema({
    wallet: t.quickDeduct.page.selectWallet,
    amount: t.quickDeduct.page.amountPositive,
    partner: t.quickDeduct.page.selectPartner,
    debtAmount: t.quickDeduct.page.debtAmountNonNegative,
    note: t.quickDeduct.page.noteMax,
  });

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

    if (defaultPartnerId) {
      const partnerExists = partners.some((p) => p.id === defaultPartnerId);
      if (partnerExists) {
        form.setValue("partnerId", defaultPartnerId);
      }
    }

    if (defaultWalletId) {
      const walletExists = childWallets.some((w) => w.id === defaultWalletId);
      if (walletExists) {
        form.setValue("walletId", defaultWalletId);
      }
    }
  }, [form, childWallets, partners]);

  const onSubmit = async (values: QuickDebtFormValues) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setNotificationMessage(null);

    try {
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

      toast.success(t.toast.transactionRecorded);
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
        toast.error(parsedError.general || t.toast.failedToRecordTransaction);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = isSubmitting || isWalletsLoading || childWallets.length === 0;

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <AmountInput
        value={totalValue}
        onChange={(value) => form.setValue("total", value, { shouldValidate: true })}
        disabled={isSubmitting}
        error={form.formState.errors.total?.message}
      />

      <WalletSelect
        value={form.watch("walletId") ?? ""}
        onChange={(value) => form.setValue("walletId", value, { shouldValidate: true })}
        groupedWallets={groupedWallets}
        isLoading={isWalletsLoading}
        hasWallets={childWallets.length > 0}
        disabled={isSubmitting}
        error={form.formState.errors.walletId?.message}
      />

      <PartnerSelect
        value={form.watch("partnerId") ?? ""}
        onChange={(value) => form.setValue("partnerId", value, { shouldValidate: true })}
        partners={partners}
        isLoading={isPartnersLoading}
        disabled={isSubmitting}
        error={form.formState.errors.partnerId?.message}
      />

      <PayerModeToggle
        value={payerMode}
        onChange={(mode) => form.setValue("payerMode", mode)}
        disabled={isSubmitting}
      />

      <DebtAmountInput
        value={debtAmountValue}
        onChange={(value) => form.setValue("debtAmount", value, { shouldValidate: true })}
        disabled={isSubmitting}
        error={form.formState.errors.debtAmount?.message}
      />

      <NoteInput
        value={form.watch("note") ?? ""}
        onChange={(value) => form.setValue("note", value, { shouldValidate: true })}
        disabled={isSubmitting}
        error={form.formState.errors.note?.message}
      />

      {notificationMessage ? (
        <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
          {notificationMessage}
        </div>
      ) : null}

      <FormSubmitButton isSubmitting={isSubmitting} disabled={isDisabled} />
    </form>
  );
}

export default QuickDebtForm;
