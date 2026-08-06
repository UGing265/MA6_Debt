import type { LoginInput, RegisterInput, LoginResponse } from "../types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7297";

const AUTH_ENDPOINTS = {
  login: `${API_URL}/api/auth/login`,
  register: `${API_URL}/api/auth/register`,
  refreshSession: `${API_URL}/api/auth/refresh`,
  logout: `${API_URL}/api/auth/logout`,
} as const;

const readAuthError = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return { message: `Request failed with status ${response.status}` };
  }
};

export const login = async (data: LoginInput): Promise<LoginResponse> => {
  const response = await fetch(AUTH_ENDPOINTS.login, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw await readAuthError(response);
  }

  return response.json();
};

export const register = async (data: RegisterInput): Promise<void> => {
  const response = await fetch(AUTH_ENDPOINTS.register, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw await readAuthError(response);
  }
};

export const refreshSession = async (): Promise<LoginResponse> => {
  const response = await fetch(AUTH_ENDPOINTS.refreshSession, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw await readAuthError(response);
  }

  return response.json();
};

export const logout = async (): Promise<void> => {
  const response = await fetch(AUTH_ENDPOINTS.logout, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw await readAuthError(response);
  }
};

export const forgotPassword = async (emailOrUsername: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emailOrUsername }),
  });

  if (!response.ok) {
    throw await readAuthError(response);
  }

  return response.json();
};

export const resetPassword = async (token: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw data;
  }

  return data;
};
