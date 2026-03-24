/**
 * Debt Partner types and interfaces
 * Aligned with backend DebtPartnerDto and command contracts
 */

/**
 * Debt Partner response from backend
 * Matches DebtPartnerDto contract
 * Balance: positive = receivable (amount owed to us), negative = payable (amount we owe)
 */
export interface DebtPartner {
  id: string; // UUID as string
  name: string;
  balance: number; // Signed: + = receivable, - = payable
}

/**
 * Create debt partner request payload
 * Matches CreateDebtPartnerCommand contract
 * Note: UserId is added server-side from JWT token
 */
export interface CreateDebtPartnerRequest {
  name: string;
  balance: number;
}

/**
 * Update debt partner request payload
 * Matches UpdateDebtPartnerCommand contract
 * Note: UserId and Id are added from URL/context
 */
export interface UpdateDebtPartnerRequest {
  name: string;
  balance: number;
}

/**
 * Error response from backend validation
 */
export interface DebtPartnerError {
  message: string;
  errors?: Record<string, string[]>;
}
