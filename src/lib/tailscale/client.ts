import axios, { AxiosInstance } from "axios";
import { TailscaleOptions } from "./types";
import { TailscaleClientError } from "./error";
import {
  Device,
  TailscaleDevicesSchema,
  TailscaleDevices,
} from "./tailscale.schema";
import { z } from "zod";

async function withErrorHandling<T>(
  operation: () => Promise<T>,
  errorMessage: string,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new TailscaleClientError(
        `Validation failed: ${error.errors.map((e) => e.message).join(", ")}`,
        error,
      );
    }
    throw error instanceof TailscaleClientError
      ? error
      : new TailscaleClientError(
          `${errorMessage}: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
  }
}

export class TailscaleClient {
  private readonly client: AxiosInstance;
  private readonly options: Readonly<TailscaleOptions>;

  constructor(options: TailscaleOptions) {
    this.options = Object.freeze({ ...options });
    this.client = axios.create({
      baseURL: "https://api.tailscale.com/api/v2",
      headers: {
        Authorization: `Bearer ${this.options.apiKey}`,
        Accept: "application/json",
      },
    });

    this.client.interceptors.response.use(
      (response) => TailscaleClientError.handleResponseError(response),
      (error) => Promise.reject(TailscaleClientError.handleAxiosError(error)),
    );
  }

  async getDevices(): Promise<Device[]> {
    return await withErrorHandling(async () => {
      const response = await this.client.get(
        `/tailnet/${this.options.tailnet}/devices`,
      );
      return TailscaleDevicesSchema.parse(response.data as TailscaleDevices)
        .devices;
    }, "Failed to fetch devices");
  }
}
