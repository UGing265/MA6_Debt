"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Loader2,
  Lock,
  AlertTriangle,
  Wallet2,
  Users,
  Calendar,
  FileText,
  ArrowLeftRight,
  Banknote,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { getHistoryItem, updateHistoryNote, deleteHistoryItem, updateTransactionDebt } from "../api/history";
import { getDebtPartners } from "@/features/debt/api/debtPartners";
import { HistoryDto, TransferDirection, PayerMode } from "../types/history";
import { formatVnd } from "@/lib/utils";

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

const formatDateTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const payerModeLabel = (mode?: PayerMode | null): string => {
  if (mode === PayerMode.ToiTra) return "Toi tra";
  if (mode === PayerMode.PartnerTra) return "Partner tra";
  return "-";
};

const handleNumericKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  // Allow: backspace, delete, tab, escape, enter, arrows
  if (
    e.key === "Backspace" ||
    e.key === "Delete" ||
    e.key === "Tab" ||
    e.key === "Escape" ||
    e.key === "Enter" ||
    e.key === "ArrowLeft" ||
    e.key === "ArrowRight" ||
    e.key === "ArrowUp" ||
    e.key === "ArrowDown" ||
    (e.ctrlKey && (e.key === "a" || e.key === "c" || e.key === "v" || e.key === "x"))
  ) {
    return;
  }
  // Block if not a number
  if (!/^\d$/.test(e.key)) {
    e.preventDefault();
  }
};

