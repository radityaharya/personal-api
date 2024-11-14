import { Hono } from "hono";
// import { bearerAuth } from 'hono/bearer-auth'
import { customLogger } from "./utils/logger";
import { zzzRouter } from "./routes/zzz";
import { networkRouter } from "./routes/network";
import { byuRouter } from "./routes/byu";
import { cache } from "./utils/cache";

const app = new Hono<{
  Variables: {
    cached?: boolean;
  };
}>();

app.use("/*", customLogger);

const DEFAULT_CACHE_DURATION = 60;

const cacheDuration: number = process.env.CACHE_DURATION
  ? parseInt(process.env.CACHE_DURATION)
  : DEFAULT_CACHE_DURATION;

//  @ts-expect-error this is a valid use of the cache middleware
app.use("/*", cache(cacheDuration));

app.get("/", (c) => {
  return c.json({
    status: "ok",
    version: process.env.npm_package_version,
    uptime: process.uptime(),
  });
});

app.route("/api/zzz", zzzRouter);
app.route("/api/network", networkRouter);
app.route("/api/byu", byuRouter);
export default {
  fetch: app.fetch,
  port: 3000,
  hostname: "0.0.0.0",
};
