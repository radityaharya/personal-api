import { Hono } from "hono";
import OpenAI from "openai";

export const aiRouter = new Hono();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  baseURL: process.env.OPENAI_BASE_URL,
});

aiRouter.post("/chat", async (c) => {
  try {
    const { messages } = await c.req.json();
    console.log("Incoming messages:", messages);

    const userAgent = c.req.header("user-agent") || "";
    console.log("User Agent:", userAgent);

    const isNativeMobile = userAgent.includes("Expo");
    console.log("Is Native Mobile:", isNativeMobile);

    console.log("Using Llama model for web client");
    const response = await openai.chat.completions.create({
      model: "together/llama-3.1-70b-instruct",
      stream: false,
      messages,
    });
    console.log("Llama API Response:", response);

    return Response.json({
      data: { content: response.choices[0].message.content },
    });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    return Response.json({
      error: "Failed to process chat request",
      details: error,
    });
  }
});
