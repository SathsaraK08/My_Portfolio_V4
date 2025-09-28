// Simple in-memory cache for skills data
interface CacheEntry<T> {
  data: T
  timestamp: number
}

let skillsCache: CacheEntry<any[]> | null = null

export function getSkillsCache(): CacheEntry<any[]> | null {
  return skillsCache
}

export function setSkillsCache(data: any[]): void {
  skillsCache = {
    data,
    timestamp: Date.now()
  }
}

export function invalidateSkillsCache(): void {
  skillsCache = null
}

export function isCacheValid(ttl: number): boolean {
  if (!skillsCache) return false
  return Date.now() - skillsCache.timestamp < ttl
}