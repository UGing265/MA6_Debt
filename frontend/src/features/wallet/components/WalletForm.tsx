"use client";

import { useState, useEffect } from "react";
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
import { useCreateWallet, useUpdateWallet } from "../hooks/useWallets";
import type { Wallet } from "../types/wallet";
import { parseErrorResponse } from "@/features/auth/utils/errorParser";

// Validation schema
const walletFormSchema = z.object({
  name: z.string().min(1, "Wallet name is required").max(100, "Name too long"),
  description: z.string().optional(),
  parentWalletId: z.string().optional(),
});

type WalletFormInput = z.infer<typeof walletFormSchema>;

interface WalletFormProps {
  mode: "create" | "edit";
  wallet?: Wallet;
  availableWallets?: Wallet[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const WalletForm = ({
  mode,
  wallet,
  availableWallets = [],
  onSuccess,
  onCancel,
}: WalletFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const createMutation = useCreateWallet();
  const updateMutation = useUpdateWallet();

  const form = useForm<WalletFormInput>({
    resolver: zodResolver(walletFormSchema),
    defaultValues: {
      name: wallet?.name || "",
      description: wallet?.description || "",
      parentWalletId: wallet?.parentWalletId || "",
    },
  });

  // Update form when wallet changes (for edit mode)
  useEffect(() => {
    if (wallet) {
      form.reset({
        name: wallet.name,
        description: wallet.description || "",
        parentWalletId: wallet.parentWalletId || "",
      });
    }
  }, [wallet, form]);

  const onSubmit = async (data: WalletFormInput) => {
    setIsLoading(true);
    try {
      // Clean up empty strings to undefined
      const payload = {
        name: data.name,
        description: data.description || undefined,
        parentWalletId: data.parentWalletId || undefined,
      };

      if (mode === "create") {
        await createMutation.mutateAsync(payload);
      } else if (wallet) {
        await updateMutation.mutateAsync({
          id: wallet.id,
          data: {
            name: payload.name,
            description: payload.description,
          },
        });
      }

      form.reset();
      onSuccess?.();
    } catch (error: any) {
      const parsedError = parseErrorResponse(error);

      // Set field errors
      if (parsedError.fields) {
        Object.entries(parsedError.fields).forEach(([field, messages]) => {
          const fieldName = field.toLowerCase() as keyof WalletFormInput;
          if (fieldName in form.control._fields) {
            form.setError(fieldName, {
              type: "manual",
              message: messages[0],
            });
          }
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Filter out current wallet from parent selection (can't be own parent)
  const selectableParents = availableWallets.filter((w) => w.id !== wallet?.id);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Wallet Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Cash Wallet, Bank Account"
                  {...field}
                  disabled={isLoading}
                  className="bg-white border-[#1F2937]/10 focus:border-[#FCD34D] focus:ring-[#FCD34D]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Description (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Brief description of this wallet"
                  {...field}
                  disabled={isLoading}
                  className="bg-white border-[#1F2937]/10 focus:border-[#FCD34D] focus:ring-[#FCD34D]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {mode === "create" && (
          <FormField
            control={form.control}
            name="parentWalletId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Parent Wallet (Optional)</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    disabled={isLoading}
                    className="w-full rounded-md border border-[#1F2937]/10 bg-white px-3 py-2 text-sm focus:border-[#FCD34D] focus:outline-none focus:ring-1 focus:ring-[#FCD34D]"
                  >
                    <option value="">-- No Parent --</option>
                    {selectableParents.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex gap-2 pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-[#FCD34D] hover:bg-[#FBBF24] text-[#1F2937] font-bold"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "create" ? "Creating..." : "Updating..."}
              </>
            ) : mode === "create" ? (
              "Create Wallet"
            ) : (
              "Update Wallet"
            )}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};
