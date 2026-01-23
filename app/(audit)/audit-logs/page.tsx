"use client";

import { useState } from "react";
import {
  FileText,
  Search,
  Download,
  Filter,
  LogIn,
  LogOut,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Play,
  Eye,
  Shield,
  Clock,
  User,
  Activity,
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDateTime, getStatusColor } from "@/lib/utils/formatters";
import { AUDIT_ACTIONS, IAM_ROLES, WORKFLOW_STATUSES } from "@/lib/constants";
import {
  mockAuditLogs,
  mockApprovalWorkflows,
  mockIAMUsers,
} from "@/server/services/mock-data";

const actionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  login: LogIn,
  logout: LogOut,
  create: Plus,
  update: Edit,
  delete: Trash2,
  approve: CheckCircle,
  reject: XCircle,
  execute: Play,
  view: Eye,
  export: Download,
};

export default function AuditLogsPage() {
  const [selectedTab, setSelectedTab] = useState("logs");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState("all");
  const [selectedAction, setSelectedAction] = useState("all");

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesSearch =
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule =
      selectedModule === "all" || log.module === selectedModule;
    const matchesAction =
      selectedAction === "all" || log.action === selectedAction;
    return matchesSearch && matchesModule && matchesAction;
  });

  const modules = [...new Set(mockAuditLogs.map((l) => l.module))];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Audit Logs & Security</h1>
            <p className="text-muted-foreground">
              Immutable audit trail and access management
            </p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Audit Trail
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Log Entries
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAuditLogs.length}</div>
              <p className="text-xs text-muted-foreground">Immutable records</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockIAMUsers.filter((u) => u.status === "active").length}
              </div>
              <p className="text-xs text-muted-foreground">
                With IAM roles assigned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Approvals
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {
                  mockApprovalWorkflows.filter(
                    (w) => w.status === "pending_approval"
                  ).length
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Maker-Checker queue
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Session Timeout
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15 min</div>
              <p className="text-xs text-muted-foreground">
                Auto-logout on inactivity
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="logs">Audit Logs</TabsTrigger>
            <TabsTrigger value="workflows">Approval Workflows</TabsTrigger>
            <TabsTrigger value="iam">IAM Users</TabsTrigger>
          </TabsList>

          {/* Audit Logs Tab */}
          <TabsContent value="logs" className="space-y-4 mt-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedModule} onValueChange={setSelectedModule}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Module" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modules</SelectItem>
                  {modules.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m.charAt(0).toUpperCase() + m.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {Object.entries(AUDIT_ACTIONS).map(([key, val]) => (
                    <SelectItem key={key} value={key}>
                      {val.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Logs Table */}
            <Card>
              <CardHeader>
                <CardTitle>Immutable Audit Trail</CardTitle>
                <CardDescription>
                  All actions are logged with timestamps and cannot be modified
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Seq #</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => {
                      const ActionIcon = actionIcons[log.action] || Activity;
                      return (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-xs">
                            {log.sequenceNumber}
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDateTime(log.timestamp)}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">
                                {log.userName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {log.userIamRole
                                  ? IAM_ROLES[
                                      log.userIamRole as keyof typeof IAM_ROLES
                                    ]?.name
                                  : log.userRole}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <ActionIcon className="h-4 w-4 text-muted-foreground" />
                              <Badge variant="outline">
                                {AUDIT_ACTIONS[
                                  log.action as keyof typeof AUDIT_ACTIONS
                                ]?.label || log.action}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{log.module}</Badge>
                          </TableCell>
                          <TableCell className="max-w-[300px]">
                            <p className="text-sm truncate">{log.description}</p>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {log.ipAddress}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approval Workflows Tab */}
          <TabsContent value="workflows" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Maker-Checker Authorization Flow</CardTitle>
                <CardDescription>
                  Four-Eyes Principle enforcement for fiscal movements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Maker</TableHead>
                      <TableHead>Approver</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockApprovalWorkflows.map((workflow) => {
                      const statusConfig =
                        WORKFLOW_STATUSES[
                          workflow.status as keyof typeof WORKFLOW_STATUSES
                        ];
                      const statusColor = getStatusColor(workflow.status);

                      return (
                        <TableRow key={workflow.id}>
                          <TableCell className="font-medium">
                            {workflow.referenceNumber}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {workflow.workflowType.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{workflow.makerName}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDateTime(workflow.madeAt)}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {workflow.approverName ? (
                              <div>
                                <p className="text-sm">{workflow.approverName}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDateTime(workflow.approvedAt!)}
                                </p>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">
                                Pending
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {workflow.amount ? (
                              <span className="font-medium">
                                ₦{(workflow.amount / 1e9).toFixed(2)}B
                              </span>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell className="max-w-[200px]">
                            <p className="text-sm truncate">
                              {workflow.description}
                            </p>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={`${statusColor.bg} ${statusColor.text}`}
                            >
                              {statusConfig?.label || workflow.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {workflow.status === "pending_approval" && (
                              <div className="flex gap-2">
                                <Button size="sm" variant="default">
                                  Approve
                                </Button>
                                <Button size="sm" variant="outline">
                                  Reject
                                </Button>
                              </div>
                            )}
                            {workflow.approvalToken && (
                              <Badge variant="outline" className="text-xs">
                                Token: {workflow.approvalToken.slice(0, 10)}...
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Workflow Explanation */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Authorization Flow (Four-Eyes Principle)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="h-12 w-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-2">
                        <Edit className="h-6 w-6 text-blue-600" />
                      </div>
                      <p className="font-medium">1. Maker</p>
                      <p className="text-xs text-muted-foreground">
                        Settlement Officer creates
                      </p>
                    </div>
                    <div className="h-px w-12 bg-border" />
                    <div className="text-center">
                      <div className="h-12 w-12 mx-auto rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                        <Clock className="h-6 w-6 text-yellow-600" />
                      </div>
                      <p className="font-medium">2. Draft</p>
                      <p className="text-xs text-muted-foreground">
                        Invisible to bank interface
                      </p>
                    </div>
                    <div className="h-px w-12 bg-border" />
                    <div className="text-center">
                      <div className="h-12 w-12 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-2">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <p className="font-medium">3. Approver</p>
                      <p className="text-xs text-muted-foreground">
                        Treasury Admin reviews
                      </p>
                    </div>
                    <div className="h-px w-12 bg-border" />
                    <div className="text-center">
                      <div className="h-12 w-12 mx-auto rounded-full bg-purple-100 flex items-center justify-center mb-2">
                        <Shield className="h-6 w-6 text-purple-600" />
                      </div>
                      <p className="font-medium">4. Token</p>
                      <p className="text-xs text-muted-foreground">
                        Cryptographic approval
                      </p>
                    </div>
                    <div className="h-px w-12 bg-border" />
                    <div className="text-center">
                      <div className="h-12 w-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        <Play className="h-6 w-6 text-primary" />
                      </div>
                      <p className="font-medium">5. Execute</p>
                      <p className="text-xs text-muted-foreground">
                        Push to Remita
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* IAM Users Tab */}
          <TabsContent value="iam" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>IAM Role Assignments</CardTitle>
                <CardDescription>
                  Multi-Tiered Role-Based Access Control (RBAC)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>IAM Role</TableHead>
                      <TableHead>Operational Scope</TableHead>
                      <TableHead>Maker</TableHead>
                      <TableHead>Checker</TableHead>
                      <TableHead>2FA</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockIAMUsers.map((user) => {
                      const roleConfig =
                        IAM_ROLES[user.iamRole as keyof typeof IAM_ROLES];
                      const statusColor = getStatusColor(user.status);

                      return (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{roleConfig?.name}</Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px]">
                            <p className="text-sm text-muted-foreground truncate">
                              {roleConfig?.operationalScope}
                            </p>
                          </TableCell>
                          <TableCell>
                            {user.canMake ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-muted-foreground" />
                            )}
                          </TableCell>
                          <TableCell>
                            {user.canCheck ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-muted-foreground" />
                            )}
                          </TableCell>
                          <TableCell>
                            {user.twoFactorEnabled ? (
                              <Badge className="bg-green-100 text-green-700">
                                Enabled
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Disabled</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDateTime(user.lastActivity || user.lastLogin)}
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

            {/* Role Definitions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Permissions Matrix</CardTitle>
                <CardDescription>
                  Role definitions and access levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {Object.values(IAM_ROLES).map((role) => (
                    <div key={role.code} className="rounded-lg border p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <span className="font-medium">{role.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {role.description}
                      </p>
                      <div className="space-y-1">
                        <p className="text-xs font-medium">Key Permissions:</p>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.slice(0, 4).map((perm) => (
                            <Badge
                              key={perm}
                              variant="secondary"
                              className="text-xs"
                            >
                              {perm}
                            </Badge>
                          ))}
                          {role.permissions.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{role.permissions.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
