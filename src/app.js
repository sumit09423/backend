import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import policyRoutes from "./routes/policyRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";

dotenv.config();
await connectDB();

const app = new Hono();

// Middleware
app.use("*", logger());
app.use("*", cors({
  origin: ['https://testdemop.netlify.app', 'http://localhost:3000', 'http://localhost:3001/', 'http://localhost:5173', 'https://monastically-agleam-soon.ngrok-free.dev'],
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Base route - Health check
app.get("/", (c) => {
  return c.json({
    message: "🚀 API is running",
    version: "1.0.0",
      routes: {
        health: {
          "GET /": "Health check endpoint"
        },
        users: {
          "GET /api/users": "Get all users",
          "POST /api/users": "Create a new user"
        },
        auth: {
          "POST /api/auth/register": "Register a new user",
          "POST /api/auth/login": "Login user",
          "GET /api/auth/profile": "Get user profile (protected)"
        },
        policies: {
          "GET /api/policies": "Get all policies with pagination (requires auth)",
          "POST /api/policies": "Create a new policy (requires auth)",
          "GET /api/policies/search": "Search policies (requires auth)",
          "GET /api/policies/stats": "Get policy statistics (requires auth)",
          "GET /api/policies/user": "Get policies by authenticated user (requires auth)",
          "GET /api/policies/:id": "Get policy by ID (requires auth)",
          "GET /api/policies/master-policy/:masterPolicyNumber": "Get policy by master policy number (requires auth)",
          "GET /api/policies/certificate/:certificateNumber": "Get policy by certificate number (requires auth)",
          "PUT /api/policies/:id": "Update policy by ID (requires auth)",
          "DELETE /api/policies/:id": "Delete policy by ID (requires auth)"
        },
        pdf: {
          "POST /api/pdf/extract-images": "Upload PDF and extract images as base64",
          "POST /api/pdf/extract-images-files": "Upload PDF and extract images as files (returns URLs)",
          "GET /api/pdf/images/:extractionId/:filename": "Serve extracted image files"
        }
      },
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// API routes
app.route("/api/users", userRoutes);
app.route("/api/auth", authRoutes);
app.route("/api/policies", policyRoutes);
app.route("/api/pdf", pdfRoutes);

// Global error handler
app.onError((err, c) => {
  console.error('Global error handler:', err);
  return c.json(
    { 
      error: "Internal Server Error", 
      message: err.message || "Something went wrong",
      statusCode: 500 
    }, 
    500
  );
});

export default app;
