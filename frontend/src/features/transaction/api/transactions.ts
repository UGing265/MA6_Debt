import {
  QuickDeductRequest,
  QuickDeductResponse,
  CashAdjustmentRequest,
  TransactionDto,
} from "../types/transaction";
import { parseErrorResponse } from "@/features/auth/utils/errorParser";
import { apiFetch } from "@/lib/apiClient";

/**
 * Quick deduct transaction
 * POST /api/transactions/quick-deduct
 */
export const quickDeductTransaction = async (
  data: QuickDeductRequest
): Promise<QuickDeductResponse> => {
  const response = await apiFetch(`/api/transactions/quick-deduct`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      throw { message: `Request failed with status ${response.status}` };
    }
    const parsed = parseErrorResponse(errorData);
    throw { ...parsed, raw: errorData };
  }

  return response.json();
};

/**
 * Create a cash adjustment transaction
 * POST /api/transactions/adjustment
 */
export const createCashAdjustment = async (
  data: CashAdjustmentRequest
): Promise<TransactionDto> => {
  const response = await apiFetch(`/api/transactions/adjustment`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      throw { message: `Request failed with status ${response.status}` };
    }
    const parsed = parseErrorResponse(errorData);
    throw { ...parsed, raw: errorData };
  }

  return response.json();
};
