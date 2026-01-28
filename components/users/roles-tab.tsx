"use client";

import { useState } from "react";
import {
  Shield,
  Lock,
  Pencil,
  Trash2,
  Search,
  ChevronDown,
  ChevronUp,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CreateRoleDialog } from "./create-role-dialog";
import { EditRoleDialog } from "./edit-role-dialog";
import { mockSystemRoles } from "@/server/services/mock-data";
import { SYSTEM_PERMISSIONS, PERMISSION_CATEGORIES } from "@/lib/constants";
import { formatDate } from "@/lib/utils/formatters";
import type { CustomRole, PermissionCategory } from "@/types";

interface RolesTabProps {
  customRoles: CustomRole[];
  onRoleCreated: (role: CustomRole) => void;
  onRoleUpdated: (role: CustomRole) => void;
  onRoleDeleted: (roleId: string) => void;
}

export function RolesTab({
  customRoles,
  onRoleCreated,
  onRoleUpdated,
  onRoleDeleted,
}: RolesTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSystemRole, setExpandedSystemRole] = useState<string | null>(null);

  const filteredCustomRoles = customRoles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteRole = (roleId: string) => {
    const role = customRoles.find((r) => r.id === roleId);
    onRoleDeleted(roleId);
    toast.success("Role deleted", {
      description: `${role?.name} has been removed.`,
    });
  };

  const toggleSystemRoleExpand = (roleId: string) => {
    setExpandedSystemRole((prev) => (prev === roleId ? null : roleId));
  };

  // Group permissions by category for display
  const groupPermissionsByCategory = (permissions: string[]) => {
    const grouped: Record<string, string[]> = {};
    permissions.forEach((permCode) => {
      const perm = SYSTEM_PERMISSIONS[permCode as keyof typeof SYSTEM_PERMISSIONS];
      if (perm) {
        const category = perm.category;
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push(permCode);
      }
    });
    return grouped;
  };

  return (
    <div className="space-y-6">
      {/* System Roles */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>System Roles</CardTitle>
              <CardDescription>
                Pre-defined roles with fixed permissions. These cannot be modified.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {mockSystemRoles.map((role) => {
              const isExpanded = expandedSystemRole === role.id;
              const groupedPerms = groupPermissionsByCategory(role.permissions);

              return (
                <Card
                  key={role.id}
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => toggleSystemRoleExpand(role.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{role.name}</CardTitle>
                      <Badge variant="secondary">
                        <Lock className="mr-1 h-3 w-3" />
                        System
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      {role.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {role.permissions.length} permissions
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>

                    {isExpanded && (
                      <div className="mt-4 space-y-3 border-t pt-4">
                        {Object.entries(groupedPerms).map(([category, perms]) => {
                          const categoryConfig = PERMISSION_CATEGORIES[category as PermissionCategory];
                          return (
                            <div key={category}>
                              <p className="text-xs font-medium text-muted-foreground mb-1">
                                {categoryConfig?.name || category}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {perms.map((permCode) => {
                                  const perm = SYSTEM_PERMISSIONS[permCode as keyof typeof SYSTEM_PERMISSIONS];
                                  return (
                                    <Badge
                                      key={permCode}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {perm?.name || permCode}
                                    </Badge>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Custom Roles */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle>Custom Roles</CardTitle>
                <CardDescription>
                  User-defined roles that can be modified and assigned to users.
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search roles..."
                  className="pl-8 w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <CreateRoleDialog onRoleCreated={onRoleCreated} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCustomRoles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery
                ? "No roles found matching your search."
                : "No custom roles created yet. Click 'Create Role' to add one."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomRoles.map((role) => {
                  const groupedPerms = groupPermissionsByCategory(role.permissions);

                  return (
                    <TableRow key={role.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{role.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {role.description.substring(0, 50)}
                            {role.description.length > 50 ? "..." : ""}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                          {role.code}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-auto p-1">
                              <Badge variant="secondary" className="cursor-pointer">
                                {role.permissions.length} permissions
                                <Eye className="ml-1 h-3 w-3" />
                              </Badge>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>{role.name} Permissions</DialogTitle>
                              <DialogDescription>
                                {role.description}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                              {Object.entries(groupedPerms).map(([category, perms]) => {
                                const categoryConfig = PERMISSION_CATEGORIES[category as PermissionCategory];
                                return (
                                  <div key={category} className="space-y-2">
                                    <h4 className="text-sm font-medium">
                                      {categoryConfig?.name || category}
                                    </h4>
                                    <div className="flex flex-wrap gap-1">
                                      {perms.map((permCode) => {
                                        const perm = SYSTEM_PERMISSIONS[permCode as keyof typeof SYSTEM_PERMISSIONS];
                                        return (
                                          <Badge
                                            key={permCode}
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            {perm?.name || permCode}
                                          </Badge>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {role.createdBy || "System"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(role.updatedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <EditRoleDialog
                            role={role}
                            onRoleUpdated={onRoleUpdated}
                            trigger={
                              <Button variant="ghost" size="icon">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Role</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete &quot;{role.name}
                                  &quot;? This action cannot be undone. Users assigned
                                  to this role will need to be reassigned.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteRole(role.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
