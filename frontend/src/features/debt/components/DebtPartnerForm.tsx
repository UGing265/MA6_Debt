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

// Validation schema
const DebtPartnerFormSchema = z.object({
  name: z
    .string()
    .min(1, "Partner name is required")
    .max(100, "Name must be less than 100 characters"),
  balance: z.number(),
});

type DebtPartnerFormValues = z.infer<typeof DebtPartnerFormSchema>;

interface DebtPartnerFormProps {
  partner?: DebtPartner; // For edit mode
  onSubmit: (data: DebtPartnerFormValues) => Promise<void>;
  onCancel: () => void;
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
}: DebtPartnerFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<DebtPartnerFormValues>({
    resolver: zodResolver(DebtPartnerFormSchema),
    defaultValues: {
      name: partner?.name || "",
      balance: partner?.balance || 0,
    },
  });

  const handleSubmit = async (data: DebtPartnerFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      form.reset();
    } catch (error: any) {
      const parsedError = parseErrorResponse(error);

      // Map field errors
      const fieldMap: Record<string, keyof DebtPartnerFormValues> = {
        Name: "name",
        Balance: "balance",
        name: "name",
        balance: "balance",
      };

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
                  className="bg-[#FDFCFB] border-[#4A2C2A]/10 focus:border-[#FF7A00] focus:ring-[#FF7A00]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Balance (Hybrid Input) */}
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
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isLoading}
                  error={form.formState.errors.balance?.message}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
            disabled={isLoading}
            className="bg-[#FF7A00] hover:bg-[#E56E00] text-white font-bold border border-[#4A2C2A]/20"
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
