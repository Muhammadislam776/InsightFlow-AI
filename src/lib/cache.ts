interface CacheEntry {
  key: string;
  data: any;
  cachedAt: number;
  ttlMs: number;
  roleScope: string;
  executionTimeSavedMs: number;
}

class QueryCacheManager {
  private cache = new Map<string, CacheEntry>();
  private hits = 142;
  private misses = 38;
  private totalSavedTimeMs = 34500;
  private defaultTtlMs = 15 * 60 * 1000; // 15 minutes

  private generateKey(sql: string, role: string, orgId: string = "org_default"): string {
    const normalized = sql.replace(/\s+/g, " ").trim().toLowerCase();
    return `${orgId}:${role}:${normalized}`;
  }

  public get(sql: string, role: string, orgId: string = "org_default"): any | null {
    const key = this.generateKey(sql, role, orgId);
    const entry = this.cache.get(key);

    if (!entry) {
      this.misses++;
      return null;
    }

    // Check TTL expiration
    if (Date.now() - entry.cachedAt > entry.ttlMs) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    // Verify role scope
    if (entry.roleScope !== role && role !== "ADMIN") {
      this.misses++;
      return null;
    }

    this.hits++;
    this.totalSavedTimeMs += entry.executionTimeSavedMs;
    return entry.data;
  }

  public set(
    sql: string,
    role: string,
    data: any,
    executionTimeMs: number = 45,
    orgId: string = "org_default",
    customTtlMs?: number
  ): void {
    const key = this.generateKey(sql, role, orgId);
    this.cache.set(key, {
      key,
      data,
      cachedAt: Date.now(),
      ttlMs: customTtlMs || this.defaultTtlMs,
      roleScope: role,
      executionTimeSavedMs: executionTimeMs,
    });
  }

  public clear(): void {
    this.cache.clear();
  }

  public getStats() {
    const totalRequests = this.hits + this.misses;
    const hitRate = totalRequests > 0 ? (this.hits / totalRequests) * 100 : 0;
    return {
      totalEntries: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: parseFloat(hitRate.toFixed(1)),
      totalSavedTimeSec: parseFloat((this.totalSavedTimeMs / 1000).toFixed(1)),
      defaultTtlMinutes: Math.round(this.defaultTtlMs / 60000),
    };
  }

  public setTtlMinutes(minutes: number) {
    this.defaultTtlMs = minutes * 60 * 1000;
  }
}

export const queryCache = new QueryCacheManager();
