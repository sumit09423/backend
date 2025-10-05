import User from "../models/User.js";

export const getUsers = async (c) => {
  try {
    const users = await User.find();
    return c.json(users);
  } catch (error) {
    return c.json(
      { 
        error: "Failed to fetch users", 
        message: error.message,
        statusCode: 500 
      }, 
      500
    );
  }
};

export const createUser = async (c) => {
  try {
    const body = await c.req.json();
    
    // Basic validation
    if (!body.firstName || !body.lastName || !body.email || !body.password) {
      return c.json(
        { 
          error: "Validation failed", 
          message: "First name, last name, email, and password are required",
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

    const user = await User.create({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: body.password,
    });
    return c.json(user, 201);
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
        error: "Failed to create user", 
        message: error.message,
        statusCode: 500 
      }, 
      500
    );
  }
};
