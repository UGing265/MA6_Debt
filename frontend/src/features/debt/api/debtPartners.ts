import {
  DebtPartner,
  CreateDebtPartnerRequest,
  UpdateDebtPartnerRequest,
} from "../types/debtPartner";
import { parseErrorResponse } from "@/features/auth/utils/errorParser";
import { apiFetch } from "@/lib/apiClient";

/**
 * Create a new debt partner
 * POST /api/debtpartners
 */
export const createDebtPartner = async (
  data: CreateDebtPartnerRequest
): Promise<DebtPartner> => {
  const response = await apiFetch(`/api/debtpartners`, {
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
  const response = await apiFetch(`/api/debtpartners`, {
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

/**
 * Fetch a single debt partner by ID
 * GET /api/debtpartners/{id}
 */
export const getDebtPartnerById = async (id: string): Promise<DebtPartner> => {
  const response = await apiFetch(`/api/debtpartners/${id}`, {
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

/**
 * Update an existing debt partner
 * PUT /api/debtpartners/{id}
 */
export const updateDebtPartner = async (
  id: string,
  data: UpdateDebtPartnerRequest
): Promise<DebtPartner> => {
  const response = await apiFetch(`/api/debtpartners/${id}`, {
    method: "PUT",
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
 * Delete a debt partner
 * DELETE /api/debtpartners/{id}
 * Returns no content (204)
 */
export const deleteDebtPartner = async (id: string): Promise<void> => {
  const response = await apiFetch(`/api/debtpartners/${id}`, {
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
