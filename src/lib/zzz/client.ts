import axios, { AxiosInstance } from "axios";
import { RecordNoteResponseSchema, IRecordNoteResponse } from "./zzz.schema";
import { ZZZOptions } from "./types";
import { ZZZClientError } from "./error";
import { z } from "zod";

async function withErrorHandling<T>(
  operation: () => Promise<T>,
  errorMessage: string,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ZZZClientError(
        `Validation failed: ${error.errors.map((e) => e.message).join(", ")}`,
        error,
      );
    }
    throw error instanceof ZZZClientError
      ? error
      : new ZZZClientError(
          `${errorMessage}: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
  }
}

export class ZZZClient {
  private readonly client: AxiosInstance;
  private readonly options: Readonly<ZZZOptions>;

  constructor(options: ZZZOptions) {
    this.options = Object.freeze({ ...options });
    this.client = axios.create({
      baseURL: "https://sg-public-api.hoyolab.com",
      headers: {
        Cookie: this.options.cookie,
        Accept: "application/json",
        "Accept-Language": this.options.lang,
      },
      params: {
        server: this.options.region,
        role_id: this.options.uid,
      },
    });
    this.client.interceptors.response.use(
      (response) => ZZZClientError.handleResponseError(response),
      (error) => Promise.reject(ZZZClientError.handleAxiosError(error)),
    );
  }

  async getNote(): Promise<IRecordNoteResponse> {
    return await withErrorHandling(async () => {
      const response = await this.client.get(
        `/event/game_record_zzz/api/zzz/note`,
      );
      return RecordNoteResponseSchema.parse(response.data.data);
    }, "Failed to fetch note");
  }
}
