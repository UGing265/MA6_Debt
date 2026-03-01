import { apiFetch } from "@/lib/apiClient";

export interface UserPreferences {
  defaultWalletId: string | null;
  defaultPartnerId: string | null;
}

export const getUserPreferences = async (): Promise<UserPreferences> => {
  const response = await apiFetch("/api/users/preferences");

  if (!response.ok) {
    throw new Error("Failed to get user preferences");
  }

  return response.json();
};

export const updateDefaultWallet = async (walletId: string | null): Promise<void> => {
  const response = await apiFetch("/api/users/default-wallet", {
    method: "PUT",
    body: JSON.stringify({ walletId }),
  });

  if (!response.ok) {
    throw new Error("Failed to update default wallet");
  }
};

export const updateDefaultPartner = async (partnerId: string | null): Promise<void> => {
  const response = await apiFetch("/api/users/default-partner", {
    method: "PUT",
    body: JSON.stringify({ partnerId }),
  });

  if (!response.ok) {
    throw new Error("Failed to update default partner");
  }
};
