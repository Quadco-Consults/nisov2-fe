"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  createChargeSchema,
  CreateChargeInput,
} from "@/lib/validations/charge-management";
import { ENTITY_CATEGORIES } from "@/lib/constants";
import { ChargeType, ChargeEntityType } from "@/types";

interface CreateChargeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateCharge: (charge: ChargeType) => void;
}

// Entity type options for dropdown
const entityTypeOptions = [
  { value: "ALL", label: "All Entity Types" },
  ...Object.values(ENTITY_CATEGORIES).map((cat) => ({
    value: cat.code,
    label: cat.name,
  })),
];

export function CreateChargeDialog({
  open,
  onOpenChange,
  onCreateCharge,
}: CreateChargeDialogProps) {
  const [hasSubCharges, setHasSubCharges] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateChargeInput>({
    resolver: zodResolver(createChargeSchema),
    defaultValues: {
      name: "",
      description: "",
      hasSubCharges: false,
      code: "",
      entityType: "ALL",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subCharges" as never,
  });

  const handleHasSubChargesChange = (checked: boolean) => {
    setHasSubCharges(checked);
    setValue("hasSubCharges", checked);
    if (checked) {
      // Clear simple charge fields when switching to sub-charges
      setValue("code", undefined as unknown as string);
      setValue("entityType", undefined as unknown as ChargeEntityType);
      // Add initial sub-charge if empty
      if (fields.length === 0) {
        append({ code: "", name: "", description: "", entityType: "ALL" });
      }
    } else {
      // Set default values for simple charge
      setValue("code", "");
      setValue("entityType", "ALL");
    }
  };

  const onSubmit = (data: CreateChargeInput) => {
    const newCharge: ChargeType = {
      id: `charge-${Date.now()}`,
      name: data.name,
      description: data.description,
      hasSubCharges: data.hasSubCharges,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (data.hasSubCharges) {
      newCharge.subCharges = data.subCharges.map((sub, index) => ({
        id: `subcharge-${Date.now()}-${index}`,
        code: sub.code,
        name: sub.name,
        description: sub.description,
        entityType: sub.entityType as ChargeEntityType,
      }));
    } else {
      newCharge.code = data.code;
      newCharge.entityType = data.entityType as ChargeEntityType;
    }

    onCreateCharge(newCharge);
    toast.success("Charge type created successfully");
    handleClose();
  };

  const handleClose = () => {
    reset();
    setHasSubCharges(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Charge Type</DialogTitle>
          <DialogDescription>
            Define a new charge type with unique identifier and entity type assignment
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Charge Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Transmission Service Charge"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of this charge type"
                rows={2}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Sub-charges Toggle */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasSubCharges"
                checked={hasSubCharges}
                onCheckedChange={handleHasSubChargesChange}
              />
              <Label htmlFor="hasSubCharges">
                This charge has sub-charges
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              {hasSubCharges
                ? "Sub-charges will have their own unique codes and entity type assignments"
                : "This charge will have a single unique code and entity type assignment"}
            </p>
          </div>

          {/* Simple Charge Fields */}
          {!hasSubCharges && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <h4 className="font-medium">Charge Identifier</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="code">Unique Code *</Label>
                  <Input
                    id="code"
                    placeholder="e.g., MET.TSP"
                    {...register("code")}
                  />
                  {errors.code && (
                    <p className="text-sm text-destructive">{errors.code.message}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="entityType">Entity Type *</Label>
                  <Select
                    value={watch("entityType") || "ALL"}
                    onValueChange={(value) => setValue("entityType", value as ChargeEntityType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select entity type" />
                    </SelectTrigger>
                    <SelectContent>
                      {entityTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.entityType && (
                    <p className="text-sm text-destructive">
                      {errors.entityType.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Sub-charges Fields */}
          {hasSubCharges && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Sub-charges</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({ code: "", name: "", description: "", entityType: "ALL" })
                  }
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Sub-charge
                </Button>
              </div>

              {fields.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No sub-charges added. Click &quot;Add Sub-charge&quot; to begin.
                </p>
              )}

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 border rounded-lg space-y-4 bg-muted/30"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Sub-charge #{index + 1}
                    </span>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label>Code *</Label>
                      <Input
                        placeholder="e.g., MET.TSP"
                        {...register(`subCharges.${index}.code` as const)}
                      />
                      {errors.subCharges?.[index]?.code && (
                        <p className="text-sm text-destructive">
                          {errors.subCharges[index]?.code?.message}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label>Name *</Label>
                      <Input
                        placeholder="Sub-charge name"
                        {...register(`subCharges.${index}.name` as const)}
                      />
                      {errors.subCharges?.[index]?.name && (
                        <p className="text-sm text-destructive">
                          {errors.subCharges[index]?.name?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label>Description</Label>
                      <Input
                        placeholder="Brief description"
                        {...register(`subCharges.${index}.description` as const)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>Entity Type *</Label>
                      <Select
                        value={watch(`subCharges.${index}.entityType`) || "ALL"}
                        onValueChange={(value) =>
                          setValue(`subCharges.${index}.entityType`, value as ChargeEntityType)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select entity type" />
                        </SelectTrigger>
                        <SelectContent>
                          {entityTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}

              {errors.subCharges && typeof errors.subCharges === "object" && "message" in errors.subCharges && (
                <p className="text-sm text-destructive">
                  {errors.subCharges.message as string}
                </p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Charge"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
