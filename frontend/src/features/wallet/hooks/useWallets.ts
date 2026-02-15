"use client";

import { useSuspenseQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getWallets,
  createWallet,
  updateWallet,
  deleteWallet,
} from "../api/wallets";
import type { Wallet, CreateWalletRequest, UpdateWalletRequest } from "../types/wallet";

/**
 * Hook for fetching all wallets with Suspense support
 * Throws promise for Suspense boundary on initial load
 */
export const useWallets = () => {
  return useSuspenseQuery({
    queryKey: ["wallets"],
    queryFn: getWallets,
    staleTime: 30000, // 30 seconds
  });
};

/**
 * Hook for creating a new wallet
 */
export const useCreateWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWalletRequest) => createWallet(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      toast.success("Wallet created successfully!");
    },
    onError: (error: any) => {
      const message = error.general || "Failed to create wallet";
      toast.error(message);
    },
  });
};

/**
 * Hook for updating a wallet
 */
export const useUpdateWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWalletRequest }) =>
      updateWallet(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      toast.success("Wallet updated successfully!");
    },
    onError: (error: any) => {
      const message = error.general || "Failed to update wallet";
      toast.error(message);
    },
  });
};

/**
 * Hook for deleting a wallet
 */
export const useDeleteWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteWallet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      toast.success("Wallet deleted successfully!");
    },
    onError: (error: any) => {
      // Surface backend constraint errors
      const message = error.general || "Failed to delete wallet";
      toast.error(message);
    },
  });
};
