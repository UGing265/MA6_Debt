import React from "react";
import { PayerMode } from "../../types/transaction";

interface PayerModeToggleProps {
  value: PayerMode;
  onChange: (mode: PayerMode) => void;
  disabled: boolean;
}

export const PayerModeToggle: React.FC<PayerModeToggleProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-left text-xs font-medium text-pencil-gray">Who Paid?</label>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(PayerMode.ToiTra)}
          className={`h-10 flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            value === PayerMode.ToiTra
              ? "bg-note-yellow text-ink-black hover:bg-amber-400"
              : "border border-gray-200 bg-white text-pencil-gray hover:bg-gray-50"
          }`}
        >
          I Pay
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(PayerMode.PartnerTra)}
          className={`h-10 flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            value === PayerMode.PartnerTra
              ? "bg-note-yellow text-ink-black hover:bg-amber-400"
              : "border border-gray-200 bg-white text-pencil-gray hover:bg-gray-50"
          }`}
        >
          Partner Pays
        </button>
      </div>
    </div>
  );
};
