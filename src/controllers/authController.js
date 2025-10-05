import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "7d",
  });
};

// Register user
export const register = async (c) => {
  try {
    const body = await c.req.json();
    
    // Basic validation
    if (!body.firstName || !body.lastName || !body.email || !body.password || !body.confirmPassword) {
      return c.json(
        { 
          error: "Validation failed", 
          message: "First name, last name, email, password, and confirm password are required",
          statusCode: 400 
        }, 
        400
      );
    }

    // Validate password confirmation
    if (body.password !== body.confirmPassword) {
      return c.json(
        { 
          error: "Validation failed", 
          message: "Password and confirm password do not match",
          statusCode: 400 
        }, 
        400
      );
    }

    // Validate password strength (minimum 6 characters)
    if (body.password.length < 6) {
      return c.json(
        { 
          error: "Validation failed", 
          message: "Password must be at least 6 characters long",
          statusCode: 400 
        }, 
        400
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return c.json(
        { 
          error: "User already exists", 
          message: "A user with this email already exists",
          statusCode: 409 
        }, 
        409
      );
    }

    // Create new user
    const user = await User.create({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: body.password,
    });

    // Generate token
    const token = generateToken(user._id);

    return c.json(
      {
        message: "User registered successfully",
        user: user.toJSON(),
        token,
        statusCode: 201
      },
      201
    );
  } catch (error) {
    if (error.name === 'ValidationError') {
      return c.json(
        { 
          error: "Validation failed", 
          message: error.message,
          statusCode: 400 
        }, 
        400
      );
    }
    
    return c.json(
      { 
        error: "Failed to register user", 
        message: error.message,
        statusCode: 500 
      }, 
      500
    );
  }
};

// Login user
export const login = async (c) => {
  try {
    console.log('Login attempt received');
    const body = await c.req.json();
    console.log('Login body:', { email: body.email, hasPassword: !!body.password });
    
    // Basic validation
    if (!body.email || !body.password) {
      return c.json(
        { 
          error: "Validation failed", 
          message: "Email and password are required",
          statusCode: 400 
        }, 
        400
      );
    }

    // Find user by email
    const user = await User.findOne({ email: body.email });
    console.log('User found:', !!user);
    if (!user) {
      console.log('User not found for email:', body.email);
      return c.json(
        { 
          error: "Invalid credentials", 
          message: "Invalid email or password",
          statusCode: 401 
        }, 
        401
      );
    }

    // Check password
    const isPasswordValid = await user.comparePassword(body.password);
    console.log('Password valid:', isPasswordValid);
    if (!isPasswordValid) {
      console.log('Invalid password for user:', body.email);
      return c.json(
        { 
          error: "Invalid credentials", 
          message: "Invalid email or password",
          statusCode: 401 
        }, 
        401
      );
    }

    // Generate token
    const token = generateToken(user._id);
    console.log('Login successful for user:', body.email);

    return c.json(
      {
        message: "Login successful",
        user: user.toJSON(),
        token,
        statusCode: 200
      },
      200
    );
  } catch (error) {
    console.error('Login error:', error);
    return c.json(
      { 
        error: "Failed to login", 
        message: error.message,
        statusCode: 500 
      }, 
      500
    );
  }
};

// Get current user profile
export const getProfile = async (c) => {
  try {
    const userId = c.get('userId');
    
    const user = await User.findById(userId);
    if (!user) {
      return c.json(
        { 
          error: "User not found", 
          message: "User not found",
          statusCode: 404 
        }, 
        404
      );
    }

    return c.json({
      user: user.toJSON(),
      statusCode: 200
    });
  } catch (error) {
    return c.json(
      { 
        error: "Failed to get profile", 
        message: error.message,
        statusCode: 500 
      }, 
      500
    );
  }
};
