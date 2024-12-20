import { ZZZClient, ZZZOptions, ZZZRegion, ZZZLanguageEnum } from "@lib/zzz";

const options: ZZZOptions = {
  cookie: process.env.COOKIE_STR as string,
  uid: process.env.ZZZ_UID as unknown as number,
  region: ZZZRegion.ASIA,
  lang: ZZZLanguageEnum.ENGLISH,
};

const zzz = new ZZZClient(options);

export async function postZZZDataToKustom() {
  try {
    const recordNote = await zzz.getNote();
    const data = {
      energy: recordNote.energy.progress.current.toString(),
      vitality: recordNote.vitality.current.toString(),
    };
    return data;
  } catch (error) {
    console.error("Error posting ZZZ data to Kustom:", error);
    throw error;
  }
}
