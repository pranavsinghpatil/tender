export type UserRole = "admin" | "officer" | "user" | "bidder";

// Payload for user registration
export interface RegisterData {
  // Account Information
  username: string;
  password: string;
  confirmPassword?: string;
  name: string;
  role: UserRole;
  email: string;
  mobileNumber: string;
  walletAddress: string;
  countryCode?: string;
  
  // Company Details
  bidderType: "Indian" | "Foreign";
  companyName: string;
  registrationNumber: string;
  taxId?: string; // Optional field for GST/PAN/Tax ID
  establishmentYear: string;
  legalStatus: 'private' | 'public' | 'llp' | 'opc' | 'other';
  companyCategory: 'startup' | 'sme' | 'msme' | 'large' | 'mnc' | 'other';
  
  // Address Details
  registeredAddress: string;
  city: string;
  state: string;
  pinCode: string;
  
  // Additional Information
  additionalInfo?: string;
  supportingDocuments?: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedAt: Date;
  }>;
  
  // Business Profile
  annualTurnover?: number;
  employeeCount?: number;
  website?: string;
  businessDescription?: string;
  
  // References
  references?: Array<{
    name: string;
    contact: string;
    email: string;
    relation: string;
  }>;
  
  // System Fields
  isApproved?: boolean;
  approverId?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  rejectionRemarks?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  lastUpdatedAt?: Date;
  
  // Captcha and Terms
  terms1: boolean;
  terms2: boolean;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  username: string;
  role: UserRole;
  isApproved?: boolean;
  approvalRemark?: string;
  createdAt: Date;
  walletAddress?: string;
  profileData?: RegisterData;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface Notification {
  id: string;
  recipientId: string;          // user id for whom notification is intended
  message: string;              // notification content
  relatedUserId?: string;       // e.g. user id for approval actions
  isRead: boolean;              // mark if read
  createdAt: Date;
}
