import { faker } from '@faker-js/faker';
import { Member, Application, MemberWithRenewalStatus, RenewalStatus } from '../types/member';

// Pharmacy-specific business name suffixes and types
const pharmacyTypes = [
  'Pharmacy', 'Drug Store', 'Apothecary', 'Medicines', 'Rx', 'Health Center',
  'Community Pharmacy', 'Family Pharmacy', 'Care Pharmacy', 'Wellness Pharmacy'
];

const pharmacyPrefixes = [
  'Main Street', 'Downtown', 'Village', 'Corner', 'Family', 'Community', 'Neighborhood',
  'Central', 'Park Avenue', 'Highland', 'Riverside', 'Sunset', 'Maple', 'Oak', 'Pine',
  'First Choice', 'Professional', 'Premier', 'Advanced', 'Modern', 'Classic', 'Heritage'
];

// Real NCPA membership tiers with actual pricing
const membershipTiers = {
  pharmacy: { price: 435, weight: 0.50 }, // Most common - Pharmacy Membership ($435 first pharmacy, $150 additional)
  staff_pharmacist: { price: 235, weight: 0.25 }, // Staff Pharmacist
  sustaining: { price: 435, weight: 0.10 }, // Sustaining Member (non-pharmacist owners/managers)
  retired: { price: 135, weight: 0.08 }, // Retired Pharmacist
  student: { price: 35, weight: 0.05 }, // Student Member
  ltc_division: { price: 235, weight: 0.015 }, // LTC Division Membership
  corporate: { price: 0, weight: 0.005 } // Corporate (pricing upon inquiry)
} as const;

// Generate realistic pharmacy business name
function generatePharmacyName(): string {
  const rand = Math.random();
  
  if (rand < 0.3) {
    // Format: "[Name] Pharmacy"
    return `${faker.person.lastName()} ${faker.helpers.arrayElement(pharmacyTypes)}`;
  } else if (rand < 0.6) {
    // Format: "[Prefix] [Type]"
    return `${faker.helpers.arrayElement(pharmacyPrefixes)} ${faker.helpers.arrayElement(pharmacyTypes)}`;
  } else if (rand < 0.8) {
    // Format: "[Name] & [Name] Pharmacy"
    return `${faker.person.lastName()} & ${faker.person.lastName()} ${faker.helpers.arrayElement(pharmacyTypes)}`;
  } else {
    // Format: "[City] [Type]"
    return `${faker.location.city()} ${faker.helpers.arrayElement(pharmacyTypes)}`;
  }
}

// Generate weighted membership tier
function generateMembershipTier(): { tier: keyof typeof membershipTiers; price: number } {
  const rand = Math.random();
  let cumulative = 0;
  
  for (const [tier, config] of Object.entries(membershipTiers)) {
    cumulative += config.weight;
    if (rand <= cumulative) {
      return { tier: tier as keyof typeof membershipTiers, price: config.price };
    }
  }
  
  return { tier: 'basic', price: membershipTiers.basic.price };
}

// Generate realistic status based on business lifecycle
function generateMembershipStatus(): Member['status'] {
  const rand = Math.random();
  if (rand < 0.65) return 'active'; // Most members are active
  if (rand < 0.80) return 'pending'; // Some pending renewals
  if (rand < 0.95) return 'inactive'; // Some temporarily inactive
  return 'churned'; // Small percentage churned
}

// Generate realistic dates
function generateDates(): { joinDate: string; renewalDate: string; lastActivity: string } {
  const joinDate = faker.date.between({ from: '2015-01-01', to: '2024-01-01' });
  const renewalDate = faker.date.between({ from: '2024-06-01', to: '2025-12-31' });
  const lastActivity = faker.date.between({ from: '2024-01-01', to: '2024-06-13' });
  
  return {
    joinDate: joinDate.toISOString().split('T')[0],
    renewalDate: renewalDate.toISOString().split('T')[0],
    lastActivity: lastActivity.toISOString().split('T')[0]
  };
}

