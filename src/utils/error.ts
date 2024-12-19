import { TailscaleClientError } from "@lib/tailscale";
import { ZZZClientError } from "@lib/zzz";
import { Context } from "hono";
import { z } from "zod";

type ErrorWithZod = Error & { zodError?: z.ZodError };

export const handleError = (
  c: Context,
  error: ZZZClientError | TailscaleClientError | Error,
  code: string,
) => {
  console.error(`Error ${code}:`, error);

  const hasZodError = (err: unknown): err is ErrorWithZod => {
    return (
      typeof err === "object" &&
      err !== null &&
      "zodError" in err &&
      (err as ErrorWithZod).zodError instanceof z.ZodError
    );
  };

  const zodError = hasZodError(error) ? error.zodError : undefined;

  const errorResponse = {
    status: "error",
    error: {
      code,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
      zodError,
    },
  };

  const status = zodError ? 400 : 500;
  return c.json(errorResponse, status);
};
