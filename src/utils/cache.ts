import { Context, Next } from 'hono'
import { JSONValue } from 'hono/utils/types'

interface CacheEntry<T> {
  data: T
  timestamp: number
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
        console.log(`[Cache] Hit: ${key} (age: ${formatDuration(age)} / ttl: ${formatDuration(durationMs)})`)
        return c.json(cached.data)
      }
      c.header('X-Cache', 'STALE')
      console.log(`[Cache] Stale: ${key} (age: ${formatDuration(age)} / ttl: ${formatDuration(durationMs)})`)
    }

    await next()
    
    try {
      if (c.res) {
        const clonedResponse = c.res.clone()
        const data = await clonedResponse.json() as T
        
        cacheStore.set(key, { 
          data,
          timestamp: Date.now() 
        })
        c.header('X-Cache', 'MISS')
        console.log(`[Cache] Miss: ${key}`)
      }
    } catch (error) {
      console.warn(`[Cache] Failed to cache response for ${key}:`, error)
      c.header('X-Cache', 'ERROR')
    }
  }
}