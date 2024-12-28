import { serve } from "bun";
import app from ".";

async function healthCheck() {
  try {
    const response = await fetch("http://localhost:3000/health");
    return response.status === 200;
  } catch {
    return false;
  }
}

if (process.argv.includes("--health-check")) {
  const isHealthy = await healthCheck();
  process.exit(isHealthy ? 0 : 1);
}

console.log("Server is running on port 3000");
serve({
  fetch: app.fetch,
  port: 3000,
  hostname: "0.0.0.0",
});
