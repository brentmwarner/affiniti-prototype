export interface Member {
  id: string;
  membershipId: string;
  businessName: string;
  contactName: string;
  businessAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  homeAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  businessPhone: string;
  personalPhone: string;
  email: string;
  status: 'active' | 'inactive' | 'pending' | 'churned';
  membershipTier: 'pharmacy' | 'staff_pharmacist' | 'student' | 'retired' | 'sustaining' | 'corporate' | 'ltc_division';
  membershipPrice: number;
  renewalDate: string;
  joinDate: string;
  lastActivity: string;
}

export interface Application {
  id: string;
  applicationId: string;
  businessName: string;
  contactName: string;
  email: string;
  businessPhone: string;
  businessAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  requestedTier: 'pharmacy' | 'staff_pharmacist' | 'student' | 'retired' | 'sustaining' | 'corporate' | 'ltc_division';
  status: 'pending_review' | 'under_review' | 'approved' | 'rejected' | 'requires_info';
  submittedDate: string;
  reviewedBy?: string;
  notes?: string;
}

export interface MemberFilters {
  search: string;
  status: string;
  tier: string;
  renewalDateRange: {
    start: string;
    end: string;
  };
}

export type RenewalStatus = 'upcoming' | 'due_soon' | 'past_due' | 'renewed';

export interface MemberWithRenewalStatus extends Member {
  renewalStatus: RenewalStatus;
}