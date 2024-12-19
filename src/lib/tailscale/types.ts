export interface TailscaleOptions {
  apiKey: string;
  tailnet: string;
  onlineTimeout?: number;
}

export interface APIResponse<T> {
  data: T;
}
