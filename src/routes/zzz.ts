import { Hono } from "hono";
import { handleError } from "../utils/error";
import { createResponse } from "../utils/createResponse";
import {
  ZZZLanguageEnum,
  ZZZClient,
  ZZZOptions,
  ZZZRegion,
  ZZZClientError,
} from "@lib/zzz";

export const zzzRouter = new Hono();

const options: ZZZOptions = {
  cookie: process.env.COOKIE_STR as string,
  uid: process.env.ZZZ_UID as unknown as number,
  region: ZZZRegion.ASIA,
  lang: ZZZLanguageEnum.ENGLISH,
};

const zzz = new ZZZClient(options);

zzzRouter.get("/note", async (c) => {
  try {
    const recordNote = await zzz.getNote();
    return c.json(createResponse(recordNote));
  } catch (error) {
    return handleError(c, error as ZZZClientError, "FETCH_RECORD_NOTE_ERROR");
  }
});
