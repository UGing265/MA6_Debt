export enum TransferDirection {
  Outgoing = 0,
  Incoming = 1
}

export interface HistoryDto {
  id: string;
  walletId: string;
  partnerId?: string | null;
  partnerName?: string | null;
  amount: number;
  note?: string | null;
  transactionDate: string;
  createdAt: string;
  isLocked: boolean;
  transferId?: string | null;
  transferFromWalletId?: string | null;
  transferToWalletId?: string | null;
  transferDirection?: TransferDirection | null;

  payerMode?: number;
  totalAmount?: number;
  total?: number;
  debtAmount?: number;
}
