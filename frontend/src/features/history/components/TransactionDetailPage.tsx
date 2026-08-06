"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getHistoryItem, deleteHistoryItem, updateTransactionDebt } from "../api/history";
import { getDebtPartners } from "@/features/debt/api/debtPartners";
import { isRepayNote, stripRepayMarker, withRepayMarker } from "../utils/historyKind";
import { HistoryDto, PayerMode } from "../types/history";
import {
  TransactionHeader,
  AmountCard,
  DebtInfoCard,
  WalletInfoCard,
  TransferDetailsCard,
  NoteCard,
  EditTransactionDialog,
  DeleteTransactionDialog,
  DebtDialog,
} from "./TransactionDetail";
import { useLanguage } from "@/context/LanguageContext";

// Utility functions
const extractGeneralError = (e: unknown): string => {
  if (!e) return "An error occurred. Please try again.";
  if (typeof e === "string") return e;
  if (typeof e === "object" && e !== null) {
    const obj = e as Record<string, unknown>;
    if (typeof obj.general === "string" && obj.general.trim().length > 0) return obj.general;
    if (typeof obj.message === "string" && obj.message.trim().length > 0) return obj.message;
    if (typeof obj.raw === "object" && obj.raw !== null) {
      const raw = obj.raw as Record<string, unknown>;
      if (typeof raw.message === "string" && raw.message.trim().length > 0) return raw.message;
    }
  }
  return "An error occurred. Please try again.";
};

const isLockLikeMessage = (msg: string): boolean => {
  const m = (msg ?? "").toLowerCase();
  return m.includes("lock") || m.includes("locked") || m.includes("conflict") || m.includes("closed") || m.includes("settled");
};

