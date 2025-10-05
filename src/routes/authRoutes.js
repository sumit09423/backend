import { Hono } from "hono";
import { register, login, getProfile } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const authRoutes = new Hono();

// Public routes
authRoutes.post("/register", register);
authRoutes.post("/login", login);

// Protected routes
authRoutes.get("/profile", authMiddleware, getProfile);

export default authRoutes;
