"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

interface NoteInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  error?: string;
}

export const NoteInput: React.FC<NoteInputProps> = ({ value, onChange, disabled, error }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-1.5">
      <label className="block text-left text-xs font-semibold text-ink-black">{t.quickDeduct.page.note}</label>
      <input
        disabled={disabled}
        placeholder={t.quickDeduct.page.notePlaceholder}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-gray-200 hover:border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-ink-black outline-none transition-all placeholder:text-pencil-gray/70 focus:border-amber-400 focus:ring-2 focus:ring-note-yellow/30 shadow-xs disabled:cursor-not-allowed disabled:opacity-50"
      />
      {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
};
