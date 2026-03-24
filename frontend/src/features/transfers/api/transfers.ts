import { WalletDto, CreateTransferRequest, CreateTransferResponse } from "../types/transfer";
import { parseErrorResponse } from "@/features/auth/utils/errorParser";
import { apiFetch } from "@/lib/apiClient";

export const getTransferWallets = async (): Promise<WalletDto[]> => {
  const response = await apiFetch(`/api/wallets`, {
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

  return response.json();
};

export const createTransfer = async (
  data: CreateTransferRequest
): Promise<CreateTransferResponse> => {
  const response = await apiFetch(`/api/transfers`, {
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
