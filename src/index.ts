import { Hono } from "hono";
// import { bearerAuth } from 'hono/bearer-auth'
import { customLogger } from "./utils/logger";
import { zzzRouter } from "./routes/zzz";
import { byuRouter } from "./routes/byu";
import { aiRouter } from "./routes/ai";
import { tailscaleRouter } from "./routes/tailscale";
// import { cache } from "./utils/cache";

const app = new Hono<{
  Variables: {
    cached?: boolean;
  };
}>();

app.use("/*", customLogger);

// const DEFAULT_CACHE_DURATION = 60;

// const cacheDuration: number = process.env.CACHE_DURATION
//   ? parseInt(process.env.CACHE_DURATION)
//   : DEFAULT_CACHE_DURATION;

// app.use("/*", cache(cacheDuration));

app.get("/", (c) => {
  return c.json({
    status: "ok",
    version: process.env.npm_package_version,
    uptime: process.uptime(),
  });
});

app.route("/api/zzz", zzzRouter);
app.route("/api/byu", byuRouter);
app.route("/api/ai", aiRouter);
app.route("/api/tailscale", tailscaleRouter);

export default {
  fetch: app.fetch,
  port: 3000,
  hostname: "0.0.0.0",
};
