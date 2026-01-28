"use client";

import { useState, useMemo } from "react";
import { Users, Shield, Key, UserCheck } from "lucide-react";
import { MainLayout } from "@/components/layouts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UsersTab, RolesTab } from "@/components/users";
import {
  mockManagedUsers,
  mockSystemRoles,
  mockCustomRoles,
} from "@/server/services/mock-data";
import type { CustomRole, ManagedUser } from "@/types";

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState("users");

  // Lift state up to share between tabs
  const [customRoles, setCustomRoles] = useState<CustomRole[]>(mockCustomRoles);
  const [users, setUsers] = useState<ManagedUser[]>(mockManagedUsers);

  // All roles (system + custom)
  const allRoles = useMemo(
    () => [...mockSystemRoles, ...customRoles],
    [customRoles]
  );

  // Calculate stats dynamically
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const inactiveUsers = users.filter((u) => u.status === "inactive").length;
  const suspendedUsers = users.filter((u) => u.status === "suspended").length;
  const totalRoles = mockSystemRoles.length + customRoles.length;
  const departments = new Set(users.map((u) => u.department)).size;

  // Role handlers
  const handleRoleCreated = (newRole: CustomRole) => {
    setCustomRoles((prev) => [...prev, newRole]);
  };

  const handleRoleUpdated = (updatedRole: CustomRole) => {
    setCustomRoles((prev) =>
      prev.map((role) => (role.id === updatedRole.id ? updatedRole : role))
    );
    // Update users with this role to reflect name changes
    setUsers((prev) =>
      prev.map((user) =>
        user.roleId === updatedRole.id
          ? { ...user, roleName: updatedRole.name }
          : user
      )
    );
  };

  const handleRoleDeleted = (roleId: string) => {
    setCustomRoles((prev) => prev.filter((r) => r.id !== roleId));
  };

  // User handlers
  const handleUserCreated = (newUser: ManagedUser) => {
    setUsers((prev) => [...prev, newUser]);
  };

  const handleUserUpdated = (updatedUser: ManagedUser) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  const handleUserDeleted = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage system users, roles, and permissions
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {activeUsers} active, {inactiveUsers} inactive
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {activeUsers}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}% of total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRoles}</div>
              <p className="text-xs text-muted-foreground">
                {mockSystemRoles.length} system, {customRoles.length} custom
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{departments}</div>
              <p className="text-xs text-muted-foreground">
                Across organization
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Roles & Permissions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <UsersTab
              users={users}
              customRoles={customRoles}
              onUserCreated={handleUserCreated}
              onUserUpdated={handleUserUpdated}
              onUserDeleted={handleUserDeleted}
            />
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <RolesTab
              customRoles={customRoles}
              onRoleCreated={handleRoleCreated}
              onRoleUpdated={handleRoleUpdated}
              onRoleDeleted={handleRoleDeleted}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
