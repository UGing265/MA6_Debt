"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
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
import { parseErrorResponse } from "@/features/auth/utils/errorParser";
import { useWallets } from "@/features/wallet/hooks/useWallets";
import { useDebtPartners } from "@/features/debt/hooks/useDebtPartners";
import { useQuickDeductSubmit } from "../hooks/useTransactionSubmit";
import {
  QuickDebtSchema,
  mapQuickDebtToPayload,
  mapQuickDebtToPayloadOff,
} from "../model";
import { PayerMode } from "../types/transaction";

const quickDebtFormSchema = z
  .object({
    walletId: z.string().min(1, "Child wallet is required"),
    total: z.preprocess(
      (value) => (value === "" || value == null ? undefined : Number(value)),
      z.number({ invalid_type_error: "Total is required" }).positive("Total must be greater than 0")
    ),
    debtTag: z.boolean().default(false),
    payerMode: z.nativeEnum(PayerMode).optional(),
    partnerId: z.string().optional(),
    debtAmount: z.preprocess(
      (value) => (value === "" || value == null ? undefined : Number(value)),
      z.number().positive("Debt amount must be greater than 0").optional()
    ),
    note: z.string().trim().max(300, "Note must be at most 300 characters").optional(),
  })
  .superRefine((data, ctx) => {
    const modelValidation = QuickDebtSchema.safeParse(data);
    if (!modelValidation.success) {
      modelValidation.error.issues.forEach((issue) => {
        ctx.addIssue(issue);
      });
    }

    if (data.debtTag && data.payerMode === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Payer mode is required when debt-tag is ON",
        path: ["payerMode"],
      });
    }
  });

type QuickDebtFormValues = z.infer<typeof quickDebtFormSchema>;

const initialValues: Partial<QuickDebtFormValues> = {
  walletId: "",
  debtTag: false,
  payerMode: PayerMode.ToiTra,
  note: "",
};

export function QuickDebtForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
  const { data: wallets, isLoading: isWalletsLoading } = useWallets();
  const { partners, isLoading: isPartnersLoading } = useDebtPartners();
  const quickDeductSubmit = useQuickDeductSubmit({
    showSuccessToast: false,
    showErrorToast: false,
  });

  const childWallets = useMemo(
    () => wallets.filter((wallet) => wallet.parentWalletId != null),
    [wallets]
  );

  const form = useForm<QuickDebtFormValues>({
    resolver: zodResolver(quickDebtFormSchema),
    defaultValues: initialValues,
  });

  const debtTag = form.watch("debtTag") ?? false;

  useEffect(() => {
    if (!debtTag) {
      form.setValue("payerMode", PayerMode.ToiTra, { shouldValidate: true });
      form.setValue("partnerId", undefined, { shouldValidate: true });
      form.setValue("debtAmount", undefined, { shouldValidate: true });
    }
  }, [debtTag, form]);

  const onSubmit = async (values: QuickDebtFormValues) => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const input = {
        walletId: values.walletId,
        total: values.total,
        debtTag: values.debtTag,
        payerMode: values.debtTag ? values.payerMode : undefined,
        partnerId: values.debtTag ? values.partnerId : undefined,
        debtAmount: values.debtTag ? values.debtAmount : undefined,
      };

      const mappedPayload = values.debtTag
        ? mapQuickDebtToPayload(input)
        : mapQuickDebtToPayloadOff(input);

      const response = await quickDeductSubmit.mutateAsync({
        ...mappedPayload,
        note: values.note?.trim() || undefined,
      });

      toast.success("Quick debt submitted successfully");
      setNotificationMessage(response.notification?.message ?? null);
      form.reset(initialValues);
    } catch (error: unknown) {
      const parsedError = parseErrorResponse(error);
      const normalizeFieldKey = (field: string) => field.replace(/[^a-z0-9]/gi, "").toLowerCase();
      const fieldMap: Record<string, keyof QuickDebtFormValues> = {
        walletid: "walletId",
        total: "total",
        note: "note",
        payermode: "payerMode",
        partnerid: "partnerId",
        debtamount: "debtAmount",
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
        toast.error(parsedError.general || "Failed to submit quick debt");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="total"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Bill</FormLabel>
              <FormControl>
                <Input
                  data-testid="qd-total"
                  disabled={isSubmitting}
                  inputMode="decimal"
                  placeholder="0"
                  type="number"
                  value={field.value ?? ""}
                  onChange={(event) => field.onChange(event.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="walletId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Child Wallet</FormLabel>
              <FormControl>
                <select
                  data-testid="qd-wallet"
                  disabled={isSubmitting || isWalletsLoading}
                  value={field.value ?? ""}
                  onChange={(event) => field.onChange(event.target.value)}
                  className="border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select child wallet</option>
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
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Input
                  disabled={isSubmitting}
                  placeholder="Optional note"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="debtTag"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    data-testid="qd-debt-toggle"
                    checked={field.value ?? false}
                    disabled={isSubmitting}
                    type="checkbox"
                    onChange={(event) => field.onChange(event.target.checked)}
                  />
                  Apply debt-tag
                </label>
              </FormControl>
            </FormItem>
          )}
        />

        {debtTag ? (
          <>
            <FormField
              control={form.control}
              name="payerMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payer Mode</FormLabel>
                  <FormControl>
                    <select
                      disabled={isSubmitting}
                      value={field.value ?? PayerMode.ToiTra}
                      onChange={(event) => field.onChange(Number(event.target.value))}
                      className="border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value={PayerMode.ToiTra}>Toi tra</option>
                      <option value={PayerMode.PartnerTra}>Partner tra</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="partnerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Debt Partner</FormLabel>
                  <FormControl>
                    <select
                      data-testid="qd-partner"
                      disabled={isSubmitting || isPartnersLoading}
                      value={field.value ?? ""}
                      onChange={(event) => field.onChange(event.target.value)}
                      className="border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select partner</option>
                      {partners.map((partner) => (
                        <option key={partner.id} value={partner.id}>
                          {partner.name}
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
              name="debtAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Debt Amount</FormLabel>
                  <FormControl>
                    <Input
                      data-testid="qd-debt-amount"
                      disabled={isSubmitting}
                      inputMode="decimal"
                      placeholder="0"
                      type="number"
                      value={field.value ?? ""}
                      onChange={(event) => field.onChange(event.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        ) : null}

        {notificationMessage ? (
          <p className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
            {notificationMessage}
          </p>
        ) : null}

        <Button
          data-testid="qd-submit"
          disabled={isSubmitting}
          type="submit"
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Quick Debt"
          )}
        </Button>
      </form>
    </Form>
  );
}

export default QuickDebtForm;
