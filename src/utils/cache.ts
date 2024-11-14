import { Context, Next } from 'hono'
import { JSONValue } from 'hono/utils/types'

interface CacheEntry<T> {
  data: T
  timestamp: number
}

const colors = {
  hit: '\x1b[32m',    // Green
  miss: '\x1b[33m',   // Yellow
  error: '\x1b[31m',  // Red
  reset: '\x1b[0m'    // Reset
}

const cacheStore = new Map<string, CacheEntry<JSONValue>>()

const formatDuration = (ms: number): string => {
  return ms > 1000 ? `${(ms/1000).toFixed(1)}s` : `${ms}ms`
}

export const cache = <T extends JSONValue>(durationMs: number) => {
  return async (c: Context, next: Next) => {
    const key = c.req.url
    const cached = cacheStore.get(key) as CacheEntry<T> | undefined

    c.header('Cache-Control', `public, max-age=${Math.floor(durationMs / 1000)}`)

    if (cached) {
      const age = Date.now() - cached.timestamp
      if (age < durationMs) {
        c.header('Age', Math.floor(age / 1000).toString())
        c.header('X-Cache', 'HIT')
        console.log(`${colors.hit}[Cache] Hit: ${key} (age: ${formatDuration(age)} / ttl: ${formatDuration(durationMs)})${colors.reset}`)
        return c.json(cached.data)
      }
    }

    await next()
    
    try {
      if (c.res) {
        const clonedResponse = c.res.clone()
        const data = await clonedResponse.json() as T
        
        const wasStale = cached ? `(stale age: ${formatDuration(Date.now() - cached.timestamp)})` : ''
        console.log(`${colors.miss}[Cache] Miss: ${key} ${wasStale}${colors.reset}`)
        
        cacheStore.set(key, { 
          data,
          timestamp: Date.now() 
        })
        c.header('X-Cache', 'MISS')
      }
    } catch (error) {
      console.warn(`${colors.error}[Cache] Failed to cache response for ${key}:${colors.reset}`, error)
      c.header('X-Cache', 'ERROR')
    }
  }
}