import { T_ByuApiResponse } from "./byu.schema";

export function transformPlanData(data: T_ByuApiResponse) {
  return {
    total: {
      offered: data.data.total.data_plan.total_offering,
      used: data.data.total.data_plan.used,
      remaining: parseFloat(data.data.total.data_plan.remaining),
      unit: data.data.total.data_plan.unit_en,
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
  };
}
