import { AxiosError, AxiosResponse } from "axios";
import { ZodError } from "zod";
import { APIResponse, APIErrorResponse } from "./types";

export class ZZZClientError extends Error {
  zodError?: ZodError;

  constructor(message: string, zodError?: ZodError) {
    super(message);
    this.name = "ZZZClientError";
    this.zodError = zodError;
  }

  static handleResponseError(response: AxiosResponse<APIResponse<unknown>>) {
    if (response.status !== 200) {
      throw new ZZZClientError(
        `HTTP Error: ${response.status} ${response.statusText}`,
      );
    }
    if (response.data.retcode !== 0) {
      throw new ZZZClientError(
        `API Error ${response.data.retcode}: ${response.data.message}`,
      );
    }
    return response;
  }

  static handleAxiosError(error: AxiosError<APIErrorResponse>) {
    throw new ZZZClientError(
      `Request failed: ${error.response?.data?.message || error.message}`,
    );
  }

  static handleZodError(error: ZodError) {
    const errorMessage = `Validation failed: ${error.errors.map((e) => e.message).join(", ")}`;
    throw new ZZZClientError(errorMessage, error);
  }
}
