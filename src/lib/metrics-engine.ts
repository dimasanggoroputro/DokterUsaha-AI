import { ConsultationData } from "@/types/diagnosis";

/**
 * Calculates real business metrics from consultation data.
 * All calculations are done in backend TypeScript — Gemini does NOT calculate.
 */
export interface BusinessMetrics {
  revenueChangePercent: number | null;
  conversionRate: number | null;
  hasMetrics: boolean;
  revenueStatus: "naik" | "turun" | "stabil" | null;
}

export function calculateBusinessMetrics(
  data: ConsultationData
): BusinessMetrics {
  const prev = data.revenuePrevMonth;
  const current = data.revenueCurrentMonth;
  const customers = data.dailyCustomers;
  const transactions = data.dailyTransactions;

  let revenueChangePercent: number | null = null;
  let revenueStatus: "naik" | "turun" | "stabil" | null = null;
  let conversionRate: number | null = null;
  let hasMetrics = false;

  // Revenue change calculation
  if (
    prev !== undefined &&
    prev !== null &&
    prev > 0 &&
    current !== undefined &&
    current !== null
  ) {
    revenueChangePercent = Math.round(((current - prev) / prev) * 100);
    hasMetrics = true;

    if (revenueChangePercent > 5) {
      revenueStatus = "naik";
    } else if (revenueChangePercent < -5) {
      revenueStatus = "turun";
    } else {
      revenueStatus = "stabil";
    }
  }

  // Conversion rate calculation
  if (
    customers !== undefined &&
    customers !== null &&
    customers > 0 &&
    transactions !== undefined &&
    transactions !== null &&
    transactions > 0
  ) {
    conversionRate = Math.round((transactions / customers) * 100);
    hasMetrics = true;
  }

  return {
    revenueChangePercent,
    conversionRate,
    hasMetrics,
    revenueStatus,
  };
}
