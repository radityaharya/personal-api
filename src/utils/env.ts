import { MiddlewareHandler } from "hono";
import { getContext } from "hono/context-storage";
import { z } from "zod";
import { env as honoEnv } from "hono/adapter";

export const envSchema = z.object({
  API_TOKEN: z.string().optional(),
  BYU_API_TOKEN: z.string(),
  TAILSCALE_API_KEY: z.string().startsWith("tskey-"),
  TAILSCALE_TAILNET: z.string(),
  ZZZ_COOKIE_STRING: z.string(),
  ZZZ_UID: z.number(),
});

export type Env = {
  Bindings: z.infer<typeof envSchema>;
};

const getMissingVars = (result: z.SafeParseError<any>) => {
  return result.error.errors
    .filter((err) => err.message === "Required")
    .map((err) => err.path.join("."))
    .join(", ");
};

export const validateEnv = (): MiddlewareHandler => {
  return async (c, next) => {
    c.env = { ...honoEnv(c), ...c.env };
    const result = envSchema.safeParse(c.env);

    if (!result.success) {
      const missingVars = getMissingVars(result);
      if (missingVars) {
        throw new Error(
          `Missing required environment variables: ${missingVars}`,
        );
      }
    }

    return next();
  };
};

export const env = getContext<Env>;
