import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (value: unknown): string => {
  const parsedValue = parseFloat(String(value));
  return (isNaN(parsedValue) ? 0 : parsedValue).toFixed(2);
};
