import { TailscaleClient, TailscaleOptions } from "@lib/tailscale";

const options: TailscaleOptions = {
  apiKey: process.env.TAILSCALE_API_KEY as string,
  tailnet: process.env.TAILSCALE_TAILNET as string,
};

const tailscale = new TailscaleClient(options);

export async function postTailscaleDataToKustom() {
  try {
    const response = await tailscale.getDevices();
    const data = {
      devices: JSON.stringify(response.devices),
    };
    return data;
  } catch (error) {
    console.error("Error posting Tailscale data to Kustom:", error);
    throw error;
  }
}
