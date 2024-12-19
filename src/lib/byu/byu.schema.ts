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

const ByuDataAddonSchema = z.object({
  total_offering: z.number(),
  used: z.number(),
  used_byte: z.number(),
  used_unit: z.string(),
  remaining: z.number(),
  remaining_byte: z.number(),
  remaining_unit: z.number().default(0),
  unit_en: z.string(),
  unit_id: z.string(),
  is_unlimited: z.boolean(),
});

const ByuVoiceSchema = z.object({
  total_offering: z.number(),
  used: z.number(),
  unit_en: z.string(),
  unit_id: z.string(),
  is_unlimited: z.boolean(),
});

const ByuCreditSchema = z.object({
  value: z.number().default(0),
});

const ByuPlanRemainingResponseSchema = z.object({
  status: z.number(),
  message: z.string().optional(),
  data: z.object({
    total: z.object({
      credit: ByuCreditSchema,
      data_plan: z.object({
        total_offering: z.number(),
        used: z.number(),
        used_byte: z.number(),
        used_unit: z.string(),
        remaining: z.string(),
        remaining_byte: z.number(),
        remaining_unit: z.string(),
        unit_en: z.string(),
        unit_id: z.string(),
        is_unlimited: z.boolean(),
      }),
      data_addon: ByuDataAddonSchema,
      voice: ByuVoiceSchema,
    }),
    detail: z.object({
      data_plan: z.array(ByuPlanDetailSchema),
      credit: z.array(ByuCreditSchema),
    }),
  }),
});

const ByuPlanResponseSchema = ByuPlanRemainingResponseSchema.transform(
  (data) => ({
    total: {
      offered: data.data.total.data_plan.total_offering,
      used: data.data.total.data_plan.used,
      remaining: parseFloat(data.data.total.data_plan.remaining),
      daysLeft:
        (new Date(data.data.detail.data_plan[0].expiryDate).getTime() -
          new Date().getTime()) /
        (1000 * 60 * 60 * 24),
      unit: data.data.total.data_plan.unit_en,
      credit: data.data.total.credit.value,
    },
    plan: data.data.detail.data_plan.map((plan) => ({
      id: plan.plan_id,
      name: plan.title,
      startDate: new Date(plan.startDate).toISOString(),
      expiryDate: new Date(plan.expiryDate).toISOString(),
      size: plan.size,
      used: plan.used,
      remaining: parseFloat(plan.remaining),
      price: parseFloat(plan.price),
      unit: plan.unit,
    }))[0],
  }),
);

type T_ByuPlanRemainingResponse = z.infer<
  typeof ByuPlanRemainingResponseSchema
>;
type T_ByuPlanDetail = z.infer<typeof ByuPlanDetailSchema>;
type T_ByuPlanResponse = z.infer<typeof ByuPlanResponseSchema>;

export {
  ByuPlanDetailSchema,
  ByuPlanRemainingResponseSchema,
  ByuPlanResponseSchema,
  ByuDataAddonSchema,
  ByuVoiceSchema,
  ByuCreditSchema,
  T_ByuPlanRemainingResponse,
  T_ByuPlanDetail,
  T_ByuPlanResponse,
};
