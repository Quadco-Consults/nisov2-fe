export const APP_NAME = "NISO Treasury Management";

// Charge Codes for Collections
export const CHARGE_CODES = {
  MET_TSP: {
    code: "MET.TSP",
    name: "Transmission Service Provider Charges",
    description: "TCN transmission charges",
  },
  MET_ISO: {
    code: "MET.ISO",
    name: "Independent System Operator Charges",
    description: "Market Operator fees",
  },
  DLR: {
    code: "DLR",
    name: "Distribution Loss Recovery",
    description: "Distribution losses recovery charges",
  },
  TLF: {
    code: "TLF",
    name: "Transmission Loss Factor",
    description: "Transmission losses charges",
  },
} as const;

// Waterfall Tiers for Disbursements
export const WATERFALL_TIERS = {
  TIER_1: {
    name: "Grid Stability",
    description: "TCN (TSP) + MO (ISO) fees",
    priority: 1,
  },
  TIER_2: {
    name: "Generation",
    description: "GenCo payments",
    priority: 2,
  },
  TIER_3: {
    name: "Gas Supply",
    description: "Gas supplier payments",
    priority: 3,
  },
  TIER_4: {
    name: "Other Obligations",
    description: "Other market obligations",
    priority: 4,
  },
} as const;

// Debt Aging Buckets
export const AGING_BUCKETS = {
  CURRENT: {
    key: "0-30",
    label: "Current (0-30 Days)",
    action: "Soft Reminder",
    color: "green",
  },
  ARREARS: {
    key: "31-60",
    label: "Arrears (31-60 Days)",
    action: "Market Rule Violation",
    color: "yellow",
  },
  CRITICAL: {
    key: "61-90",
    label: "Critical (61-90 Days)",
    action: "Late-payment penalties",
    color: "orange",
  },
  LEGAL: {
    key: "90+",
    label: "Legal (90+ Days)",
    action: "Handover to NISO Legal",
    color: "red",
  },
} as const;

// User Roles
export const USER_ROLES = {
  super_admin: { label: "Super Admin", level: 1 },
  admin: { label: "Administrator", level: 2 },
  finance_manager: { label: "Finance Manager", level: 3 },
  debt_collector: { label: "Debt Collector", level: 4 },
  treasury_officer: { label: "Treasury Officer", level: 5 },
  auditor: { label: "Auditor", level: 6 },
  viewer: { label: "Viewer", level: 7 },
} as const;

// ===========================================
// Chapter 6: Entity Registry
// ===========================================

// Entity Categories (Player Taxonomy)
export const ENTITY_CATEGORIES = {
  DISCO: {
    code: "DISCO",
    name: "Distribution Company",
    description: "Primary payors in the market. Tracks high-volume energy consumption.",
    canBePayer: true,
    canBePayee: false,
    requiresSERCLink: false,
    canBePrioritySP: false,
  },
  GENCO: {
    code: "GENCO",
    name: "Generation Company",
    description: "Can be both payees (energy supplied) and payors (uninstructed deviations/penalties).",
    canBePayer: true,
    canBePayee: true,
    requiresSERCLink: false,
    canBePrioritySP: false,
  },
  SERVICE_PROVIDER: {
    code: "SERVICE_PROVIDER",
    name: "Service Provider",
    description: "Core infrastructure entities (TCN/TSP, MO/ISO) receiving priority disbursements.",
    canBePayer: false,
    canBePayee: true,
    requiresSERCLink: false,
    canBePrioritySP: true,
  },
  SERC: {
    code: "SERC",
    name: "State Regulatory Commission",
    description: "Regulatory beneficiaries. Receives mandatory 5% split from linked Service Provider.",
    canBePayer: false,
    canBePayee: true,
    requiresSERCLink: true,
    canBePrioritySP: false,
  },
  BILATERAL: {
    code: "BILATERAL",
    name: "Bilateral Partner",
    description: "Special category with negotiated energy contracts outside the standard pool.",
    canBePayer: true,
    canBePayee: true,
    requiresSERCLink: false,
    canBePrioritySP: false,
  },
} as const;

// Entity Registration Statuses
export const ENTITY_REGISTRATION_STATUSES = {
  draft: { label: "Draft", color: "gray" },
  pending_validation: { label: "Pending Validation", color: "yellow" },
  validated: { label: "Validated", color: "blue" },
  active: { label: "Active", color: "green" },
  suspended: { label: "Suspended", color: "orange" },
  deactivated: { label: "Deactivated", color: "red" },
} as const;

// Legacy Entity Types (for backward compatibility)
export const ENTITY_TYPES = {
  DISCO: { code: "DISCO", name: "Distribution Company" },
  GENCO: { code: "GENCO", name: "Generation Company" },
  TCN: { code: "TCN", name: "Transmission Company of Nigeria" },
  NBET: { code: "NBET", name: "Nigerian Bulk Electricity Trading" },
  IPP: { code: "IPP", name: "Independent Power Producer" },
  TRADER: { code: "TRADER", name: "Licensed Trader" },
  SERC: { code: "SERC", name: "State Electricity Regulatory Commission" },
} as const;

// ===========================================
// Chapter 7: IAM & RBAC
// ===========================================

