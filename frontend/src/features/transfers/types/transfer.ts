export interface WalletDto {
  id: string;
  name: string;
  description?: string | null;
  parentWalletId?: string | null;
  balance: number;
}

export interface WalletOption {
  value: WalletDto["id"];
  label: WalletDto["name"];
  wallet: WalletDto;
}

export interface CreateTransferRequest {
  fromWalletId: string;
  toWalletId: string;
  amount: number;
  sourceTransactionId?: string | null;
  destinationTransactionId?: string | null;
}

export interface TransferDto {
  id: string;
  fromWalletId: string;
  toWalletId: string;
  amount: number;
  sourceTransactionId?: string | null;
  destinationTransactionId?: string | null;
  createdAt?: string | null;
}

export type CreateTransferResponse = TransferDto;

export interface ValidationErrorResponse {
  type?: string;
  title?: string;
  status?: number;
  errors?: Record<string, string[] | string>;
}
