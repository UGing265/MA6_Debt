"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeftRight, Loader2 } from "lucide-react";

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

const getWalletLabel = (wallet: WalletDto) => {
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
    "border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-end">
          <FormField
            control={form.control}
            name="fromWalletId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Từ ví</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    data-testid="transfer-from-wallet"
                    disabled={isDisabled}
                    className={walletSelectClassName}
                  >
                    <option value="">Chọn ví</option>
                    {wallets.map((w) => (
                      <option key={w.id} value={w.id}>
                        {getWalletLabel(w)}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center md:pb-1">
            <Button
              type="button"
              variant="outline"
              onClick={handleSwap}
              disabled={isDisabled || (!fromWalletId && !toWalletId)}
              data-testid="transfer-swap"
              className="h-9 w-9 p-0"
              aria-label="Swap wallets"
              title="Swap"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
          </div>

          <FormField
            control={form.control}
            name="toWalletId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Đến ví</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    data-testid="transfer-to-wallet"
                    disabled={isDisabled}
                    className={walletSelectClassName}
                  >
                    <option value="">Chọn ví</option>
                    {wallets.map((w) => (
                      <option key={w.id} value={w.id}>
                        {getWalletLabel(w)}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Số tiền</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder="0"
                  data-testid="transfer-amount"
                  disabled={isDisabled || !fromWalletId}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const next = e.target.value;
                    field.onChange(next === "" ? undefined : Number(next));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Ghi chú</FormLabel>
              <FormControl>
                <Input
                  placeholder="(Tuỳ chọn)"
                  data-testid="transfer-note"
                  disabled={isDisabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          data-testid="transfer-submit"
          disabled={isDisabled}
          className="w-full bg-[#FCD34D] hover:bg-[#FBBF24] text-[#1F2937] font-bold"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang chuyển...
            </>
          ) : (
            "Chuyển tiền"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default TransferForm;
