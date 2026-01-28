"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Info } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  createUserSchema,
  type CreateUserInput,
} from "@/lib/validations/user-management";
import { DEPARTMENT_OPTIONS, SYSTEM_PERMISSIONS } from "@/lib/constants";
import { mockSystemRoles, mockCustomRoles } from "@/server/services/mock-data";
import type { CustomRole, ManagedUser } from "@/types";

interface CreateUserDialogProps {
  onUserCreated: (user: ManagedUser) => void;
  customRoles?: CustomRole[];
}

export function CreateUserDialog({
  onUserCreated,
  customRoles = mockCustomRoles,
}: CreateUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allRoles = useMemo(
    () => [...mockSystemRoles, ...customRoles],
    [customRoles]
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      department: "",
      roleId: "",
    },
  });

  const selectedRoleId = watch("roleId");
  const selectedRole = allRoles.find((r) => r.id === selectedRoleId);

  const onSubmit = async (data: CreateUserInput) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const role = allRoles.find((r) => r.id === data.roleId);
    const newUser: ManagedUser = {
      id: `user_${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      department: data.department,
      roleId: data.roleId,
      roleName: role?.name || "Unknown",
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };

    onUserCreated(newUser);
    toast.success("User created successfully", {
      description: `${data.name} has been added with the ${role?.name} role.`,
    });

    setIsSubmitting(false);
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account and assign a role.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="e.g., John Smith"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="e.g., john.smith@niso.gov.ng"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              placeholder="e.g., +234 801 234 5678"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              onValueChange={(value) => setValue("department", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENT_OPTIONS.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.department && (
              <p className="text-sm text-destructive">
                {errors.department.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="roleId">Role</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Select a role to define user permissions</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select
              onValueChange={(value) => setValue("roleId", value, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  System Roles
                </div>
                {mockSystemRoles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
                {customRoles.length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">
                      Custom Roles
                    </div>
                    {customRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
            {errors.roleId && (
              <p className="text-sm text-destructive">{errors.roleId.message}</p>
            )}
          </div>

          {/* Role Preview */}
          {selectedRole && (
            <div className="rounded-md border bg-muted/50 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  {selectedRole.name}
                  {selectedRole.isSystemRole && (
                    <Badge variant="secondary" className="ml-2">
                      System
                    </Badge>
                  )}
                </p>
                <span className="text-xs text-muted-foreground">
                  {selectedRole.permissions.length} permissions
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedRole.description}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedRole.permissions.slice(0, 5).map((permCode) => {
                  const perm = SYSTEM_PERMISSIONS[permCode as keyof typeof SYSTEM_PERMISSIONS];
                  return (
                    <Badge key={permCode} variant="outline" className="text-xs">
                      {perm?.name || permCode}
                    </Badge>
                  );
                })}
                {selectedRole.permissions.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{selectedRole.permissions.length - 5} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
