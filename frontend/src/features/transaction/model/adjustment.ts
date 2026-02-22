import { z } from "zod";
import { AdjustmentDirection } from "../types/transaction";

export interface AdjustmentInput {
  walletId: string;
  amount: number;
  direction: AdjustmentDirection;
  note: string;
}

export interface AdjustmentPayload {
  walletId: string;
  amount: number;
  direction: AdjustmentDirection;
  note: string;
}

export const AdjustmentSchema = z.object({
  walletId: z.string().min(1, "Wallet is required"),
  amount: z.number().positive("Amount must be greater than 0"),
  direction: z.nativeEnum(AdjustmentDirection),
  note: z.string().min(3, "Note must be at least 3 characters"),
});

export function mapAdjustmentToPayload(input: AdjustmentInput): AdjustmentPayload {
  return {
    walletId: input.walletId,
    amount: input.amount,
    direction: input.direction,
    note: input.note,
  };
}
