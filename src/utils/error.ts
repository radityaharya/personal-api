import { Context } from "hono";
import { z } from "zod";

export const handleError = (c: Context, error: unknown, code: string) => {
  console.error(`Error ${code}:`, error);

  const errorResponse = {
    status: "error",
    error: {
      code,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    },
  };

  const status = error instanceof z.ZodError ? 400 : 500;
  return c.json(errorResponse, status);
};
