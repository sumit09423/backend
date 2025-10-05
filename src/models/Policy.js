import mongoose from "mongoose";

const insuredPersonSchema = new mongoose.Schema({
  insured_name: {
    type: String,
    required: true,
    trim: true
  },
  insured_dob: {
    type: String,
    required: true
  },
  insured_gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  insured_relationship: {
    type: String,
    required: true,
    trim: true
  },
  nominee_name: {
    type: String,
    required: true,
    trim: true
  },
  nominee_relationship: {
    type: String,
    required: true,
    trim: true
  },
  sum_insured: {
    type: String,
    required: true
  },
  super_no_claim_bonus_percentage: {
    type: String,
    default: ""
  },
  super_no_claim_bonus_amount: {
    type: String,
    default: ""
  },
  pre_existing_disease: {
    type: String,
    default: ""
  },
  member_id: {
    type: String,
    required: true,
    unique: true
  }
});

const policySchema = new mongoose.Schema({
  user_uuid: {
    type: String,
    required: true,
    trim: true
  },
  policy_details: {
    master_policy_number: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    certificate_number: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    product_name: {
      type: String,
      required: true,
      trim: true
    },
    product_uin: {
      type: String,
      required: true,
      trim: true
    },
    coverage_type: {
      type: String,
      required: true,
      trim: true
    },
    period_of_insurance: {
      type: String,
      required: true
    },
    start_date_time: {
      type: String,
      required: true
    },
    expiry_date_time: {
      type: String,
      required: true
    },
    inception_date: {
      type: String,
      required: true
    },
    end_date: {
      type: String,
      required: true
    }
  },
  master_policyholder: {
    master_policyholder_name: {
      type: String,
      required: true,
      trim: true
    }
  },
  proposer_details: {
    proposer_name: {
      type: String,
      required: true,
      trim: true
    },
    proposer_address: {
      type: String,
      required: true,
      trim: true
    },
    proposer_city: {
      type: String,
      required: true,
      trim: true
    },
    proposer_state: {
      type: String,
      required: true,
      trim: true
    },
    proposer_pincode: {
      type: String,
      required: true,
      trim: true
    },
    proposer_mobile: {
      type: String,
      required: true,
      trim: true
    },
    proposer_email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    unique_identification_number: {
      type: String,
      required: true,
      unique: true,
      trim: true
    }
  },
  insured_person_details: [insuredPersonSchema],
  premium_details: {
    net_premium: {
      type: String,
      required: true
    },
    cgst_9: {
      type: String,
      default: ""
    },
    sgst_utgst_9: {
      type: String,
      default: ""
    },
    igst_18: {
      type: String,
      default: ""
    },
    gross_premium: {
      type: String,
      required: true
    },
    premium_payment_mode: {
      type: String,
      required: true,
      trim: true
    }
  },
  contact_details: {
    contact_number: {
      type: String,
      required: true,
      trim: true
    },
    contact_email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    contact_address: {
      type: String,
      required: true,
      trim: true
    }
  },
  grievance_redressal: {
    grievance_email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    grievance_toll_free: {
      type: String,
      required: true,
      trim: true
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
policySchema.index({ user_uuid: 1 });
policySchema.index({ "policy_details.master_policy_number": 1 });
policySchema.index({ "policy_details.certificate_number": 1 });
policySchema.index({ "proposer_details.unique_identification_number": 1 });
policySchema.index({ "proposer_details.proposer_email": 1 });
policySchema.index({ "proposer_details.proposer_mobile": 1 });
policySchema.index({ createdAt: -1 });
policySchema.index({ user_uuid: 1, createdAt: -1 }); // Compound index for user's policies

const Policy = mongoose.model("Policy", policySchema);

export default Policy;
