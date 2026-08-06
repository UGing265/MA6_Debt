"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";

import { createTransfer, getTransferWallets } from "../api/transfers";
import type { WalletDto } from "../types/transfer";
import {
  TransferFormFieldMap,
  TransferFormSchema,
  type TransferFormValues,
} from "../types/transferForm";
import { parseErrorResponse } from "@/features/auth/utils/errorParser";
import { WalletBalancePanel } from "./WalletBalancePanel";
import { WalletSelectField } from "./WalletSelectField";
import { AmountInputField } from "./AmountInputField";
import { NoteInputField } from "./NoteInputField";
import { TransferSubmitButton } from "./TransferFormActions";
import { SelectedWalletBalance } from "./SelectedWalletBalance";
import { useLanguage } from "@/context/LanguageContext";

type ParsedLikeError = {
  general?: string;
  fields?: Record<string, string[]>;
};

type GroupedWallets = {
  parent: WalletDto | null;
  children: WalletDto[];
};

const isParsedLikeError = (value: unknown): value is ParsedLikeError => {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;

  if ("general" in v && v.general !== undefined && typeof v.general !== "string") {
    return false;
  }

  if ("fields" in v && v.fields !== undefined) {
    if (typeof v.fields !== "object" || v.fields === null) return false;
    const fields = v.fields as Record<string, unknown>;
    for (const [, messages] of Object.entries(fields)) {
      if (!Array.isArray(messages)) return false;
      if (!messages.every((m) => typeof m === "string")) return false;
    }
  }

  return "general" in v || "fields" in v;
};

