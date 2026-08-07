const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7297";
const AUTH_REFRESH_URL = `${API_URL}/api/auth/refresh`;
const AUTH_ENDPOINT_PATHS = new Set([
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh",
  "/api/auth/logout",
]);

export interface ApiFetchOptions extends RequestInit {
  skipAuthRefresh?: boolean;
}

let refreshPromise: Promise<void> | null = null;
//phương án dự phòng lưu storage
export const getStoredAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
};

export const getStoredRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refresh_token");
};

export const setStoredTokens = (accessToken?: string, refreshToken?: string) => {
  if (typeof window === "undefined") return;
  if (accessToken) localStorage.setItem("access_token", accessToken);
  if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
};

export const clearStoredTokens = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

const buildFullUrl = (url: string) =>
  url.startsWith("http") ? url : `${API_URL}${url}`;

const isAuthEndpoint = (url: string) => {
  const fullUrl = buildFullUrl(url);

  try {
    return AUTH_ENDPOINT_PATHS.has(new URL(fullUrl).pathname);
  } catch {
    return AUTH_ENDPOINT_PATHS.has(url.split("?")[0] ?? url);
  }
};

const refreshSessionOnce = async () => {
  if (!refreshPromise) {
    const storedRefreshToken = getStoredRefreshToken();

    refreshPromise = fetch(AUTH_REFRESH_URL, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: storedRefreshToken ? JSON.stringify({ refreshToken: storedRefreshToken }) : undefined,
    })
      .then(async (response) => {
        if (!response.ok) {
          clearStoredTokens();
          await handleApiError(response);
        }
        const data = await response.json();
        if (data?.token) {
          setStoredTokens(data.token, data.refreshToken);
        }
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

const redirectToLogin = () => {
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

/**
 * Centralized API client that handles authentication and error responses
 * Automatically redirects to login on 401 (unauthorized) responses
 */
export async function apiFetch(
  url: string,
  options: ApiFetchOptions = {}
): Promise<Response> {
  const { skipAuthRefresh = false, ...fetchOptions } = options;
  const fullUrl = buildFullUrl(url);

  const token = getStoredAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(fetchOptions.headers as Record<string, string>),
  };

  const requestOptions: RequestInit = {
    ...fetchOptions,
    headers,
    credentials: "include",
  };

  const response = await fetch(fullUrl, requestOptions);

  if (response.status !== 401 || skipAuthRefresh || isAuthEndpoint(url)) {
    return response;
  }

  try {
    await refreshSessionOnce();
  } catch {
    redirectToLogin();
    throw new Error("Session expired. Please log in again.");
  }

  const newToken = getStoredAccessToken();
  const retryHeaders: Record<string, string> = {
    ...headers,
    ...(newToken ? { Authorization: `Bearer ${newToken}` } : {}),
  };

  return fetch(fullUrl, {
    ...requestOptions,
    headers: retryHeaders,
  });
}

/**
 * Helper function to get auth headers for backward compatibility
 * @deprecated Use apiFetch instead
 */
export const getAuthHeaders = () => {
  const token = getStoredAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Helper to handle API errors consistently
 */
export async function handleApiError(response: Response): Promise<never> {
  let errorData;
  try {
    errorData = await response.json();
  } catch {
    throw { message: `Request failed with status ${response.status}` };
  }
  throw errorData;
}