// IAM Role Definitions (Permissions Matrix)
export const IAM_ROLES = {
  treasury_admin: {
    code: "treasury_admin",
    name: "Treasury Administrator",
    description: "High-level Oversight",
    operationalScope: "Full system access with approval authority",
    permissions: [
      "user:provision",
      "user:manage",
      "waterfall:approve",
      "disbursement:approve",
      "system:configure",
      "penalty:override",
      "entity:approve",
      "audit:view",
      "report:all",
    ],
    canMake: true,
    canCheck: true,
  },
  settlement_officer: {
    code: "settlement_officer",
    name: "Settlement Officer",
    description: "Data Ingestion",
    operationalScope: "Transaction creation and data entry",
    permissions: [
      "invoice:create",
      "invoice:edit",
      "statement:upload",
      "collection:update",
      "entity:create",
      "entity:edit",
      "registry:maintain",
    ],
    canMake: true,
    canCheck: false,
  },
  compliance_auditor: {
    code: "compliance_auditor",
    name: "Compliance Auditor",
    description: "Independent Verification",
    operationalScope: "Read-only access for audit purposes",
    permissions: [
      "ledger:view",
      "audit:view",
      "audit:export",
      "security:view",
      "report:view",
    ],
    canMake: false,
    canCheck: false,
  },
} as const;

// Maker-Checker Workflow Statuses
export const WORKFLOW_STATUSES = {
  draft: { label: "Draft", color: "gray", description: "Created but not submitted" },
  pending_approval: { label: "Pending Approval", color: "yellow", description: "Awaiting checker review" },
  approved: { label: "Approved", color: "green", description: "Approved and ready for execution" },
  rejected: { label: "Rejected", color: "red", description: "Rejected by checker" },
  executed: { label: "Executed", color: "blue", description: "Successfully executed" },
} as const;

// Audit Action Types
export const AUDIT_ACTIONS = {
  login: { label: "Login", icon: "LogIn" },
  logout: { label: "Logout", icon: "LogOut" },
  create: { label: "Create", icon: "Plus" },
  update: { label: "Update", icon: "Edit" },
  delete: { label: "Delete", icon: "Trash" },
  approve: { label: "Approve", icon: "CheckCircle" },
  reject: { label: "Reject", icon: "XCircle" },
  execute: { label: "Execute", icon: "Play" },
  view: { label: "View", icon: "Eye" },
  export: { label: "Export", icon: "Download" },
} as const;

// Security Configuration
export const SECURITY_CONFIG = {
  sessionTimeout: 15, // minutes
  maxLoginAttempts: 5,
  passwordMinLength: 12,
  requireTwoFactor: false,
  ipGeofencingEnabled: false,
} as const;

// Penalty Types
export const PENALTY_TYPES = {
  UGD: {
    code: "UGD",
    name: "Uninstructed Generation Deviation",
    description: "GenCo dispatch instruction violations",
  },
  LPP: {
    code: "LPP",
    name: "Late Payment Penalty",
    description: "Penalty for overdue payments",
  },
  MRV: {
    code: "MRV",
    name: "Market Rule Violation",
    description: "Violation of market rules",
  },
} as const;

// Adjustment Types
export const ADJUSTMENT_TYPES = {
  FIXED: { code: "fixed", name: "Fixed Amount" },
  PERCENTAGE: { code: "percentage", name: "Percentage" },
  TAX: { code: "tax", name: "Tax/Levy" },
  CREDIT: { code: "credit", name: "Credit" },
} as const;

// SERC Split Configuration
export const SERC_SPLIT = {
  SERVICE_PROVIDER: 0.95, // 95%
  STATE_SERC: 0.05, // 5%
} as const;

// Variance Threshold
export const VARIANCE_THRESHOLD = 15; // ±15%

// Default Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Navigation Items
export const NAVIGATION = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
    roles: ["all"],
  },
  {
    title: "Entity Registry",
    href: "/entities",
    icon: "Building2",
    roles: ["finance_manager", "admin", "super_admin", "treasury_officer", "settlement_officer"],
  },
  {
    title: "Collections",
    href: "/collections",
    icon: "DollarSign",
    roles: ["finance_manager", "admin", "super_admin", "treasury_officer", "settlement_officer"],
  },
  {
    title: "Disbursements",
    href: "/disbursements",
    icon: "Send",
    roles: ["finance_manager", "admin", "super_admin", "treasury_officer"],
  },
  {
    title: "Debt Aging",
    href: "/debt-aging",
    icon: "AlertCircle",
    roles: ["debt_collector", "finance_manager", "admin", "super_admin"],
  },
  {
    title: "Deductions",
    href: "/deductions",
    icon: "Calculator",
    roles: ["finance_manager", "admin", "super_admin"],
  },
  {
    title: "Reports",
    href: "/reports",
    icon: "BarChart",
    roles: ["all"],
  },
  {
    title: "Audit Logs",
    href: "/audit-logs",
    icon: "FileText",
    roles: ["admin", "super_admin", "auditor", "compliance_auditor"],
  },
  {
    title: "User Management",
    href: "/users",
    icon: "Users",
    roles: ["admin", "super_admin", "treasury_admin"],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: "Settings",
    roles: ["admin", "super_admin"],
  },
] as const;

// Status Options
export const COLLECTION_STATUSES = [
  "pending",
  "verified",
  "posted",
  "reconciled",
  "disputed",
] as const;

export const DISBURSEMENT_STATUSES = [
  "draft",
  "pending_approval",
  "approved",
  "processing",
  "completed",
  "failed",
] as const;

export const DEBT_STATUSES = [
  "current",
  "overdue",
  "critical",
  "legal",
  "resolved",
] as const;
