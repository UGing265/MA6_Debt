"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatVnd } from "@/lib/utils";

export type BalanceDirection = "receivable" | "payable";

interface HybridBalanceInputProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
  disabled?: boolean;
  onValidityChange?: (isValid: boolean) => void;
}

/**
 * Hybrid Balance Input Component
 * 
 * Replaced legacy modes with a two-mode contract:
 * - Adjust Mode: Enter a non-negative delta and choose direction
 *   to apply against current balance (current + delta or current - delta).
 * - Set Mode: Enter a signed absolute balance (final target).
 * 
 * Sync Rule: When switching modes, we deterministically map values:
 * - Adjust -> Set: final target = current + delta
 * - Set -> Adjust: delta = target - current
 *
 * Balance Semantics:
 * - Positive (>0): Receivable (partner owes you)
 * - Negative (<0): Payable (you owe partner)
 * - Zero: Neutral
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

  // Mode states (two-mode contract: Adjust and Set)
  // Adjust: delta input (non-negative) + direction toggle
  const [amount, setAmount] = useState<string>("0");
  const [direction, setDirection] = useState<BalanceDirection>(
    value >= 0 ? "receivable" : "payable"
  );

  // Set: final signed balance input
  const [directValue, setDirectValue] = useState<string>(value.toString());

  // Inline validation state
  const [internalError, setInternalError] = useState<string | null>(null);

  // Track last modified mode for sync logic (keeps deterministic mapping)
  const [lastModified, setLastModified] = useState<"adjust" | "set">("adjust");

  // Tab state (mode selector)
  const [activeTab, setActiveTab] = useState<"adjust" | "set">("adjust");

  // Helper: format number with commas for display (for input value)
  function formatWithCommas(num: string): string {
    const digits = num.replace(/\D/g, "");
    const hasMinus = num.startsWith("-");
    const sign = hasMinus ? "-" : "";
    return sign + digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // Helper: format number with commas and append vnd suffix
  function formatInputWithCommasAndVnd(num: string): string {
    if (!num) return "";
    const cleaned = num.replace(/\D/g, "");
    const hasMinus = cleaned.startsWith("-");
    const sign = hasMinus ? "-" : "";
    const digits = cleaned.replace(/-/g, "");
    
    return sign + digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
      setDirectValue(formatWithCommas(value.toString()));
      lastNotifiedValueRef.current = value;
    }
  }, [value]);

  // Handle Adjust (delta) amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Remove non-numeric and commas for internal value, then re-format
    const cleaned = inputValue.replace(/[^0-9.-]/g, "");
    
    // Update formatted display value
    setAmount(formatWithCommas(cleaned));
    setLastModified("adjust");
    
    // Parse numeric value for logic
    const parseResult = parseMoneyInput(cleaned, /*allowNegative=*/ false);
    if (cleaned.trim() === "" || parseResult.valid) {
      const delta = cleaned.trim() === "" ? 0 : Math.abs(parseResult.value);
      const signedBalance = direction === "receivable" ? baseline + delta : baseline - delta;
      lastNotifiedValueRef.current = signedBalance;
      onChange(signedBalance);
      setDirectValue(formatWithCommas(signedBalance.toString()));
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
    setLastModified("adjust");
    
    // Recalculate signed balance with new direction using current delta
    // Use tolerant parser for delta (amount)
    const deltaParse = parseMoneyInput(amount, /*allowNegative=*/ false);
    const delta = deltaParse.valid ? Math.abs(deltaParse.value) : 0;
    const signedBalance = newDirection === "receivable" ? baseline + delta : baseline - delta;
    lastNotifiedValueRef.current = signedBalance;
    onChange(signedBalance);
    
    // Sync to Set mode
    setDirectValue(formatWithCommas(signedBalance.toString()));
  };

  // Handle direct mode input change
  const handleDirectValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Remove non-numeric and commas for internal value, then re-format
    const cleaned = inputValue.replace(/[^0-9.-]/g, "");
    
    // Update formatted display value
    setDirectValue(formatWithCommas(cleaned));
    setLastModified("set");
    
    // Use tolerant parser for signed values
    const parseResult = parseMoneyInput(cleaned, /*allowNegative=*/ true);
    if (cleaned.trim() === "" || parseResult.valid) {
      const numValue = cleaned.trim() === "" ? 0 : parseResult.value;
      lastNotifiedValueRef.current = numValue;
      onChange(numValue);
      // Sync to adjust mode
      const delta = Math.abs(numValue - baseline);
      setAmount(formatWithCommas(delta.toString()));
      setDirection(numValue - baseline >= 0 ? "receivable" : "payable");
      setInternalError(null);
      onValidityChange?.(true);
    } else {
      setInternalError("Invalid amount format");
      onValidityChange?.(false);
    }
  };

  // Local tolerant money string parser
  // Accepts 1,000,000 | 1.000.000 | 1 000 000 | optional vnd suffix
  function parseMoneyInput(input: string, allowNegative: boolean): { valid: boolean; value: number } {
    const raw = input.trim();
    if (raw === "") return { valid: true, value: 0 };
    let s = raw.replace(/\s*vnd$/i, "");
    const hasMinus = /^-/.test(s);
    if (hasMinus && !allowNegative) return { valid: false, value: 0 };
    s = s.replace(/[,\s]/g, "");
    let sign = 1;
    if (s.startsWith("-")) {
      sign = -1;
      s = s.substring(1);
    } else if (s.startsWith("+")) {
      s = s.substring(1);
    }
    const dotCount = (s.match(/\./g) || []).length;
    let numericStr = s;
    if (dotCount === 0) {
      numericStr = s.replace(/[^0-9]/g, "");
      if (numericStr.length === 0) return { valid: false, value: 0 };
      const val = parseInt(numericStr, 10);
      return { valid: true, value: sign * val };
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
      return { valid: true, value: sign * val };
    }
  }

  // On tab switch, apply deterministic mode mapping to keep contract intact
  const onTabChange = (val: string) => {
    const newTab = val as "adjust" | "set";
    if (newTab === activeTab) return;
    // Switching from Adjust to Set: compute final target using current delta
    if (activeTab === "adjust" && newTab === "set") {
      // Use tolerant parser for delta
      const deltaParse = parseMoneyInput(amount, /*allowNegative=*/ false);
      const delta = deltaParse.valid ? Math.abs(deltaParse.value) : 0;
      const signedBalance = direction === "receivable" ? baseline + delta : baseline - delta;
      lastNotifiedValueRef.current = signedBalance;
      onChange(signedBalance);
      setDirectValue(formatWithCommas(signedBalance.toString()));
    }
    // Switching from Set to Adjust: derive delta and direction from target and current
    if (activeTab === "set" && newTab === "adjust") {
      const currentTargetParse = parseMoneyInput(directValue, /*allowNegative=*/ true);
      const currentTarget = currentTargetParse.valid ? currentTargetParse.value : 0;
      const delta = Math.abs(currentTarget - baseline);
      setAmount(formatWithCommas(delta.toString()));
      setDirection(currentTarget - baseline >= 0 ? "receivable" : "payable");
    }
    setActiveTab(newTab);
    setLastModified(newTab);
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger type="button" value="adjust">Adjust</TabsTrigger>
          <TabsTrigger type="button" value="set">Set</TabsTrigger>
        </TabsList>

        {/* Adjust Mode Tab */}
        <TabsContent value="adjust" className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={amount}
                onChange={handleAmountChange}
                disabled={disabled}
                className={cn(
                  "bg-[#FDFCFB] border-[#4A2C2A]/10 focus:border-note-yellow focus:ring-note-yellow pr-12",
                  error && "border-red-500"
                )}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-pencil-gray select-none" aria-hidden="true">
                vnd
              </span>
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => handleDirectionToggle("receivable")}
                disabled={disabled}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-all text-sm whitespace-nowrap",
                  direction === "receivable"
                    ? "bg-green-500 text-white border-2 border-green-600"
                    : "bg-gray-100 text-gray-700 border-2 border-gray-300 hover:bg-gray-200"
                )}
              >
                Partner owes me
              </button>
              <button
                type="button"
                onClick={() => handleDirectionToggle("payable")}
                disabled={disabled}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-all text-sm whitespace-nowrap",
                  direction === "payable"
                    ? "bg-red-500 text-white border-2 border-red-600"
                    : "bg-gray-100 text-gray-700 border-2 border-gray-300 hover:bg-gray-200"
                )}
              >
                I owe partner
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Amount must be non-negative. Use direction to specify who owes whom.
          </p>
        </TabsContent>

        {/* Set Mode Tab */}
        <TabsContent value="set" className="space-y-2">
          <div className="relative">
            <Input
              type="text"
              inputMode="numeric"
              placeholder="0 (positive = receivable, negative = payable)"
              value={directValue}
              onChange={handleDirectValueChange}
              disabled={disabled}
              className={cn(
                "bg-[#FDFCFB] border-[#4A2C2A]/10 focus:border-note-yellow focus:ring-note-yellow pr-12",
                error && "border-red-500"
              )}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-pencil-gray select-none" aria-hidden="true">
              vnd
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Enter signed number: positive = receivable, negative = payable
          </p>
        </TabsContent>
      </Tabs>

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
