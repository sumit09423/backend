import Policy from "../models/Policy.js";

// Create a new policy
export const createPolicy = async (c) => {
  try {
    const policyData = await c.req.json();
    
    // Get user ID from token (set by auth middleware)
    const userId = c.get('userId');
    if (!userId) {
      return c.json({
        success: false,
        message: "User ID not found in token"
      }, 401);
    }
    
    // Add user ID to policy data
    policyData.user_uuid = userId;
    
    // Check if policy with same master policy number or certificate number already exists
    const existingPolicy = await Policy.findOne({
      $or: [
        { "policy_details.master_policy_number": policyData.policy_details.master_policy_number },
        { "policy_details.certificate_number": policyData.policy_details.certificate_number }
      ]
    });

    if (existingPolicy) {
      return c.json({
        success: false,
        message: "Policy with this master policy number or certificate number already exists"
      }, 400);
    }

    // Check for duplicate member IDs in insured person details
    const memberIds = policyData.insured_person_details.map(person => person.member_id);
    const duplicateMemberId = await Policy.findOne({
      "insured_person_details.member_id": { $in: memberIds }
    });

    if (duplicateMemberId) {
      return c.json({
        success: false,
        message: "One or more member IDs already exist. Please use unique member IDs",
        field: "insured_person_details.member_id"
      }, 400);
    }

    const policy = new Policy(policyData);
    await policy.save();

    return c.json({
      success: true,
      message: "Policy created successfully",
      data: policy
    }, 201);
  } catch (error) {
    console.error("Error creating policy:", error);
    
    // Handle specific MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      let message = "Duplicate value found";
      
      if (field === "policy_details.master_policy_number") {
        message = "A policy with this master policy number already exists";
      } else if (field === "policy_details.certificate_number") {
        message = "A policy with this certificate number already exists";
      } else if (field === "proposer_details.unique_identification_number") {
        message = "A policy with this unique identification number already exists";
      } else if (field === "insured_person_details.member_id") {
        message = "A policy with this member ID already exists. Please use a different member ID";
      } else {
        message = `Duplicate value found for field: ${field}`;
      }
      
      return c.json({
        success: false,
        message: message,
        field: field,
        duplicateValue: error.keyValue[field]
      }, 400);
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return c.json({
        success: false,
        message: "Validation failed",
        errors: errors
      }, 400);
    }
    
    return c.json({
      success: false,
      message: "Failed to create policy",
      error: error.message
    }, 500);
  }
};

