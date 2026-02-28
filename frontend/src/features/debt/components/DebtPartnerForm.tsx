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
 * - Hybrid balance input (guided + direct modes)
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
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Partner Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter partner name"
                    {...field}
                    disabled={isLoading}
                    className="bg-[#FDFCFB] border-[#4A2C2A]/10 focus:border-note-yellow focus:ring-note-yellow"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        {/* Balance (Hybrid Input) */}
        {showBalance ? (
          <FormField
            control={form.control}
            name="balance"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Balance
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
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        {/* Form Actions */}
        <div className="flex gap-3 justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !isBalanceInputValid}
            className="bg-note-yellow text-ink-black hover:bg-note-yellow/90 font-bold"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {partner ? "Updating..." : "Creating..."}
              </>
            ) : partner ? (
              "Update Partner"
            ) : (
              "Create Partner"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
