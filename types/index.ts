// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  entityType?: string;
  entityId?: string;
  entityName?: string;
  department?: string;
  phone?: string;
  avatar?: string;
  status: "active" | "inactive" | "suspended";
  permissions?: string[];
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Market Participant
export interface MarketParticipant {
  id: string;
  code: string;
  name: string;
  type: "DISCO" | "GENCO" | "TCN" | "NBET" | "IPP" | "TRADER" | "SERC";
  status: "active" | "inactive" | "suspended";
  email?: string;
  phone?: string;
  address?: string;
  bankDetails?: BankDetails;
  currentBalance: number;
  outstandingDebt: number;
  createdAt: string;
  updatedAt: string;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
  bankCode?: string;
}

// Collection Types
export interface Collection {
  id: string;
  referenceNumber: string;
  // Entity info
  entityId: string;
  entityAlias: string;
  entityName: string;
  entityType: "DISCO" | "GENCO" | "BILATERAL";
  // Payment identification
  paymentId: string; // Format: ChargeCode-ServiceProviderAlias (e.g., "MET.TSP-TCN-TSP")
  chargeCode: string;
  serviceProviderId: string;
  serviceProviderAlias: string;
  // Settlement period
  period: string;
  // Amounts
  amount: number;
  status: "pending" | "verified" | "posted" | "reconciled" | "disputed";
  auditLocked: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  postedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionSummary {
  totalCollections: number;
  broughtForward: number;
  appliedCredits: number;
  grandTotal: number;
  byChargeCode: {
    code: string;
    amount: number;
    count: number;
  }[];
}

// Disbursement Types
export interface Disbursement {
  id: string;
  disbursementNumber: string;
  period: string;
  tier: 1 | 2 | 3 | 4;
  tierName: string;
  serviceProviderId: string;
  serviceProviderName: string;
  serviceProviderType: string;
  grossAmount: number;
  sercDeduction: number; // 5%
  netAmount: number; // 95%
  status: "draft" | "pending_approval" | "approved" | "processing" | "completed" | "failed";
  paymentMethod?: string;
  paymentReference?: string;
  approvedBy?: string;
  approvedAt?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DisbursementWaterfall {
  totalPool: number;
  allocations: WaterfallAllocation[];
  isUnderfunded: boolean;
  fundingRatio: number;
}

export interface WaterfallAllocation {
  tier: number;
  tierName: string;
  required: number;
  allocated: number;
  shortfall: number;
  providers: ProviderAllocation[];
}

export interface ProviderAllocation {
  id: string;
  name: string;
  type: string;
  required: number;
  allocated: number;
  proRataFactor?: number;
}

// SERC Split
export interface SercSplit {
  id: string;
  disbursementId: string;
  serviceProviderAmount: number; // 95%
  sercAmount: number; // 5%
  sercName: string;
  state: string;
  status: "pending" | "paid";
  createdAt: string;
}

// Debt Aging Types
export interface DebtRecord {
  id: string;
  participantId: string;
  participantName: string;
  participantType: string;
  originalAmount: number;
  currentBalance: number;
  dueDate: string;
  agingDays: number;
  agingBucket: "0-30" | "31-60" | "61-90" | "90+";
  riskLevel: "low" | "medium" | "high" | "critical";
  status: "current" | "overdue" | "critical" | "legal" | "resolved";
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  recoveryAction?: string;
  assignedTo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgingBucketSummary {
  bucket: "0-30" | "31-60" | "61-90" | "90+";
  label: string;
  count: number;
  amount: number;
  action: string;
  color: string;
}

// Penalty & Deduction Types
export interface Penalty {
  id: string;
  referenceNumber: string;
  participantId: string;
  participantName: string;
  type: "UGD" | "LPP" | "MRV";
  typeName: string;
  reason: string;
  calculationType: "fixed" | "percentage";
  baseAmount?: number;
  percentage?: number;
  amount: number;
  period: string;
  status: "pending" | "applied" | "waived" | "disputed";
  appliedBy?: string;
  appliedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Adjustment {
  id: string;
  referenceNumber: string;
  participantId: string;
  participantName: string;
  type: "fixed" | "percentage" | "tax" | "credit";
  description: string;
  amount: number;
  isDebit: boolean;
  period: string;
  status: "pending" | "applied";
  createdAt: string;
}

// Deduction Type (for configuring deduction types)
export interface DeductionType {
  id: string;
  code: string;
  name: string;
  description?: string;
  calculationType: "fixed" | "percentage";
  defaultValue?: number; // Default amount or percentage
  linkedServiceProviders: string[]; // Service provider IDs this deduction applies to
  status: "active" | "inactive";
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Penalty Record (for market rule violations)
export interface PenaltyRecord {
  id: string;
  referenceNumber: string;
  entityId: string;
  entityName: string;
  entityType: "DISCO" | "GENCO" | "BILATERAL";
  penaltyType: "UGD" | "LPP" | "MRV" | "OTHER";
  penaltyTypeName: string;
  reason: string;
  violationDate: string;
  calculationType: "fixed" | "percentage";
  baseAmount?: number;
  rate?: number; // percentage rate if applicable
  amount: number;
  status: "pending" | "approved" | "applied" | "waived" | "disputed";
  approvedBy?: string;
  approvedAt?: string;
  appliedAt?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard Types
export interface DashboardStats {
  mtdCollections: number;
  mtdCollectionsChange: number;
  poolBalance: number;
  poolBalanceChange: number;
  phi: number; // Pool Health Index
  phiStatus: string;
  varianceAlerts: number;
  varianceAlertsChange: number;
}

export interface PoolHealth {
  totalOwed: number;
  totalReceived: number;
  phi: number;
  status: "healthy" | "good" | "moderate" | "poor" | "critical";
  trend: "up" | "down" | "stable";
}

export interface VarianceAlert {
  id: string;
  participantId: string;
  participantName: string;
  expected: number;
  actual: number;
  variance: number;
  flagged: boolean;
  period: string;
  createdAt: string;
}

// Settlement Types
export interface Settlement {
  id: string;
  settlementNumber: string;
  participantId: string;
  participantName: string;
  participantType: string;
  period: string;
  totalAmount: number;
  status: "draft" | "pending" | "verified" | "posted";
  verifiedAt?: string;
  postedAt?: string;
  createdAt: string;
}

// Service Provider
export interface ServiceProvider {
  id: string;
  code: string;
  name: string;
  type: "TCN" | "MO" | "GENCO" | "GAS" | "OTHER";
  priority: number;
  status: "active" | "inactive";
  bankDetails: BankDetails;
  allocationPercentage?: number;
  currentBalance: number;
  totalDisbursed: number;
  createdAt: string;
}

// Report Types
export interface Report {
  id: string;
  reportNumber: string;
  type: string;
  title: string;
  period: string;
  status: "draft" | "generated" | "submitted";
  generatedBy?: string;
  generatedAt?: string;
  submittedAt?: string;
  fileUrl?: string;
  createdAt: string;
}

// Audit Log
export interface AuditLog {
  id: string;
  module: string;
  action: string;
  entityId: string;
  entityType: string;
  userId: string;
  userName: string;
  description: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress?: string;
  timestamp: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Chart Data Types
export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

// ===========================================
// Chapter 6: Entity Registry & Lifecycle Management
// ===========================================

// Entity Categories (Player Taxonomy)
export type EntityCategory = "DISCO" | "GENCO" | "SERVICE_PROVIDER" | "SERC" | "BILATERAL";

// Registered Entity (Master Data Directory)
export interface RegisteredEntity {
  id: string;
  alias: string; // Unique market alias (e.g., AEDC, EGBIN)
  name: string;
  category: EntityCategory;
  description?: string;

