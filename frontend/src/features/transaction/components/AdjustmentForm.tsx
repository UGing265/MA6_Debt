"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { parseErrorResponse } from "@/features/auth/utils/errorParser";
import { useWallets } from "@/features/wallet/hooks/useWallets";
import { useCashAdjustmentSubmit } from "../hooks/useTransactionSubmit";
import { AdjustmentSchema, mapAdjustmentToPayload } from "../model";
import { AdjustmentDirection } from "../types/transaction";
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

type AdjustmentFormInput = z.infer<typeof AdjustmentSchema>;

const defaultValues: AdjustmentFormInput = {
  walletId: "",
  direction: AdjustmentDirection.Credit,
  amount: Number.NaN,
  note: "",
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

  const form = useForm<AdjustmentFormInput>({
    resolver: zodResolver(AdjustmentSchema),
    defaultValues,
  });

  const onSubmit = async (values: AdjustmentFormInput) => {
    setIsSubmitting(true);
    try {
      const payload = mapAdjustmentToPayload(values);
      await cashAdjustmentSubmit.mutateAsync(payload);
      toast.success("Adjustment submitted successfully!");
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="walletId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Child Wallet</FormLabel>
              <FormControl>
                <select
                  data-testid="adj-wallet"
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting || walletsLoading || childWallets.length === 0}
                  className="w-full h-10 rounded-md border border-[#1F2937]/10 bg-white px-3 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCD34D]"
                >
                  <option value="">
                    {walletsLoading
                      ? "Loading child wallets..."
                      : childWallets.length === 0
                      ? "No child wallets available"
                      : "Select child wallet"}
                  </option>
                  {childWallets.map((wallet) => (
                    <option key={wallet.id} value={wallet.id}>
                      {wallet.name}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="direction"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Direction</FormLabel>
              <FormControl>
                <select
                  data-testid="adj-direction"
                  value={String(field.value)}
                  onChange={(event) =>
                    field.onChange(Number(event.target.value) as AdjustmentDirection)
                  }
                  disabled={isSubmitting}
                  className="w-full h-10 rounded-md border border-[#1F2937]/10 bg-white px-3 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCD34D]"
                >
                  <option value={AdjustmentDirection.Credit}>Credit</option>
                  <option value={AdjustmentDirection.Debit}>Debit</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Amount</FormLabel>
              <FormControl>
                <Input
                  data-testid="adj-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Enter amount"
                  value={Number.isNaN(field.value) ? "" : field.value}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    field.onChange(nextValue === "" ? Number.NaN : Number(nextValue));
                  }}
                  disabled={isSubmitting}
                  className="bg-white border-[#1F2937]/10 focus:border-[#FCD34D] focus:ring-[#FCD34D]"
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
              <FormLabel className="text-gray-700">Note</FormLabel>
              <FormControl>
                <Input
                  data-testid="adj-note"
                  placeholder="Reason for this adjustment"
                  {...field}
                  disabled={isSubmitting}
                  className="bg-white border-[#1F2937]/10 focus:border-[#FCD34D] focus:ring-[#FCD34D]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {walletsError ? <p className="text-sm text-red-600">{walletsError}</p> : null}

        <Button
          data-testid="adj-submit"
          type="submit"
          disabled={isSubmitting || walletsLoading || childWallets.length === 0}
          className="w-full bg-[#FCD34D] hover:bg-[#FBBF24] text-[#1F2937] font-bold"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Adjustment"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AdjustmentForm;
