import { HistoryDto } from "@/features/history/types/history";
import { parseErrorResponse } from "@/features/auth/utils/errorParser";
import { getAuthToken } from "@/lib/authToken";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7297";

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

const getAuthHeaders = () => {
  const token = getAuthToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const getHistory = async (params: {
  search?: string;
  walletId?: string | null;
  page?: number;
  pageSize?: number;
}): Promise<PagedResult<HistoryDto>> => {
  const queryParts: string[] = [];
  if (params.search && params.search.trim().length > 0) {
    queryParts.push(`search=${encodeURIComponent(params.search)}`);
  }
  if (params.walletId && params.walletId.trim().length > 0) {
    queryParts.push(`walletId=${encodeURIComponent(params.walletId)}`);
  }
  if (params.page && params.page > 1) {
    queryParts.push(`page=${params.page}`);
  }
  if (params.pageSize && params.pageSize !== 10) {
    queryParts.push(`pageSize=${params.pageSize}`);
  }
  const query = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  const response = await fetch(`${API_URL}/api/transactions${query}`, {
    method: "GET",
    headers: getAuthHeaders(),
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

  return response.json() as Promise<PagedResult<HistoryDto>>;
};

export const getHistoryItem = async (id: string): Promise<HistoryDto> => {
  const response = await fetch(`${API_URL}/api/transactions/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
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

  return response.json() as Promise<HistoryDto>;
};

export const updateHistoryNote = async (id: string, note: string): Promise<HistoryDto> => {
  const existing = await getHistoryItem(id);

  interface UpdatePayload {
    PayerMode: number;
    Total: number;
    DebtAmount?: number;
    Note?: string;
    TransactionDate?: string;
  }

  const payload: UpdatePayload = {
    PayerMode: existing.payerMode ?? 0,
    Total: existing.totalAmount ?? Math.abs(existing.amount) ?? 0,
    DebtAmount: existing.debtAmount ?? undefined,
    Note: note,
    TransactionDate: existing.transactionDate,
  };

  const putRes = await fetch(`${API_URL}/api/transactions/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!putRes.ok) {
    let errorData;
    try {
      errorData = await putRes.json();
    } catch {
      throw { message: `Request failed with status ${putRes.status}` };
    }
    const parsed = parseErrorResponse(errorData);
    throw { ...parsed, raw: errorData };
  }

  return putRes.json() as Promise<HistoryDto>;
};

export const deleteHistoryItem = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/api/transactions/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
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
};
