import type { HistoryDto } from "../types/history";

export const REPAY_NOTE_MARKER = "[repay]";

type HistoryKindInput = Pick<HistoryDto, "partnerId" | "note" | "transferId" | "amount">;

export type HistoryKind = "repay" | "bill" | "consume" | "salary" | "other";
export type HistoryKindTag = "repay" | "bill" | "consume" | "salary";

export const isRepayNote = (note?: string | null): boolean => {
  if (!note) {
    return false;
  }
  return /^\s*\[repay\](?:\s+|$)/i.test(note);
};

export const stripRepayMarker = (note?: string | null): string => {
  if (!note) {
    return "";
  }
  return note.replace(/^\s*\[repay\](?:\s+|$)/i, "").trim();
};

export const withRepayMarker = (note?: string): string => {
  const cleaned = stripRepayMarker(note);
  if (!cleaned) {
    return REPAY_NOTE_MARKER;
  }
  return `${REPAY_NOTE_MARKER} ${cleaned}`;
};

export const getHistoryKind = (item: HistoryKindInput): HistoryKind => {
  if (item.partnerId) {
    if (isRepayNote(item.note)) {
      return "repay";
    }
    return "bill";
  }

  if (item.transferId) {
    return "other";
  }

  if (item.amount < 0) {
    return "consume";
  }

  if (item.amount > 0) {
    return "salary";
  }

  return "other";
};

export const getHistoryKindTag = (item: HistoryKindInput): HistoryKindTag | null => {
  const kind = getHistoryKind(item);
  if (kind === "other") {
    return null;
  }
  return kind;
};

export const getHistoryKindTagClasses = (tag: HistoryKindTag): string => {
  if (tag === "repay") {
    return "bg-emerald-100 text-emerald-700";
  }
  if (tag === "bill") {
    return "bg-sky-100 text-sky-700";
  }
  if (tag === "consume") {
    return "bg-orange-100 text-orange-700";
  }
  return "bg-green-100 text-green-700";
};
