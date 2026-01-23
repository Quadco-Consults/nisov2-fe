import { format, formatDistanceToNow, parseISO, differenceInDays } from "date-fns";

/**
 * Format currency with Naira symbol
 */
export function formatCurrency(
  amount: number | undefined | null,
  currency: string = "NGN"
): string {
  if (amount === undefined || amount === null) return "₦0.00";

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format number with commas
 */
export function formatNumber(num: number | undefined | null, decimals: number = 2): string {
  if (num === undefined || num === null) return "0";

  return new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Format energy in MWh or GWh
 */
export function formatEnergy(mwh: number): string {
  if (mwh >= 1000) {
    return `${formatNumber(mwh / 1000, 2)} GWh`;
  }
  return `${formatNumber(mwh, 2)} MWh`;
}

/**
 * Format power in MW or GW
 */
export function formatPower(mw: number): string {
  if (mw >= 1000) {
    return `${formatNumber(mw / 1000, 2)} GW`;
  }
  return `${formatNumber(mw, 2)} MW`;
}

/**
 * Format date
 */
export function formatDate(date: Date | string | undefined | null): string {
  if (!date) return "-";
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM d, yyyy");
}

/**
 * Format date with time
 */
export function formatDateTime(date: Date | string | undefined | null): string {
  if (!date) return "-";
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM d, yyyy HH:mm");
}

/**
 * Format short date
 */
export function formatDateShort(date: Date | string | undefined | null): string {
  if (!date) return "-";
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "dd/MM/yyyy");
}

/**
 * Format time ago
 */
export function formatTimeAgo(date: Date | string | undefined | null): string {
  if (!date) return "-";
  const d = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

/**
 * Format percentage
 */
export function formatPercentage(value: number | undefined | null, decimals: number = 2): string {
  if (value === undefined || value === null) return "0%";
  return `${value.toFixed(decimals)}%`;
}

/**
 * Get status badge colors
 */
export function getStatusColor(status: string): { bg: string; text: string } {
  const statusColors: Record<string, { bg: string; text: string }> = {
    // Payment/Invoice statuses
    paid: { bg: "bg-green-100", text: "text-green-700" },
    completed: { bg: "bg-green-100", text: "text-green-700" },
    verified: { bg: "bg-green-100", text: "text-green-700" },
    approved: { bg: "bg-green-100", text: "text-green-700" },
    active: { bg: "bg-green-100", text: "text-green-700" },

    pending: { bg: "bg-yellow-100", text: "text-yellow-700" },
    processing: { bg: "bg-blue-100", text: "text-blue-700" },
    in_progress: { bg: "bg-blue-100", text: "text-blue-700" },

    overdue: { bg: "bg-red-100", text: "text-red-700" },
    failed: { bg: "bg-red-100", text: "text-red-700" },
    rejected: { bg: "bg-red-100", text: "text-red-700" },
    cancelled: { bg: "bg-red-100", text: "text-red-700" },
    critical: { bg: "bg-red-100", text: "text-red-700" },

    partial: { bg: "bg-orange-100", text: "text-orange-700" },
    arrears: { bg: "bg-orange-100", text: "text-orange-700" },

    draft: { bg: "bg-gray-100", text: "text-gray-700" },
    inactive: { bg: "bg-gray-100", text: "text-gray-700" },

    // Debt aging
    current: { bg: "bg-green-100", text: "text-green-700" },
    "0-30": { bg: "bg-green-100", text: "text-green-700" },
    "31-60": { bg: "bg-yellow-100", text: "text-yellow-700" },
    "61-90": { bg: "bg-orange-100", text: "text-orange-700" },
    "90+": { bg: "bg-red-100", text: "text-red-700" },
    legal: { bg: "bg-red-100", text: "text-red-700" },
  };

  return statusColors[status.toLowerCase()] || { bg: "bg-gray-100", text: "text-gray-700" };
}

/**
 * Get aging bucket color class
 */
export function getAgingBucketColor(bucket: string): string {
  const colors: Record<string, string> = {
    "current": "border-l-green-500",
    "0-30": "border-l-green-500",
    "31-60": "border-l-yellow-500",
    "61-90": "border-l-orange-500",
    "90+": "border-l-red-500",
    "critical": "border-l-red-600",
    "legal": "border-l-purple-500",
  };
  return colors[bucket] || "border-l-gray-500";
}

/**
 * Generate reference number
 */
export function generateReferenceNumber(prefix: string = "REF"): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `${prefix}-${year}${month}-${random}`;
}

/**
 * Truncate text
 */
export function truncate(text: string, length: number = 50): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Calculate aging days from date
 */
export function calculateAgingDays(date: Date | string): number {
  const d = typeof date === "string" ? parseISO(date) : date;
  return differenceInDays(new Date(), d);
}

/**
 * Get aging bucket from days
 */
export function getAgingBucket(days: number): string {
  if (days <= 30) return "0-30";
  if (days <= 60) return "31-60";
  if (days <= 90) return "61-90";
  return "90+";
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Calculate Pool Health Index (PHI)
 */
export function calculatePHI(totalOwed: number, totalReceived: number): number {
  if (totalOwed === 0) return 100;
  return (totalReceived / totalOwed) * 100;
}

/**
 * Format PHI status
 */
export function getPHIStatus(phi: number): { status: string; color: string } {
  if (phi >= 95) return { status: "Healthy", color: "text-green-600" };
  if (phi >= 85) return { status: "Good", color: "text-blue-600" };
  if (phi >= 70) return { status: "Moderate", color: "text-yellow-600" };
  if (phi >= 50) return { status: "Poor", color: "text-orange-600" };
  return { status: "Critical", color: "text-red-600" };
}

/**
 * Calculate variance and check if flagged (±15% deviation)
 */
export function calculateVariance(expected: number, actual: number): { variance: number; flagged: boolean } {
  if (expected === 0) return { variance: 0, flagged: false };
  const variance = ((actual - expected) / expected) * 100;
  return { variance, flagged: Math.abs(variance) > 15 };
}
