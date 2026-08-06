"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  getWallets,
  createWallet,
  updateWallet,
  deleteWallet,
} from "../api/wallets";
import type { Wallet, CreateWalletRequest, UpdateWalletRequest } from "../types/wallet";
import { parseErrorResponse } from "@/features/auth/utils/errorParser";
import { useLanguage } from "@/context/LanguageContext";

type WalletsListener = () => void;

const walletsListeners = new Set<WalletsListener>();

export const triggerWalletsRefresh = () => {
  walletsListeners.forEach((listener) => listener());
};

export const useWallets = () => {
  const { t } = useLanguage();
  const [data, setData] = useState<Wallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const requestIdRef = useRef(0);

  const refetch = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    if (isMountedRef.current) {
      setIsLoading(true);
      setError(null);
    }

    try {
      const wallets = await getWallets();

      if (!isMountedRef.current || requestId !== requestIdRef.current) return;
      setData(wallets);
    } catch (err: unknown) {
      if (!isMountedRef.current || requestId !== requestIdRef.current) return;
      const parsedError = parseErrorResponse(err);
      setError(parsedError.general || t.toast.failedToLoadWallets);
    } finally {
      if (!isMountedRef.current || requestId !== requestIdRef.current) return;
      setIsLoading(false);
    }
  }, [t.toast.failedToLoadWallets]);

  useEffect(() => {
    isMountedRef.current = true;
    void refetch();

    const listener = () => {
      void refetch();
    };

    walletsListeners.add(listener);
    return () => {
      isMountedRef.current = false;
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
  const { t } = useLanguage();

  return {
    mutateAsync: async (data: CreateWalletRequest) => {
      try {
        const result = await createWallet(data);
        toast.success(t.toast.walletCreated);
        triggerWalletsRefresh();
        return result;
      } catch (error: unknown) {
        const parsedError = parseErrorResponse(error);
        const message = parsedError.general || t.toast.failedToSaveWallet;
        toast.error(message);
        throw error;
      }
    },
  };
};

export const useUpdateWallet = () => {
  const { t } = useLanguage();

  return {
    mutateAsync: async ({ id, data }: { id: string; data: UpdateWalletRequest }) => {
      try {
        const result = await updateWallet(id, data);
        toast.success(t.toast.walletUpdated);
        triggerWalletsRefresh();
        return result;
      } catch (error: unknown) {
        const parsedError = parseErrorResponse(error);
        const message = parsedError.general || t.toast.failedToSaveWallet;
        toast.error(message);
        throw error;
      }
    },
  };
};

export const useDeleteWallet = () => {
  const { t } = useLanguage();

  return {
    mutateAsync: async (id: string) => {
      try {
        await deleteWallet(id);
        toast.success(t.toast.walletDeleted);
        triggerWalletsRefresh();
      } catch (error: unknown) {
        const parsedError = parseErrorResponse(error);
        const message = parsedError.general || t.toast.failedToSaveWallet;
        toast.error(message);
        throw error;
      }
    },
  };
};
