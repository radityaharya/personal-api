import axios, { AxiosInstance } from "axios";
import { ByuPlanResponseSchema, T_ByuPlanResponse } from "./byu.schema";
import { ByuOptions } from "./types";
import { ByuClientError } from "./error";
import { z } from "zod";

async function withErrorHandling<T>(
  operation: () => Promise<T>,
  errorMessage: string,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ByuClientError(
        `Validation failed: ${error.errors.map((e) => e.message).join(", ")}`,
        error,
      );
    }
    throw error instanceof ByuClientError
      ? error
      : new ByuClientError(
          `${errorMessage}: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
  }
}

export class ByuClient {
  private readonly client: AxiosInstance;
  private readonly options: Readonly<ByuOptions>;

  constructor(options: ByuOptions) {
    this.options = Object.freeze({ ...options });
    this.client = axios.create({
      baseURL: "https://api.byu.id/api/v2",
      headers: {
        Authorization: `Bearer ${this.options.apiKey}`,
      },
      timeout: 100000,
    });

    this.client.interceptors.response.use(
      (response) => ByuClientError.handleResponseError(response),
      (error) => Promise.reject(ByuClientError.handleAxiosError(error)),
    );
  }

  async getPlan(): Promise<T_ByuPlanResponse> {
    return withErrorHandling(async () => {
      const response = await this.client.get("/planRemaining");
      console.log(JSON.stringify(response.data, null, 2));
      return ByuPlanResponseSchema.parse(response.data);
    }, "Failed to fetch plan data");
  }
}
