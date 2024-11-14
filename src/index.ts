import { Hono } from 'hono'
// import { bearerAuth } from 'hono/bearer-auth'
import { customLogger } from './utils/logger'
import { zzzRouter } from './routes/zzz'
import { networkRouter } from './routes/network'
import { byuRouter } from './routes/byu'
import { cache } from "./utils/cache"

const app = new Hono<{
  Variables: {
    cached?: boolean;
  };
}>()

// const token = process.env.APP_TOKEN as string


app.use("*", customLogger)

// @ts-expect-error - This is a valid middleware
app.use('*', cache(60000))

app.get('/', (c) => {
  return c.json({
    status: 'ok',
    version: process.env.npm_package_version,
    uptime: process.uptime()
  })
})

app.route('/api/zzz', zzzRouter)
app.route('/api/network', networkRouter)
app.route('/api/byu', byuRouter)

export default {
  fetch: app.fetch,
  port: 3000,
  hostname: '0.0.0.0'
}