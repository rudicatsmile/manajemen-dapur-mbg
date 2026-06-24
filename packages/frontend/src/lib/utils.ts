import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date));
}

export function formatDateInput(date: Date): string {
  return date.toISOString().split('T')[0]!;
}

/** True bila error berasal dari kegagalan koneksi (Axios tanpa response), bukan error server. */
export function isNetworkError(err: unknown): boolean {
  if (typeof err !== 'object' || err === null) return false;
  const e = err as { code?: string; response?: unknown; message?: string };
  if (e.response) return false; // server merespons (4xx/5xx) → bukan network error
  return e.code === 'ERR_NETWORK' || e.message === 'Network Error' || !!e.code;
}
