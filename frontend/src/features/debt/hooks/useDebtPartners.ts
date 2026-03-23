"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

type DebtPartnersListener = () => void;

const debtPartnersListeners = new Set<DebtPartnersListener>();

export const triggerDebtPartnersRefresh = () => {
  debtPartnersListeners.forEach((listener) => listener());
};

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
  const isMountedRef = useRef(true);
  const requestIdRef = useRef(0);

  // Fetch all debt partners
  const fetchPartners = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    if (isMountedRef.current) {
      setIsLoading(true);
      setError(null);
    }

    try {
      const data = await getDebtPartners();

      if (!isMountedRef.current || requestId !== requestIdRef.current) return;
      setPartners(data);
    } catch (err: any) {
      if (!isMountedRef.current || requestId !== requestIdRef.current) return;
      const parsedError = parseErrorResponse(err);
      setError(parsedError.general);
      toast.error(parsedError.general || "Failed to load debt partners");
    } finally {
      if (!isMountedRef.current || requestId !== requestIdRef.current) return;
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    isMountedRef.current = true;
    void fetchPartners();

    const listener = () => {
      void fetchPartners();
    };

    debtPartnersListeners.add(listener);

    return () => {
      isMountedRef.current = false;
      debtPartnersListeners.delete(listener);
    };
  }, [fetchPartners]);

  // Create new partner
  const createPartner = async (
    data: CreateDebtPartnerRequest
  ): Promise<DebtPartner | null> => {
    try {
      const newPartner = await createDebtPartner(data);
      toast.success("Partner created successfully!");
      triggerDebtPartnersRefresh();
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
      triggerDebtPartnersRefresh();
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
      triggerDebtPartnersRefresh();
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
