import { Hono } from "hono";
import { handleError } from "../utils/error";
import { createResponse } from "../utils/createResponse";

interface ByuPlanDetail {
  plan_id: string;
  title: string;
  startDate: string;
  expiryDate: string;
  size: number;
  used: number;
  used_byte: number;
  remaining: string;
  remaining_byte: number;
  unit: string;
  price: string;
}

interface ByuApiResponse {
  status: number;
  message: string;
  data: {
    total: {
      data_plan: {
        total_offering: number;
        used: number;
        used_byte: number;
        remaining: string;
        remaining_byte: number;
        unit_en: string;
      };
    };
    detail: {
      data_plan: ByuPlanDetail[];
    };
  };
}

export const byuRouter = new Hono();

async function fetchByuPlan(token: string): Promise<ByuApiResponse> {
  const response = await fetch("https://api.byu.id/api/v2/planRemaining", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`BYU API error: ${response.statusText}`);
  }

  return response.json();
}

function transformPlanData(data: ByuApiResponse) {
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

byuRouter.get("/plan", async (c) => {
  try {
    const data = await fetchByuPlan(process.env.BYU_API_TOKEN!);
    const summary = transformPlanData(data);
    return c.json(createResponse(summary));
  } catch (error) {
    return handleError(c, error as Error, "BYU_API_ERROR");
  }
});