export const TransactionDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const transactionId = params.id as string;

  const [transaction, setTransaction] = React.useState<HistoryDto | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [noteDraft, setNoteDraft] = React.useState("");
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
      setNoteDraft(data.note ?? "");
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

  const handleSaveNote = React.useCallback(async () => {
    if (!transaction || transaction.isLocked) return;
    setIsSaving(true);
    try {
      await updateHistoryNote(transaction.id, noteDraft);
      toast.success("Note updated");
      setIsEditOpen(false);
      await fetchTransaction();
    } catch (e: unknown) {
      const msg = extractGeneralError(e);
      if (isLockLikeMessage(msg)) {
        toast.error("This transaction is locked and can't be changed.");
        await fetchTransaction();
        return;
      }
      toast.error(msg || "Failed to update note");
    } finally {
      setIsSaving(false);
    }
  }, [transaction, noteDraft, fetchTransaction]);

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
      toast.success("Debt info updated");
      setIsDebtOpen(false);
      await fetchTransaction();
    } catch (e: unknown) {
      const msg = extractGeneralError(e);
      if (isLockLikeMessage(msg)) {
        toast.error("This transaction is locked and can't be changed.");
        await fetchTransaction();
        return;
      }
      toast.error(msg || "Failed to update debt info");
    } finally {
      setIsSavingDebt(false);
    }
  }, [transaction, debtPartnerId, debtPayerMode, debtAmount, fetchTransaction]);

  const handleDelete = React.useCallback(async () => {
    if (!transaction || transaction.isLocked) return;
    setIsDeleting(true);
    try {
      await deleteHistoryItem(transaction.id);
      toast.success("Transaction deleted");
      router.push("/history");
    } catch (e: unknown) {
      const msg = extractGeneralError(e);
      if (isLockLikeMessage(msg)) {
        toast.error("This transaction is locked and can't be changed.");
        await fetchTransaction();
        return;
      }
      toast.error(msg || "Failed to delete transaction");
    } finally {
      setIsDeleting(false);
    }
  }, [transaction, router, fetchTransaction]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/history">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-ink-black">Transaction Details</h1>
        </div>
        <Card className="animate-pulse h-64" />
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/history">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-ink-black">Transaction Details</h1>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4 pb-4">
            <p className="text-red-600">{error || "Transaction not found"}</p>
            <div className="pt-4">
              <Link href="/history">
                <Button variant="outline">Back to History</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const amount = transaction.amount ?? 0;
  const isTransfer = transaction.transferId != null;
  const direction = transaction.transferDirection ?? null;
  const absAmount = Math.abs(amount);
  const isLocked = Boolean(transaction.isLocked);
  const lockReason = "This transaction is locked and can't be edited or deleted.";

  const sign = isTransfer
    ? direction === TransferDirection.Incoming
      ? "+"
      : "-"
    : amount >= 0
    ? "+"
    : "-";

  const transferLabel = isTransfer
    ? direction === TransferDirection.Incoming
      ? "Transfer In"
      : "Transfer Out"
    : "";

  const amountColor = isTransfer
    ? direction === TransferDirection.Incoming
      ? "text-green-600"
      : "text-red-600"
    : amount >= 0
    ? "text-green-600"
    : "text-red-600";

  const walletDisplay = transaction.walletName ?? "";
  const hasQuickDeduct = transaction.payerMode != null || transaction.totalAmount != null || transaction.debtAmount != null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/history">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-ink-black">Transaction Details</h1>
        </div>
        <div className="flex items-center gap-2">
          {isLocked && (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
              title={lockReason}
            >
              <Lock className="h-4 w-4" />
              Locked
            </span>
          )}
        </div>
      </div>

      {/* Amount Card */}
      <Card className="border-note-yellow/30">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-pencil-gray">Amount</p>
              <p className={`text-4xl font-bold ${amountColor}`}>
                {sign}
                {formatVnd(absAmount)}
              </p>
              {isTransfer && (
                <span
                  className={`inline-flex items-center mt-2 px-3 py-1 rounded-full text-sm ${
                    direction === TransferDirection.Incoming
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <ArrowLeftRight className="h-4 w-4 mr-1" />
                  {transferLabel}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {/* Add/Edit Debt button - only show for non-transfer transactions */}
              {!isTransfer && (
                <Button
                  variant="outline"
                  onClick={() => setIsDebtOpen(true)}
                  disabled={isLocked}
                  title={isLocked ? lockReason : transaction.partnerId ? "Edit debt info" : "Add debt info"}
                >
                  <Banknote className="h-4 w-4 mr-2" />
                  {transaction.partnerId ? "Edit Debt" : "Add Debt"}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setIsEditOpen(true)}
                disabled={isLocked}
                title={isLocked ? lockReason : "Edit note"}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => setIsDeleteOpen(true)}
                disabled={isLocked}
                title={isLocked ? lockReason : "Delete transaction"}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout: Debt Info | Wallet Info */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* LEFT COLUMN: Debt/Partner Info */}
        {transaction.partnerId && (
          <Card className="border-purple-200 bg-purple-50/30 md:row-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-purple-700">
                <Users className="h-5 w-5" />
                Debt Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Who owes whom - PROMINENT */}
              <div className="p-3 rounded-lg bg-white border border-purple-200">
                {transaction.payerMode === PayerMode.ToiTra ? (
                  <div>
                    <p className="text-xs text-pencil-gray mb-1">Partner owes you</p>
                    <p className="text-xl font-bold text-purple-700">{transaction.partnerName}</p>
                  </div>
                ) : transaction.payerMode === PayerMode.PartnerTra ? (
                  <div>
                    <p className="text-xs text-pencil-gray mb-1">You owe partner</p>
                    <p className="text-xl font-bold text-purple-700">{transaction.partnerName}</p>
                  </div>
                ) : (
                  <p className="text-xl font-bold text-purple-700">{transaction.partnerName}</p>
                )}
              </div>

              {/* Bill amounts */}
              <div className="grid grid-cols-2 gap-3">
                {transaction.totalAmount != null && (
                  <div className="p-2 rounded-lg bg-white border border-gray-200">
                    <p className="text-xs text-pencil-gray">Total Bill</p>
                    <p className="text-lg font-bold text-ink-black">{formatVnd(transaction.totalAmount)}</p>
                  </div>
                )}
                {transaction.debtAmount != null && transaction.debtAmount !== 0 ? (
                  <div className="p-2 rounded-lg bg-purple-100 border border-purple-200">
                    <p className="text-xs text-purple-600">Debt Amount</p>
                    <p className="text-lg font-bold text-purple-700">{formatVnd(transaction.debtAmount)}</p>
                  </div>
                ) : (
                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                    <p className="text-xs text-amber-600">Debt Amount</p>
                    <p className="text-sm font-medium text-amber-700">⚠️ Not set</p>
                  </div>
                )}
              </div>

              {/* Payer Mode */}
              {transaction.payerMode != null && (
                <div className="text-sm">
                  <span className="text-pencil-gray">Who paid: </span>
                  <span className="font-semibold text-ink-black">
                    {transaction.payerMode === PayerMode.ToiTra ? "You" : transaction.partnerName}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* RIGHT COLUMN: Wallet Info */}
        <div className="space-y-4">
          {/* Wallet */}
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-note-yellow/20 text-note-yellow flex items-center justify-center">
                  <Wallet2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-pencil-gray">Wallet</p>
                  <p className="font-semibold text-ink-black">{walletDisplay}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Date */}
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-pencil-gray">Date</p>
                  <p className="font-semibold text-ink-black">{formatDateTime(transaction.transactionDate)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Created At */}
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-pencil-gray">Created</p>
                  <p className="font-semibold text-ink-black">{formatDateTime(transaction.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Note - Full width below */}
        {transaction.note && (
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Note
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-ink-black whitespace-pre-wrap">{transaction.note}</p>
            </CardContent>
          </Card>
        )}

        {/* Transfer Details */}
        {isTransfer && (
          <Card className="border-blue-200 bg-blue-50/30 md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5 text-blue-600" />
                Transfer Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-sm text-pencil-gray">From</p>
                  <p className="font-bold text-ink-black">{transaction.transferFromWalletName || "Unknown"}</p>
                </div>
                <ArrowLeftRight className="h-6 w-6 text-blue-600" />
                <div className="text-center">
                  <p className="text-sm text-pencil-gray">To</p>
                  <p className="font-bold text-ink-black">{transaction.transferToWalletName || "Unknown"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogClose onClose={() => setIsEditOpen(false)} />
          <DialogHeader>
            <DialogTitle>Edit note</DialogTitle>
            <DialogDescription>Update the note for this transaction.</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Note</label>
            <textarea
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              placeholder="Add a note..."
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveNote} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogClose onClose={() => setIsDeleteOpen(false)} />
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle>Delete transaction</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Debt Dialog */}
      <Dialog open={isDebtOpen} onOpenChange={setIsDebtOpen}>
        <DialogContent>
          <DialogClose onClose={() => setIsDebtOpen(false)} />
          <DialogHeader>
            <DialogTitle>{transaction.partnerId ? "Edit Debt Info" : "Add Debt Info"}</DialogTitle>
            <DialogDescription>
              {transaction.partnerId
                ? "Update debt information for this transaction."
                : "Add debt information to track who owes whom."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Partner */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Partner</label>
              <select
                value={debtPartnerId}
                onChange={(e) => setDebtPartnerId(e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              >
                <option value="">Select partner</option>
                {partners.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({formatVnd(p.balance)})
                  </option>
                ))}
              </select>
            </div>

            {/* Payer Mode */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Who Paid?</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDebtPayerMode(PayerMode.ToiTra)}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    debtPayerMode === PayerMode.ToiTra
                      ? "bg-note-yellow text-ink-black"
                      : "border border-gray-200 bg-white text-pencil-gray hover:bg-gray-50"
                  }`}
                >
                  I Paid
                </button>
                <button
                  type="button"
                  onClick={() => setDebtPayerMode(PayerMode.PartnerTra)}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    debtPayerMode === PayerMode.PartnerTra
                      ? "bg-note-yellow text-ink-black"
                      : "border border-gray-200 bg-white text-pencil-gray hover:bg-gray-50"
                  }`}
                >
                  Partner Paid
                </button>
              </div>
            </div>

            {/* Debt Amount */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                {debtPayerMode === PayerMode.ToiTra ? "Partner Owes Me" : "I Owe Partner"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={debtAmount ? Number(debtAmount.replace(/,/g, "")).toLocaleString("en-US") : ""}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/,/g, "").replace(/[^\d]/g, "");
                    setDebtAmount(raw);
                  }}
                  onKeyDown={handleNumericKeyDown}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 pr-12 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-pencil-gray">vnd</span>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => setIsDebtOpen(false)} disabled={isSavingDebt}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveDebt} disabled={isSavingDebt}>
              {isSavingDebt ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionDetailPage;
