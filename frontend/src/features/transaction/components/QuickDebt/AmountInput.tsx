import React from "react";
import { handleNumericKeyDown } from "@/lib/utils/numericInput";

interface AmountInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
  error?: string;
}

export const AmountInput: React.FC<AmountInputProps> = ({ value, onChange, disabled, error }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value.replace(/,/g, "").replace(/[^\d]/g, "");
    onChange(raw === "" ? 0 : Number(raw));
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-center text-sm font-medium text-ink-black">Total</label>
      <div className="relative">
        <input
          data-testid="qd-total"
          disabled={disabled}
          inputMode="numeric"
          placeholder="0"
          type="text"
          value={value ? Number(value).toLocaleString("en-US") : ""}
          onChange={handleChange}
          onKeyDown={handleNumericKeyDown}
          className="h-14 w-full rounded-lg border-2 border-note-yellow bg-white px-4 py-3 text-center text-2xl font-semibold text-ink-black outline-none transition-colors placeholder:text-pencil-gray focus:border-amber-500 focus:ring-2 focus:ring-note-yellow/30 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-pencil-gray">
          vnd
        </span>
      </div>
      {error && <p className="text-center text-xs text-red-500">{error}</p>}
    </div>
  );
};
