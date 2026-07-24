import { HistoryDto } from "@/features/history/types/history";
import { parseErrorResponse } from "@/features/auth/utils/errorParser";
import { apiFetch } from "@/lib/apiClient";

// History refresh event system
type HistoryListener = () => void;

const historyListeners = new Set<HistoryListener>();

export const subscribeToHistoryRefresh = (listener: () => void): (() => void) => {
  historyListeners.add(listener);
  return () => {
    historyListeners.delete(listener);
  };
};

export const triggerHistoryRefresh = () => {
  historyListeners.forEach((listener) => listener());
};

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface MonthlyStatsDto {
  month: string;
  monthLabel: string;
  expense: number;
  income: number;
  debtIncrease: number;
  debtDecrease: number;
}

export const getMonthlyStats = async (months: number = 6): Promise<MonthlyStatsDto[]> => {
  const response = await apiFetch(`/api/transactions/monthly-stats?months=${months}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to get monthly stats");
  }

  return response.json();
};
export interface SpendingStatsDto {
  label: string;
  amount: number;
}

export const getSpendingStats = async (period: string = "day", limit: number = 30): Promise<SpendingStatsDto[]> => {
  const response = await apiFetch(`/api/transactions/spending-stats?period=${period}&limit=${limit}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to get spending stats");
  }

  return response.json();
};
export const getHistory = async (params: {
  search?: string;
  walletId?: string | null;
  partnerId?: string | null;
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
  if (params.partnerId && params.partnerId.trim().length > 0) {
    queryParts.push(`partnerId=${encodeURIComponent(params.partnerId)}`);
  }
  if (params.page && params.page > 1) {
    queryParts.push(`page=${params.page}`);
  }
  if (params.pageSize && params.pageSize !== 10) {
    queryParts.push(`pageSize=${params.pageSize}`);
  }
  const query = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  const response = await apiFetch(`/api/transactions${query}`, {
    method: "GET",
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
  const response = await apiFetch(`/api/transactions/${id}`, {
    method: "GET",
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

  const putRes = await apiFetch(`/api/transactions/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
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
  const response = await apiFetch(`/api/transactions/${id}`, {
    method: "DELETE",
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

export interface UpdateDebtRequest {
  partnerId?: string;
  payerMode: number;
  total: number;
  debtAmount?: number;
  note?: string;
  transactionDate?: string;
}

export const updateTransactionDebt = async (
  id: string,
  data: UpdateDebtRequest
): Promise<HistoryDto> => {
  const payload = {
    PartnerId: data.partnerId ?? null,
    PayerMode: data.payerMode,
    Total: data.total,
    DebtAmount: data.debtAmount ?? undefined,
    Note: data.note ?? undefined,
    TransactionDate: data.transactionDate,
  };

  const response = await apiFetch(`/api/transactions/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
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

export const getHistoryByPartner = async (params: {
  partnerId: string;
  page?: number;
  pageSize?: number;
}): Promise<PagedResult<HistoryDto>> => {
  const queryParts: string[] = [];
  queryParts.push(`partnerId=${encodeURIComponent(params.partnerId)}`);
  if (params.page && params.page > 1) {
    queryParts.push(`page=${params.page}`);
  }
  if (params.pageSize && params.pageSize !== 10) {
    queryParts.push(`pageSize=${params.pageSize}`);
  }
  const query = `?${queryParts.join('&')}`;
  const response = await apiFetch(`/api/transactions${query}`, {
    method: "GET",
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
