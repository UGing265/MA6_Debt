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

type TransferFormInput = Omit<TransferFormValues, "amount"> & {
  amount?: number;
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

const formatBalance = (balance: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(balance);
};

const getWalletLabel = (wallet: WalletDto, includeBalance = false): string => {
  if (includeBalance) {
    return `${wallet.name} (${formatBalance(wallet.balance)})`;
  }
  return wallet.name;
};

export const TransferForm: React.FC = () => {
  const [wallets, setWallets] = useState<WalletDto[]>([]);
  const [isWalletsLoading, setIsWalletsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const isDisabled = isWalletsLoading || isSubmitting;

  const form = useForm<TransferFormInput>({
    resolver: zodResolver(TransferFormSchema),
    defaultValues: {
      fromWalletId: "",
      toWalletId: "",
      amount: undefined,
      sourceBalance: 0,
      note: "",
    },
  });

  const fromWalletId = form.watch("fromWalletId");
  const toWalletId = form.watch("toWalletId");

  const fromWallet = useMemo(() => {
    return wallets.find((w) => w.id === fromWalletId);
  }, [fromWalletId, wallets]);

  // Group wallets by parent
  const groupedWallets = useMemo((): GroupedWallets[] => {
    const parentWallets = wallets.filter((w) => !w.parentWalletId);
    const childWallets = wallets.filter((w) => w.parentWalletId);

    const groups: GroupedWallets[] = [];

    // Add parent wallets with their children
    for (const parent of parentWallets) {
      const children = childWallets.filter((c) => c.parentWalletId === parent.id);
      groups.push({ parent, children });
    }

    // Add orphan children (if any)
    const orphans = childWallets.filter(
      (c) => !parentWallets.some((p) => p.id === c.parentWalletId)
    );
    if (orphans.length > 0) {
      groups.push({ parent: null, children: orphans });
    }

    return groups;
  }, [wallets]);

  // Calculate total balance
  const totalBalance = useMemo(() => {
    return wallets.reduce((sum, w) => sum + w.balance, 0);
  }, [wallets]);

  useEffect(() => {
    let isMounted = true;

    const loadWallets = async () => {
      setIsWalletsLoading(true);
      try {
        const data = await getTransferWallets();
        if (!isMounted) return;
        setWallets(data);
      } catch (error: any) {
        const general =
          error && typeof error === "object" && typeof error.general === "string"
            ? error.general
            : parseErrorResponse(error).general;
        toast.error(general);
      } finally {
        if (isMounted) {
          setIsWalletsLoading(false);
        }
      }
    };

    loadWallets();

    return () => {
      isMounted = false;
    };
  }, []);

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
    async (values: TransferFormInput) => {
      setIsSubmitting(true);
      try {
        await createTransfer({
          fromWalletId: values.fromWalletId,
          toWalletId: values.toWalletId,
          amount: values.amount!,
        });

        toast.success("Chuyển tiền thành công");
        form.reset({
          fromWalletId: "",
          toWalletId: "",
          amount: undefined,
          sourceBalance: 0,
          note: "",
        });
      } catch (error: any) {
        applyServerErrors(error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [applyServerErrors, form]
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
              Số dư ví
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
                  <p className="text-xs text-pencil-gray mb-1">Tổng số dư</p>
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
                          {formatBalance(group.parent.balance)}
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
                  <p className="text-center text-pencil-gray py-4">Không có ví nào</p>
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
            <h3 className="font-semibold text-ink-black">Chuyển tiền nội bộ</h3>
            <p className="text-xs text-pencil-gray mt-1">Chuyển giữa các ví con của bạn</p>
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
                        <FormLabel className="text-gray-700 font-medium">Từ ví</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            data-testid="transfer-from-wallet"
                            disabled={isDisabled}
                            className={walletSelectClassName}
                          >
                            <option value="">Chọn ví nguồn</option>
                            {groupedWallets.map((group, idx) => (
                              <optgroup
                                key={group.parent?.id ?? `orphan-${idx}`}
                                label={group.parent?.name ?? "Ví khác"}
                              >
                                {group.parent && (
                                  <option value={group.parent.id}>
                                    {getWalletLabel(group.parent, true)}
                                  </option>
                                )}
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
                      title="Đổi ví"
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
                        <FormLabel className="text-gray-700 font-medium">Đến ví</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            data-testid="transfer-to-wallet"
                            disabled={isDisabled}
                            className={walletSelectClassName}
                          >
                            <option value="">Chọn ví đích</option>
                            {groupedWallets.map((group, idx) => (
                              <optgroup
                                key={group.parent?.id ?? `orphan-${idx}`}
                                label={group.parent?.name ?? "Ví khác"}
                              >
                                {group.parent && (
                                  <option value={group.parent.id}>
                                    {getWalletLabel(group.parent, true)}
                                  </option>
                                )}
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
                    <span className="text-sm text-pencil-gray">Số dư khả dụng</span>
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
                      <FormLabel className="text-gray-700 font-medium">Số tiền</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="decimal"
                          placeholder="Nhập số tiền"
                          data-testid="transfer-amount"
                          disabled={isDisabled || !fromWalletId}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const next = e.target.value;
                            field.onChange(next === "" ? undefined : Number(next));
                          }}
                          className="h-10"
                        />
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
                        Ghi chú{" "}
                        <span className="text-pencil-gray font-normal">(tuỳ chọn)</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="VD: Chuyển tiết kiệm"
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
                      Đang chuyển...
                    </>
                  ) : (
                    "Chuyển tiền"
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
