export const ERROR_MESSAGES = {
  geminiOverload:
    "Dokter AI sedang melayani banyak konsultasi saat ini. Silakan coba lagi dalam beberapa menit.",
  geminiRateLimit:
    "Permintaan konsultasi sedang ramai. Mohon tunggu beberapa saat lalu coba kembali.",
  noInternet:
    "Tidak ada koneksi internet. Periksa jaringan Anda lalu coba lagi.",
  timeout:
    "Proses diagnosis membutuhkan waktu lebih lama dari biasanya. Silakan coba kembali.",
  supabase:
    "Data tidak dapat diproses saat ini. Silakan coba kembali beberapa saat lagi.",
  notFoundDiagnosis: "Hasil diagnosis yang Anda cari tidak ditemukan.",
  notFoundHistory: "Riwayat diagnosis tidak ditemukan.",
  apiKey:
    "Layanan diagnosis sedang dalam pemeliharaan. Silakan coba kembali nanti.",
  unknown:
    "Terjadi kendala pada sistem. Silakan coba kembali beberapa saat lagi.",
};

function normalizeErrorMessage(error: unknown): string {
  if (!error) return "";
  if (error instanceof Error && error.message) return error.message;

  if (typeof error === "string") return error;

  if (typeof error === "object") {
    try {
      return JSON.stringify(error);
    } catch {
      return String(error);
    }
  }

  return String(error);
}

function containsAny(message: string, patterns: string[]) {
  return patterns.some((pattern) => message.includes(pattern));
}

function isOfflineError(error: unknown): boolean {
  const message = normalizeErrorMessage(error).toLowerCase();
  return (
    message.includes("offline") ||
    message.includes("failed to fetch") ||
    message.includes("networkerror") ||
    message.includes("network") ||
    message.includes("econnreset") ||
    message.includes("etimedout") ||
    message.includes("fetch failed") ||
    message.includes("dns")
  );
}

function isTimeoutError(error: unknown): boolean {
  const message = normalizeErrorMessage(error).toLowerCase();
  return containsAny(message, [
    "timeout",
    "timedout",
    "time out",
    "deadline exceeded",
    "request timeout",
  ]);
}

function isGeminiOverloadError(error: unknown): boolean {
  const message = normalizeErrorMessage(error).toLowerCase();
  return (
    containsAny(message, ["503", "unavailable", "high demand"]) &&
    !containsAny(message, ["429", "resource_exhausted"])
  );
}

function isGeminiRateLimitError(error: unknown): boolean {
  const message = normalizeErrorMessage(error).toLowerCase();
  return containsAny(message, ["429", "resource_exhausted", "rate limit"]);
}

function isSupabaseError(error: unknown): boolean {
  const message = normalizeErrorMessage(error).toLowerCase();
  return containsAny(message, [
    "supabase",
    "database",
    "rls",
    "connection",
    "insert failed",
    "fetch failed",
    "select failed",
    "query failed",
  ]);
}

function isApiKeyError(error: unknown): boolean {
  const message = normalizeErrorMessage(error).toLowerCase();
  return containsAny(message, [
    "api key",
    "api_key",
    "kunci api",
    "invalid api",
    "missing api",
    "unauthorized",
    "unauthenticated",
  ]);
}

export function getUserFriendlyErrorMessage(error: unknown): string {
  const normalized = normalizeErrorMessage(error).toLowerCase();

  if (typeof window !== "undefined" && !navigator.onLine) {
    return ERROR_MESSAGES.noInternet;
  }

  if (isGeminiOverloadError(normalized)) {
    return ERROR_MESSAGES.geminiOverload;
  }

  if (isGeminiRateLimitError(normalized)) {
    return ERROR_MESSAGES.geminiRateLimit;
  }

  if (isApiKeyError(normalized)) {
    return ERROR_MESSAGES.apiKey;
  }

  if (isTimeoutError(normalized)) {
    return ERROR_MESSAGES.timeout;
  }

  if (isOfflineError(normalized)) {
    return ERROR_MESSAGES.noInternet;
  }

  if (isSupabaseError(normalized)) {
    return ERROR_MESSAGES.supabase;
  }

  return ERROR_MESSAGES.unknown;
}
