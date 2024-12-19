export interface TailscaleOptions {
  apiKey: string;
  tailnet: string;
}

export interface APIResponse<T> {
  data: T;
}

export interface Device {
  addresses: string[];
  id: string;
  user: string;
  name: string;
  hostname: string;
  clientVersion: string;
  updateAvailable: boolean;
  os: string;
  created: string;
  lastSeen: string;
  keyExpiryDisabled: boolean;
  expires: string;
  authorized: boolean;
  isExternal: boolean;
  machineKey: string;
  nodeKey: string;
  blocksIncomingConnections: boolean;
}

export interface DevicesResponse {
  devices: Device[];
}
