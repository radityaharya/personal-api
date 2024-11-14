import { Hono } from "hono";
import { handleError } from "../utils/error";
import * as ping from "ping";
import { createResponse } from "../utils/createResponse";

export const networkRouter = new Hono();

interface PingConfig {
  hosts: string[];
  timeout: number;
  count: number;
  maxConcurrent: number;
}

interface PingResult {
  host: string;
  success: boolean;
  time?: number;
  error?: string;
  alive?: boolean;
}

const validateConfig = (
  input: Record<string, string | undefined>,
): PingConfig => {
  const hosts = input.PING_HOSTS?.split(",") || ["100.101.1.6"];
  const timeout = Number(input.PING_TIMEOUT) || 5000;
  const count = Number(input.PING_COUNT) || 1;
  const maxConcurrent = Number(input.PING_MAX_CONCURRENT) || 5;

  if (timeout < 1000 || timeout > 10000) {
    throw new Error("PING_TIMEOUT must be between 1000 and 10000ms");
  }

  if (count < 1 || count > 5) {
    throw new Error("PING_COUNT must be between 1 and 5");
  }

  return { hosts, timeout, count, maxConcurrent };
};

const config = validateConfig(process.env);

const pingHost = async (host: string): Promise<PingResult> => {
  try {
    const result = await ping.promise.probe(host, {
      timeout: config.timeout / 1000,
      min_reply: config.count,
      extra: ["-c", config.count.toString()],
    });

    return {
      host,
      success: true,
      alive: result.alive,
      time: result.time === "unknown" ? undefined : result.time,
    };
  } catch (error) {
    return {
      host,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

const batchProcess = async <T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize = 5,
): Promise<R[]> => {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map((item) => processor(item)),
    );
    results.push(...batchResults);
  }
  return results;
};

networkRouter.get("/ping", async (c) => {
  try {
    const results = await batchProcess(
      config.hosts,
      pingHost,
      config.maxConcurrent,
    );

    const summary = {
      total: results.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      alive: results.filter((r) => r.alive).length,
      results,
    };

    return c.json(createResponse(summary));
  } catch (error) {
    return handleError(c, error, "PING_ERROR");
  }
});

export { config as pingConfig };