  // Contact Information
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;

  // Remita Integration Metadata
  bankDetails: BankDetails;
  remitaValidated: boolean;
  remitaValidationDate?: string;

  // Regulatory Linkage (for SERCs)
  linkedServiceProviderId?: string;
  linkedServiceProviderName?: string;
  state?: string; // For SERC entities

  // Priority Flags (for Service Providers)
  isPrioritySP: boolean;
  waterfallTier?: number;

  // Registration Workflow
  registrationStatus: "draft" | "pending_validation" | "validated" | "active" | "suspended" | "deactivated";
  registeredBy?: string;
  registeredAt?: string;
  validatedBy?: string;
  validatedAt?: string;

  // Financial Tracking
  totalCollections: number;
  totalDisbursements: number;
  currentBalance: number;
  outstandingDebt: number;

  createdAt: string;
  updatedAt: string;
}

// Entity Registration Request
export interface EntityRegistrationRequest {
  alias: string;
  name: string;
  category: EntityCategory;
  email?: string;
  phone?: string;
  address?: string;
  bankDetails: BankDetails;
  linkedServiceProviderId?: string;
  isPrioritySP?: boolean;
  state?: string;
}

// Entity Category Config
export interface EntityCategoryConfig {
  code: EntityCategory;
  name: string;
  description: string;
  canBePayer: boolean;
  canBePayee: boolean;
  requiresSERCLink: boolean;
  canBePrioritySP: boolean;
}

// ===========================================
// Chapter 7: Identity & Access Management (IAM)
// ===========================================

// IAM Role Definition
export type IAMRole = "treasury_admin" | "settlement_officer" | "compliance_auditor";

export interface RoleDefinition {
  code: IAMRole;
  name: string;
  description: string;
  operationalScope: string;
  permissions: string[];
}

// Enhanced User with IAM
export interface IAMUser extends User {
  iamRole: IAMRole;
  canMake: boolean; // Can create transactions
  canCheck: boolean; // Can approve transactions
  sessionTimeout: number; // in minutes
  lastActivity?: string;
  ipRestrictions?: string[];
  twoFactorEnabled: boolean;
}

// Maker-Checker Workflow
export type WorkflowStatus = "draft" | "pending_approval" | "approved" | "rejected" | "executed";

export interface ApprovalWorkflow {
  id: string;
  workflowType: "disbursement" | "entity_registration" | "penalty" | "adjustment";
  referenceId: string;
  referenceNumber: string;

