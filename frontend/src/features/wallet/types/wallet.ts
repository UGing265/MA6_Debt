/**
 * Wallet types and interfaces
 * Aligned with backend WalletDto and command contracts
 */

/**
 * Wallet response from backend
 * Matches WalletDto contract
 */
export interface Wallet {
  id: string; // UUID as string
  name: string;
  description?: string | null;
  parentWalletId?: string | null;
  balance: number;
}

/**
 * Create wallet request payload
 * Matches CreateWalletCommand contract
 * Note: UserId is added server-side from JWT token
 */
export interface CreateWalletRequest {
  name: string;
  description?: string;
  parentWalletId?: string;
}

/**
 * Update wallet request payload
 * Matches UpdateWalletCommand contract
 * Note: UserId and Id are added from URL/context
 */
export interface UpdateWalletRequest {
  name: string;
  description?: string;
  parentWalletId?: string | null;
}

/**
 * Error response from backend validation
 */
export interface WalletError {
  message: string;
  errors?: Record<string, string[]>;
}
