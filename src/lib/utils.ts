import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format integer fils into AED currency string.
 * Example: 199900 fils -> "AED 1,999.00"
 */
export function formatAED(fils: number): string {
  const aed = fils / 100;
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(aed);
}

/**
 * Convert integer fils to AED float number (for display/charts only, not calculations)
 */
export function filsToAED(fils: number): number {
  return Number((fils / 100).toFixed(2));
}

/**
 * Convert AED float number to integer fils safely
 */
export function aedToFils(aed: number): number {
  return Math.round(aed * 100);
}

/**
 * Format UAE date nicely
 */
export function formatUAEDate(dateStringOrTimestamp: string | number | Date): string {
  const date = new Date(dateStringOrTimestamp);
  return new Intl.DateTimeFormat("en-AE", {
    timeZone: "Asia/Dubai",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
