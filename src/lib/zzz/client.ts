import axios, { AxiosInstance } from "axios";
import {
  RecordNoteResponseSchema,
  IRecordNoteResponse,
} from "../../schemas/zzz.schema";
import { ZZZOptions } from "./types";
import { ZZZClientError } from "./error";

export interface IZZZClient {
  getNote(): Promise<IRecordNoteResponse>;
}

export class ZZZClient implements IZZZClient {
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
    try {
      const response = await this.client.get(
        `/event/game_record_zzz/api/zzz/note`,
      );

      return RecordNoteResponseSchema.parse(response.data.data);
    } catch (error) {
      throw new ZZZClientError(
        `Failed to fetch note: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}
