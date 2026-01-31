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
    title: "Deductions/Penalty",
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
    title: "Entity Registry",
    href: "/entities",
    icon: "Building2",
    roles: ["finance_manager", "admin", "super_admin", "treasury_officer", "settlement_officer"],
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

// ===========================================
// User Management: Permissions System
// ===========================================

// Permission Categories Configuration
export const PERMISSION_CATEGORIES = {
  user_management: {
    code: "user_management",
    name: "User Management",
    description: "Create, edit, and manage system users and roles",
    icon: "Users",
  },
  entity_management: {
    code: "entity_management",
    name: "Entity Management",
    description: "Manage market participants and entity registry",
    icon: "Building2",
  },
  collections: {
    code: "collections",
    name: "Collections",
    description: "View and manage collection records",
    icon: "DollarSign",
  },
  disbursements: {
    code: "disbursements",
    name: "Disbursements",
    description: "View, create, and approve disbursements",
    icon: "Send",
  },
  audit: {
    code: "audit",
    name: "Audit & Compliance",
    description: "Access audit logs and compliance reports",
    icon: "FileText",
  },
  reports: {
    code: "reports",
    name: "Reports",
    description: "Generate and export system reports",
    icon: "BarChart",
  },
  system: {
    code: "system",
    name: "System Administration",
    description: "Configure system settings and security",
    icon: "Settings",
  },
} as const;

// System Permissions (granular)
export const SYSTEM_PERMISSIONS = {
  // User Management
  "user:view": {
    code: "user:view",
    name: "View Users",
    description: "View user list and details",
    category: "user_management",
  },
  "user:create": {
    code: "user:create",
    name: "Create Users",
    description: "Create new system users",
    category: "user_management",
  },
  "user:edit": {
    code: "user:edit",
    name: "Edit Users",
    description: "Edit user information and roles",
    category: "user_management",
  },
  "user:delete": {
    code: "user:delete",
    name: "Delete Users",
    description: "Deactivate or delete users",
    category: "user_management",
  },
  "role:view": {
    code: "role:view",
    name: "View Roles",
    description: "View roles and permissions",
    category: "user_management",
  },
  "role:create": {
    code: "role:create",
    name: "Create Roles",
    description: "Create custom roles with permissions",
    category: "user_management",
  },
  "role:edit": {
    code: "role:edit",
    name: "Edit Roles",
    description: "Modify custom role permissions",
    category: "user_management",
  },
  "role:delete": {
    code: "role:delete",
    name: "Delete Roles",
    description: "Delete custom roles",
    category: "user_management",
  },

  // Entity Management
  "entity:view": {
    code: "entity:view",
    name: "View Entities",
    description: "View entity registry and details",
    category: "entity_management",
  },
  "entity:create": {
    code: "entity:create",
    name: "Create Entities",
    description: "Register new market entities",
    category: "entity_management",
  },
  "entity:edit": {
    code: "entity:edit",
    name: "Edit Entities",
    description: "Modify entity information",
    category: "entity_management",
  },
  "entity:approve": {
    code: "entity:approve",
    name: "Approve Entities",
    description: "Validate and approve entity registrations",
    category: "entity_management",
  },
  "entity:deactivate": {
    code: "entity:deactivate",
    name: "Deactivate Entities",
    description: "Suspend or deactivate entities",
    category: "entity_management",
  },

  // Collections
  "collection:view": {
    code: "collection:view",
    name: "View Collections",
    description: "View collection records and summaries",
    category: "collections",
  },
  "collection:create": {
    code: "collection:create",
    name: "Create Collections",
    description: "Create new collection entries",
    category: "collections",
  },
  "collection:edit": {
    code: "collection:edit",
    name: "Edit Collections",
    description: "Modify collection records",
    category: "collections",
  },
  "collection:verify": {
    code: "collection:verify",
    name: "Verify Collections",
    description: "Verify and validate collection data",
    category: "collections",
  },
  "collection:post": {
    code: "collection:post",
    name: "Post Collections",
    description: "Post verified collections to ledger",
    category: "collections",
  },

  // Disbursements
  "disbursement:view": {
    code: "disbursement:view",
    name: "View Disbursements",
    description: "View disbursement records and waterfall",
    category: "disbursements",
  },
  "disbursement:create": {
    code: "disbursement:create",
    name: "Create Disbursements",
    description: "Create disbursement batches",
    category: "disbursements",
  },
  "disbursement:edit": {
    code: "disbursement:edit",
    name: "Edit Disbursements",
    description: "Modify disbursement records",
    category: "disbursements",
  },
  "disbursement:approve": {
    code: "disbursement:approve",
    name: "Approve Disbursements",
    description: "Approve disbursement for processing",
    category: "disbursements",
  },
  "disbursement:execute": {
    code: "disbursement:execute",
    name: "Execute Disbursements",
    description: "Execute approved disbursements",
    category: "disbursements",
  },

  // Audit
  "audit:view": {
    code: "audit:view",
    name: "View Audit Logs",
    description: "Access system audit trail",
    category: "audit",
  },
  "audit:export": {
    code: "audit:export",
    name: "Export Audit Logs",
    description: "Export audit data for compliance",
    category: "audit",
  },
  "security:view": {
    code: "security:view",
    name: "View Security Logs",
    description: "View security and access logs",
    category: "audit",
  },

  // Reports
  "report:view": {
    code: "report:view",
    name: "View Reports",
    description: "Access system reports",
    category: "reports",
  },
  "report:generate": {
    code: "report:generate",
    name: "Generate Reports",
    description: "Generate custom reports",
    category: "reports",
  },
  "report:export": {
    code: "report:export",
    name: "Export Reports",
    description: "Export reports to external formats",
    category: "reports",
  },

  // System
  "system:configure": {
    code: "system:configure",
    name: "System Configuration",
    description: "Modify system settings",
    category: "system",
  },
  "system:backup": {
    code: "system:backup",
    name: "System Backup",
    description: "Manage system backups",
    category: "system",
  },
  "waterfall:configure": {
    code: "waterfall:configure",
    name: "Configure Waterfall",
    description: "Modify disbursement waterfall tiers",
    category: "system",
  },
  "penalty:override": {
    code: "penalty:override",
    name: "Override Penalties",
    description: "Waive or override penalties",
    category: "system",
  },
} as const;

