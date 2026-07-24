import React from "react";
import { handleNumericKeyDown } from "@/lib/utils/numericInput";

interface DebtAmountInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
  error?: string;
}

export const DebtAmountInput: React.FC<DebtAmountInputProps> = ({ value, onChange, disabled, error }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value.replace(/,/g, "").replace(/[^\d]/g, "");
    onChange(raw === "" ? 0 : Number(raw));
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-left text-xs font-semibold text-ink-black">Debt Amount</label>
      <div className="relative">
        <input
          data-testid="qd-debt-amount"
          disabled={disabled}
          inputMode="numeric"
          placeholder="0"
          type="text"
          value={value ? value.toLocaleString("en-US") : ""}
          onChange={handleChange}
          onKeyDown={handleNumericKeyDown}
          className="h-11 w-full rounded-xl border border-gray-200 hover:border-gray-300 bg-white px-3.5 py-2 pr-12 text-sm font-medium text-ink-black outline-none transition-all placeholder:text-pencil-gray/70 focus:border-amber-400 focus:ring-2 focus:ring-note-yellow/30 shadow-xs disabled:cursor-not-allowed disabled:opacity-50"
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-pencil-gray/80">
          vnd
        </span>
      </div>
      {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
};
