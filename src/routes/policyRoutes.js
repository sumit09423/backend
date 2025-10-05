import { Hono } from "hono";
import {
  createPolicy,
  getAllPolicies,
  getPolicyById,
  getPolicyByMasterPolicyNumber,
  getPolicyByCertificateNumber,
  updatePolicy,
  deletePolicy,
  searchPolicies,
  getPolicyStats,
  getPoliciesByUser
} from "../controllers/policyController.js";
import { validatePolicyData, validatePolicyUpdate } from "../middlewares/policyValidation.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const policyRoutes = new Hono();

// Apply auth middleware to all policy routes
policyRoutes.use("*", authMiddleware);

// Create a new policy
policyRoutes.post("/", validatePolicyData, createPolicy);

// Get all policies with pagination and filtering
policyRoutes.get("/", getAllPolicies);

// Search policies
policyRoutes.get("/search", searchPolicies);

// Get policy statistics
policyRoutes.get("/stats", getPolicyStats);

// Get policies by user UUID (uses authenticated user)
policyRoutes.get("/user", getPoliciesByUser);

// Get policy by ID
policyRoutes.get("/:id", getPolicyById);

// Get policy by master policy number
policyRoutes.get("/master-policy/:masterPolicyNumber", getPolicyByMasterPolicyNumber);

// Get policy by certificate number
policyRoutes.get("/certificate/:certificateNumber", getPolicyByCertificateNumber);

// Update policy by ID
policyRoutes.put("/:id", validatePolicyUpdate, updatePolicy);

// Delete policy by ID
policyRoutes.delete("/:id", deletePolicy);

export default policyRoutes;
