import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Canonical money formatter for Vietnamese đồng (VND)
// - Groups digits with comma separators
// - Appends lowercase space-delimited suffix ' vnd'
// - Respects privacy setting (ma6_hide_amount)
export function formatVnd(value: number, forceShow?: boolean): string {
  if (typeof window !== "undefined" && (window as any).__ma6_temp_show) {
    return `${value.toLocaleString("en-US")} vnd`;
  }
  if (!forceShow && typeof window !== "undefined" && localStorage.getItem("ma6_hide_amount") === "true") {
    return "•••••• vnd";
  }
  return `${value.toLocaleString("en-US")} vnd`;
}
