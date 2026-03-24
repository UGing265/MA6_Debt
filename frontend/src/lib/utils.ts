import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Canonical money formatter for Vietnamese đồng (VND)
// - Groups digits with comma separators
// - Appends lowercase space-delimited suffix ' vnd'
export function formatVnd(value: number): string {
  return `${value.toLocaleString("en-US")} vnd`;
}
