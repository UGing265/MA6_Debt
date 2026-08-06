"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { formatVnd, cn } from "@/lib/utils";
import { ChevronDown, X } from "lucide-react";

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
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedPartner = useMemo(
    () => partners.find((p) => p.id === value),
    [partners, value]
  );

  // Filter partners by search query
  const filteredPartners = useMemo(() => {
    if (!searchQuery.trim()) return partners;
    const query = searchQuery.toLowerCase().trim();
    return partners.filter((p) => p.name.toLowerCase().includes(query));
  }, [partners, searchQuery]);

  const isControlDisabled = disabled || isLoading;

  // Display value for input: if user is typing, show searchQuery; if selected, show selected name + balance
  const displayInputValue = isOpen
    ? searchQuery
    : selectedPartner
    ? `${selectedPartner.name} (${formatVnd(selectedPartner.balance)})`
    : "";

  return (
    <div className="space-y-1.5 relative" ref={containerRef}>
      <label className="block text-left text-xs font-semibold text-ink-black">Partner</label>

      {/* Hidden input for automated tests */}
      <input data-testid="qd-partner" type="hidden" value={value ?? ""} />

      {/* Hybrid Search Combobox Input */}
      <div className="relative flex items-center">
        <input
          type="text"
          disabled={isControlDisabled}
          placeholder={isLoading ? "Loading..." : "Select partner or search..."}
          value={displayInputValue}
          onFocus={() => {
            setSearchQuery("");
            setIsOpen(true);
          }}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          className={cn(
            "h-11 w-full rounded-xl bg-white px-3.5 py-2 pr-12 text-sm text-ink-black outline-none transition-all placeholder:text-pencil-gray/70 focus:border-amber-400 focus:ring-2 focus:ring-note-yellow/30 shadow-xs disabled:cursor-not-allowed disabled:opacity-50 border",
            isOpen
              ? "border-2 border-note-yellow font-semibold"
              : "border-gray-200 hover:border-gray-300 font-medium"
          )}
        />

        <div className="absolute right-2 flex items-center gap-1 text-pencil-gray">
          {selectedPartner && !isControlDisabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
                setSearchQuery("");
              }}
              className="p-1 hover:text-ink-black transition-colors rounded-full"
              title="Clear selection"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            disabled={isControlDisabled}
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:text-ink-black transition-colors"
          >
            <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />
          </button>
        </div>
      </div>

      {/* Floating Filtered Partners List */}
      {isOpen && !isControlDisabled && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 max-h-56 overflow-y-auto rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl space-y-0.5 animate-in fade-in-50 zoom-in-95">
          {filteredPartners.length === 0 ? (
            <div className="px-3 py-2 text-xs text-pencil-gray text-center font-medium select-none">
              No matching partners
            </div>
          ) : (
            filteredPartners.map((partner) => {
              const isSelected = partner.id === value;
              return (
                <div
                  key={partner.id}
                  onClick={() => {
                    onChange(partner.id);
                    setSearchQuery("");
                    setIsOpen(false);
                  }}
                  className={cn(
                    "px-3 py-2 text-sm rounded-lg cursor-pointer flex items-center justify-between transition-colors",
                    isSelected
                      ? "bg-note-yellow/30 font-bold text-ink-black"
                      : "text-ink-black hover:bg-amber-50 font-medium"
                  )}
                >
                  <span className="truncate">{partner.name}</span>
                  <span className={cn("text-xs font-semibold shrink-0 ml-2", isSelected ? "text-ink-black" : "text-pencil-gray")}>
                    {formatVnd(partner.balance)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}

      {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
};