export const TransferForm: React.FC = () => {
  const { t } = useLanguage();
  const [wallets, setWallets] = useState<WalletDto[]>([]);
  const [isWalletsLoading, setIsWalletsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const isDisabled = isWalletsLoading || isSubmitting;

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(TransferFormSchema),
    defaultValues: {
      fromWalletId: "",
      toWalletId: "",
      amount: Number.NaN,
      sourceBalance: 0,
      note: "",
    },
  });

  const fromWalletId = form.watch("fromWalletId");
  const toWalletId = form.watch("toWalletId");

  const fromWallet = useMemo(() => {
    return wallets.find((w) => w.id === fromWalletId);
  }, [fromWalletId, wallets]);

  // Group wallets by parent - only direct children, no grandchild
  const groupedWallets = useMemo((): GroupedWallets[] => {
    const parentWallets = wallets.filter((w) => !w.parentWalletId);
    const groups: GroupedWallets[] = [];

    for (const parent of parentWallets) {
      const directChildren = wallets.filter((w) => w.parentWalletId === parent.id);
      groups.push({ parent, children: directChildren });
    }

    return groups;
  }, [wallets]);

  // Calculate total balance
  const totalBalance = useMemo(() => {
    return wallets.reduce((sum, w) => sum + w.balance, 0);
  }, [wallets]);

  // Calculate parent wallet total (parent balance + sum of children balances)
  const getParentTotalBalance = useCallback((parent: WalletDto, children: WalletDto[]): number => {
    const childrenSum = children.reduce((sum, child) => sum + child.balance, 0);
    return parent.balance + childrenSum;
  }, []);

  // Load wallets function - reusable for refresh after transfer
  const loadWallets = useCallback(async () => {
    setIsWalletsLoading(true);
    try {
      const data = await getTransferWallets();
      setWallets(data);
    } catch (error: any) {
      const general =
        error && typeof error === "object" && typeof error.general === "string"
          ? error.general
          : parseErrorResponse(error).general;
      toast.error(general);
    } finally {
      setIsWalletsLoading(false);
    }
  }, []);

  // Initial load on mount
  useEffect(() => {
    loadWallets();
  }, [loadWallets]);

  useEffect(() => {
    form.setValue("sourceBalance", fromWallet?.balance ?? 0, {
      shouldValidate: true,
    });
  }, [fromWallet?.balance, form]);

  const handleSwap = useCallback(() => {
    const currentFrom = form.getValues("fromWalletId");
    const currentTo = form.getValues("toWalletId");

    form.setValue("fromWalletId", currentTo, { shouldValidate: true });
    form.setValue("toWalletId", currentFrom, { shouldValidate: true });
  }, [form]);

  const applyServerErrors = useCallback(
    (error: any) => {
      const parsed: ParsedLikeError = isParsedLikeError(error)
        ? error
        : parseErrorResponse(error);

      if (parsed.general) {
        toast.error(parsed.general);
      }

      if (parsed.fields) {
        Object.entries(parsed.fields).forEach(([rawKey, messages]) => {
          const key = rawKey.includes(".") ? rawKey.split(".").pop() ?? rawKey : rawKey;
          const fieldName = TransferFormFieldMap[key];
          if (!fieldName || messages.length === 0) return;
          form.setError(fieldName, { type: "server", message: messages[0] });
        });
      }
    },
    [form]
  );

  const onSubmit = useCallback(
    async (values: TransferFormValues) => {
      setIsSubmitting(true);
      try {
        await createTransfer({
          fromWalletId: values.fromWalletId,
          toWalletId: values.toWalletId,
          amount: values.amount,
          note: values.note || null,
        });

        toast.success(t.toast.transferSuccessful);
        form.reset({
          fromWalletId: "",
          toWalletId: "",
          amount: Number.NaN,
          sourceBalance: 0,
          note: "",
        });
        await loadWallets();
      } catch (error: any) {
        applyServerErrors(error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [applyServerErrors, form, loadWallets]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Panel - Wallet Balances */}
      <WalletBalancePanel
        groupedWallets={groupedWallets}
        totalBalance={totalBalance}
        selectedFromId={fromWalletId}
        selectedToId={toWalletId}
        isLoading={isWalletsLoading}
        getParentTotalBalance={getParentTotalBalance}
      />

      {/* Right Panel - Transfer Form */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl border border-note-yellow/20 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-note-yellow/10 to-note-yellow/5 px-4 py-3 border-b border-note-yellow/20">
            <h3 className="font-semibold text-ink-black">{t.transfer.page.title}</h3>
            <p className="text-xs text-pencil-gray mt-1">{t.transfer.page.description}</p>
          </div>

          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
                  <WalletSelectField
                    form={form}
                    name="fromWalletId"
                    label={t.transfer.page.fromWallet}
                    placeholder={t.transfer.page.sourceWalletPlaceholder}
                    groupedWallets={groupedWallets}
                    disabled={isDisabled}
                    testId="transfer-from-wallet"
                  />

                  <div className="flex justify-center md:pb-2">
                    <button
                      type="button"
                      onClick={handleSwap}
                      disabled={isDisabled || (!fromWalletId && !toWalletId)}
                      data-testid="transfer-swap"
                      className="h-10 w-10 p-0 rounded-full border border-note-yellow/30 hover:bg-note-yellow/20 hover:border-note-yellow flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={t.transfer.page.swapWallets}
                      title={t.transfer.page.swapWallets}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M8 3L4 7l4 4" />
                        <path d="M4 7h16" />
                        <path d="M16 21l4-4-4-4" />
                        <path d="M20 17H4" />
                      </svg>
                    </button>
                  </div>

                  <WalletSelectField
                    form={form}
                    name="toWalletId"
                    label={t.transfer.page.toWallet}
                    placeholder={t.transfer.page.destinationWalletPlaceholder}
                    groupedWallets={groupedWallets}
                    disabled={isDisabled}
                    testId="transfer-to-wallet"
                  />
                </div>

                <SelectedWalletBalance wallet={fromWallet} />

                <AmountInputField form={form} disabled={isDisabled} fromWalletId={fromWalletId} />

                <NoteInputField form={form} disabled={isDisabled} />

                <TransferSubmitButton isSubmitting={isSubmitting} disabled={isDisabled} />
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferForm;
