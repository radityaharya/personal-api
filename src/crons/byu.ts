import { ByuClient } from "@lib/byu";

const byu = new ByuClient({
  apiKey: process.env.BYU_API_TOKEN as string,
});

export async function postByuDataToKustom() {
  try {
    const data = await byu.getPlan();
    const postData = {
      data_remaining: `${data.total.remaining.toString()}${data.total.unit}`,
      data_days_left: Math.floor(data.total.daysLeft).toString(),
      credit_remaining: `${data.total.credit}`,
    };
    return postData;
  } catch (error) {
    console.error("Error posting BYU data to Kustom:", error);
    throw error;
  }
}
