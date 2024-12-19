import { Hono } from "hono";
import { handleError } from "../utils/error";
import { createResponse } from "../utils/createResponse";
import {
  TailscaleClient,
  TailscaleClientError,
  TailscaleOptions,
} from "@lib/tailscale";

export const tailscaleRouter = new Hono();

const options: TailscaleOptions = {
  apiKey: process.env.TAILSCALE_API_KEY as string,
  tailnet: process.env.TAILSCALE_TAILNET as string,
};

const tailscale = new TailscaleClient(options);

tailscaleRouter.get("/devices", async (c) => {
  try {
    const devices = await tailscale.getDevices();
    return c.json(createResponse(devices));
  } catch (error: unknown) {
    return handleError(c, error as TailscaleClientError, "FETCH_DEVICES_ERROR");
  }
});
