import { IRecordNoteResponse } from "../../schemas/zzz.schema";
export enum ZZZRegion {
  ASIA = "prod_gf_jp",
}

export enum ZZZLanguageEnum {
  ENGLISH = "en-us",
}

export interface ZZZOptions {
  cookie: string;
  uid: number;
  region: ZZZRegion;
  lang: ZZZLanguageEnum;
}

export interface APIResponse<T> {
  retcode: number;
  message: string;
  data: T;
}

export interface APIErrorResponse {
  message?: string;
  data?: IRecordNoteResponse;
}
