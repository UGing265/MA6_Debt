"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  getDebtPartners,
  createDebtPartner,
  updateDebtPartner,
  deleteDebtPartner,
} from "../api/debtPartners";
import type {
  DebtPartner,
  CreateDebtPartnerRequest,
  UpdateDebtPartnerRequest,
} from "../types/debtPartner";
import { parseErrorResponse } from "@/features/auth/utils/errorParser";

interface UseDebtPartnersReturn {
  partners: DebtPartner[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createPartner: (data: CreateDebtPartnerRequest) => Promise<DebtPartner | null>;
  updatePartner: (
    id: string,
    data: UpdateDebtPartnerRequest
  ) => Promise<DebtPartner | null>;
  removePartner: (id: string) => Promise<boolean>;
}

/**
 * Hook for managing debt partners with CRUD operations
 * Handles loading states, error handling, and automatic refetching
 */
export function useDebtPartners(): UseDebtPartnersReturn {
  const [partners, setPartners] = useState<DebtPartner[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all debt partners
  const fetchPartners = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDebtPartners();
      setPartners(data);
    } catch (err: any) {
      const parsedError = parseErrorResponse(err);
      setError(parsedError.general);
      toast.error(parsedError.general || "Failed to load debt partners");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPartners();
  }, []);

  // Create new partner
  const createPartner = async (
    data: CreateDebtPartnerRequest
  ): Promise<DebtPartner | null> => {
    try {
      const newPartner = await createDebtPartner(data);
      toast.success("Partner created successfully!");
      await fetchPartners(); // Refresh list
      return newPartner;
    } catch (err: any) {
      const parsedError = parseErrorResponse(err);
      toast.error(parsedError.general || "Failed to create partner");
      // Return error for form-level handling
      throw err;
    }
  };

  // Update existing partner
  const updatePartner = async (
    id: string,
    data: UpdateDebtPartnerRequest
  ): Promise<DebtPartner | null> => {
    try {
      const updatedPartner = await updateDebtPartner(id, data);
      toast.success("Partner updated successfully!");
      await fetchPartners(); // Refresh list
      return updatedPartner;
    } catch (err: any) {
      const parsedError = parseErrorResponse(err);
      toast.error(parsedError.general || "Failed to update partner");
      throw err;
    }
  };

  // Delete partner (soft delete)
  const removePartner = async (id: string): Promise<boolean> => {
    try {
      await deleteDebtPartner(id);
      toast.success("Partner deleted successfully!");
      await fetchPartners(); // Refresh list
      return true;
    } catch (err: any) {
      const parsedError = parseErrorResponse(err);
      toast.error(parsedError.general || "Failed to delete partner");
      return false;
    }
  };

  return {
    partners,
    isLoading,
    error,
    refetch: fetchPartners,
    createPartner,
    updatePartner,
    removePartner,
  };
}
