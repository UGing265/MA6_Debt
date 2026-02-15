import {
  DebtPartner,
  CreateDebtPartnerRequest,
  UpdateDebtPartnerRequest,
} from "../types/debtPartner";
import { parseErrorResponse } from "@/features/auth/utils/errorParser";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7297";

/**
 * Create a new debt partner
 * POST /api/debtpartners
 */
export const createDebtPartner = async (
  data: CreateDebtPartnerRequest
): Promise<DebtPartner> => {
  const response = await fetch(`${API_URL}/api/debtpartners`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
 * Fetch all debt partners for current user
 * GET /api/debtpartners
 */
export const getDebtPartners = async (): Promise<DebtPartner[]> => {
  const response = await fetch(`${API_URL}/api/debtpartners`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
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
 * Fetch a single debt partner by ID
 * GET /api/debtpartners/{id}
 */
export const getDebtPartnerById = async (id: string): Promise<DebtPartner> => {
  const response = await fetch(`${API_URL}/api/debtpartners/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
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
 * Update an existing debt partner
 * PUT /api/debtpartners/{id}
 */
export const updateDebtPartner = async (
  id: string,
  data: UpdateDebtPartnerRequest
): Promise<DebtPartner> => {
  const response = await fetch(`${API_URL}/api/debtpartners/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
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
 * Delete a debt partner
 * DELETE /api/debtpartners/{id}
 * Returns no content (204)
 */
export const deleteDebtPartner = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/api/debtpartners/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
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
