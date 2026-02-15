import { Wallet, CreateWalletRequest, UpdateWalletRequest } from "../types/wallet";
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
 * Create a new wallet
 * POST /api/wallets
 */
export const createWallet = async (data: CreateWalletRequest): Promise<Wallet> => {
  const response = await fetch(`${API_URL}/api/wallets`, {
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
    // Parse error for form field mapping
    const parsed = parseErrorResponse(errorData);
    throw { ...parsed, raw: errorData };
  }

  return response.json();
};

/**
 * Fetch all wallets for current user
 * GET /api/wallets
 */
export const getWallets = async (): Promise<Wallet[]> => {
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

/**
 * Fetch a single wallet by ID
 * GET /api/wallets/{id}
 */
export const getWalletById = async (id: string): Promise<Wallet> => {
  const response = await fetch(`${API_URL}/api/wallets/${id}`, {
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

/**
 * Update an existing wallet
 * PUT /api/wallets/{id}
 */
export const updateWallet = async (
  id: string,
  data: UpdateWalletRequest
): Promise<Wallet> => {
  const response = await fetch(`${API_URL}/api/wallets/${id}`, {
    method: "PUT",
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
 * Delete a wallet
 * DELETE /api/wallets/{id}
 * Returns no content (204)
 */
export const deleteWallet = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/api/wallets/${id}`, {
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
