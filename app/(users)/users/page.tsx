"use client";

import { useState } from "react";
import { Users, Plus, Search, Shield, Mail, Phone } from "lucide-react";
import { MainLayout } from "@/components/layouts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials, formatDate, getStatusColor } from "@/lib/utils/formatters";
import { USER_ROLES } from "@/lib/constants";

const mockUsers = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@niso.gov.ng",
    role: "super_admin",
    department: "IT",
    phone: "+234 801 234 5678",
    status: "active",
    lastLogin: "2025-01-23T10:30:00Z",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Doe",
    email: "jane.doe@niso.gov.ng",
    role: "finance_manager",
    department: "Treasury",
    phone: "+234 802 345 6789",
    status: "active",
    lastLogin: "2025-01-22T14:00:00Z",
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael.j@niso.gov.ng",
    role: "debt_collector",
    department: "Collections",
    phone: "+234 803 456 7890",
    status: "active",
    lastLogin: "2025-01-21T09:15:00Z",
    createdAt: "2024-03-10",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.w@niso.gov.ng",
    role: "treasury_officer",
    department: "Treasury",
    phone: "+234 804 567 8901",
    status: "inactive",
    lastLogin: "2024-12-15T16:45:00Z",
    createdAt: "2024-04-05",
  },
  {
    id: "5",
    name: "David Brown",
    email: "david.b@niso.gov.ng",
    role: "auditor",
    department: "Audit",
    phone: "+234 805 678 9012",
    status: "active",
    lastLogin: "2025-01-20T11:30:00Z",
    createdAt: "2024-05-01",
  },
];

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeUsers = mockUsers.filter((u) => u.status === "active").length;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-muted-foreground">
              Manage system users and access permissions
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockUsers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {activeUsers}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(mockUsers.map((u) => u.department)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>System Users</CardTitle>
                <CardDescription>All registered system users</CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8 w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const statusColor = getStatusColor(user.status);
                  const roleLabel =
                    USER_ROLES[user.role as keyof typeof USER_ROLES]?.label ||
                    user.role;

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
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {user.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{roleLabel}</Badge>
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(user.lastLogin)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`${statusColor.bg} ${statusColor.text}`}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
