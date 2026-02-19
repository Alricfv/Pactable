/**
 * Global request throttle to prevent hitting Supabase rate limits
 * This limits concurrent requests and adds delays between bursts
 */

// Track pending requests
let activeRequests = 0
const MAX_CONCURRENT_REQUESTS = 3 // Max parallel requests
const REQUEST_DELAY = 100 // ms between request starts
const requestQueue: Array<() => void> = []
let lastRequestTime = 0

// Process the queue
function processQueue() {
  if (requestQueue.length === 0) return
  if (activeRequests >= MAX_CONCURRENT_REQUESTS) return
  
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  
  if (timeSinceLastRequest < REQUEST_DELAY) {
    // Wait before processing next request
    setTimeout(processQueue, REQUEST_DELAY - timeSinceLastRequest)
    return
  }
  
  const next = requestQueue.shift()
  if (next) {
    lastRequestTime = Date.now()
    activeRequests++
    next()
  }
}

/**
 * Wrap an async function to throttle it
 */
export function throttledRequest<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const execute = () => {
      fn()
        .then(resolve)
        .catch(reject)
        .finally(() => {
          activeRequests--
          processQueue()
        })
    }
    
    if (activeRequests < MAX_CONCURRENT_REQUESTS) {
      const now = Date.now()
      if (now - lastRequestTime >= REQUEST_DELAY) {
        lastRequestTime = now
        activeRequests++
        execute()
      } else {
        requestQueue.push(execute)
        setTimeout(processQueue, REQUEST_DELAY)
      }
    } else {
      requestQueue.push(execute)
    }
  })
}

/**
 * Simple in-memory cache with TTL
 */
const cache = new Map<string, { data: any; expiry: number }>()

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiry) {
    cache.delete(key)
    return null
  }
  return entry.data as T
}

export function setCache(key: string, data: any, ttlMs: number) {
  cache.set(key, { data, expiry: Date.now() + ttlMs })
}

export function clearCache(keyPrefix?: string) {
  if (keyPrefix) {
    for (const key of cache.keys()) {
      if (key.startsWith(keyPrefix)) {
        cache.delete(key)
      }
    }
  } else {
    cache.clear()
  }
}

/**
 * localStorage persistence for offline support
 */
const STORAGE_PREFIX = 'pactable_data_'

export function persistToStorage(key: string, data: any, ttlMs: number) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify({
      data,
      expiry: Date.now() + ttlMs
    }))
  } catch {
    // localStorage full or unavailable
  }
}

export function getFromStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    if (!raw) return null
    const { data, expiry } = JSON.parse(raw)
    if (Date.now() > expiry) {
      localStorage.removeItem(STORAGE_PREFIX + key)
      return null
    }
    return data as T
  } catch {
    return null
  }
}

export function clearStorage(keyPrefix?: string) {
  if (typeof window === 'undefined') return
  const prefix = STORAGE_PREFIX + (keyPrefix || '')
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(prefix)) {
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key))
}
