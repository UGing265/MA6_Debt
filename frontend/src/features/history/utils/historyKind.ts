import type { HistoryDto } from "../types/history";

export const REPAY_NOTE_MARKER = "[repay]";

type HistoryKindInput = Pick<HistoryDto, "partnerId" | "note">;

export type HistoryKind = "repay" | "bill" | "other";

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
  if (!item.partnerId) {
    return "other";
  }
  if (isRepayNote(item.note)) {
    return "repay";
  }
  return "bill";
};

export const getHistoryKindTag = (item: HistoryKindInput): "repay" | "bill" | null => {
  const kind = getHistoryKind(item);
  if (kind === "other") {
    return null;
  }
  return kind;
};
