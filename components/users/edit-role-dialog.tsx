"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PermissionSelector } from "./permission-selector";
import {
  editRoleSchema,
  type EditRoleInput,
} from "@/lib/validations/user-management";
import type { CustomRole } from "@/types";

interface EditRoleDialogProps {
  role: CustomRole;
  onRoleUpdated: (role: CustomRole) => void;
  trigger?: React.ReactNode;
}

export function EditRoleDialog({
  role,
  onRoleUpdated,
  trigger,
}: EditRoleDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EditRoleInput>({
    resolver: zodResolver(editRoleSchema),
    defaultValues: {
      id: role.id,
      name: role.name,
      code: role.code,
      description: role.description,
      permissions: role.permissions,
    },
  });

  const selectedPermissions = watch("permissions");

  // Reset form when role changes or dialog opens
  useEffect(() => {
    if (open) {
      reset({
        id: role.id,
        name: role.name,
        code: role.code,
        description: role.description,
        permissions: role.permissions,
      });
    }
  }, [role, open, reset]);

  const onSubmit = async (data: EditRoleInput) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const updatedRole: CustomRole = {
      ...role,
      name: data.name,
      code: data.code,
      description: data.description,
      permissions: data.permissions,
      updatedAt: new Date().toISOString().split("T")[0],
    };

    onRoleUpdated(updatedRole);
    toast.success("Role updated successfully", {
      description: `${data.name} has been updated.`,
    });

    setIsSubmitting(false);
    setOpen(false);
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>
            Modify the role permissions and details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Role Name</Label>
              <Input
                id="edit-name"
                placeholder="e.g., Collections Manager"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-code">Role Code</Label>
              <Input
                id="edit-code"
                placeholder="e.g., collections_manager"
                {...register("code")}
                disabled // Code should not be changed after creation
              />
              {errors.code && (
                <p className="text-sm text-destructive">{errors.code.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              placeholder="Describe the responsibilities and scope of this role..."
              rows={3}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Permissions</Label>
            <PermissionSelector
              selectedPermissions={selectedPermissions}
              onPermissionsChange={(permissions) =>
                setValue("permissions", permissions, { shouldValidate: true })
              }
            />
            {errors.permissions && (
              <p className="text-sm text-destructive">
                {errors.permissions.message}
              </p>
            )}
          </div>

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
