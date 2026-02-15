"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type BalanceDirection = "receivable" | "payable";

interface HybridBalanceInputProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
  disabled?: boolean;
}

/**
 * Hybrid Balance Input Component
 * 
 * Supports two input modes with deterministic sync:
 * - Guided Mode: Amount (>=0) + Direction Toggle
 * - Direct Mode: Signed number input
 * 
 * Sync Rule: Latest user action wins
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
}: HybridBalanceInputProps) {
  // Guided mode state
  const [amount, setAmount] = useState<string>(Math.abs(value).toString());
  const [direction, setDirection] = useState<BalanceDirection>(
    value >= 0 ? "receivable" : "payable"
  );
  
  // Direct mode state
  const [directValue, setDirectValue] = useState<string>(value.toString());
  
  // Track last modified mode for sync logic
  const [lastModified, setLastModified] = useState<"guided" | "direct">("guided");

  // Sync from external value changes (e.g., form reset)
  useEffect(() => {
    const absValue = Math.abs(value);
    const newDirection: BalanceDirection = value >= 0 ? "receivable" : "payable";
    
    setAmount(absValue.toString());
    setDirection(newDirection);
    setDirectValue(value.toString());
  }, [value]);

  // Handle guided mode amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty string or valid non-negative numbers
    if (inputValue === "" || /^\d*\.?\d*$/.test(inputValue)) {
      setAmount(inputValue);
      setLastModified("guided");
      
      // Calculate signed balance
      const numValue = inputValue === "" ? 0 : parseFloat(inputValue);
      const signedBalance = direction === "receivable" ? numValue : -numValue;
      onChange(signedBalance);
      
      // Sync to direct mode
      setDirectValue(signedBalance.toString());
    }
  };

  // Handle direction toggle
  const handleDirectionToggle = (newDirection: BalanceDirection) => {
    setDirection(newDirection);
    setLastModified("guided");
    
    // Recalculate signed balance with new direction
    const numValue = amount === "" ? 0 : parseFloat(amount);
    const signedBalance = newDirection === "receivable" ? numValue : -numValue;
    onChange(signedBalance);
    
    // Sync to direct mode
    setDirectValue(signedBalance.toString());
  };

  // Handle direct mode input change
  const handleDirectValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty string, negative sign, or valid numbers
    if (inputValue === "" || inputValue === "-" || /^-?\d*\.?\d*$/.test(inputValue)) {
      setDirectValue(inputValue);
      setLastModified("direct");
      
      // Calculate and propagate value
      const numValue = inputValue === "" || inputValue === "-" ? 0 : parseFloat(inputValue);
      onChange(numValue);
      
      // Sync to guided mode
      const absValue = Math.abs(numValue);
      setAmount(absValue.toString());
      setDirection(numValue >= 0 ? "receivable" : "payable");
    }
  };

  return (
    <div className="space-y-4">
      {/* Guided Mode */}
      <div className="space-y-2">
        <Label className="text-gray-700 font-medium">Guided Mode</Label>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={handleAmountChange}
              disabled={disabled}
              className={cn(
                "bg-[#FDFCFB] border-[#4A2C2A]/10 focus:border-[#FF7A00] focus:ring-[#FF7A00]",
                error && "border-red-500"
              )}
            />
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
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-[#FFFBEB] px-2 text-gray-500">OR</span>
        </div>
      </div>

      {/* Direct Mode */}
      <div className="space-y-2">
        <Label className="text-gray-700 font-medium">Direct Mode</Label>
        <Input
          type="text"
          inputMode="decimal"
          placeholder="0 (positive = receivable, negative = payable)"
          value={directValue}
          onChange={handleDirectValueChange}
          disabled={disabled}
          className={cn(
            "bg-[#FDFCFB] border-[#4A2C2A]/10 focus:border-[#FF7A00] focus:ring-[#FF7A00]",
            error && "border-red-500"
          )}
        />
        <p className="text-xs text-gray-500">
          Enter signed number: positive = receivable, negative = payable
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-500 font-medium">{error}</p>
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
            {value.toFixed(2)}
          </span>{" "}
          {value > 0 && "(Receivable - Partner owes you)"}
          {value < 0 && "(Payable - You owe this partner)"}
          {value === 0 && "(Neutral)"}
        </p>
      </div>
    </div>
  );
}
