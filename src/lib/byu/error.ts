import { AxiosError, AxiosResponse } from "axios";
import { ZodError } from "zod";
import { APIResponse, APIErrorResponse } from "./types";

export class ByuClientError extends Error {
  zodError?: ZodError;

  constructor(message: string, zodError?: ZodError) {
    super(message);
    this.name = "ByuClientError";
    this.zodError = zodError;
  }

  static handleResponseError(response: AxiosResponse<APIResponse<unknown>>) {
    if (response.status !== 200) {
      throw new ByuClientError(
        `HTTP Error: ${response.status} ${response.statusText}`,
      );
    }
    return response;
  }

  static handleAxiosError(error: AxiosError<APIErrorResponse>) {
    throw new ByuClientError(
      `Request failed: ${error.response?.data?.message || error.message}`,
    );
  }

  static handleZodError(error: ZodError) {
    const errorMessage = `Validation failed: ${error.errors.map((e) => e.message).join(", ")}`;
    throw new ByuClientError(errorMessage, error);
  }
}
