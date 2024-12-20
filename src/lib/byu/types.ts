import { T_ByuPlanResponse } from "./byu.schema";

export interface ByuOptions {
  apiKey: string;
}

export interface APIResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface APIErrorResponse {
  message?: string;
  data?: T_ByuPlanResponse;
}
