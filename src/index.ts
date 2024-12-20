import { Hono } from "hono";
import { customLogger } from "./utils/logger";
import { zzzRouter } from "./routes/zzz";
import { byuRouter } from "./routes/byu";
import { tailscaleRouter } from "./routes/tailscale";
// import { cache } from "./utils/cache";
import { env } from "hono/adapter";

const app = new Hono();

app.use("/*", customLogger);

app.use("*", async (c, next) => {
  const { API_TOKEN } = env<{ API_TOKEN: string }>(c);

  if (c.req.header("authorization")) {
    const authHeader = c.req.header("authorization");
    if (authHeader) {
      const [type, token] = authHeader.split(" ");
      if (type === "Bearer" && token === API_TOKEN) {
        await next();
        return;
      }
    }
  }
  return c.json(
    {
      status: "error",
      message: "Unauthorized",
      timestamp: new Date(),
      statusCode: 401,
    },
    401,
  );
});

app.route("/api/zzz", zzzRouter);
app.route("/api/byu", byuRouter);
app.route("/api/tailscale", tailscaleRouter);

export default {
  fetch: app.fetch,
  port: 3000,
  hostname: "0.0.0.0",
};
