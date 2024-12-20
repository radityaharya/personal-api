import axios, { AxiosError } from "axios";
import { z } from "zod";

interface KustomClientOptions {
  baseUrl?: string;
}

const KustomPostDataSchema = z.object({
  tokens: z.array(z.string()),
  data: z.record(z.string(), z.string()),
});

type KustomPostData = z.infer<typeof KustomPostDataSchema>;

class KustomClient {
  private baseUrl: string;
  private rateLimitRemaining: number = 5;
  private rateLimitReset: number = Date.now() + 60000;

  constructor(options?: KustomClientOptions) {
    this.baseUrl = options?.baseUrl || "https://api.kustom.rocks";
  }

  async postMessage(data: KustomPostData) {
    KustomPostDataSchema.parse(data);

    if (this.rateLimitRemaining <= 0) {
      const waitTime = this.rateLimitReset - Date.now();
      if (waitTime > 0) {
        console.error(
          `Rate limit exceeded. No quota left. Discarding request.`,
        );
        console.error(`Quota will reset in ${this.formatTime(waitTime)}`);
        // throw new Error("Rate limit exceeded. No quota left.");
        return;
      }
      this.rateLimitRemaining = 5;
      this.rateLimitReset = Date.now() + 60000;
    }

    try {
      const response = await axios.post(`${this.baseUrl}/msg`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      this.rateLimitRemaining = parseInt(
        response.headers["x-ratelimit-remaining"],
        10,
      );
      this.rateLimitReset =
        Date.now() + parseInt(response.headers["x-ratelimit-reset"], 10) * 1000;

      console.log(
        `Message posted successfully. Remaining quota: ${this.rateLimitRemaining}. Quota resets in: ${this.formatTime(this.rateLimitReset - Date.now())}`,
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(
          "Error posting message to Kustom:",
          error.response?.data || error.message,
        );
        throw new Error("Failed to post message to Kustom");
      }
      throw error;
    }
  }

  private formatTime(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}min ${remainingSeconds}sec`;
    }
    return `${remainingSeconds}sec`;
  }
}

export { KustomClient, KustomPostData };
