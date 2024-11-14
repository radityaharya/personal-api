import { Hono } from "hono";
import {
  ZenlessZoneZero,
  LanguageEnum,
  ZZZRegion,
  ZZZOptions,
} from "node-hoyolab";
import { handleError } from "../utils/error";
import {
  RecordsResponseSchema,
  RecordNoteResponseSchema,
  RecordHollowZeroResponseSchema,
  RecordShiyuDefenseSchema,
} from "../schemas/zzz.schema";
import { createResponse } from "../utils/createResponse";

export const zzzRouter = new Hono();

const options: ZZZOptions = {
  cookie: process.env.COOKIE_STR as string,
  uid: process.env.ZZZ_UID as unknown as number,
  region: ZZZRegion.ASIA,
  lang: LanguageEnum.ENGLISH,
};

const zzz = new ZenlessZoneZero(options);

zzzRouter.get("/records", async (c) => {
  try {
    const records = await zzz.record.records();
    const validated = RecordsResponseSchema.parse(records);
    return c.json(createResponse(validated));
  } catch (error) {
    return handleError(c, error, "FETCH_RECORDS_ERROR");
  }
});

zzzRouter.get("/note", async (c) => {
  try {
    const recordNote = await zzz.record.note();
    const validated = RecordNoteResponseSchema.parse(recordNote);
    return c.json(createResponse(validated));
  } catch (error) {
    return handleError(c, error, "FETCH_RECORD_NOTE_ERROR");
  }
});

zzzRouter.get("/hollowZero", async (c) => {
  try {
    const recordHollowZero = await zzz.record.hollowZero();
    const validated = RecordHollowZeroResponseSchema.parse(recordHollowZero);
    return c.json(createResponse(validated));
  } catch (error) {
    return handleError(c, error, "FETCH_RECORD_HOLLOW_ZERO_ERROR");
  }
});

zzzRouter.get("/shiyuDefense", async (c) => {
  try {
    const recordShiyuDefense = await zzz.record.shiyuDefense();
    const validated = RecordShiyuDefenseSchema.parse(recordShiyuDefense);
    return c.json(createResponse(validated));
  } catch (error) {
    return handleError(c, error, "FETCH_RECORD_SHIYU_DEFENSE_ERROR");
  }
});

zzzRouter.get("/summary", async (c) => {
  try {
    const summary = {
      energy: (await zzz.record.note()).energy,
    };
    return c.json(createResponse(summary));
  } catch (error) {
    return handleError(c, error, "FETCH_SUMMARY_ERROR");
  }
});
