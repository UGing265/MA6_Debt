import React from "react";

/**
 * Handles keyboard events for numeric-only input fields.
 * Allows navigation, deletion, and control keys while blocking non-numeric characters.
 */
export const handleNumericKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
  if (!/^\d$/.test(e.key)) {
    e.preventDefault();
  }
};

/**
 * Formats a numeric value with thousand separators.
 */
export const formatNumericValue = (value: string): string => {
  if (!value) return "";
  return Number(value.replace(/,/g, "")).toLocaleString("en-US");
};

/**
 * Parses a formatted numeric string back to a plain number string.
 */
export const parseNumericInput = (input: string): string => {
  return input.replace(/,/g, "").replace(/[^\d]/g, "");
};
