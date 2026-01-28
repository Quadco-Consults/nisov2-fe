"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Phone,
  Pencil,
  Trash2,
  Filter,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CreateUserDialog } from "./create-user-dialog";
import { EditUserDialog } from "./edit-user-dialog";
import { mockSystemRoles } from "@/server/services/mock-data";
import { formatDate, getInitials, getStatusColor } from "@/lib/utils/formatters";
import type { ManagedUser, CustomRole } from "@/types";

interface UsersTabProps {
  users: ManagedUser[];
  customRoles: CustomRole[];
  onUserCreated: (user: ManagedUser) => void;
  onUserUpdated: (user: ManagedUser) => void;
  onUserDeleted: (userId: string) => void;
}

export function UsersTab({
  users,
  customRoles,
  onUserCreated,
  onUserUpdated,
  onUserDeleted,
}: UsersTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const allRoles = useMemo(
    () => [...mockSystemRoles, ...customRoles],
    [customRoles]
  );

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === "all" || user.roleId === roleFilter;
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const handleDeleteUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    onUserDeleted(userId);
    toast.success("User deleted", {
      description: `${user?.name} has been removed from the system.`,
    });
  };

  const activeCount = users.filter((u) => u.status === "active").length;
  const inactiveCount = users.filter((u) => u.status === "inactive").length;
  const suspendedCount = users.filter((u) => u.status === "suspended").length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>System Users</CardTitle>
              <CardDescription>
                Manage user accounts and role assignments
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8 w-full md:w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={roleFilter}
                    onValueChange={setRoleFilter}
                  >
                    <DropdownMenuRadioItem value="all">
                      All Roles
                    </DropdownMenuRadioItem>
                    {allRoles.map((role) => (
                      <DropdownMenuRadioItem key={role.id} value={role.id}>
                        {role.name}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>

                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <DropdownMenuRadioItem value="all">
                      All Status
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="active">
                      Active ({activeCount})
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="inactive">
                      Inactive ({inactiveCount})
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="suspended">
                      Suspended ({suspendedCount})
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <CreateUserDialog
                onUserCreated={onUserCreated}
                customRoles={customRoles}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Active Filters */}
          {(roleFilter !== "all" || statusFilter !== "all") && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-muted-foreground">Filters:</span>
              {roleFilter !== "all" && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setRoleFilter("all")}
                >
                  Role: {allRoles.find((r) => r.id === roleFilter)?.name}
                  <span className="ml-1">&times;</span>
                </Badge>
              )}
              {statusFilter !== "all" && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setStatusFilter("all")}
                >
                  Status: {statusFilter}
                  <span className="ml-1">&times;</span>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setRoleFilter("all");
                  setStatusFilter("all");
                }}
              >
                Clear all
              </Button>
            </div>
          )}

          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery || roleFilter !== "all" || statusFilter !== "all"
                ? "No users found matching your filters."
                : "No users created yet. Click 'Add User' to create one."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const statusColor = getStatusColor(user.status);
                  const role = allRoles.find((r) => r.id === user.roleId);

                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.phone && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            {user.phone}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {user.roleName}
                          {role?.isSystemRole && (
                            <span className="ml-1 text-muted-foreground">
                              (System)
                            </span>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.lastLogin ? formatDate(user.lastLogin) : "Never"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`${statusColor.bg} ${statusColor.text}`}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <EditUserDialog
                            user={user}
                            onUserUpdated={onUserUpdated}
                            customRoles={customRoles}
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
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {user.name}?
                                  This action cannot be undone. The user will lose
                                  access to the system immediately.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user.id)}
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
