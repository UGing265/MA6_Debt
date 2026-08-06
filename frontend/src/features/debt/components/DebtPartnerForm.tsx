"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
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
import { HybridBalanceInput } from "./HybridBalanceInput";
import type { DebtPartner } from "../types/debtPartner";
import { parseErrorResponse } from "@/features/auth/utils/errorParser";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export type DebtPartnerFormMode = "default" | "name-only" | "money-only";


type DebtPartnerFormValues = { name: string; balance?: number };
const DebtPartnerFormSchemaNameOnly = z.object({
  name: z
    .string()
    .min(1, "Partner name is required")
    .max(100, "Name must be less than 100 characters"),
});
const DebtPartnerFormSchemaDefault = z.object({
  name: z
    .string()
    .min(1, "Partner name is required")
    .max(100, "Name must be less than 100 characters"),
  balance: z.number().optional(),
});

interface DebtPartnerFormProps {
  partner?: DebtPartner; // For edit mode
  onSubmit: (data: DebtPartnerFormValues, mode?: DebtPartnerFormMode) => Promise<void>;
  onCancel: () => void;
  mode?: DebtPartnerFormMode;
}

/**
 * Form component for creating/editing debt partners
 * Features:
 * - Name input with validation
 * - Balance adjustment input
 * - Loading states
 * - Error handling with field-level messages
 */
export function DebtPartnerForm({
  partner,
  onSubmit,
  onCancel,
  mode = "default",
}: DebtPartnerFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isBalanceInputValid, setIsBalanceInputValid] = useState(true);
  const { t } = useLanguage();

  // Choose schema based on mode
  const currentSchema = mode === "name-only" ? DebtPartnerFormSchemaNameOnly : DebtPartnerFormSchemaDefault;
  // Field visibility based on mode: show Name input unless money-only; show Balance input unless name-only
  const showName = mode !== "money-only";
  const showBalance = mode !== "name-only";
  const form = useForm<DebtPartnerFormValues>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      name: partner?.name || "",
      balance: partner?.balance ?? 0,
    },
  });

  const handleSubmit = async (data: DebtPartnerFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data, mode);
      form.reset();
    } catch (error: any) {
      const parsedError = parseErrorResponse(error);

      // Map field errors
      // Map field errors. In name-only mode we only map name errors.
      const fieldMap: Record<string, keyof DebtPartnerFormValues> = {
        Name: "name",
        name: "name",
      };
      if (mode !== "name-only") {
        fieldMap.Balance = "balance";
        fieldMap.balance = "balance";
      }

      if (parsedError.fields) {
        Object.entries(parsedError.fields).forEach(([key, messages]) => {
          const fieldName = fieldMap[key];
          if (fieldName && messages.length > 0) {
            form.setError(fieldName, { type: "server", message: messages[0] });
          }
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Partner Name */}
        {showName ? (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-ink-black font-semibold text-sm">
                  {t.partners.page.title}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t.partners.page.searchPlaceholder}
                    {...field}
                    disabled={isLoading}
                    className={cn(
                      "h-11 w-full rounded-xl bg-white px-4 py-2.5 text-sm text-ink-black outline-none transition-all placeholder:text-pencil-gray/70 focus:border-amber-400 focus:ring-2 focus:ring-note-yellow/30 shadow-xs",
                      field.value && field.value.trim() !== ""
                        ? "border-2 border-note-yellow font-semibold"
                        : "border border-gray-200 hover:border-gray-300 focus:border-2"
                    )}
                  />
                </FormControl>
                <FormMessage className="text-xs font-medium text-red-500" />
              </FormItem>
            )}
          />
        ) : null}

        {/* Balance (Adjustment Input) */}
        {showBalance ? (
          <FormField
            control={form.control}
            name="balance"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-ink-black font-semibold text-sm">
                  {t.wallets.page.detail.balanceAdjustment}
                </FormLabel>
                <FormControl>
                  <HybridBalanceInput
                    value={field.value ?? 0}
                    onChange={field.onChange}
                    disabled={isLoading}
                    error={form.formState.errors.balance?.message}
                    onValidityChange={(isValid) => setIsBalanceInputValid(isValid)}
                  />
                </FormControl>
                <FormMessage className="text-xs font-medium text-red-500" />
              </FormItem>
            )}
          />
        ) : null}

        {/* Form Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t border-note-yellow/20">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="h-11 px-5 rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 text-ink-black font-semibold cursor-pointer transition-all shadow-xs"
          >
              {t.common.cancel}
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !isBalanceInputValid}
            className="h-11 px-6 rounded-xl bg-note-yellow hover:bg-note-yellow/90 border-2 border-note-yellow text-ink-black font-bold shadow-xs transition-all active:scale-[0.98] cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {partner ? t.wallets.page.updating : t.wallets.page.creating}
              </>
            ) : partner ? (
              t.partners.page.updatePartnerTitle
            ) : (
              t.partners.page.createPartnerTitle
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
