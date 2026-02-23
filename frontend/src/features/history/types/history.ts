export enum TransferDirection {
  Outgoing = 0,
  Incoming = 1
}

export enum PayerMode {
  ToiTra = 0,
  PartnerTra = 1
}

export interface HistoryDto {
  id: string;
  walletId: string;
  walletName?: string | null;
  parentWalletName?: string | null;
  partnerId?: string | null;
  partnerName?: string | null;
  amount: number;
  note?: string | null;
  transactionDate: string;
  createdAt: string;
  isLocked: boolean;

  // Transfer fields
  transferId?: string | null;
  transferFromWalletId?: string | null;
  transferToWalletId?: string | null;
  transferFromWalletName?: string | null;
  transferToWalletName?: string | null;
  transferDirection?: TransferDirection | null;

  // QuickDeduct fields
  payerMode?: PayerMode | null;
  totalAmount?: number | null;
  debtAmount?: number | null;
}

// Helper to format wallet display: "Ví Con (Ví Cha)"
export function formatWalletDisplay(walletName?: string | null, parentWalletName?: string | null): string {
  if (!walletName) return "Unknown Wallet";
  if (parentWalletName) {
    return `${walletName} (${parentWalletName})`;
  }
  return walletName;
}
