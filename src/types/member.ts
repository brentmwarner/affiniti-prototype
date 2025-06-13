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

export interface MemberFilters {
  search: string;
  status: string;
  tier: string;
  renewalDateRange: {
    start: string;
    end: string;
  };
}