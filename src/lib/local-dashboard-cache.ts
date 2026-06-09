const CACHE_KEY = "dashboard-cache";
const MAX_ENTRIES = 50;

export type DashboardCacheEntry = {
  id: string;
  businessName: string;
  healthScore: number;
  healthStatus: string;
  createdAt: string;
};

/**
 * Reads the current cache array from localStorage.
 * Returns an empty array if cache doesn't exist or is corrupted.
 */
function readCache(): DashboardCacheEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Writes the cache array to localStorage.
 */
function writeCache(entries: DashboardCacheEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(entries));
  } catch (err) {
    console.warn("Dashboard cache write failed:", err);
  }
}

/**
 * Saves a single dashboard summary entry to the cache.
 * Deduplicates by ID and limits to MAX_ENTRIES.
 */
export function saveDashboardHistory(entry: DashboardCacheEntry): void {
  const cache = readCache();

  // Remove existing entry with same ID (dedup)
  const filtered = cache.filter((item) => item.id !== entry.id);

  // Prepend new entry (most recent first)
  filtered.unshift(entry);

  // Trim to max entries
  const trimmed = filtered.slice(0, MAX_ENTRIES);

  writeCache(trimmed);
}

/**
 * Returns all cached dashboard entries, sorted by createdAt desc.
 */
export function getDashboardHistory(): DashboardCacheEntry[] {
  const cache = readCache();
  return cache.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Overwrites the entire cache with fresh data from Supabase.
 * Used to keep the cache in sync when online.
 */
export function syncDashboardCache(entries: DashboardCacheEntry[]): void {
  const trimmed = entries.slice(0, MAX_ENTRIES);
  writeCache(trimmed);
}

/**
 * Clears the dashboard cache entirely.
 */
export function clearDashboardHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (err) {
    console.warn("Dashboard cache clear failed:", err);
  }
}
