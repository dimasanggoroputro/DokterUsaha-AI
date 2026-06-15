import { ConsultationData, DiagnosisResult } from "@/types/diagnosis";

const DETAIL_CACHE_PREFIX = "dokterusaha_diagnosis_detail_";

/**
 * Saves a full diagnosis details (inputs + AI output) to local cache for offline reading.
 */
export function saveFullDiagnosisToCache(
  id: string,
  consultationData: ConsultationData,
  diagnosisResult: DiagnosisResult,
): void {
  if (typeof window === "undefined" || !id) return;
  try {
    const key = `${DETAIL_CACHE_PREFIX}${id}`;
    const payload = {
      consultationData,
      diagnosisResult,
    };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch (err) {
    console.warn("Failed to cache full diagnosis offline:", err);
  }
}

/**
 * Retrieves a full cached diagnosis by ID.
 * Returns null if not found or corrupted.
 */
export function getFullDiagnosisFromCache(
  id: string,
): {
  consultationData: ConsultationData;
  diagnosisResult: DiagnosisResult;
} | null {
  if (typeof window === "undefined" || !id) return null;
  try {
    const key = `${DETAIL_CACHE_PREFIX}${id}`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.consultationData && parsed.diagnosisResult) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}


export function removeFullDiagnosisFromCache(id: string): void {
  if (typeof window === "undefined" || !id) return;
  try {
    const key = `${DETAIL_CACHE_PREFIX}${id}`;
    localStorage.removeItem(key);
  } catch (err) {
    console.warn("Failed to remove full cached diagnosis offline:", err);
  }
}