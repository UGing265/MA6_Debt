import React from "react";
import { PayerMode } from "../../types/transaction";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface PayerModeToggleProps {
  value: PayerMode;
  onChange: (mode: PayerMode) => void;
  disabled: boolean;
}

export const PayerModeToggle: React.FC<PayerModeToggleProps> = ({ value, onChange, disabled }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-1.5">
      <label className="block text-left text-xs font-semibold text-ink-black">{t.quickDeduct.page.whoPaid}</label>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(PayerMode.ToiTra)}
          className={cn(
            "h-11 flex-1 rounded-xl px-4 py-2 text-sm font-bold transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
            value === PayerMode.ToiTra
              ? "bg-note-yellow text-ink-black border-2 border-note-yellow hover:bg-amber-400"
              : "bg-white text-pencil-gray border border-gray-200 hover:bg-gray-50 hover:text-ink-black font-medium"
          )}
        >
          {t.quickDeduct.page.payerMode.toiTra}
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(PayerMode.PartnerTra)}
          className={cn(
            "h-11 flex-1 rounded-xl px-4 py-2 text-sm font-bold transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
            value === PayerMode.PartnerTra
              ? "bg-note-yellow text-ink-black border-2 border-note-yellow hover:bg-amber-400"
              : "bg-white text-pencil-gray border border-gray-200 hover:bg-gray-50 hover:text-ink-black font-medium"
          )}
        >
          {t.quickDeduct.page.payerMode.partnerTra}
        </button>
      </div>
    </div>
  );
};
