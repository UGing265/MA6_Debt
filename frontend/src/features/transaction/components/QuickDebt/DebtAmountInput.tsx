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
      <label className="block text-left text-xs font-medium text-pencil-gray">Debt Amount</label>
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
          className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pr-10 text-sm text-ink-black outline-none transition-colors placeholder:text-pencil-gray focus:border-note-yellow focus:ring-2 focus:ring-note-yellow/30 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-pencil-gray">
          vnd
        </span>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
