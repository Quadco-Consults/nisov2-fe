"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, Info } from "lucide-react";
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
  editUserSchema,
  type EditUserInput,
} from "@/lib/validations/user-management";
import {
  DEPARTMENT_OPTIONS,
  USER_STATUS_OPTIONS,
  SYSTEM_PERMISSIONS,
} from "@/lib/constants";
import { mockSystemRoles, mockCustomRoles } from "@/server/services/mock-data";
import type { CustomRole, ManagedUser } from "@/types";

interface EditUserDialogProps {
  user: ManagedUser;
  onUserUpdated: (user: ManagedUser) => void;
  customRoles?: CustomRole[];
  trigger?: React.ReactNode;
}

export function EditUserDialog({
  user,
  onUserUpdated,
  customRoles = mockCustomRoles,
  trigger,
}: EditUserDialogProps) {
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
  } = useForm<EditUserInput>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      department: user.department,
      roleId: user.roleId,
      status: user.status,
    },
  });

  const selectedRoleId = watch("roleId");
  const selectedRole = allRoles.find((r) => r.id === selectedRoleId);
  const selectedStatus = watch("status");

  // Reset form when user changes or dialog opens
  useEffect(() => {
    if (open) {
      reset({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        department: user.department,
        roleId: user.roleId,
        status: user.status,
      });
    }
  }, [user, open, reset]);

  const onSubmit = async (data: EditUserInput) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const role = allRoles.find((r) => r.id === data.roleId);
    const updatedUser: ManagedUser = {
      ...user,
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      department: data.department,
      roleId: data.roleId,
      roleName: role?.name || user.roleName,
      status: data.status,
      updatedAt: new Date().toISOString().split("T")[0],
    };

    onUserUpdated(updatedUser);
    toast.success("User updated successfully", {
      description: `${data.name}'s profile has been updated.`,
    });

    setIsSubmitting(false);
    setOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and role assignment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Full Name</Label>
            <Input
              id="edit-name"
              placeholder="e.g., John Smith"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-email">Email Address</Label>
            <Input
              id="edit-email"
              type="email"
              placeholder="e.g., john.smith@niso.gov.ng"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-phone">Phone Number (Optional)</Label>
            <Input
              id="edit-phone"
              placeholder="e.g., +234 801 234 5678"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-department">Department</Label>
              <Select
                value={watch("department")}
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
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={selectedStatus}
                onValueChange={(value: "active" | "inactive" | "suspended") =>
                  setValue("status", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {USER_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            option.color === "green"
                              ? "bg-green-500"
                              : option.color === "gray"
                              ? "bg-gray-500"
                              : "bg-red-500"
                          }`}
                        />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-destructive">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="edit-roleId">Role</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Changing the role will update user permissions</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select
              value={selectedRoleId}
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
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
