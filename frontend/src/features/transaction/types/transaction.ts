/**
 * Frontend transaction contracts aligned with backend API contracts
 * US-03 Quick Deduct and US-04 Cash Adjustment
 */

// Payer mode used in Quick Deduct requests
export enum PayerMode {
  ToiTra = 0,
  PartnerTra = 1,
}

// Direction for cash adjustment
export enum AdjustmentDirection {
  Credit = 0,
  Debit = 1,
}

// Debt notification direction (visual hint for UI)
export enum DebtDirection {
  PartnerOwesUser = 0,
  UserOwesPartner = 1,
  Settled = 2,
}

// API request: Quick Deduct
export interface QuickDeductRequest {
  walletId?: string;
  partnerId?: string;
  payerMode: PayerMode;
  total: number;
  debtAmount?: number;
  note?: string;
  transactionDate?: string;
}

// API request: Cash Adjustment
export interface CashAdjustmentRequest {
  walletId: string;
  direction: AdjustmentDirection;
  amount: number;
  note: string;
  transactionDate?: string;
}

// Debt notification (frontend-friendly)
export interface DebtNotification {
  partnerId: string;
  partnerName: string;
  remainingBalance: number;
  message: string;
  direction: DebtDirection;
}

// Data transfer object for a transaction (camelCase JSON)
export interface TransactionDto {
  id: string;
  walletId: string;
  partnerId?: string;
  partnerName?: string;
  amount: number;
  note?: string;
  transactionDate: string;
  createdAt: string;
  isLocked: boolean;
  payerMode?: PayerMode;
  totalAmount?: number;
  debtAmount?: number;
  transferId?: string;
  transferFromWalletId?: string;
  transferToWalletId?: string;
  transferDirection?: number;
}

// API response wrapper for Quick Deduct (camelCase keys)
export interface QuickDeductResponse {
  transaction: TransactionDto;
  notification?: DebtNotification | null;
}
