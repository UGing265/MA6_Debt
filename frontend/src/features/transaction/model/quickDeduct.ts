import { z } from "zod";
import { PayerMode } from "../types/transaction";

export interface QuickDebtInput {
  walletId: string;
  total: number;
  debtAmount?: number;
  debtTag?: boolean;
  payerMode?: PayerMode;
  partnerId?: string;
}

export interface QuickDebtPayload {
  walletId: string;
  total: number;
  debtAmount?: number;
  payerMode?: PayerMode;
  partnerId?: string;
}

export const QuickDebtSchema = z
  .object({
    walletId: z.string().min(1, "Child wallet is required"),
    total: z.number().positive("Total must be greater than 0"),
    debtAmount: z.number().optional(),
    debtTag: z.boolean().optional(),
    payerMode: z.nativeEnum(PayerMode).optional(),
    partnerId: z.string().optional(),
  })
  .superRefine((d, ctx) => {
    // If debtTag ON, require debtAmount and partnerId
    const tagOn = d.debtTag ?? false;
    if (tagOn) {
      if (d.debtAmount == null) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Debt amount is required when debtTag is ON", path: ["debtAmount"] });
      }
      if (!d.partnerId) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "PartnerId is required when debtTag is ON", path: ["partnerId"] });
      }
    }
    // If debtAmount is provided, ensure it does not exceed total
    if (d.debtAmount != null && d.total != null) {
      if (d.debtAmount > d.total) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Debt amount cannot exceed total", path: ["debtAmount"] });
      }
    }
  });

export function mapQuickDebtToPayload(input: QuickDebtInput): QuickDebtPayload {
  const payload: QuickDebtPayload = {
    walletId: input.walletId,
    total: input.total,
  };
  if (typeof input.debtAmount === "number") payload.debtAmount = input.debtAmount;
  if (input.payerMode !== undefined) payload.payerMode = input.payerMode;
  if (input.partnerId) payload.partnerId = input.partnerId;
  return payload;
}

export function mapQuickDebtToPayloadOff(input: QuickDebtInput): QuickDebtPayload {
  return {
    walletId: input.walletId,
    total: input.total,
    payerMode: PayerMode.ToiTra,
  };
}
