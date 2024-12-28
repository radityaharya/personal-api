import { Hono } from "hono";
import { customLogger } from "./utils/logger";
import { zzzRouter } from "./routes/zzz";
import { byuRouter } from "./routes/byu";
import { tailscaleRouter } from "./routes/tailscale";
import { env } from "hono/adapter";
import { contextStorage } from "hono/context-storage";
import { Env, validateEnv } from "@utils/env";
// import { postAllDataToKustom } from "./crons";

export const app = new Hono<{ Bindings: Env }>();

app.use("/*", customLogger);

app.use("*", validateEnv());

app.use(contextStorage());

app.use("*", async (c, next) => {
  const { API_TOKEN } = env(c);

  if (!API_TOKEN) {
    await next();
    return;
  }

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

app.get("/health", async (c) => {
  return c.json({
    status: "success",
    message: "Server is running",
    timestamp: new Date(),
  });
});

export default app;