// User Status Options
export const USER_STATUS_OPTIONS = [
  { value: "active", label: "Active", color: "green" },
  { value: "inactive", label: "Inactive", color: "gray" },
  { value: "suspended", label: "Suspended", color: "red" },
] as const;

// Department Options
export const DEPARTMENT_OPTIONS = [
  "Treasury",
  "Settlements",
  "Finance",
  "Collections",
  "Internal Audit",
  "Legal",
  "IT",
  "Operations",
  "Compliance",
  "Administration",
] as const;

// ===========================================
// Charge Management
// ===========================================

// Entity types for charge assignment
export const CHARGE_ENTITY_TYPES = {
  DISCO: {
    value: "DISCO",
    label: "Distribution Companies (DISCOs)",
    description: "Applies only to Distribution Companies",
  },
  GENCO: {
    value: "GENCO",
    label: "Generation Companies (GENCOs)",
    description: "Applies only to Generation Companies",
  },
  ALL: {
    value: "ALL",
    label: "All Entities",
    description: "Applies to all market participants",
  },
} as const;

// Charge beneficiary types (who receives the payment)
export const CHARGE_BENEFICIARY_TYPES = {
  SERVICE_PROVIDER: {
    value: "SERVICE_PROVIDER",
    label: "Service Provider",
    description: "Payment goes to a Service Provider (TCN, MO, etc.)",
  },
  GENCO: {
    value: "GENCO",
    label: "Generation Company (GENCO)",
    description: "Payment goes to a linked Generation Company",
  },
} as const;

// Charge categories (which entity type pays)
export const CHARGE_CATEGORIES = {
  DISCO: {
    value: "DISCO",
    label: "DISCO Charges",
    description: "Charges paid by Distribution Companies",
  },
  BILATERAL: {
    value: "BILATERAL",
    label: "Bilateral Charges",
    description: "Charges paid by Bilateral Partners",
  },
} as const;

// ===========================================
// Nigerian States
// ===========================================

export const NIGERIAN_STATES = [
  { code: "AB", name: "Abia" },
  { code: "AD", name: "Adamawa" },
  { code: "AK", name: "Akwa Ibom" },
  { code: "AN", name: "Anambra" },
  { code: "BA", name: "Bauchi" },
  { code: "BY", name: "Bayelsa" },
  { code: "BE", name: "Benue" },
  { code: "BO", name: "Borno" },
  { code: "CR", name: "Cross River" },
  { code: "DE", name: "Delta" },
  { code: "EB", name: "Ebonyi" },
  { code: "ED", name: "Edo" },
  { code: "EK", name: "Ekiti" },
  { code: "EN", name: "Enugu" },
  { code: "FC", name: "FCT - Abuja" },
  { code: "GO", name: "Gombe" },
  { code: "IM", name: "Imo" },
  { code: "JI", name: "Jigawa" },
  { code: "KD", name: "Kaduna" },
  { code: "KN", name: "Kano" },
  { code: "KT", name: "Katsina" },
  { code: "KE", name: "Kebbi" },
  { code: "KO", name: "Kogi" },
  { code: "KW", name: "Kwara" },
  { code: "LA", name: "Lagos" },
  { code: "NA", name: "Nasarawa" },
  { code: "NI", name: "Niger" },
  { code: "OG", name: "Ogun" },
  { code: "ON", name: "Ondo" },
  { code: "OS", name: "Osun" },
  { code: "OY", name: "Oyo" },
  { code: "PL", name: "Plateau" },
  { code: "RI", name: "Rivers" },
  { code: "SO", name: "Sokoto" },
  { code: "TA", name: "Taraba" },
  { code: "YO", name: "Yobe" },
  { code: "ZA", name: "Zamfara" },
] as const;
