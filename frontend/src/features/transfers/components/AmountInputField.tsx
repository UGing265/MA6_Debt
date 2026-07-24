import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";
import type { TransferFormValues } from "../types/transferForm";
import { handleNumericKeyDown } from "@/lib/utils/numericInput";
import { cn } from "@/lib/utils";

interface AmountInputFieldProps {
  form: UseFormReturn<TransferFormValues>;
  disabled: boolean;
  fromWalletId: string;
}

export const AmountInputField: React.FC<AmountInputFieldProps> = ({ form, disabled, fromWalletId }) => {
  return (
    <FormField
      control={form.control}
      name="amount"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="block text-center text-sm font-bold text-ink-black">Amount</FormLabel>
          <FormControl>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                data-testid="transfer-amount"
                disabled={disabled || !fromWalletId}
                value={
                  field.value != null && !Number.isNaN(field.value)
                    ? field.value.toLocaleString("en-US")
                    : ""
                }
                onChange={(e) => {
                  const raw = e.target.value.replace(/,/g, "").replace(/[^\d]/g, "");
                  field.onChange(raw === "" ? undefined : Number(raw));
                }}
                onKeyDown={handleNumericKeyDown}
                className={cn(
                  "h-14 w-full rounded-xl border-2 border-note-yellow bg-white px-4 py-3 text-center text-2xl font-bold text-ink-black outline-none transition-all placeholder:text-pencil-gray/60 focus:border-amber-400 focus:ring-2 focus:ring-note-yellow/30 shadow-xs disabled:cursor-not-allowed disabled:opacity-50"
                )}
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-pencil-gray/80">
                VND
              </span>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
