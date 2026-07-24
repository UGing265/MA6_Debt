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
    refreshPromise = fetch(AUTH_REFRESH_URL, {
      method: "POST",
      credentials: "include",
    })
      .then(async (response) => {
        if (!response.ok) {
          await handleApiError(response);
        }
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

const redirectToLogin = () => {
  if (typeof window !== "undefined") {
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

  // Merge headers, prioritizing custom headers
  const headers = {
    "Content-Type": "application/json",
    ...fetchOptions.headers,
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

  return fetch(fullUrl, requestOptions);
}

/**
 * Helper function to get auth headers for backward compatibility
 * @deprecated Use apiFetch instead
 */
export const getAuthHeaders = () => {
  return {
    "Content-Type": "application/json",
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
