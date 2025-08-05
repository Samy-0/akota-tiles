import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumbers(value?: string | number, showSymbol = true) {
  const newValue = typeof value === "string" ? parseFloat(value) : value ?? 0;

  if (!showSymbol) {
    return new Intl.NumberFormat("bn-BD", {
      style: "decimal",
      numberingSystem: "latn",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(newValue));
  }

  const formattedValue = new Intl.NumberFormat("bn-BD", {
    style: "currency",
    currency: "BDT",
    currencyDisplay: "narrowSymbol",
    numberingSystem: "latn",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(newValue));

  return formattedValue;
}
