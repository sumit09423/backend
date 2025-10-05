# 🧩 Backend Setup — Node.js + Hono + MongoDB

## 📘 Overview

This project is a **modern, flexible backend** built using:
- **Node.js (v22.x LTS)**
- **Hono (v4.x)** — lightweight, high-performance web framework
- **MongoDB (v7.x)** with **Mongoose (v8.x)** ODM
- **dotenv** for environment configuration
- **Nodemon**, **ESLint**, **Prettier** for development workflow

It also includes **API Documentation served via Hono routes**.

---

## ⚙️ Prerequisites

Before starting, ensure the following are installed:

| Tool | Version | Install |
|------|----------|---------|
| Node.js | v22.x LTS | [https://nodejs.org](https://nodejs.org) |
| npm | v10.x | Included with Node.js |
| MongoDB | v7.x | [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community) |
| Git | v2.40+ | [https://git-scm.com](https://git-scm.com) |

---

## 📂 Folder Structure

```
backend/
│
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── userController.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   └── docsRoute.js
│   ├── middlewares/
│   ├── utils/
│   ├── app.js
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
├── README.md
└── SETUP.md
```

---

## ⚡ Step-by-Step Setup

### 1. Initialize Project

```bash
mkdir backend && cd backend
npm init -y
```

---

### 2. Install Dependencies

```bash
npm install hono mongoose dotenv morgan
```

#### Dev Dependencies
```bash
npm install --save-dev nodemon eslint prettier
```

---

### 3. Create `.env`

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/honodb
NODE_ENV=development
```

> Add `.env` to `.gitignore`

---

### 4. Database Configuration — `src/config/db.js`

```js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
```

---

### 5. App Initialization — `src/app.js`

```js
import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import docsRoute from "./routes/docsRoute.js";

dotenv.config();
await connectDB();

const app = new Hono();

// Middleware
app.use("*", logger());
app.use("*", cors());

// Base route
app.get("/", (c) => c.json({ message: "🚀 API is running" }));

// API routes
app.route("/api/users", userRoutes);
app.route("/api/docs", docsRoute);

export default app;
```

---

### 6. Sample Model — `src/models/User.js`

```js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
```

---

### 7. Controller — `src/controllers/userController.js`

```js
import User from "../models/User.js";

export const getUsers = async (c) => {
  const users = await User.find();
  return c.json(users);
};

export const createUser = async (c) => {
  const body = await c.req.json();
  const user = await User.create(body);
  return c.json(user, 201);
};
```

---

### 8. Routes — `src/routes/userRoutes.js`

```js
import { Hono } from "hono";
import { getUsers, createUser } from "../controllers/userController.js";

const userRoutes = new Hono();

userRoutes.get("/", getUsers);
userRoutes.post("/", createUser);

export default userRoutes;
```

---

### 9. API Documentation Route — `src/routes/docsRoute.js`

```js
import { Hono } from "hono";

const docsRoute = new Hono();

docsRoute.get("/", (c) =>
  c.json({
    info: {
      title: "Hono + MongoDB API Docs",
      description: "Simple REST API with Hono framework",
      version: "1.0.0",
    },
    routes: {
      "/api/users": {
        GET: "Fetch all users",
        POST: "Create a new user",
      },
      "/": {
        GET: "Health check endpoint",
      },
    },
  })
);

export default docsRoute;
```

---

### 10. Server Entry — `src/server.js`

```js
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.fire().listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

---

### 11. Scripts — `package.json`

```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js",
  "lint": "eslint . --ext .js",
  "format": "prettier --write ."
}
```

---

### 12. ESLint and Prettier

**.eslintrc.json**
```json
{
  "env": {
    "es2022": true,
    "node": true
  },
  "extends": ["eslint:recommended", "prettier"],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {}
}
```

**.prettierrc**
```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

---

## 🧠 Run the Server

### Development:
```bash
npm run dev
```

### Production:
```bash
npm start
```

Visit:
```
http://localhost:5000
```

API Documentation:
```
http://localhost:5000/api/docs
```

---

## ✅ Recommended Versions (October 2025)

| Package | Version |
|----------|----------|
| Node.js | 22.6.0 |
| Hono | 4.3.x |
| MongoDB | 7.0.x |
| Mongoose | 8.6.x |
| dotenv | 16.5.x |
| morgan | 1.10.x |
| nodemon | 3.1.x |
| eslint | 9.x |
| prettier | 3.x |

---

## 🧩 Optional Improvements

- Add JWT authentication
- Add Zod validation for requests
- Integrate Swagger UI
- Use Winston or Pino for logging
- Deploy on Vercel / Render / Railway

---

## 🎯 Summary

You now have a complete **Node.js + Hono + MongoDB backend** with:
- Structured folder hierarchy
- Environment configuration
- Built-in Hono documentation route
- ESLint & Prettier formatting
- Ready for development and production

---

🧠 **Docs Route Preview:**  
You can extend `/api/docs` to auto-generate documentation or integrate with OpenAPI for full Swagger UI in the future.
