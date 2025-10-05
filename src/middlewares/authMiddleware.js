import jwt from "jsonwebtoken";

export const authMiddleware = async (c, next) => {
  try {
    // Get token from Authorization header
    const authHeader = c.req.header("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json(
        { 
          error: "Access denied", 
          message: "No token provided",
          statusCode: 401 
        }, 
        401
      );
    }

    // Extract token
    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    
    // Add user ID to context
    c.set('userId', decoded.userId);
    
    await next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return c.json(
        { 
          error: "Invalid token", 
          message: "Invalid token provided",
          statusCode: 401 
        }, 
        401
      );
    }
    
    if (error.name === 'TokenExpiredError') {
      return c.json(
        { 
          error: "Token expired", 
          message: "Token has expired",
          statusCode: 401 
        }, 
        401
      );
    }
    
    return c.json(
      { 
        error: "Authentication failed", 
        message: error.message,
        statusCode: 401 
      }, 
      401
    );
  }
};
