import React from "react";
import { formatVnd } from "@/lib/utils";

interface Partner {
  id: string;
  name: string;
  balance: number;
}

interface PartnerSelectProps {
  value: string;
  onChange: (value: string) => void;
  partners: Partner[];
  isLoading: boolean;
  disabled: boolean;
  error?: string;
}

export const PartnerSelect: React.FC<PartnerSelectProps> = ({
  value,
  onChange,
  partners,
  isLoading,
  disabled,
  error,
}) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-left text-xs font-medium text-pencil-gray">Partner</label>
      <select
        data-testid="qd-partner"
        disabled={disabled || isLoading}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-ink-black outline-none transition-colors focus:border-note-yellow focus:ring-2 focus:ring-note-yellow/30 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">{isLoading ? "Loading..." : "Select partner"}</option>
        {partners.map((partner) => (
          <option key={partner.id} value={partner.id}>
            {partner.name} ({formatVnd(partner.balance)})
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
