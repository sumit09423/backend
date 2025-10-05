# Insurance Policy API Documentation

## Overview
This API provides comprehensive CRUD operations for managing insurance policies with a distributed table structure. The API supports creating, reading, updating, and deleting insurance policies with full validation, search capabilities, and JWT-based authentication.

## Base URL
```
http://localhost:5000/api/policies
```

## Authentication
**All policy endpoints require JWT authentication.** Include the JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

### Getting a JWT Token
First, login to get a JWT token:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "yourpassword"
  }'
```

The response will include a `token` field that you can use for authentication.

## API Endpoints

### 1. Create Policy
**POST** `/api/policies`

Creates a new insurance policy with comprehensive validation. The user ID is automatically extracted from the JWT token.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
Content-Type: application/json
```

**Request Body:**
```json
{
  "policy_details": {
    "master_policy_number": "MP123456789",
    "certificate_number": "CERT123456789",
    "product_name": "Health Insurance Premium",
    "product_uin": "UIN123456789",
    "coverage_type": "Individual",
    "period_of_insurance": "1 Year",
    "start_date_time": "2024-01-01T00:00:00Z",
    "expiry_date_time": "2024-12-31T23:59:59Z",
    "inception_date": "2024-01-01",
    "end_date": "2024-12-31"
  },
  "master_policyholder": {
    "master_policyholder_name": "John Doe"
  },
  "proposer_details": {
    "proposer_name": "Jane Smith",
    "proposer_address": "123 Main Street",
    "proposer_city": "Mumbai",
    "proposer_state": "Maharashtra",
    "proposer_pincode": "400001",
    "proposer_mobile": "9876543210",
    "proposer_email": "jane.smith@email.com",
    "unique_identification_number": "AADHAR123456789"
  },
  "insured_person_details": [
    {
      "insured_name": "John Doe",
      "insured_dob": "1990-01-01",
      "insured_gender": "Male",
      "insured_relationship": "Self",
      "nominee_name": "Jane Doe",
      "nominee_relationship": "Spouse",
      "sum_insured": "500000",
      "super_no_claim_bonus_percentage": "10",
      "super_no_claim_bonus_amount": "50000",
      "pre_existing_disease": "No",
      "member_id": "MEM001"
    }
  ],
  "premium_details": {
    "net_premium": "10000",
    "cgst_9": "900",
    "sgst_utgst_9": "900",
    "igst_18": "0",
    "gross_premium": "11800",
    "premium_payment_mode": "Annual"
  },
  "contact_details": {
    "contact_number": "9876543210",
    "contact_email": "contact@insurance.com",
    "contact_address": "Insurance Company Address"
  },
  "grievance_redressal": {
    "grievance_email": "grievance@insurance.com",
    "grievance_toll_free": "1800-123-4567"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Policy created successfully",
  "data": {
    "_id": "policy_id",
    "user_uuid": "user-12345-abcde-67890-fghij",
    "policy_details": { ... },
    "master_policyholder": { ... },
    "proposer_details": { ... },
    "insured_person_details": [ ... ],
    "premium_details": { ... },
    "contact_details": { ... },
    "grievance_redressal": { ... },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**

**Duplicate Master Policy Number:**
```json
{
  "success": false,
  "message": "A policy with this master policy number already exists",
  "field": "policy_details.master_policy_number",
  "duplicateValue": "MP123456789"
}
```

**Duplicate Certificate Number:**
```json
{
  "success": false,
  "message": "A policy with this certificate number already exists",
  "field": "policy_details.certificate_number",
  "duplicateValue": "CERT123456789"
}
```

**Duplicate Member ID:**
```json
{
  "success": false,
  "message": "A policy with this member ID already exists. Please use a different member ID",
  "field": "insured_person_details.member_id",
  "duplicateValue": "MEM001"
}
```

**Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Master policy number is required",
    "Invalid email format in proposer_details"
  ]
}
```

### 2. Get All Policies
**GET** `/api/policies`

Retrieves all policies for the authenticated user with pagination and filtering options.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of policies per page (default: 10)
- `master_policy_number` (optional): Filter by master policy number
- `certificate_number` (optional): Filter by certificate number
- `proposer_email` (optional): Filter by proposer email
- `proposer_mobile` (optional): Filter by proposer mobile

