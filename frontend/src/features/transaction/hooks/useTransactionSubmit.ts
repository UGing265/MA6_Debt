"use client";

import { toast } from "sonner";
import { parseErrorResponse } from "@/features/auth/utils/errorParser";
import { triggerWalletsRefresh } from "@/features/wallet/hooks/useWallets";
import { triggerDebtPartnersRefresh } from "@/features/debt/hooks/useDebtPartners";
import { createCashAdjustment, quickDeductTransaction } from "../api/transactions";
import type {
  CashAdjustmentRequest,
  QuickDeductRequest,
  QuickDeductResponse,
  TransactionDto,
} from "../types/transaction";

interface SubmitToastOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

const notifyCrossFeatureRefresh = () => {
  triggerWalletsRefresh();
  triggerDebtPartnersRefresh();
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const parsedError = parseErrorResponse(error);
  return parsedError.general || fallback;
};

export const notifyTransactionSubmitSuccess = () => {
  notifyCrossFeatureRefresh();
};

export const useQuickDeductSubmit = (options: SubmitToastOptions = {}) => {
  const { showSuccessToast = true, showErrorToast = true } = options;

  return {
    mutateAsync: async (payload: QuickDeductRequest): Promise<QuickDeductResponse> => {
      try {
        const result = await quickDeductTransaction(payload);
        notifyTransactionSubmitSuccess();
        if (showSuccessToast) {
          toast.success("Transaction submitted successfully!");
        }
        return result;
      } catch (error) {
        if (showErrorToast) {
          toast.error(getErrorMessage(error, "Failed to submit transaction"));
        }
        throw error;
      }
    },
  };
};

export const useCashAdjustmentSubmit = (options: SubmitToastOptions = {}) => {
  const { showSuccessToast = true, showErrorToast = true } = options;

  return {
    mutateAsync: async (payload: CashAdjustmentRequest): Promise<TransactionDto> => {
      try {
        const result = await createCashAdjustment(payload);
        notifyTransactionSubmitSuccess();
        if (showSuccessToast) {
          toast.success("Adjustment submitted successfully!");
        }
        return result;
      } catch (error) {
        if (showErrorToast) {
          toast.error(getErrorMessage(error, "Failed to submit adjustment"));
        }
        throw error;
      }
    },
  };
};
