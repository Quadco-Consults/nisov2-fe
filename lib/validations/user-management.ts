import { z } from "zod";

// Create Role Schema
export const createRoleSchema = z.object({
  name: z
    .string()
    .min(3, "Role name must be at least 3 characters")
    .max(50, "Role name must be less than 50 characters"),
  code: z
    .string()
    .min(2, "Role code must be at least 2 characters")
    .max(30, "Role code must be less than 30 characters")
    .regex(
      /^[a-z][a-z0-9_]*$/,
      "Role code must start with a letter and contain only lowercase letters, numbers, and underscores"
    ),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description must be less than 200 characters"),
  permissions: z
    .array(z.string())
    .min(1, "At least one permission must be selected"),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;

// Edit Role Schema
export const editRoleSchema = createRoleSchema.extend({
  id: z.string(),
});

export type EditRoleInput = z.infer<typeof editRoleSchema>;

// Create User Schema
export const createUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .max(20, "Phone number must be less than 20 characters")
    .regex(
      /^\+?[0-9\s\-]+$/,
      "Phone number can only contain numbers, spaces, hyphens, and optional + prefix"
    )
    .optional()
    .or(z.literal("")),
  department: z.string().min(1, "Please select a department"),
  roleId: z.string().min(1, "Please select a role"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

// Edit User Schema
export const editUserSchema = createUserSchema.extend({
  id: z.string(),
  status: z.enum(["active", "inactive", "suspended"]),
});

export type EditUserInput = z.infer<typeof editUserSchema>;