  // Maker Info
  makerId: string;
  makerName: string;
  makerRole: string;
  madeAt: string;

  // Checker Info (when applicable)
  checkerId?: string;
  checkerName?: string;
  checkerRole?: string;
  checkedAt?: string;
  checkerComments?: string;

  // Approval Info
  approverId?: string;
  approverName?: string;
  approverRole?: string;
  approvedAt?: string;
  approvalToken?: string; // Cryptographic approval token

  status: WorkflowStatus;
  amount?: number;
  description: string;

  createdAt: string;
  updatedAt: string;
}

// Disbursement Batch (Maker-Checker)
export interface DisbursementBatch {
  id: string;
  batchNumber: string;
  period: string;
  totalAmount: number;
  disbursementCount: number;
  disbursementIds: string[];

  // Workflow Status
  status: WorkflowStatus;

  // Maker
  createdBy: string;
  createdByName: string;
  createdAt: string;

  // Checker/Approver
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  approvalToken?: string;

  // Execution
  executedAt?: string;
  remitaReference?: string;

  rejectionReason?: string;
}

// Immutable Audit Log (Enhanced)
export interface ImmutableAuditLog {
  id: string;
  sequenceNumber: number; // For ordering

  // Action Details
  module: string;
  action: "login" | "logout" | "create" | "update" | "delete" | "approve" | "reject" | "execute" | "view" | "export";
  entityType: string;
  entityId?: string;

  // User Details
  userId: string;
  userName: string;
  userRole: string;
  userIamRole?: IAMRole;

  // Description
  description: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;

  // Security Context
  ipAddress: string;
  userAgent?: string;
  sessionId: string;

  // Immutability
  timestamp: string;
  checksum: string; // Hash of log entry for tamper detection
}

// Security Session
export interface SecuritySession {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  loginTime: string;
  lastActivity: string;
  ipAddress: string;
  userAgent?: string;
  isActive: boolean;
  expiresAt: string;
}

// ===========================================
// User Management: Permissions & Roles
// ===========================================

// Permission Categories
export type PermissionCategory =
  | "user_management"
  | "entity_management"
  | "collections"
  | "disbursements"
  | "audit"
  | "reports"
  | "system";

// System Permission
export interface Permission {
  id: string;
  code: string;
  name: string;
  description: string;
  category: PermissionCategory;
}

// Custom Role (for user-created roles)
export interface CustomRole {
  id: string;
  code: string;
  name: string;
  description: string;
  permissions: string[];
  isSystemRole: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Managed User (for user management module)
export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  roleId: string;
  roleName: string;
  status: "active" | "inactive" | "suspended";
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// Charge Management Types
// ===========================================

// Entity types that charges can be assigned to
export type ChargeEntityType = "DISCO" | "GENCO" | "SERVICE_PROVIDER" | "SERC" | "BILATERAL" | "ALL";

// Sub-charge (for charges with multiple components)
export interface SubCharge {
  id: string;
  code: string;
  name: string;
  description?: string;
  // "ALL" for all entity types, or a specific entity type
  entityType: ChargeEntityType;
}

// Main Charge Type
export interface ChargeType {
  id: string;
  name: string;
  description?: string;
  hasSubCharges: boolean;
  // Only populated if hasSubCharges is false
  code?: string;
  // "ALL" for all entity types, or a specific entity type
  entityType?: ChargeEntityType;
  // Service providers that receive payments for this charge type
  linkedServiceProviders?: string[];
  // Only populated if hasSubCharges is true
  subCharges?: SubCharge[];
  status: "active" | "inactive";
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Settlement Registration Types
export interface SettlementPaymentLine {
  chargeCode: string;
  chargeName: string;
  serviceProviderId: string;
  serviceProviderAlias: string;
  serviceProviderName: string;
  paymentIdentifier: string; // e.g., "MET.TSP-TCN"
  amount: number;
}

export interface SettlementRegistration {
  id: string;
  referenceNumber: string;
  entityId: string;
  entityName: string;
  entityAlias: string;
  entityType: "DISCO" | "GENCO" | "BILATERAL";
  settlementPeriod: string; // e.g., "2025-01" for January 2025
  paymentLines: SettlementPaymentLine[];
  totalAmount: number;
  status: "draft" | "pending" | "verified" | "posted";
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}
