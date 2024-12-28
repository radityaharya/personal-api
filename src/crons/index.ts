import { KustomClient, KustomPostData } from "@lib/kustom/client";
import { postZZZDataToKustom } from "./zzz";
// import { postTailscaleDataToKustom } from "./tailscale";
import { postByuDataToKustom } from "./byu";

const kustom = new KustomClient();

function prefixDataKeys(
  data: Record<string, string>,
  prefix: string,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [`${prefix}_${key}`, value]),
  );
}

export async function postAllDataToKustom() {
  console.log("Posting all data to Kustom...");
  try {
    const [zzzData, byuData] = await Promise.all([
      postZZZDataToKustom(),
      postByuDataToKustom(),
    ]);

    const data: KustomPostData = {
      tokens: [process.env.KUSTOM_TOKEN as string],
      data: {
        ...prefixDataKeys(zzzData, "zzz"),
        // ...prefixDataKeys(tailscaleData, "ts"),
        ...prefixDataKeys(byuData, "byu"),
      },
    };

    await kustom.postMessage(data);
  } catch (error) {
    console.error("Error posting data to Kustom:", error);
  }
}
