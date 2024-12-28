import { Hono } from "hono";
import { handleError } from "@utils/error";
import { createResponse } from "@utils/createResponse";
import {
  ZZZLanguageEnum,
  ZZZClient,
  ZZZOptions,
  ZZZRegion,
  ZZZClientError,
} from "@lib/zzz";
import { env } from "@utils/env";

export const zzzRouter = new Hono();

const zzzClient = () => {
  const options: ZZZOptions = {
    cookie: env().env.ZZZ_COOKIE_STRING,
    uid: env().env.ZZZ_UID,
    region: ZZZRegion.ASIA,
    lang: ZZZLanguageEnum.ENGLISH,
  };

  return new ZZZClient(options);
};

zzzRouter.get("/", (c) => {
  return c.json({
    routes: zzzRouter.routes.map((route) => ({
      method: route.method,
      path: route.path,
    })),
  });
});

zzzRouter.get("/note", async (c) => {
  try {
    const zzz = zzzClient();
    const recordNote = await zzz.getNote();
    return c.json(createResponse(recordNote));
  } catch (error) {
    return handleError(c, error as ZZZClientError, "FETCH_RECORD_NOTE_ERROR");
  }
});
