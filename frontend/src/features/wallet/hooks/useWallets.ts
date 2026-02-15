"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getWallets,
  createWallet,
  updateWallet,
  deleteWallet,
} from "../api/wallets";
import type { Wallet, CreateWalletRequest, UpdateWalletRequest } from "../types/wallet";
import { parseErrorResponse } from "@/features/auth/utils/errorParser";

type WalletsListener = () => void;

const walletsListeners = new Set<WalletsListener>();

const notifyWalletsChanged = () => {
  walletsListeners.forEach((listener) => listener());
};

export const useWallets = () => {
  const [data, setData] = useState<Wallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const wallets = await getWallets();
      setData(wallets);
    } catch (err: any) {
      const parsedError = parseErrorResponse(err);
      setError(parsedError.general || "Failed to load wallets");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();

    const listener = () => {
      void refetch();
    };

    walletsListeners.add(listener);
    return () => {
      walletsListeners.delete(listener);
    };
  }, [refetch]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};

export const useCreateWallet = () => {
  return {
    mutateAsync: async (data: CreateWalletRequest) => {
      try {
        const result = await createWallet(data);
        toast.success("Wallet created successfully!");
        notifyWalletsChanged();
        return result;
      } catch (error: any) {
        const message = error.general || "Failed to create wallet";
        toast.error(message);
        throw error;
      }
    },
  };
};

export const useUpdateWallet = () => {
  return {
    mutateAsync: async ({ id, data }: { id: string; data: UpdateWalletRequest }) => {
      try {
        const result = await updateWallet(id, data);
        toast.success("Wallet updated successfully!");
        notifyWalletsChanged();
        return result;
      } catch (error: any) {
        const message = error.general || "Failed to update wallet";
        toast.error(message);
        throw error;
      }
    },
  };
};

export const useDeleteWallet = () => {
  return {
    mutateAsync: async (id: string) => {
      try {
        await deleteWallet(id);
        toast.success("Wallet deleted successfully!");
        notifyWalletsChanged();
      } catch (error: any) {
        const message = error.general || "Failed to delete wallet";
        toast.error(message);
        throw error;
      }
    },
  };
};
