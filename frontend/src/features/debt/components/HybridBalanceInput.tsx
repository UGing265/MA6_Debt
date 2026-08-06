"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { cn, formatVnd } from "@/lib/utils";

export type BalanceDirection = "receivable" | "payable";

const handleNumericKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  // Allow: backspace, delete, tab, escape, enter, arrows, select all, copy, paste, cut
  if (
    e.key === "Backspace" ||
    e.key === "Delete" ||
    e.key === "Tab" ||
    e.key === "Escape" ||
    e.key === "Enter" ||
    e.key === "ArrowLeft" ||
    e.key === "ArrowRight" ||
    e.key === "ArrowUp" ||
    e.key === "ArrowDown" ||
    (e.ctrlKey && (e.key === "a" || e.key === "c" || e.key === "v" || e.key === "x"))
  ) {
    return;
  }
  // Block if not a number
  if (!/^\d$/.test(e.key)) {
    e.preventDefault();
  }
};

interface HybridBalanceInputProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
  disabled?: boolean;
  onValidityChange?: (isValid: boolean) => void;
}

/**
 * Balance Adjustment Input Component
 * 
 * Mode: Adjust (Delta + Direction)
 * - Enter a non-negative amount delta and select direction
 * - Calculates signed balance against baseline (current balance):
 *   baseline + delta (Receivable) or baseline - delta (Payable)
 */
export function HybridBalanceInput({
  value,
  onChange,
  error,
  disabled = false,
  onValidityChange,
}: HybridBalanceInputProps) {
  const [baseline, setBaseline] = useState<number>(value);
  const mountedRef = useRef(false);
  const lastNotifiedValueRef = useRef<number>(value);

  // Adjust mode state: delta input (non-negative) + direction toggle
  const [amount, setAmount] = useState<string>("0");
  const [direction, setDirection] = useState<BalanceDirection>(
    value >= 0 ? "receivable" : "payable"
  );

  // Inline validation state
  const [internalError, setInternalError] = useState<string | null>(null);

  // Helper: format number with commas for display
  function formatWithCommas(num: string): string {
    const digits = num.replace(/\D/g, "");
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // On first mount, capture baseline from initial value
  useEffect(() => {
    if (!mountedRef.current) {
      setBaseline(value);
      mountedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (value !== lastNotifiedValueRef.current) {
      setBaseline(value);
      setAmount("0");
      setDirection(value >= 0 ? "receivable" : "payable");
      lastNotifiedValueRef.current = value;
    }
  }, [value]);

  // Handle Adjust (delta) amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const cleaned = inputValue.replace(/[^0-9.-]/g, "");

    setAmount(formatWithCommas(cleaned));

    const parseResult = parseMoneyInput(cleaned);
    if (cleaned.trim() === "" || parseResult.valid) {
      const delta = cleaned.trim() === "" ? 0 : Math.abs(parseResult.value);
      const signedBalance = direction === "receivable" ? baseline + delta : baseline - delta;
      lastNotifiedValueRef.current = signedBalance;
      onChange(signedBalance);
      setInternalError(null);
      onValidityChange?.(true);
    } else {
      setInternalError("Invalid amount format");
      onValidityChange?.(false);
    }
  };

  // Handle direction toggle
  const handleDirectionToggle = (newDirection: BalanceDirection) => {
    setDirection(newDirection);

    const deltaParse = parseMoneyInput(amount);
    const delta = deltaParse.valid ? Math.abs(deltaParse.value) : 0;
    const signedBalance = newDirection === "receivable" ? baseline + delta : baseline - delta;
    lastNotifiedValueRef.current = signedBalance;
    onChange(signedBalance);
  };

  // Local tolerant money string parser (non-negative)
  function parseMoneyInput(input: string): { valid: boolean; value: number } {
    const raw = input.trim();
    if (raw === "") return { valid: true, value: 0 };
    let s = raw.replace(/\s*vnd$/i, "");
    if (/^-/.test(s)) return { valid: false, value: 0 };
    s = s.replace(/[,\s]/g, "");
    if (s.startsWith("+")) {
      s = s.substring(1);
    }
    const dotCount = (s.match(/\./g) || []).length;
    let numericStr = s;
    if (dotCount === 0) {
      numericStr = s.replace(/[^0-9]/g, "");
      if (numericStr.length === 0) return { valid: false, value: 0 };
      const val = parseInt(numericStr, 10);
      return { valid: true, value: val };
    } else {
      const lastDotIndex = s.lastIndexOf(".");
      const digitsAfterLastDot = s.substring(lastDotIndex + 1);
      if (digitsAfterLastDot.length <= 2) {
        const withoutDots = s.replace(/\./g, "");
        const withDecimal = withoutDots.slice(0, withoutDots.length - digitsAfterLastDot.length) + "." + digitsAfterLastDot;
        numericStr = withDecimal;
      } else {
        numericStr = s.replace(/\./g, "");
      }
      numericStr = numericStr.replace(/[^0-9.]/g, "");
      const val = parseFloat(numericStr);
      if (isNaN(val)) return { valid: false, value: 0 };
      return { valid: true, value: val };
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={amount}
              onChange={handleAmountChange}
              onKeyDown={handleNumericKeyDown}
              disabled={disabled}
              className={cn(
                "min-h-[44px] rounded-lg border border-gray-200 bg-white text-sm text-ink-black outline-none transition-colors duration-200 focus:border-note-yellow focus:ring-2 focus:ring-note-yellow/30 pr-12",
                error && "border-red-500"
              )}
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-pencil-gray select-none"
              aria-hidden="true"
            >
              vnd
            </span>
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => handleDirectionToggle("receivable")}
              disabled={disabled}
              className={cn(
                "min-h-[44px] px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-in-out text-sm whitespace-nowrap cursor-pointer",
                direction === "receivable"
                  ? "bg-note-yellow text-ink-black border border-note-yellow/40 shadow-sm"
                  : "bg-white text-ink-black/70 border border-gray-200 hover:bg-gray-50 active:scale-[0.98]"
              )}
            >
              Partner owes me
            </button>
            <button
              type="button"
              onClick={() => handleDirectionToggle("payable")}
              disabled={disabled}
              className={cn(
                "min-h-[44px] px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-in-out text-sm whitespace-nowrap cursor-pointer",
                direction === "payable"
                  ? "bg-slate-900 text-white border border-slate-900 shadow-sm"
                  : "bg-white text-ink-black/70 border border-gray-200 hover:bg-gray-50 active:scale-[0.98]"
              )}
            >
              I owe partner
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Enter amount to adjust balance. Choose direction to specify who owes whom.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-500 font-medium">{error}</p>
      )}
      {internalError && (
        <p className="text-sm text-red-500 font-medium">{internalError}</p>
      )}

      {/* Current Value Preview */}
      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Current Balance:</span>{" "}
          <span
            className={cn(
              "font-bold",
              value > 0 && "text-green-600",
              value < 0 && "text-red-600",
              value === 0 && "text-gray-600"
            )}
          >
            {formatVnd(value)}
          </span>{" "}
          {value > 0 && "(Receivable - Partner owes you)"}
          {value < 0 && "(Payable - You owe this partner)"}
          {value === 0 && "(Neutral)"}
        </p>
      </div>
    </div>
  );
}

