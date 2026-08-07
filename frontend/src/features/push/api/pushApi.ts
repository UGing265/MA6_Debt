import { apiFetch, handleApiError } from "@/lib/apiClient";

export interface PushPublicKeyResponse {
  publicKey: string;
}

export const getPushPublicKey = async (): Promise<string> => {
  const response = await apiFetch("/api/push/public-key");

  if (!response.ok) {
    await handleApiError(response);
  }

  const data = (await response.json()) as PushPublicKeyResponse;
  return data.publicKey;
};

export const subscribeToPush = async (subscription: PushSubscription): Promise<void> => {
  const response = await apiFetch("/api/push/subscribe", {
    method: "POST",
    body: JSON.stringify(subscription),
  });

  if (!response.ok) {
    await handleApiError(response);
  }
};

export const unsubscribeFromPush = async (endpoint: string): Promise<void> => {
  const response = await apiFetch("/api/push/subscribe", {
    method: "DELETE",
    body: JSON.stringify({ endpoint }),
  });

  if (!response.ok) {
    await handleApiError(response);
  }
};

export const sendTestPush = async (): Promise<void> => {
  const response = await apiFetch("/api/push/test", {
    method: "POST",
  });

  if (!response.ok) {
    await handleApiError(response);
  }
};
