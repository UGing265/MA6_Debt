"use client";

import { toast } from "sonner";
import { parseErrorResponse } from "@/features/auth/utils/errorParser";
import { triggerWalletsRefresh } from "@/features/wallet/hooks/useWallets";
import { triggerDebtPartnersRefresh } from "@/features/debt/hooks/useDebtPartners";
import { triggerHistoryRefresh } from "@/features/history/api/history";
import { createCashAdjustment, quickDeductTransaction } from "../api/transactions";
import { useLanguage } from "@/context/LanguageContext";
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
  triggerHistoryRefresh();
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
  const { t } = useLanguage();

  return {
    mutateAsync: async (payload: QuickDeductRequest): Promise<QuickDeductResponse> => {
      try {
        const result = await quickDeductTransaction(payload);
        notifyTransactionSubmitSuccess();
        if (showSuccessToast) {
          toast.success(t.toast.transactionSubmitted);
        }
        return result;
      } catch (error) {
        if (showErrorToast) {
          toast.error(getErrorMessage(error, t.toast.failedToRecordTransaction));
        }
        throw error;
      }
    },
  };
};

export const useCashAdjustmentSubmit = (options: SubmitToastOptions = {}) => {
  const { showSuccessToast = true, showErrorToast = true } = options;
  const { t } = useLanguage();

  return {
    mutateAsync: async (payload: CashAdjustmentRequest): Promise<TransactionDto> => {
      try {
        const result = await createCashAdjustment(payload);
        notifyTransactionSubmitSuccess();
        if (showSuccessToast) {
          toast.success(t.toast.adjustmentSubmitted);
        }
        return result;
      } catch (error) {
        if (showErrorToast) {
          toast.error(getErrorMessage(error, t.toast.failedToSubmitAdjustment));
        }
        throw error;
      }
    },
  };
};
