import app from "./app.js";
import dotenv from "dotenv";
import { serve } from "@hono/node-server";

dotenv.config();

const PORT = process.env.PORT || 5000;

serve({
  fetch: app.fetch,
  port: PORT,
  hostname: '0.0.0.0'
}, (info) => {
  console.log(`🚀 Server running on port ${info.port}`);
});