// Generate a single pharmacy member
function generatePharmacyMember(index: number): Member {
  const businessName = generatePharmacyName();
  const { tier, price: basePrice } = generateMembershipTier();
  const status = generateMembershipStatus();
  const dates = generateDates();
  
  // Handle special pricing scenarios
  let finalPrice = basePrice;
  if (tier === 'pharmacy' && Math.random() < 0.3) {
    // 30% chance of multiple pharmacy locations (additional $150 each)
    const additionalPharmacies = Math.floor(Math.random() * 3) + 1; // 1-3 additional
    finalPrice = basePrice + (additionalPharmacies * 150);
  } else if (tier === 'corporate') {
    // Corporate memberships have variable pricing
    finalPrice = faker.helpers.arrayElement([2500, 5000, 7500, 10000]);
  } else if (tier === 'student' && Math.random() < 0.4) {
    // 40% chance of multi-year student discount
    const multiYear = faker.helpers.arrayElement([
      { years: 2, price: 60 },
      { years: 3, price: 80 },
      { years: 4, price: 100 }
    ]);
    finalPrice = multiYear.price;
  } else if (tier === 'sustaining' && Math.random() < 0.3) {
    // 30% chance of multi-year sustaining discount
    const multiYear = faker.helpers.arrayElement([
      { years: 2, price: 720 },
      { years: 3, price: 1045 }
    ]);
    finalPrice = multiYear.price;
  }
  
  // Generate owner/pharmacist name (often the contact person)
  const contactFirstName = faker.person.firstName();
  const contactLastName = faker.person.lastName();
  const contactName = `${contactFirstName} ${contactLastName}`;
  
  // Generate realistic pharmacy addresses (business addresses)
  const businessAddress = {
    street: `${faker.location.buildingNumber()} ${faker.location.street()}`,
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    zipCode: faker.location.zipCode()
  };
  
  // Home address in same general area
  const homeAddress = {
    street: `${faker.location.buildingNumber()} ${faker.location.street()}`,
    city: Math.random() < 0.7 ? businessAddress.city : faker.location.city(), // 70% same city
    state: businessAddress.state, // Usually same state
    zipCode: faker.location.zipCode()
  };
  
  // Professional pharmacy contact info
  const businessPhone = faker.phone.number('(###) ###-####');
  const personalPhone = faker.phone.number('(###) ###-####');
  
  // Professional email formats common in pharmacy
  const emailDomain = businessName.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '')
    .slice(0, 15) + 
    faker.helpers.arrayElement(['pharmacy.com', 'rx.com', 'care.com', 'health.net', 'meds.com']);
  
  const email = `${contactFirstName.toLowerCase()}.${contactLastName.toLowerCase()}@${emailDomain}`;
  
  return {
    id: (index + 1).toString(),
    membershipId: `NCPA-${String(index + 1).padStart(6, '0')}`,
    businessName,
    contactName,
    businessAddress,
    homeAddress,
    businessPhone,
    personalPhone,
    email,
    status,
    membershipTier: tier,
    membershipPrice: finalPrice,
    renewalDate: dates.renewalDate,
    joinDate: dates.joinDate,
    lastActivity: dates.lastActivity
  };
}

// Generate array of pharmacy members
export function generatePharmacyMembers(count: number = 250): Member[] {
  return Array.from({ length: count }, (_, index) => generatePharmacyMember(index));
}

// Generate realistic application status
function generateApplicationStatus(): Application['status'] {
  const rand = Math.random();
  if (rand < 0.40) return 'pending_review'; // Most applications are pending
  if (rand < 0.65) return 'under_review'; // Some under review
  if (rand < 0.80) return 'requires_info'; // Some need more info
  if (rand < 0.95) return 'approved'; // Some approved
  return 'rejected'; // Few rejected
}

// Generate a single application
function generateApplication(index: number): Application {
  const businessName = generatePharmacyName();
  const { tier } = generateMembershipTier();
  const status = generateApplicationStatus();
  
  // Generate applicant name
  const contactFirstName = faker.person.firstName();
  const contactLastName = faker.person.lastName();
  const contactName = `${contactFirstName} ${contactLastName}`;
  
  // Generate business address
  const businessAddress = {
    street: `${faker.location.buildingNumber()} ${faker.location.street()}`,
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    zipCode: faker.location.zipCode()
  };
  
  // Professional contact info
  const businessPhone = faker.phone.number('(###) ###-####');
  
  // Professional email
  const emailDomain = businessName.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '')
    .slice(0, 15) + 
    faker.helpers.arrayElement(['pharmacy.com', 'rx.com', 'care.com', 'health.net', 'meds.com']);
  
  const email = `${contactFirstName.toLowerCase()}.${contactLastName.toLowerCase()}@${emailDomain}`;
  
  // Generate submitted date (recent applications)
  const submittedDate = faker.date.between({ from: '2024-05-01', to: '2024-06-13' });
  
  // Add reviewer for applications that have been reviewed
  const reviewedBy = ['under_review', 'approved', 'rejected'].includes(status) 
    ? faker.person.fullName() 
    : undefined;
  
  // Add notes for some applications
  const notes = Math.random() < 0.3 ? faker.lorem.sentence() : undefined;
  
  return {
    id: (index + 1).toString(),
    applicationId: `APP-${String(index + 1).padStart(4, '0')}`,
    businessName,
    contactName,
    email,
    businessPhone,
    businessAddress,
    requestedTier: tier,
    status,
    submittedDate: submittedDate.toISOString().split('T')[0],
    reviewedBy,
    notes
  };
}

// Generate array of applications
export function generateApplications(count: number = 25): Application[] {
  return Array.from({ length: count }, (_, index) => generateApplication(index));
}

// Calculate renewal status based on renewal date
function calculateRenewalStatus(renewalDate: string): RenewalStatus {
  const today = new Date();
  const renewal = new Date(renewalDate);
  const diffTime = renewal.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return 'past_due';
  } else if (diffDays <= 30) {
    return 'due_soon';
  } else if (diffDays <= 90) {
    return 'upcoming';
  } else {
    return 'renewed';
  }
}

// Generate members with renewal status
export function generateMembersWithRenewalStatus(count: number = 250): MemberWithRenewalStatus[] {
  return generatePharmacyMembers(count).map(member => ({
    ...member,
    renewalStatus: calculateRenewalStatus(member.renewalDate)
  }));
}

// Pre-generated data for immediate use
export const mockPharmacyMembers = generatePharmacyMembers(250);
export const mockApplications = generateApplications(25);
export const mockMembersWithRenewalStatus = generateMembersWithRenewalStatus(250);