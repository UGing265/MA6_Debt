import { WalletDto, CreateTransferRequest, CreateTransferResponse } from "../types/transfer";
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

export const getTransferWallets = async (): Promise<WalletDto[]> => {
  const response = await fetch(`${API_URL}/api/wallets`, {
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

  return response.json();
};

export const createTransfer = async (
  data: CreateTransferRequest
): Promise<CreateTransferResponse> => {
  const response = await fetch(`${API_URL}/api/transfers`, {
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