// Get all policies with pagination and filtering
export const getAllPolicies = async (c) => {
  try {
    const page = parseInt(c.req.query("page")) || 1;
    const limit = parseInt(c.req.query("limit")) || 10;
    const skip = (page - 1) * limit;
    
    // Get user ID from token (set by auth middleware)
    const userId = c.get('userId');
    if (!userId) {
      return c.json({
        success: false,
        message: "User ID not found in token"
      }, 401);
    }
    
    // Build filter object - default to user's policies
    const filter = { user_uuid: userId };
    
    if (c.req.query("master_policy_number")) {
      filter["policy_details.master_policy_number"] = new RegExp(c.req.query("master_policy_number"), 'i');
    }
    
    if (c.req.query("certificate_number")) {
      filter["policy_details.certificate_number"] = new RegExp(c.req.query("certificate_number"), 'i');
    }
    
    if (c.req.query("proposer_email")) {
      filter["proposer_details.proposer_email"] = new RegExp(c.req.query("proposer_email"), 'i');
    }
    
    if (c.req.query("proposer_mobile")) {
      filter["proposer_details.proposer_mobile"] = c.req.query("proposer_mobile");
    }

    const policies = await Policy.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPolicies = await Policy.countDocuments(filter);
    const totalPages = Math.ceil(totalPolicies / limit);

    return c.json({
      success: true,
      data: policies,
      pagination: {
        currentPage: page,
        totalPages,
        totalPolicies,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching policies:", error);
    return c.json({
      success: false,
      message: "Failed to fetch policies",
      error: error.message
    }, 500);
  }
};

// Get policy by ID
export const getPolicyById = async (c) => {
  try {
    const { id } = c.req.param();
    
    const policy = await Policy.findById(id);
    
    if (!policy) {
      return c.json({
        success: false,
        message: "Policy not found"
      }, 404);
    }

    return c.json({
      success: true,
      data: policy
    });
  } catch (error) {
    console.error("Error fetching policy:", error);
    return c.json({
      success: false,
      message: "Failed to fetch policy",
      error: error.message
    }, 500);
  }
};

// Get policy by master policy number
export const getPolicyByMasterPolicyNumber = async (c) => {
  try {
    const { masterPolicyNumber } = c.req.param();
    
    const policy = await Policy.findOne({
      "policy_details.master_policy_number": masterPolicyNumber
    });
    
    if (!policy) {
      return c.json({
        success: false,
        message: "Policy not found"
      }, 404);
    }

    return c.json({
      success: true,
      data: policy
    });
  } catch (error) {
    console.error("Error fetching policy:", error);
    return c.json({
      success: false,
      message: "Failed to fetch policy",
      error: error.message
    }, 500);
  }
};

// Get policy by certificate number
export const getPolicyByCertificateNumber = async (c) => {
  try {
    const { certificateNumber } = c.req.param();
    
    const policy = await Policy.findOne({
      "policy_details.certificate_number": certificateNumber
    });
    
    if (!policy) {
      return c.json({
        success: false,
        message: "Policy not found"
      }, 404);
    }

    return c.json({
      success: true,
      data: policy
    });
  } catch (error) {
    console.error("Error fetching policy:", error);
    return c.json({
      success: false,
      message: "Failed to fetch policy",
      error: error.message
    }, 500);
  }
};

// Update policy by ID
export const updatePolicy = async (c) => {
  try {
    const { id } = c.req.param();
    const updateData = await c.req.json();
    
    // Check if policy exists
    const existingPolicy = await Policy.findById(id);
    if (!existingPolicy) {
      return c.json({
        success: false,
        message: "Policy not found"
      }, 404);
    }

    // Check if master policy number or certificate number conflicts with other policies
    if (updateData.policy_details) {
      const conflictPolicy = await Policy.findOne({
        _id: { $ne: id },
        $or: [
          { "policy_details.master_policy_number": updateData.policy_details.master_policy_number },
          { "policy_details.certificate_number": updateData.policy_details.certificate_number }
        ]
      });

      if (conflictPolicy) {
        return c.json({
          success: false,
          message: "Policy with this master policy number or certificate number already exists"
        }, 400);
      }
    }

    const updatedPolicy = await Policy.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return c.json({
      success: true,
      message: "Policy updated successfully",
      data: updatedPolicy
    });
  } catch (error) {
    console.error("Error updating policy:", error);
    
    // Handle specific MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      let message = "Duplicate value found";
      
      if (field === "policy_details.master_policy_number") {
        message = "A policy with this master policy number already exists";
      } else if (field === "policy_details.certificate_number") {
        message = "A policy with this certificate number already exists";
      } else if (field === "proposer_details.unique_identification_number") {
        message = "A policy with this unique identification number already exists";
      } else if (field === "insured_person_details.member_id") {
        message = "A policy with this member ID already exists. Please use a different member ID";
      } else {
        message = `Duplicate value found for field: ${field}`;
      }
      
      return c.json({
        success: false,
        message: message,
        field: field,
        duplicateValue: error.keyValue[field]
      }, 400);
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return c.json({
        success: false,
        message: "Validation failed",
        errors: errors
      }, 400);
    }
    
    return c.json({
      success: false,
      message: "Failed to update policy",
      error: error.message
    }, 500);
  }
};

// Delete policy by ID
export const deletePolicy = async (c) => {
  try {
    const { id } = c.req.param();
    
    const policy = await Policy.findByIdAndDelete(id);
    
    if (!policy) {
      return c.json({
        success: false,
        message: "Policy not found"
      }, 404);
    }

    return c.json({
      success: true,
      message: "Policy deleted successfully",
      data: policy
    });
  } catch (error) {
    console.error("Error deleting policy:", error);
    return c.json({
      success: false,
      message: "Failed to delete policy",
      error: error.message
    }, 500);
  }
};

// Search policies by various criteria
export const searchPolicies = async (c) => {
  try {
    const query = c.req.query("q");
    const page = parseInt(c.req.query("page")) || 1;
    const limit = parseInt(c.req.query("limit")) || 10;
    const skip = (page - 1) * limit;

    if (!query) {
      return c.json({
        success: false,
        message: "Search query is required"
      }, 400);
    }

    // Get user ID from token (set by auth middleware)
    const userId = c.get('userId');
    if (!userId) {
      return c.json({
        success: false,
        message: "User ID not found in token"
      }, 401);
    }

    const searchFilter = {
      user_uuid: userId,
      $or: [
        { "policy_details.master_policy_number": new RegExp(query, 'i') },
        { "policy_details.certificate_number": new RegExp(query, 'i') },
        { "policy_details.product_name": new RegExp(query, 'i') },
        { "master_policyholder.master_policyholder_name": new RegExp(query, 'i') },
        { "proposer_details.proposer_name": new RegExp(query, 'i') },
        { "proposer_details.proposer_email": new RegExp(query, 'i') },
        { "proposer_details.proposer_mobile": new RegExp(query, 'i') },
        { "proposer_details.unique_identification_number": new RegExp(query, 'i') },
        { "insured_person_details.insured_name": new RegExp(query, 'i') },
        { "insured_person_details.member_id": new RegExp(query, 'i') },
        { "user_uuid": new RegExp(query, 'i') }
      ]
    };

    const policies = await Policy.find(searchFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPolicies = await Policy.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalPolicies / limit);

    return c.json({
      success: true,
      data: policies,
      pagination: {
        currentPage: page,
        totalPages,
        totalPolicies,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error("Error searching policies:", error);
    return c.json({
      success: false,
      message: "Failed to search policies",
      error: error.message
    }, 500);
  }
};

// Get policies by user UUID (uses authenticated user)
export const getPoliciesByUser = async (c) => {
  try {
    const page = parseInt(c.req.query("page")) || 1;
    const limit = parseInt(c.req.query("limit")) || 10;
    const skip = (page - 1) * limit;
    
    // Get user ID from token (set by auth middleware)
    const userId = c.get('userId');
    if (!userId) {
      return c.json({
        success: false,
        message: "User ID not found in token"
      }, 401);
    }
    
    const filter = { user_uuid: userId };
    
    const policies = await Policy.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPolicies = await Policy.countDocuments(filter);
    const totalPages = Math.ceil(totalPolicies / limit);

    return c.json({
      success: true,
      data: policies,
      pagination: {
        currentPage: page,
        totalPages,
        totalPolicies,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching policies by user:", error);
    return c.json({
      success: false,
      message: "Failed to fetch policies for user",
      error: error.message
    }, 500);
  }
};

// Get policy statistics
export const getPolicyStats = async (c) => {
  try {
    const totalPolicies = await Policy.countDocuments();
    
    const policiesByProduct = await Policy.aggregate([
      {
        $group: {
          _id: "$policy_details.product_name",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const policiesByState = await Policy.aggregate([
      {
        $group: {
          _id: "$proposer_details.proposer_state",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const recentPolicies = await Policy.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("policy_details.master_policy_number policy_details.product_name createdAt");

    return c.json({
      success: true,
      data: {
        totalPolicies,
        policiesByProduct,
        policiesByState,
        recentPolicies
      }
    });
  } catch (error) {
    console.error("Error fetching policy statistics:", error);
    return c.json({
      success: false,
      message: "Failed to fetch policy statistics",
      error: error.message
    }, 500);
  }
};
