import { z } from "zod";

export const TransferFormSchema = z
  .object({
    fromWalletId: z.string().min(1, "FromWalletId is required"),
    toWalletId: z.string().min(1, "ToWalletId is required"),
    amount: z
      .number({
        required_error: "Amount is required",
        invalid_type_error: "Amount is required",
      })
      .greaterThan(0, "Amount must be greater than zero"),
    sourceBalance: z
      .number({
        required_error: "SourceBalance is required",
        invalid_type_error: "SourceBalance is required",
      })
      .min(0, "SourceBalance must be non-negative"),
    note: z.string().max(500, "Note must be at most 500 characters").optional(),
  })
  .superRefine((values, ctx) => {
    if (
      values.fromWalletId.length > 0 &&
      values.toWalletId.length > 0 &&
      values.fromWalletId === values.toWalletId
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["toWalletId"],
        message: "FromWalletId and ToWalletId must be different",
      });
    }

    if (values.amount > 0 && values.amount > values.sourceBalance) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["amount"],
        message: "Insufficient balance in source wallet",
      });
    }
  });

export type TransferFormValues = z.infer<typeof TransferFormSchema>;

export const TransferFormFieldMap: Record<string, keyof TransferFormValues> = {
  FromWalletId: "fromWalletId",
  fromWalletId: "fromWalletId",
  ToWalletId: "toWalletId",
  toWalletId: "toWalletId",
  Amount: "amount",
  amount: "amount",
};
