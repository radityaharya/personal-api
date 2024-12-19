import { AxiosError, AxiosResponse } from "axios";
import { APIResponse, APIErrorResponse } from "./types";

export class ZZZClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ZZZClientError";
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
}
