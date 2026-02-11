// src/lib/cache.ts
class MemoryCache {
  private cache = new Map()
  private timers = new Map()

  set(key: string, value: any, ttl: number = 300000) { // 5 minutes default
    // Clear existing timer
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key))
    }

    // Set value
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    })

    // Set expiration timer
    const timer = setTimeout(() => {
      this.cache.delete(key)
      this.timers.delete(key)
    }, ttl)

    this.timers.set(key, timer)
  }

  get(key: string) {
    const item = this.cache.get(key)
    return item ? item.value : null
  }

  has(key: string) {
    return this.cache.has(key)
  }

  delete(key: string) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key))
      this.timers.delete(key)
    }
    this.cache.delete(key)
  }

  clear() {
    for (const timer of this.timers.values()) {
      clearTimeout(timer)
    }
    this.cache.clear()
    this.timers.clear()
  }
}

export const memoryCache = new MemoryCache()