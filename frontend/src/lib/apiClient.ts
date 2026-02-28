import { getAuthToken, clearAuthToken } from "./authToken";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7297";

/**
 * Centralized API client that handles authentication and error responses
 * Automatically redirects to login on 401 (unauthorized) responses
 */
export async function apiFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAuthToken();

  // Build full URL if it's a relative path
  const fullUrl = url.startsWith("http") ? url : `${API_URL}${url}`;

  // Merge headers, prioritizing custom headers
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // Make the request with credentials
  const response = await fetch(fullUrl, {
    ...options,
    headers,
    credentials: "include",
  });

  // Handle 401 Unauthorized - token expired or invalid
  if (response.status === 401) {
    // Clear the auth token
    clearAuthToken();

    // Redirect to login page
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }

    // Throw an error to stop further processing
    throw new Error("Session expired. Please log in again.");
  }

  return response;
}

/**
 * Helper function to get auth headers for backward compatibility
 * @deprecated Use apiFetch instead
 */
export const getAuthHeaders = () => {
  const token = getAuthToken();
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
