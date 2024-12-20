import { Context, Next } from "hono";

const methodColors = {
  GET: "\x1b[32m", // Green
  POST: "\x1b[34m", // Blue
  PUT: "\x1b[33m", // Yellow
  DELETE: "\x1b[31m", // Red
  DEFAULT: "\x1b[37m", // White
};

const methodArrows = {
  GET: ["←--", "--→"],
  POST: ["←--", "--→"],
  PUT: ["←--", "--→"],
  DELETE: ["←--", "--→"],
  DEFAULT: ["<--", "-->"],
};

export const customLogger = async (c: Context, next: Next) => {
  const method = c.req.method;
  const path = new URL(c.req.url).pathname;
  const color =
    methodColors[method as keyof typeof methodColors] || methodColors.DEFAULT;
  const arrows =
    methodArrows[method as keyof typeof methodArrows] || methodArrows.DEFAULT;
  const reset = "\x1b[0m";
  const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });

  console.log(`${color}[${timestamp}] ${arrows[0]} ${method} ${path} ${reset}`);

  const start = performance.now();
  await next();
  const timeMs = Math.round(performance.now() - start);
  const statusCode = c.res.status;

  console.log(
    `${color}[${timestamp}] ${arrows[1]} ${method} ${path} ${statusCode} ${timeMs}ms${reset}`,
  );
};
