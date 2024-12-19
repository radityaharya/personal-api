import { Hono } from "hono";
import { handleError } from "../utils/error";
import { createResponse } from "../utils/createResponse";
import {
  TailscaleClient,
  TailscaleClientError,
  TailscaleOptions,
} from "@lib/tailscale";
import { DeviceFilters, filterDevices } from "@lib/tailscale/utils";

export const tailscaleRouter = new Hono();

const options: TailscaleOptions = {
  apiKey: process.env.TAILSCALE_API_KEY as string,
  tailnet: process.env.TAILSCALE_TAILNET as string,
};

const tailscale = new TailscaleClient(options);

tailscaleRouter.get("/", (c) => {
  return c.json({
    routes: tailscaleRouter.routes.map((route) => ({
      method: route.method,
      path: route.path,
    })),
  });
});

tailscaleRouter.get("/devices", async (c) => {
  try {
    const response = await tailscale.getDevices();

    const filters: DeviceFilters = {
      online: c.req.query("online")
        ? c.req.query("online") === "true"
        : undefined,
      os: c.req.query("os"),
      name: c.req.query("name"),
    };

    const filteredDevices = filterDevices(response.devices, filters);

    return c.json(
      createResponse({
        devices: filteredDevices,
        count: filteredDevices.length,
      }),
    );
  } catch (error: unknown) {
    return handleError(c, error as TailscaleClientError, "FETCH_DEVICES_ERROR");
  }
});
