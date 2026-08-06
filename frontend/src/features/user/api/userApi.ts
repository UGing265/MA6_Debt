import { apiFetch } from "@/lib/apiClient";

export interface UserPreferences {
  defaultWalletId: string | null;
  defaultPartnerId: string | null;
  dailySpendingLimitEnabled: boolean;
  dailySpendingLimitAmount: number | null;
}

export interface UserProfile {
  username: string;
  email: string | null;
  name: string | null;
  createdAt: string;
}

export const getUserPreferences = async (): Promise<UserPreferences> => {
  const response = await apiFetch("/api/users/preferences");

  if (!response.ok) {
    throw new Error("Failed to get user preferences");
  }

  return response.json();
};

export const getProfile = async (): Promise<UserProfile> => {
  const response = await apiFetch("/api/users/profile");

  if (!response.ok) {
    throw new Error("Failed to get profile");
  }

  return response.json();
};

export const updateProfile = async (data: { username: string; email?: string | null }): Promise<void> => {
  const response = await apiFetch("/api/users/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
};

export const changePassword = async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
  const response = await apiFetch("/api/users/password", {
    method: "PUT",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
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

export const updateDailySpendingLimit = async (data: { enabled: boolean; amount: number | null }): Promise<void> => {
  const response = await apiFetch("/api/users/daily-spending-limit", {
    method: "PUT",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
};
