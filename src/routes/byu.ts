import { Hono } from "hono";
import { handleError } from "@utils/error";
import { createResponse } from "@utils/createResponse";
import { ByuClient } from "@lib/byu";

const byu = new ByuClient({
  apiKey: process.env.BYU_API_TOKEN as string,
});

export const byuRouter = new Hono();

byuRouter.get("/", (c) => {
  return c.json({
    routes: byuRouter.routes.map((route) => ({
      method: route.method,
      path: route.path,
    })),
  });
});

byuRouter.get("/plan", async (c) => {
  try {
    const data = await byu.getPlan();
    return c.json(createResponse(data));
  } catch (error) {
    return handleError(c, error as Error, "BYU_API_ERROR");
  }
});
