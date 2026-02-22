import {
  QuickDeductRequest,
  QuickDeductResponse,
  CashAdjustmentRequest,
  TransactionDto,
} from "../types/transaction";
import { parseErrorResponse } from "@/features/auth/utils/errorParser";
import { getAuthToken } from "@/lib/authToken";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7297";

const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Quick deduct transaction
 * POST /api/transactions/quick-deduct
 */
export const quickDeductTransaction = async (
  data: QuickDeductRequest
): Promise<QuickDeductResponse> => {
  const response = await fetch(`${API_URL}/api/transactions/quick-deduct`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    credentials: "include",
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
  const response = await fetch(`${API_URL}/api/transactions/adjustment`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    credentials: "include",
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