**Example:**
```
GET /api/policies?page=1&limit=10&proposer_email=jane@email.com
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "policy_id",
      "policy_details": { ... },
      "master_policyholder": { ... },
      "proposer_details": { ... },
      "insured_person_details": [ ... ],
      "premium_details": { ... },
      "contact_details": { ... },
      "grievance_redressal": { ... },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalPolicies": 50,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### 3. Get Policy by ID
**GET** `/api/policies/:id`

Retrieves a specific policy by its ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "policy_id",
    "policy_details": { ... },
    "master_policyholder": { ... },
    "proposer_details": { ... },
    "insured_person_details": [ ... ],
    "premium_details": { ... },
    "contact_details": { ... },
    "grievance_redressal": { ... },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Get Policy by Master Policy Number
**GET** `/api/policies/master-policy/:masterPolicyNumber`

Retrieves a policy by its master policy number.

**Example:**
```
GET /api/policies/master-policy/MP123456789
```

### 5. Get Policy by Certificate Number
**GET** `/api/policies/certificate/:certificateNumber`

Retrieves a policy by its certificate number.

**Example:**
```
GET /api/policies/certificate/CERT123456789
```

### 6. Get Policies by Authenticated User
**GET** `/api/policies/user`

Retrieves all policies created by the authenticated user.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of policies per page (default: 10)

**Example:**
```
GET /api/policies/user?page=1&limit=10
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "policy_id",
      "user_uuid": "user-12345-abcde-67890-fghij",
      "policy_details": { ... },
      "master_policyholder": { ... },
      "proposer_details": { ... },
      "insured_person_details": [ ... ],
      "premium_details": { ... },
      "contact_details": { ... },
      "grievance_redressal": { ... },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalPolicies": 15,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### 7. Update Policy
**PUT** `/api/policies/:id`

Updates an existing policy. Only provided fields will be updated.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
Content-Type: application/json
```

**Request Body:**
```json
{
  "policy_details": {
    "product_name": "Updated Health Insurance"
  },
  "premium_details": {
    "gross_premium": "12000"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Policy updated successfully",
  "data": {
    "_id": "policy_id",
    "policy_details": { ... },
    "master_policyholder": { ... },
    "proposer_details": { ... },
    "insured_person_details": [ ... ],
    "premium_details": { ... },
    "contact_details": { ... },
    "grievance_redressal": { ... },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 8. Delete Policy
**DELETE** `/api/policies/:id`

Deletes a policy by its ID.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Response:**
```json
{
  "success": true,
  "message": "Policy deleted successfully",
  "data": {
    "_id": "policy_id",
    "policy_details": { ... },
    "master_policyholder": { ... },
    "proposer_details": { ... },
    "insured_person_details": [ ... ],
    "premium_details": { ... },
    "contact_details": { ... },
    "grievance_redressal": { ... },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 9. Search Policies
**GET** `/api/policies/search`

Searches policies across multiple fields for the authenticated user.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Query Parameters:**
- `q` (required): Search query
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of results per page (default: 10)

**Example:**
```
GET /api/policies/search?q=John&page=1&limit=10
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "policy_id",
      "policy_details": { ... },
      "master_policyholder": { ... },
      "proposer_details": { ... },
      "insured_person_details": [ ... ],
      "premium_details": { ... },
      "contact_details": { ... },
      "grievance_redressal": { ... },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalPolicies": 15,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### 10. Get Policy Statistics
**GET** `/api/policies/stats`

Retrieves statistical information about policies for the authenticated user.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalPolicies": 150,
    "policiesByProduct": [
      {
        "_id": "Health Insurance Premium",
        "count": 75
      },
      {
        "_id": "Life Insurance Premium",
        "count": 50
      }
    ],
    "policiesByState": [
      {
        "_id": "Maharashtra",
        "count": 60
      },
      {
        "_id": "Karnataka",
        "count": 40
      }
    ],
    "recentPolicies": [
      {
        "_id": "policy_id",
        "policy_details": {
          "master_policy_number": "MP123456789",
          "product_name": "Health Insurance Premium"
        },
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

## Error Responses

### 400 Bad Request

**Missing Required Field:**
```json
{
  "success": false,
  "message": "Missing required field in policy_details: master_policy_number"
}
```

**Duplicate Master Policy Number:**
```json
{
  "success": false,
  "message": "A policy with this master policy number already exists",
  "field": "policy_details.master_policy_number",
  "duplicateValue": "MP123456789"
}
```

**Duplicate Certificate Number:**
```json
{
  "success": false,
  "message": "A policy with this certificate number already exists",
  "field": "policy_details.certificate_number",
  "duplicateValue": "CERT123456789"
}
```

**Duplicate Member ID:**
```json
{
  "success": false,
  "message": "A policy with this member ID already exists. Please use a different member ID",
  "field": "insured_person_details.member_id",
  "duplicateValue": "MEM001"
}
```

**Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Master policy number is required",
    "Invalid email format in proposer_details"
  ]
}
```

### 401 Unauthorized

**Missing Token:**
```json
{
  "success": false,
  "message": "User ID not found in token"
}
```

**Invalid Token:**
```json
{
  "error": "Invalid token",
  "message": "Invalid token provided",
  "statusCode": 401
}
```

**Expired Token:**
```json
{
  "error": "Token expired",
  "message": "Token has expired",
  "statusCode": 401
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Policy not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to create policy",
  "error": "Detailed error message"
}
```

## Data Validation

The API includes comprehensive validation for:

1. **Required Fields**: All mandatory fields are validated
2. **Email Format**: Email addresses are validated using regex
3. **Mobile Number**: 10-digit mobile number validation
4. **Gender**: Must be one of 'Male', 'Female', 'Other'
5. **Unique Fields**: Master policy number and certificate number must be unique
6. **Array Validation**: Insured person details must be a non-empty array

## Database Indexes

The following indexes are created for optimal performance:

- `policy_details.master_policy_number`
- `policy_details.certificate_number`
- `proposer_details.unique_identification_number`
- `proposer_details.proposer_email`
- `proposer_details.proposer_mobile`
- `createdAt` (for sorting)

## Usage Examples

### Complete Authentication Flow

```bash
# 1. Login to get JWT token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "yourpassword"
  }' | jq -r '.token')

echo "Token: $TOKEN"
```

### Creating a Policy
```bash
curl -X POST http://localhost:5000/api/policies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "policy_details": {
      "master_policy_number": "MP123456789",
      "certificate_number": "CERT123456789",
      "product_name": "Health Insurance Premium",
      "product_uin": "UIN123456789",
      "coverage_type": "Individual",
      "period_of_insurance": "1 Year",
      "start_date_time": "2024-01-01T00:00:00Z",
      "expiry_date_time": "2024-12-31T23:59:59Z",
      "inception_date": "2024-01-01",
      "end_date": "2024-12-31"
    },
    "master_policyholder": {
      "master_policyholder_name": "John Doe"
    },
    "proposer_details": {
      "proposer_name": "Jane Smith",
      "proposer_address": "123 Main Street",
      "proposer_city": "Mumbai",
      "proposer_state": "Maharashtra",
      "proposer_pincode": "400001",
      "proposer_mobile": "9876543210",
      "proposer_email": "jane.smith@email.com",
      "unique_identification_number": "AADHAR123456789"
    },
    "insured_person_details": [
      {
        "insured_name": "John Doe",
        "insured_dob": "1990-01-01",
        "insured_gender": "Male",
        "insured_relationship": "Self",
        "nominee_name": "Jane Doe",
        "nominee_relationship": "Spouse",
        "sum_insured": "500000",
        "super_no_claim_bonus_percentage": "10",
        "super_no_claim_bonus_amount": "50000",
        "pre_existing_disease": "No",
        "member_id": "MEM001"
      }
    ],
    "premium_details": {
      "net_premium": "10000",
      "cgst_9": "900",
      "sgst_utgst_9": "900",
      "igst_18": "0",
      "gross_premium": "11800",
      "premium_payment_mode": "Annual"
    },
    "contact_details": {
      "contact_number": "9876543210",
      "contact_email": "contact@insurance.com",
      "contact_address": "Insurance Company Address"
    },
    "grievance_redressal": {
      "grievance_email": "grievance@insurance.com",
      "grievance_toll_free": "1800-123-4567"
    }
  }'
