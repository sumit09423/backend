# 🚀 Backend API - Node.js + Hono + MongoDB

A modern, lightweight backend API built with Hono framework and MongoDB.

## 🛠️ Tech Stack

- **Node.js (v22.x LTS)**
- **Hono (v4.x)** - High-performance web framework
- **MongoDB (v7.x)** with **Mongoose (v8.x)** ODM
- **dotenv** for environment configuration
- **ESLint** & **Prettier** for code quality

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js          # Database configuration
│   ├── controllers/
│   │   └── userController.js  # User business logic
│   ├── models/
│   │   └── User.js        # User Mongoose schema
│   ├── routes/
│   │   ├── userRoutes.js  # User API routes
│   │   └── docsRoute.js   # API documentation
│   ├── middlewares/       # Custom middlewares
│   ├── utils/            # Utility functions
│   ├── app.js            # Main application setup
│   └── server.js         # Server entry point
├── .env                  # Environment variables
├── .gitignore           # Git ignore rules
├── .eslintrc.json       # ESLint configuration
├── .prettierrc          # Prettier configuration
└── package.json         # Dependencies and scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js v22.x LTS
- MongoDB v7.x
- npm v10.x

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env  # If you have an example file
   # Edit .env with your MongoDB connection string
   ```

3. **Start MongoDB:**
   ```bash
   # Make sure MongoDB is running on localhost:27017
   ```

### Development

```bash
# Start development server with hot reload
npm run dev

# Start production server
npm start

# Lint code
npm run lint

# Format code
npm run format
```

## 📡 API Endpoints

### Base URL: `http://localhost:5000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/api/docs` | API documentation |
| GET | `/api/users` | Get all users |
| POST | `/api/users` | Create a new user |

### Example Usage

**Create a user:**
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

**Get all users:**
```bash
curl http://localhost:5000/api/users
```

**API Documentation:**
```bash
curl http://localhost:5000/api/docs
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/honodb` |
| `NODE_ENV` | Environment | `development` |

## 📝 Development

### Code Quality
- **ESLint**: Configured for Node.js ES2022 modules
- **Prettier**: Consistent code formatting
- **Nodemon**: Hot reload during development

### Adding New Features

1. **Models**: Add new Mongoose schemas in `src/models/`
2. **Controllers**: Add business logic in `src/controllers/`
3. **Routes**: Define API endpoints in `src/routes/`
4. **Middlewares**: Add custom middleware in `src/middlewares/`

## 🚀 Deployment

The application is ready for deployment on platforms like:
- **Vercel** (serverless)
- **Railway**
- **Render**
- **DigitalOcean App Platform**

## 📚 Next Steps

- Add JWT authentication
- Implement request validation with Zod
- Add Swagger UI integration
- Set up Winston/Pino logging
- Add unit tests with Jest
- Implement rate limiting
- Add API versioning

---

**Happy Coding! 🎉**


## Docker Command 

# Start development server
./run.sh dev

# Start with Docker (recommended for full stack)
./run.sh docker

# View logs
./run.sh logs

# Clean up when done
./run.sh clean

# Get help
./run.sh help