/* eslint-disable prettier/prettier */
import { z } from "zod";

const ClientSupportsSchema = z.object({
  hairPinning: z.boolean().describe("Whether router supports hairpinning"),
  ipv6: z.boolean().describe("Whether device OS supports IPv6"),
  pcp: z.boolean().describe("Whether PCP port-mapping exists"),
  pmp: z.boolean().describe("Whether NAT-PMP port-mapping exists"),
  udp: z.boolean().describe("Whether UDP traffic is enabled"),
  upnp: z.boolean().describe("Whether UPnP port-mapping exists"),
});

const DerpLatencySchema = z.object({
  preferred: z
    .boolean()
    .optional()
    .describe("Preferred DERP server for incoming traffic"),
  latencyMs: z.number().describe("Current latency to DERP server"),
});

const ClientConnectivitySchema = z.object({
  endpoints: z
    .array(z.string())
    .describe("Client's magicsock UDP IP:port endpoints (IPv4 or IPv6)"),
  mappingVariesByDestIP: z
    .boolean()
    .describe("Whether host's NAT mappings vary based on the destination IP"),
  latency: z
    .record(DerpLatencySchema)
    .describe("Map of DERP server locations and their current latency"),
  clientSupports: ClientSupportsSchema.describe(
    "Identifies features supported by the client",
  ),
});

const PostureIdentitySchema = z.object({
  serialNumbers: z
    .array(z.string())
    .optional()
    .describe("Serial numbers of the device"),
  disabled: z
    .boolean()
    .optional()
    .describe("Whether posture identity collection is disabled"),
});

const DeviceSchema = z.object({
  addresses: z
    .array(z.string())
    .describe("List of Tailscale IP addresses for the device"),
  id: z
    .string()
    .describe("Legacy identifier for a device"),
  nodeId: z
    .string()
    .describe("Preferred identifier for a device"),
  user: z
    .string()
    .describe("User who registered the node"),
  name: z
    .string()
    .describe("MagicDNS name of the device"),
  hostname: z
    .string()
    .describe("Machine name in the admin console"),
  clientVersion: z
    .string()
    .describe("Version of the Tailscale client software"),
  updateAvailable: z
    .boolean()
    .describe("Whether a Tailscale client version upgrade is available"),
  os: z
    .string()
    .describe("Operating system that the device is running"),
  created: z
    .string()
    .datetime()
    .describe("Date on which the device was added to the tailnet"),
  lastSeen: z
    .string()
    .datetime()
    .describe("When device was last active on the tailnet"),
  keyExpiryDisabled: z
    .boolean()
    .describe("Whether the keys for the device will not expire"),
  expires: z
    .string()
    .datetime()
    .describe("Expiration date of the device's auth key"),
  authorized: z
    .boolean()
    .describe("Whether the device has been authorized to join the tailnet"),
  isExternal: z
    .boolean()
    .describe("Whether the device is shared into the tailnet"),
  machineKey: z
    .string()
    .describe("For internal use and not required for any API operations"),
  nodeKey: z
    .string()
    .describe("Mostly for internal use, required for select operations"),
  blocksIncomingConnections: z
    .boolean()
    .describe(
      "Whether the device is not allowed to accept any connections over Tailscale",
    ),
  enabledRoutes: z
    .array(z.string())
    .optional()
    .describe(
      "Subnet routes for this device that have been approved by a tailnet admin",
    ),
  advertisedRoutes: z
    .array(z.string())
    .optional()
    .describe("Subnets this device requests to expose"),
  clientConnectivity: ClientConnectivitySchema
    .optional()
    .describe("Report on the device's current physical network conditions"),
  tags: z
    .array(z.string())
    .optional()
    .describe(
      "Assigns an identity to a device that is separate from human users",
    ),
  tailnetLockError: z
    .string()
    .optional()
    .describe(
      "Indicates an issue with the tailnet lock node-key signature on this device",
    ),
  tailnetLockKey: z
    .string()
    .optional()
    .describe("The node's tailnet lock key"),
  postureIdentity: PostureIdentitySchema
    .optional()
    .describe(
      "Contains extra identifiers from the device when posture identification collection is enabled",
    ),
});


const DeviceResponseSchema = DeviceSchema.omit({
  postureIdentity: true,
  nodeKey: true,
  tailnetLockKey: true,
  tailnetLockError: true,
  nodeId: true,
  id: true,
  machineKey: true,
  blocksIncomingConnections: true,
  keyExpiryDisabled: true,
  authorized: true,
  isExternal: true,
}).extend({
  online: z
    .boolean()
    .optional()
    .describe("Whether the device is currently online"),
});

// ######

const TailscaleDevicesResponseSchema = z.object({
  devices: z.array(DeviceResponseSchema),
  count: z.number(),
});

// ######

type T_ClientSupports = z.infer<typeof ClientSupportsSchema>;
type T_DerpLatency = z.infer<typeof DerpLatencySchema>;
type T_ClientConnectivity = z.infer<typeof ClientConnectivitySchema>;
type T_PostureIdentity = z.infer<typeof PostureIdentitySchema>;
type T_Device = z.infer<typeof DeviceSchema>;
type T_TailscaleDevicesResponseSchema = z.infer<typeof TailscaleDevicesResponseSchema>;

type T_DeviceResponse = z.infer<typeof DeviceResponseSchema>;

export {
  ClientSupportsSchema,
  DerpLatencySchema,
  ClientConnectivitySchema,
  PostureIdentitySchema,
  DeviceSchema,
  TailscaleDevicesResponseSchema,

  // response
  DeviceResponseSchema,
  
  // Types
  T_ClientSupports,
  T_DerpLatency,
  T_ClientConnectivity,
  T_PostureIdentity,
  T_Device,
  
  // Response Types
  T_TailscaleDevicesResponseSchema,
  T_DeviceResponse,
};
