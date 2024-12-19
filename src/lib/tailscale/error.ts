import { AxiosError, AxiosResponse } from "axios";
import { ZodError } from "zod"; // Import ZodError
import { APIResponse } from "./types";

export class TailscaleClientError extends Error {
  zodError?: ZodError;

  constructor(message: string, zodError?: ZodError) {
    super(message);
    this.name = "TailscaleClientError";
    this.zodError = zodError;
  }

  static handleResponseError(response: AxiosResponse<APIResponse<unknown>>) {
    if (response.status !== 200) {
      throw new TailscaleClientError(
        `HTTP Error: ${response.status} ${response.statusText}`,
      );
    }
    return response;
  }

  static handleAxiosError(error: AxiosError) {
    throw new TailscaleClientError(
      `Request failed: ${error.response?.statusText || error.message}`,
    );
  }

  static handleZodError(error: ZodError) {
    const errorMessage = `Validation failed: ${error.errors.map((e) => e.message).join(", ")}`;
    throw new TailscaleClientError(errorMessage, error);
  }
}
