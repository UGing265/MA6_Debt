import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { TransferFormValues } from "../types/transferForm";
import { handleNumericKeyDown } from "@/lib/utils/numericInput";

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
          <FormLabel className="text-gray-700 font-medium">Amount</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
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
                className="h-10 pr-16 text-right"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-pencil-gray">VND</span>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
