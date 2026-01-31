import { z } from "zod";

// Entity types that can be assigned to charges
const entityTypes = ["DISCO", "GENCO", "SERVICE_PROVIDER", "SERC", "BILATERAL", "ALL"] as const;

// Charge beneficiary types
const beneficiaryTypes = ["SERVICE_PROVIDER", "GENCO"] as const;

// Charge categories
const chargeCategories = ["DISCO", "BILATERAL"] as const;

// Sub-charge schema
export const subChargeSchema = z.object({
  id: z.string().optional(),
  code: z
    .string()
    .min(1, "Code is required")
    .max(50, "Code must be less than 50 characters"),
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional(),
  // entityType can be "ALL" for all entity types, or a specific entity type
  entityType: z.enum(entityTypes, {
    required_error: "Please select an entity type",
  }),
});

export type SubChargeInput = z.infer<typeof subChargeSchema>;

// Create Charge Schema (for charges without sub-charges)
export const createSimpleChargeSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  hasSubCharges: z.literal(false),
  code: z
    .string()
    .min(1, "Code is required")
    .max(50, "Code must be less than 50 characters"),
  // entityType can be "ALL" for all entity types, or a specific entity type
  entityType: z.enum(entityTypes, {
    required_error: "Please select an entity type",
  }),
  // Charge category: DISCO or BILATERAL (which entity type pays)
  chargeCategory: z.enum(chargeCategories).optional(),
  // Beneficiary type: SERVICE_PROVIDER or GENCO (only for DISCO charges)
  beneficiaryType: z.enum(beneficiaryTypes).optional(),
  // Linked GENCOs (for DISCO charges with GENCO beneficiary)
  linkedGencos: z.array(z.string()).optional(),
  // Linked service providers
  linkedServiceProviders: z.array(z.string()).optional(),
});

// Create Charge Schema (for charges with sub-charges)
export const createChargeWithSubChargesSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  hasSubCharges: z.literal(true),
  subCharges: z
    .array(subChargeSchema)
    .min(1, "At least one sub-charge is required"),
});

// Combined create charge schema using discriminated union
export const createChargeSchema = z.discriminatedUnion("hasSubCharges", [
  createSimpleChargeSchema,
  createChargeWithSubChargesSchema,
]);

export type CreateChargeInput = z.infer<typeof createChargeSchema>;

// Edit charge schema extends create schema with id and status
export const editSimpleChargeSchema = createSimpleChargeSchema.extend({
  id: z.string(),
  status: z.enum(["active", "inactive"]),
  chargeCategory: z.enum(chargeCategories).optional(),
  beneficiaryType: z.enum(beneficiaryTypes).optional(),
  linkedGencos: z.array(z.string()).optional(),
  linkedServiceProviders: z.array(z.string()).optional(),
});

export const editChargeWithSubChargesSchema = createChargeWithSubChargesSchema.extend({
  id: z.string(),
  status: z.enum(["active", "inactive"]),
  chargeCategory: z.enum(chargeCategories).optional(),
});

export const editChargeSchema = z.discriminatedUnion("hasSubCharges", [
  editSimpleChargeSchema,
  editChargeWithSubChargesSchema,
]);

export type EditChargeInput = z.infer<typeof editChargeSchema>;
