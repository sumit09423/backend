import { Hono } from "hono";
import { getUsers, createUser } from "../controllers/userController.js";

const userRoutes = new Hono();

userRoutes.get("/", getUsers);
userRoutes.post("/", createUser);

export default userRoutes;
