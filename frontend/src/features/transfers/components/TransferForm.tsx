"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeftRight, Loader2, Wallet2, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { createTransfer, getTransferWallets } from "../api/transfers";
import type { WalletDto } from "../types/transfer";
import {
  TransferFormFieldMap,
  TransferFormSchema,
  type TransferFormValues,
} from "../types/transferForm";
import { parseErrorResponse } from "@/features/auth/utils/errorParser";

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

// Format balance with commas and VND suffix: 1,111,111 VND
const formatBalance = (balance: number): string => {
  return `${balance.toLocaleString("en-US")} VND`;
};

const getWalletLabel = (wallet: WalletDto, includeBalance = false): string => {
  if (includeBalance) {
    return `${wallet.name} (${formatBalance(wallet.balance)})`;
  }
  return wallet.name;
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

export const TransferForm: React.FC = () => {
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
    // Parent wallets: no parentWalletId
    const parentWallets = wallets.filter((w) => !w.parentWalletId);

    const groups: GroupedWallets[] = [];

    // Add parent wallets with their DIRECT children only
    for (const parent of parentWallets) {
      // Only direct children: parentWalletId === parent.id
      const directChildren = wallets.filter((w) => w.parentWalletId === parent.id);
      groups.push({ parent, children: directChildren });
    }

    // Note: We don't show orphan/grandchild wallets anymore
    // Grandchild wallets (child of a child) are not displayed to avoid confusion

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

        toast.success("Transfer successful");
        form.reset({
          fromWalletId: "",
          toWalletId: "",
          amount: Number.NaN,
          sourceBalance: 0,
          note: "",
        });
        // Refresh wallet list to show updated balances
        await loadWallets();
      } catch (error: any) {
        applyServerErrors(error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [applyServerErrors, form, loadWallets]
  );

  const walletSelectClassName =
    "border-input h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm transition-all outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-note-yellow focus-visible:ring-2 focus-visible:ring-note-yellow/30";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Panel - Wallet Balances */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl border border-note-yellow/20 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-note-yellow/10 to-note-yellow/5 px-4 py-3 border-b border-note-yellow/20">
            <h3 className="font-semibold text-ink-black flex items-center gap-2">
              <Wallet2 className="h-4 w-4 text-note-yellow" />
              Wallet Balances
            </h3>
          </div>

          <div className="p-4">
            {isWalletsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-note-yellow" />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Total Balance */}
                <div className="bg-gradient-to-r from-note-yellow/20 to-note-yellow/5 rounded-lg p-3 mb-4">
                  <p className="text-xs text-pencil-gray mb-1">Total Balance</p>
                  <p className="text-xl font-bold text-ink-black">
                    {formatBalance(totalBalance)}
                  </p>
                </div>

                {/* Grouped Wallets */}
                {groupedWallets.map((group, idx) => (
                  <div key={group.parent?.id ?? `orphan-${idx}`} className="space-y-2">
                    {group.parent && (
                      <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <ChevronRight className="h-3 w-3 text-pencil-gray" />
                          <span className="font-medium text-ink-black text-sm">
                            {group.parent.name}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-ink-black">
                          {formatBalance(getParentTotalBalance(group.parent, group.children))}
                        </span>
                      </div>
                    )}

                    {group.children.length > 0 && (
                      <div className="ml-4 space-y-1">
                        {group.children.map((child) => (
                          <div
                            key={child.id}
                            className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
                              fromWalletId === child.id || toWalletId === child.id
                                ? "bg-note-yellow/20 border border-note-yellow/30"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <span className="text-sm text-pencil-gray">{child.name}</span>
                            <span className="text-sm font-medium text-ink-black">
                              {formatBalance(child.balance)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {wallets.length === 0 && (
                  <p className="text-center text-pencil-gray py-4">No wallets available</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Transfer Form */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl border border-note-yellow/20 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-note-yellow/10 to-note-yellow/5 px-4 py-3 border-b border-note-yellow/20">
            <h3 className="font-semibold text-ink-black">Internal Transfer</h3>
            <p className="text-xs text-pencil-gray mt-1">Transfer between your wallets</p>
          </div>

          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
                  {/* From Wallet */}
                  <FormField
                    control={form.control}
                    name="fromWalletId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">From Wallet</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            data-testid="transfer-from-wallet"
                            disabled={isDisabled}
                            className={walletSelectClassName}
                          >
                            <option value="">Select source wallet</option>
                            {groupedWallets.map((group, idx) => (
                              <optgroup
                                key={group.parent?.id ?? `orphan-${idx}`}
                                label={group.parent?.name ?? "Other Wallets"}
                              >
                                {/* Only children are selectable, parent is just optgroup label */}
                                {group.children.map((child) => (
                                  <option key={child.id} value={child.id}>
                                    {getWalletLabel(child, true)}
                                  </option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Swap Button */}
                  <div className="flex justify-center md:pb-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSwap}
                      disabled={isDisabled || (!fromWalletId && !toWalletId)}
                      data-testid="transfer-swap"
                      className="h-10 w-10 p-0 rounded-full border-note-yellow/30 hover:bg-note-yellow/20 hover:border-note-yellow"
                      aria-label="Swap wallets"
                      title="Swap wallets"
                    >
                      <ArrowLeftRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* To Wallet */}
                  <FormField
                    control={form.control}
                    name="toWalletId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">To Wallet</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            data-testid="transfer-to-wallet"
                            disabled={isDisabled}
                            className={walletSelectClassName}
                          >
                            <option value="">Select destination wallet</option>
                            {groupedWallets.map((group, idx) => (
                              <optgroup
                                key={group.parent?.id ?? `orphan-${idx}`}
                                label={group.parent?.name ?? "Other Wallets"}
                              >
                                {/* Only children are selectable, parent is just optgroup label */}
                                {group.children.map((child) => (
                                  <option key={child.id} value={child.id}>
                                    {getWalletLabel(child, true)}
                                  </option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Selected Wallet Balance Info */}
                {fromWallet && (
                  <div className="bg-gradient-to-r from-note-yellow/10 to-transparent rounded-lg p-3 flex items-center justify-between">
                    <span className="text-sm text-pencil-gray">Available Balance</span>
                    <span className="font-semibold text-ink-black">
                      {formatBalance(fromWallet.balance)}
                    </span>
                  </div>
                )}

                {/* Amount */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Amount</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text"
                            inputMode="numeric"
                            placeholder="0"
                            data-testid="transfer-amount"
                            disabled={isDisabled || !fromWalletId}
                            value={field.value != null && !Number.isNaN(field.value) ? field.value.toLocaleString("en-US") : ""}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/,/g, "").replace(/[^\d]/g, "");
                              field.onChange(raw === "" ? undefined : Number(raw));
                            }}
                            onKeyDown={handleNumericKeyDown}
                            className="h-10 pr-16 text-right"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-pencil-gray">
                            VND
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Note */}
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Note{" "}
                        <span className="text-pencil-gray font-normal">(Optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Add a note for this transfer..."
                          data-testid="transfer-note"
                          disabled={isDisabled}
                          className="h-10"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  data-testid="transfer-submit"
                  disabled={isDisabled}
                  className="w-full h-11 bg-gradient-to-r from-note-yellow to-amber-400 hover:from-amber-400 hover:to-note-yellow text-ink-black font-bold text-base rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Transferring...
                    </>
                  ) : (
                    "Transfer"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferForm;
