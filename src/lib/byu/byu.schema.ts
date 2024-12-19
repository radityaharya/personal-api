import { z } from "zod";

const ByuPlanDetailSchema = z.object({
  plan_id: z.string(),
  title: z.string(),
  startDate: z.string(),
  expiryDate: z.string(),
  size: z.number(),
  used: z.number(),
  used_byte: z.number(),
  remaining: z.string(),
  remaining_byte: z.number(),
  unit: z.string(),
  price: z.string(),
});

const ByuApiResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    total: z.object({
      data_plan: z.object({
        total_offering: z.number(),
        used: z.number(),
        used_byte: z.number(),
        remaining: z.string(),
        remaining_byte: z.number(),
        unit_en: z.string(),
      }),
    }),
    detail: z.object({
      data_plan: z.array(ByuPlanDetailSchema),
    }),
  }),
});

type T_ByuApiResponse = z.infer<typeof ByuApiResponseSchema>;
type T_ByuPlanDetail = z.infer<typeof ByuPlanDetailSchema>;

export {
  ByuPlanDetailSchema,
  ByuApiResponseSchema,
  T_ByuApiResponse,
  T_ByuPlanDetail,
};
