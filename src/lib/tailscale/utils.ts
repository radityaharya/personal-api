import { z } from "zod";
import { T_DeviceResponse } from "./tailscale.schema";

const DeviceFiltersSchema = z.object({
  online: z.boolean().optional(),
  os: z.string().optional(),
  name: z.string().optional(),
});

export type DeviceFilters = z.infer<typeof DeviceFiltersSchema>;

const matchesOnlineStatus = (device: T_DeviceResponse, online?: boolean) =>
  online === undefined || device.online === online;

const matchesOS = (device: T_DeviceResponse, os?: string) =>
  !os || device.os.toLowerCase().includes(os.toLowerCase());

const matchesName = (device: T_DeviceResponse, name?: string) =>
  !name || device.name.toLowerCase().includes(name.toLowerCase());

export function filterDevices(
  devices: T_DeviceResponse[],
  filters: DeviceFilters,
): T_DeviceResponse[] {
  let validatedFilters;
  try {
    validatedFilters = DeviceFiltersSchema.parse(filters);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedError = error.errors
        .map((err) => `Path: ${err.path.join(".")} - ${err.message}`)
        .join(", ");
      throw new Error(`Invalid filters: ${formattedError}`);
    }
    throw error;
  }

  const { online, os, name } = validatedFilters;

  return devices.filter(
    (device) =>
      matchesOnlineStatus(device, online) &&
      matchesOS(device, os) &&
      matchesName(device, name),
  );
}