```

### Getting All Policies
```bash
curl -X GET "http://localhost:5000/api/policies?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### Getting User's Policies
```bash
curl -X GET "http://localhost:5000/api/policies/user?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### Searching Policies
```bash
curl -X GET "http://localhost:5000/api/policies/search?q=John&page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### Updating a Policy
```bash
curl -X PUT http://localhost:5000/api/policies/policy_id \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "premium_details": {
      "gross_premium": "12000"
    }
  }'
```

### Deleting a Policy
```bash
curl -X DELETE http://localhost:5000/api/policies/policy_id \
  -H "Authorization: Bearer $TOKEN"
```

### Getting Policy Statistics
```bash
curl -X GET http://localhost:5000/api/policies/stats \
  -H "Authorization: Bearer $TOKEN"
```

## Notes

1. **Authentication Required**: All policy endpoints require JWT authentication
2. **User Isolation**: Users can only access their own policies
3. **Automatic User ID**: User ID is automatically extracted from JWT token
4. **Comprehensive Error Handling**: Detailed error messages for duplicate values and validation failures
5. **All timestamps are in ISO 8601 format**
6. **The API supports partial updates for the PUT endpoint**
7. **Search functionality works across multiple fields including names, emails, policy numbers, etc.**
8. **All responses include success/error status and appropriate HTTP status codes**
9. **The API includes comprehensive error handling and validation**

## Security Features

- **JWT Token Authentication**: Secure token-based authentication
- **User Data Isolation**: Users can only access their own policies
- **Automatic Authorization**: User ID extracted from token automatically
- **Session Management**: Token expiration and validation
- **Input Validation**: Comprehensive validation for all fields
- **Duplicate Prevention**: Prevents duplicate policy numbers, certificate numbers, and member IDs
