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
      <label className="block text-center text-sm font-bold text-ink-black">Total</label>
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
          className="h-14 w-full rounded-xl border-2 border-note-yellow bg-white px-4 py-3 text-center text-2xl font-bold text-ink-black outline-none transition-all placeholder:text-pencil-gray/60 focus:border-amber-400 focus:ring-2 focus:ring-note-yellow/30 shadow-xs disabled:cursor-not-allowed disabled:opacity-50"
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-pencil-gray/80">
          vnd
        </span>
      </div>
      {error && <p className="text-center text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
};
