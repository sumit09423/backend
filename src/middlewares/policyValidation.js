// Validation middleware for policy data
export const validatePolicyData = async (c, next) => {
  try {
    const data = await c.req.json();
    
    // Required fields validation
    const requiredFields = [
      'policy_details',
      'master_policyholder',
      'proposer_details',
      'insured_person_details',
      'premium_details',
      'contact_details',
      'grievance_redressal'
    ];

    // Check if all required sections are present
    for (const field of requiredFields) {
      if (!data[field]) {
        return c.json({
          success: false,
          message: `Missing required section: ${field}`
        }, 400);
      }
    }

    // Note: user_uuid will be automatically added from JWT token in the controller

    // Validate policy_details
    const policyDetails = data.policy_details;
    const requiredPolicyFields = [
      'master_policy_number',
      'certificate_number',
      'product_name',
      'product_uin',
      'coverage_type',
      'period_of_insurance',
      'start_date_time',
      'expiry_date_time',
      'inception_date',
      'end_date'
    ];

    for (const field of requiredPolicyFields) {
      if (!policyDetails[field] || policyDetails[field].trim() === '') {
        return c.json({
          success: false,
          message: `Missing required field in policy_details: ${field}`
        }, 400);
      }
    }

    // Validate master_policyholder
    if (!data.master_policyholder.master_policyholder_name || 
        data.master_policyholder.master_policyholder_name.trim() === '') {
      return c.json({
        success: false,
        message: 'master_policyholder_name is required'
      }, 400);
    }

    // Validate proposer_details
    const proposerDetails = data.proposer_details;
    const requiredProposerFields = [
      'proposer_name',
      'proposer_address',
      'proposer_city',
      'proposer_state',
      'proposer_pincode',
      'proposer_mobile',
      'proposer_email',
      'unique_identification_number'
    ];

    for (const field of requiredProposerFields) {
      if (!proposerDetails[field] || proposerDetails[field].trim() === '') {
        return c.json({
          success: false,
          message: `Missing required field in proposer_details: ${field}`
        }, 400);
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(proposerDetails.proposer_email)) {
      return c.json({
        success: false,
        message: 'Invalid email format in proposer_details'
      }, 400);
    }

    // Validate mobile number (basic validation)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(proposerDetails.proposer_mobile)) {
      return c.json({
        success: false,
        message: 'Invalid mobile number format in proposer_details (should be 10 digits)'
      }, 400);
    }

    // Validate insured_person_details
    if (!Array.isArray(data.insured_person_details) || data.insured_person_details.length === 0) {
      return c.json({
        success: false,
        message: 'insured_person_details must be a non-empty array'
      }, 400);
    }

    for (let i = 0; i < data.insured_person_details.length; i++) {
      const insuredPerson = data.insured_person_details[i];
      const requiredInsuredFields = [
        'insured_name',
        'insured_dob',
        'insured_gender',
        'insured_relationship',
        'nominee_name',
        'nominee_relationship',
        'sum_insured',
        'member_id'
      ];

      for (const field of requiredInsuredFields) {
        if (!insuredPerson[field] || insuredPerson[field].trim() === '') {
          return c.json({
            success: false,
            message: `Missing required field in insured_person_details[${i}]: ${field}`
          }, 400);
        }
      }

      // Validate gender
      const validGenders = ['Male', 'Female', 'Other'];
      if (!validGenders.includes(insuredPerson.insured_gender)) {
        return c.json({
          success: false,
          message: `Invalid gender in insured_person_details[${i}]. Must be one of: ${validGenders.join(', ')}`
        }, 400);
      }
    }

    // Validate premium_details
    const premiumDetails = data.premium_details;
    const requiredPremiumFields = [
      'net_premium',
      'gross_premium',
      'premium_payment_mode'
    ];

    for (const field of requiredPremiumFields) {
      if (!premiumDetails[field] || premiumDetails[field].trim() === '') {
        return c.json({
          success: false,
          message: `Missing required field in premium_details: ${field}`
        }, 400);
      }
    }

    // Validate contact_details
    const contactDetails = data.contact_details;
    const requiredContactFields = [
      'contact_number',
      'contact_email',
      'contact_address'
    ];

    for (const field of requiredContactFields) {
      if (!contactDetails[field] || contactDetails[field].trim() === '') {
        return c.json({
          success: false,
          message: `Missing required field in contact_details: ${field}`
        }, 400);
      }
    }

    // Validate contact email format
    if (!emailRegex.test(contactDetails.contact_email)) {
      return c.json({
        success: false,
        message: 'Invalid email format in contact_details'
      }, 400);
    }

    // Validate grievance_redressal
    const grievanceRedressal = data.grievance_redressal;
    const requiredGrievanceFields = [
      'grievance_email',
      'grievance_toll_free'
    ];

    for (const field of requiredGrievanceFields) {
      if (!grievanceRedressal[field] || grievanceRedressal[field].trim() === '') {
        return c.json({
          success: false,
          message: `Missing required field in grievance_redressal: ${field}`
        }, 400);
      }
    }

    // Validate grievance email format
    if (!emailRegex.test(grievanceRedressal.grievance_email)) {
      return c.json({
        success: false,
        message: 'Invalid email format in grievance_redressal'
      }, 400);
    }

    // If all validations pass, store the validated data and continue
    c.set('validatedPolicyData', data);
    await next();
  } catch (error) {
    return c.json({
      success: false,
      message: 'Invalid JSON data',
      error: error.message
    }, 400);
  }
};

// Validation middleware for policy updates (less strict)
export const validatePolicyUpdate = async (c, next) => {
  try {
    const data = await c.req.json();
    
    // Validate email formats if present
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (data.proposer_details?.proposer_email && 
        !emailRegex.test(data.proposer_details.proposer_email)) {
      return c.json({
        success: false,
        message: 'Invalid email format in proposer_details'
      }, 400);
    }

    if (data.contact_details?.contact_email && 
        !emailRegex.test(data.contact_details.contact_email)) {
      return c.json({
        success: false,
        message: 'Invalid email format in contact_details'
      }, 400);
    }

    if (data.grievance_redressal?.grievance_email && 
        !emailRegex.test(data.grievance_redressal.grievance_email)) {
      return c.json({
        success: false,
        message: 'Invalid email format in grievance_redressal'
      }, 400);
    }

    // Validate mobile number if present
    if (data.proposer_details?.proposer_mobile) {
      const mobileRegex = /^[0-9]{10}$/;
      if (!mobileRegex.test(data.proposer_details.proposer_mobile)) {
        return c.json({
          success: false,
          message: 'Invalid mobile number format in proposer_details (should be 10 digits)'
        }, 400);
      }
    }

    // Validate gender if present
    if (data.insured_person_details) {
      for (let i = 0; i < data.insured_person_details.length; i++) {
        const insuredPerson = data.insured_person_details[i];
        if (insuredPerson.insured_gender) {
          const validGenders = ['Male', 'Female', 'Other'];
          if (!validGenders.includes(insuredPerson.insured_gender)) {
            return c.json({
              success: false,
              message: `Invalid gender in insured_person_details[${i}]. Must be one of: ${validGenders.join(', ')}`
            }, 400);
          }
        }
      }
    }

    // If all validations pass, store the validated data and continue
    c.set('validatedPolicyData', data);
    await next();
  } catch (error) {
    return c.json({
      success: false,
      message: 'Invalid JSON data',
      error: error.message
    }, 400);
  }
};