const formatDateForInput = (dateStr: string): string => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const TransactionDetailPage: React.FC = () => {
  const { t } = useLanguage();

  const params = useParams();
  const router = useRouter();
  const transactionId = params.id as string;

  const [transaction, setTransaction] = React.useState<HistoryDto | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [noteDraft, setNoteDraft] = React.useState("");
  const [transactionDateDraft, setTransactionDateDraft] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Debt dialog state
  const [isDebtOpen, setIsDebtOpen] = React.useState(false);
  const [debtPartnerId, setDebtPartnerId] = React.useState<string>("");
  const [debtPayerMode, setDebtPayerMode] = React.useState<PayerMode>(PayerMode.ToiTra);
  const [debtAmount, setDebtAmount] = React.useState<string>("");
  const [partners, setPartners] = React.useState<{ id: string; name: string; balance: number }[]>([]);
  const [isSavingDebt, setIsSavingDebt] = React.useState(false);

  // Load partners when debt dialog opens
  React.useEffect(() => {
    if (isDebtOpen) {
      getDebtPartners().then(setPartners).catch(() => setPartners([]));
    }
  }, [isDebtOpen]);

  const fetchTransaction = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getHistoryItem(transactionId);
      setTransaction(data);
      setNoteDraft(stripRepayMarker(data.note));
      setTransactionDateDraft(formatDateForInput(data.transactionDate));
      setDebtPartnerId(data.partnerId ?? "");
      setDebtPayerMode(data.payerMode ?? PayerMode.ToiTra);
      setDebtAmount(data.debtAmount != null ? String(data.debtAmount) : "");
    } catch (e: unknown) {
      setError(extractGeneralError(e));
    } finally {
      setIsLoading(false);
    }
  }, [transactionId]);

  React.useEffect(() => {
    fetchTransaction();
  }, [fetchTransaction]);

  const handleSaveEdit = React.useCallback(async () => {
    if (!transaction || transaction.isLocked) return;
    setIsSaving(true);
    try {
      const total = transaction.totalAmount ?? Math.abs(transaction.amount) ?? 0;
      await updateTransactionDebt(transaction.id, {
        partnerId: transaction.partnerId ?? undefined,
        payerMode: transaction.payerMode ?? PayerMode.ToiTra,
        total: total,
        debtAmount: transaction.debtAmount ?? undefined,
        note: isRepayNote(transaction.note) ? withRepayMarker(noteDraft) : noteDraft || undefined,
        transactionDate: transactionDateDraft ? new Date(transactionDateDraft).toISOString() : transaction.transactionDate,
      });
      toast.success(t.toast.walletUpdated);
      setIsEditOpen(false);
      await fetchTransaction();
    } catch (e: unknown) {
      const msg = extractGeneralError(e);
      if (isLockLikeMessage(msg)) {
        toast.error(t.history.page.failedToLoad);
        await fetchTransaction();
        return;
      }
      toast.error(msg || t.common.retry);
    } finally {
      setIsSaving(false);
    }
  }, [transaction, noteDraft, transactionDateDraft, fetchTransaction]);

  const handleSaveDebt = React.useCallback(async () => {
    if (!transaction || transaction.isLocked) return;
    setIsSavingDebt(true);
    try {
      const total = transaction.totalAmount ?? Math.abs(transaction.amount) ?? 0;
      const parsedDebtAmount = debtAmount ? Number(debtAmount.replace(/,/g, "")) : undefined;

      await updateTransactionDebt(transaction.id, {
        partnerId: debtPartnerId || undefined,
        payerMode: debtPayerMode,
        total: total,
        debtAmount: parsedDebtAmount,
        note: transaction.note ?? undefined,
        transactionDate: transaction.transactionDate,
      });
      toast.success(t.toast.partnerUpdated);
      setIsDebtOpen(false);
      await fetchTransaction();
    } catch (e: unknown) {
      const msg = extractGeneralError(e);
      if (isLockLikeMessage(msg)) {
        toast.error(t.history.page.failedToLoad);
        await fetchTransaction();
        return;
      }
      toast.error(msg || t.common.retry);
    } finally {
      setIsSavingDebt(false);
    }
  }, [transaction, debtPartnerId, debtPayerMode, debtAmount, fetchTransaction]);

  const handleDelete = React.useCallback(async () => {
    if (!transaction || transaction.isLocked) return;
    setIsDeleting(true);
    try {
      await deleteHistoryItem(transaction.id);
      toast.success(t.toast.transactionRecorded);
      router.push("/history");
    } catch (e: unknown) {
      const msg = extractGeneralError(e);
      if (isLockLikeMessage(msg)) {
        toast.error(t.history.page.failedToLoad);
        await fetchTransaction();
        return;
      }
      toast.error(msg || t.common.retry);
    } finally {
      setIsDeleting(false);
    }
  }, [transaction, router, fetchTransaction]);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/history">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-ink-black">{t.history.page.title}</h1>
        </div>
        <Card className="animate-pulse h-64" />
      </div>
    );
  }

  // Error state
  if (error || !transaction) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/history">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-ink-black">{t.history.page.title}</h1>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4 pb-4">
            <p className="text-red-600">{error || t.history.page.noTransactions}</p>
            <div className="pt-4">
              <Link href="/history">
                <Button variant="outline">{t.history.page.title}</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Computed values
  const isTransfer = transaction.transferId != null;
  const isLocked = Boolean(transaction.isLocked);
  const lockReason = t.history.page.failedToLoad;
  const isRepay = isRepayNote(transaction.note);

  return (
    <div className="space-y-6">
      <TransactionHeader isLocked={isLocked} lockReason={lockReason} />

      <AmountCard
        transaction={transaction}
        isLocked={isLocked}
        lockReason={lockReason}
        onEdit={() => setIsEditOpen(true)}
        onDelete={() => setIsDeleteOpen(true)}
        onAddDebt={() => setIsDebtOpen(true)}
      />

      {/* Two Column Layout */}
      <div className="grid gap-4 md:grid-cols-2">
        {transaction.partnerId ? (
          <>
            <DebtInfoCard transaction={transaction} isRepay={isRepay} />
            <WalletInfoCard transaction={transaction} />
            <NoteCard note={transaction.note} className="md:col-span-2" />
          </>
        ) : (
          <>
            <WalletInfoCard transaction={transaction} />
            <NoteCard note={transaction.note} className="bg-gray-50/30" />
          </>
        )}

        <TransferDetailsCard transaction={transaction} />
      </div>

      {/* Dialogs */}
      <EditTransactionDialog
        isOpen={isEditOpen}
        noteDraft={noteDraft}
        transactionDateDraft={transactionDateDraft}
        isSaving={isSaving}
        onNoteChange={setNoteDraft}
        onDateChange={setTransactionDateDraft}
        onSave={handleSaveEdit}
        onCancel={() => setIsEditOpen(false)}
      />

      <DeleteTransactionDialog
        isOpen={isDeleteOpen}
        isDeleting={isDeleting}
        onDelete={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />

      <DebtDialog
        isOpen={isDebtOpen}
        hasExistingDebt={!!transaction.partnerId}
        debtPartnerId={debtPartnerId}
        debtPayerMode={debtPayerMode}
        debtAmount={debtAmount}
        partners={partners}
        isSaving={isSavingDebt}
        onPartnerChange={setDebtPartnerId}
        onPayerModeChange={setDebtPayerMode}
        onDebtAmountChange={setDebtAmount}
        onSave={handleSaveDebt}
        onCancel={() => setIsDebtOpen(false)}
      />
    </div>
  );
};

export default TransactionDetailPage;
