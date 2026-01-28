"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronRight, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  SYSTEM_PERMISSIONS,
  PERMISSION_CATEGORIES,
} from "@/lib/constants";
import type { PermissionCategory } from "@/types";

interface PermissionSelectorProps {
  selectedPermissions: string[];
  onPermissionsChange: (permissions: string[]) => void;
  disabled?: boolean;
}

export function PermissionSelector({
  selectedPermissions,
  onPermissionsChange,
  disabled = false,
}: PermissionSelectorProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(Object.keys(PERMISSION_CATEGORIES))
  );

  // Group permissions by category
  const permissionsByCategory = useMemo(() => {
    const grouped: Record<PermissionCategory, typeof SYSTEM_PERMISSIONS[keyof typeof SYSTEM_PERMISSIONS][]> = {
      user_management: [],
      entity_management: [],
      collections: [],
      disbursements: [],
      audit: [],
      reports: [],
      system: [],
    };

    Object.values(SYSTEM_PERMISSIONS).forEach((permission) => {
      grouped[permission.category as PermissionCategory].push(permission);
    });

    return grouped;
  }, []);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const togglePermission = (permissionCode: string) => {
    if (disabled) return;

    const newPermissions = selectedPermissions.includes(permissionCode)
      ? selectedPermissions.filter((p) => p !== permissionCode)
      : [...selectedPermissions, permissionCode];
    onPermissionsChange(newPermissions);
  };

  const toggleCategoryPermissions = (category: PermissionCategory) => {
    if (disabled) return;

    const categoryPermissions = permissionsByCategory[category].map((p) => p.code);
    const allSelected = categoryPermissions.every((code) =>
      selectedPermissions.includes(code)
    );

    if (allSelected) {
      // Remove all category permissions
      onPermissionsChange(
        selectedPermissions.filter((p) => !categoryPermissions.includes(p))
      );
    } else {
      // Add all category permissions
      const newPermissions = new Set([...selectedPermissions, ...categoryPermissions]);
      onPermissionsChange(Array.from(newPermissions));
    }
  };

  const getCategorySelectionState = (category: PermissionCategory) => {
    const categoryPermissions = permissionsByCategory[category].map((p) => p.code);
    const selectedCount = categoryPermissions.filter((code) =>
      selectedPermissions.includes(code)
    ).length;

    if (selectedCount === 0) return "none";
    if (selectedCount === categoryPermissions.length) return "all";
    return "partial";
  };

  const selectAll = () => {
    if (disabled) return;
    onPermissionsChange(Object.keys(SYSTEM_PERMISSIONS));
  };

  const clearAll = () => {
    if (disabled) return;
    onPermissionsChange([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {selectedPermissions.length} of {Object.keys(SYSTEM_PERMISSIONS).length} permissions selected
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={selectAll}
            disabled={disabled}
          >
            Select All
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearAll}
            disabled={disabled}
          >
            Clear All
          </Button>
        </div>
      </div>

      <div className="rounded-md border divide-y">
        {(Object.keys(PERMISSION_CATEGORIES) as PermissionCategory[]).map((category) => {
          const categoryConfig = PERMISSION_CATEGORIES[category];
          const isExpanded = expandedCategories.has(category);
          const selectionState = getCategorySelectionState(category);
          const categoryPermissions = permissionsByCategory[category];
          const selectedCount = categoryPermissions.filter((p) =>
            selectedPermissions.includes(p.code)
          ).length;

          return (
            <div key={category}>
              <div
                className={cn(
                  "flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50",
                  disabled && "cursor-not-allowed opacity-50"
                )}
                onClick={() => toggleCategory(category)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}

                <Checkbox
                  checked={selectionState === "all"}
                  ref={(el) => {
                    if (el) {
                      (el as HTMLButtonElement & { indeterminate?: boolean }).indeterminate = selectionState === "partial";
                    }
                  }}
                  onCheckedChange={() => toggleCategoryPermissions(category)}
                  onClick={(e) => e.stopPropagation()}
                  disabled={disabled}
                />

                <div className="flex-1">
                  <div className="font-medium">{categoryConfig.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {categoryConfig.description}
                  </div>
                </div>

                <Badge variant="secondary">
                  {selectedCount}/{categoryPermissions.length}
                </Badge>
              </div>

              {isExpanded && (
                <div className="bg-muted/30 p-3 pl-12 space-y-2">
                  {categoryPermissions.map((permission) => (
                    <label
                      key={permission.code}
                      className={cn(
                        "flex items-start gap-3 p-2 rounded-md hover:bg-background cursor-pointer",
                        disabled && "cursor-not-allowed opacity-50"
                      )}
                    >
                      <Checkbox
                        checked={selectedPermissions.includes(permission.code)}
                        onCheckedChange={() => togglePermission(permission.code)}
                        disabled={disabled}
                        className="mt-0.5"
                      />
                      <div>
                        <div className="text-sm font-medium">{permission.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {permission.description}
                        </div>
                        <code className="text-xs text-muted-foreground bg-muted px-1 rounded">
                          {permission.code}
                        </code>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
