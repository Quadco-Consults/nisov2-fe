"use client";

import { useState } from "react";
import {
  Send,
  ArrowDown,
  CheckCircle,
  Clock,
  AlertTriangle,
  Building,
  Percent,
  DollarSign,
  ChevronRight,
  Shield,
  Edit,
  Play,
  XCircle,
  FileText,
  Users,
  Lock,
} from "lucide-react";
import { MainLayout } from "@/components/layouts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  formatCurrency,
  formatPercentage,
  formatDateTime,
  getStatusColor,
} from "@/lib/utils/formatters";
import { WATERFALL_TIERS, SERC_SPLIT, WORKFLOW_STATUSES, IAM_ROLES } from "@/lib/constants";
import {
  mockDisbursements,
  mockWaterfall,
  mockSercSplits,
  mockDisbursementBatches,
  mockApprovalWorkflows,
} from "@/server/services/mock-data";

export default function DisbursementsPage() {
  const [selectedTab, setSelectedTab] = useState("waterfall");

  const pendingApprovals = mockApprovalWorkflows.filter(
    (w) => w.workflowType === "disbursement" && w.status === "pending_approval"
  ).length;
  const approvedBatches = mockDisbursementBatches.filter(
    (b) => b.status === "approved"
  ).length;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Payment Waterfall</h1>
            <p className="text-muted-foreground">
              Tiered disbursement allocation with Maker-Checker authorization
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Send className="mr-2 h-4 w-4" />
                Create Disbursement Batch
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Disbursement Batch</DialogTitle>
                <DialogDescription>
                  Initiate a new disbursement batch (Maker action)
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Period</Label>
                  <Input placeholder="e.g., January 2025" />
                </div>
                <div className="grid gap-2">
                  <Label>Description</Label>
                  <Input placeholder="Describe the batch purpose" />
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm font-medium mb-2">Maker-Checker Flow</p>
                  <p className="text-xs text-muted-foreground">
                    This batch will be created as DRAFT and require approval from
                    a Treasury Administrator before execution.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Create as Draft</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Pool Status */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Pool</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(mockWaterfall.totalPool)}
              </div>
              <p className="text-xs text-muted-foreground">
                Available for disbursement
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Funding Ratio</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">
                  {formatPercentage(mockWaterfall.fundingRatio * 100)}
                </span>
                {mockWaterfall.isUnderfunded && (
                  <Badge variant="destructive" className="text-xs">
                    Underfunded
                  </Badge>
                )}
              </div>
              <Progress
                value={mockWaterfall.fundingRatio * 100}
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {approvedBatches > 0 ? approvedBatches : pendingApprovals}
              </div>
              <p className="text-xs text-muted-foreground">
                {approvedBatches > 0 ? "Approved, ready to execute" : "Awaiting checker review"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">SERC Allocation</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPercentage(SERC_SPLIT.STATE_SERC * 100)}
              </div>
              <p className="text-xs text-muted-foreground">
                Statutory deduction per disbursement
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="waterfall">Waterfall Allocation</TabsTrigger>
            <TabsTrigger value="approval" className="flex items-center gap-2">
              Approval Workflow
              {(pendingApprovals > 0 || approvedBatches > 0) && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                  {approvedBatches > 0 ? approvedBatches : pendingApprovals}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="disbursements">Disbursements</TabsTrigger>
            <TabsTrigger value="serc">SERC 5% Split</TabsTrigger>
          </TabsList>

          {/* Waterfall Visualization */}
          <TabsContent value="waterfall" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Waterfall Tiers</CardTitle>
                <CardDescription>
                  Priority-based allocation with pro-rata balancing when underfunded
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockWaterfall.allocations.map((allocation, index) => (
                    <div key={allocation.tier} className="space-y-4">
                      {/* Tier Header */}
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                            allocation.shortfall === 0
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {allocation.tier}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{allocation.tierName}</h3>
                              <p className="text-sm text-muted-foreground">
                                {
                                  WATERFALL_TIERS[
                                    `TIER_${allocation.tier}` as keyof typeof WATERFALL_TIERS
                                  ]?.description
                                }
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {formatCurrency(allocation.allocated)} /{" "}
                                {formatCurrency(allocation.required)}
                              </p>
                              {allocation.shortfall > 0 && (
                                <p className="text-sm text-red-600">
                                  Shortfall: {formatCurrency(allocation.shortfall)}
                                </p>
                              )}
                            </div>
                          </div>
                          <Progress
                            value={(allocation.allocated / allocation.required) * 100}
                            className="mt-2"
                          />
                        </div>
                      </div>

                      {/* Tier Providers */}
                      <div className="ml-14 space-y-2">
                        {allocation.providers.map((provider) => (
                          <div
                            key={provider.id}
                            className="flex items-center justify-between rounded-lg border p-3"
                          >
                            <div className="flex items-center gap-3">
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{provider.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {provider.type}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {formatCurrency(provider.allocated)}
                              </p>
                              {provider.proRataFactor && (
                                <p className="text-xs text-orange-600">
                                  Pro-rata: {formatPercentage(provider.proRataFactor * 100)}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Arrow to next tier */}
                      {index < mockWaterfall.allocations.length - 1 && (
                        <div className="flex justify-center">
                          <ArrowDown className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pro-rata Notice */}
            {mockWaterfall.isUnderfunded && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <AlertTriangle className="h-5 w-5" />
                    Pro-Rata Balancing Active
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-orange-700">
                  <p>
                    The pool is underfunded at{" "}
                    {formatPercentage(mockWaterfall.fundingRatio * 100)} of
                    requirements. Lower-priority tiers are receiving weighted
                    distributions based on available funds.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Approval Workflow Tab (Maker-Checker) */}
          <TabsContent value="approval" className="space-y-6 mt-6">
            {/* Four-Eyes Principle Explanation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Maker-Checker Authorization Flow
                </CardTitle>
                <CardDescription>
                  Four-Eyes Principle enforcement for all disbursement operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-6">
                    {/* Step 1: Maker */}
                    <div className="text-center">
                      <div className="h-14 w-14 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-2">
                        <Edit className="h-7 w-7 text-blue-600" />
                      </div>
                      <p className="font-medium text-sm">1. Maker</p>
                      <p className="text-xs text-muted-foreground max-w-[100px]">
                        Settlement Officer creates batch
                      </p>
                    </div>
                    <ChevronRight className="h-6 w-6 text-muted-foreground" />

                    {/* Step 2: Draft */}
                    <div className="text-center">
                      <div className="h-14 w-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-2">
                        <FileText className="h-7 w-7 text-gray-600" />
                      </div>
                      <p className="font-medium text-sm">2. Draft</p>
                      <p className="text-xs text-muted-foreground max-w-[100px]">
                        Invisible to bank interface
                      </p>
                    </div>
                    <ChevronRight className="h-6 w-6 text-muted-foreground" />

                    {/* Step 3: Checker */}
                    <div className="text-center">
                      <div className="h-14 w-14 mx-auto rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                        <Users className="h-7 w-7 text-yellow-600" />
                      </div>
                      <p className="font-medium text-sm">3. Checker</p>
                      <p className="text-xs text-muted-foreground max-w-[100px]">
                        Treasury Admin reviews
                      </p>
                    </div>
                    <ChevronRight className="h-6 w-6 text-muted-foreground" />

                    {/* Step 4: Approval Token */}
                    <div className="text-center">
                      <div className="h-14 w-14 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-2">
                        <Lock className="h-7 w-7 text-green-600" />
                      </div>
                      <p className="font-medium text-sm">4. Token</p>
                      <p className="text-xs text-muted-foreground max-w-[100px]">
                        Cryptographic approval
                      </p>
                    </div>
                    <ChevronRight className="h-6 w-6 text-muted-foreground" />

                    {/* Step 5: Execute */}
                    <div className="text-center">
                      <div className="h-14 w-14 mx-auto rounded-full bg-purple-100 flex items-center justify-center mb-2">
                        <Play className="h-7 w-7 text-purple-600" />
                      </div>
                      <p className="font-medium text-sm">5. Execute</p>
                      <p className="text-xs text-muted-foreground max-w-[100px]">
                        Push to Remita gateway
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Disbursement Batches */}
            <Card>
              <CardHeader>
                <CardTitle>Disbursement Batches</CardTitle>
                <CardDescription>
                  Batches requiring approval or ready for execution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch Number</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Approved By</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockDisbursementBatches.map((batch) => {
                      const statusConfig =
                        WORKFLOW_STATUSES[batch.status as keyof typeof WORKFLOW_STATUSES];
                      const statusColor = getStatusColor(batch.status);

                      return (
                        <TableRow key={batch.id}>
                          <TableCell className="font-medium">
                            {batch.batchNumber}
                          </TableCell>
                          <TableCell>{batch.period}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {batch.disbursementCount} disbursements
                            </Badge>
                          </TableCell>
                          <TableCell className="font-bold">
                            {formatCurrency(batch.totalAmount)}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{batch.createdByName}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDateTime(batch.createdAt)}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {batch.approvedByName ? (
                              <div>
                                <p className="text-sm">{batch.approvedByName}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDateTime(batch.approvedAt!)}
                                </p>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={`${statusColor.bg} ${statusColor.text}`}
                            >
                              {batch.status === "approved" && (
                                <CheckCircle className="mr-1 h-3 w-3" />
                              )}
                              {batch.status === "executed" && (
                                <Play className="mr-1 h-3 w-3" />
                              )}
                              {statusConfig?.label || batch.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {batch.status === "draft" && (
                              <Button size="sm" variant="outline">
                                Submit for Approval
                              </Button>
                            )}
                            {batch.status === "pending_approval" && (
                              <div className="flex gap-2">
                                <Button size="sm">Approve</Button>
                                <Button size="sm" variant="outline">
                                  Reject
                                </Button>
                              </div>
                            )}
                            {batch.status === "approved" && (
                              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                                <Play className="mr-1 h-3 w-3" />
                                Execute to Remita
                              </Button>
                            )}
                            {batch.status === "executed" && batch.remitaReference && (
                              <Badge variant="outline" className="font-mono text-xs">
                                {batch.remitaReference}
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

            {/* Approval Workflows */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals Queue</CardTitle>
                <CardDescription>
                  All disbursement-related items awaiting checker authorization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Maker</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Token</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockApprovalWorkflows
                      .filter((w) => w.workflowType === "disbursement")
                      .map((workflow) => {
                        const statusConfig =
                          WORKFLOW_STATUSES[workflow.status as keyof typeof WORKFLOW_STATUSES];
                        const statusColor = getStatusColor(workflow.status);

                        return (
                          <TableRow key={workflow.id}>
                            <TableCell className="font-medium">
                              {workflow.referenceNumber}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {workflow.workflowType}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="text-sm">{workflow.makerName}</p>
                                <p className="text-xs text-muted-foreground">
                                  {IAM_ROLES[workflow.makerRole as keyof typeof IAM_ROLES]?.name || workflow.makerRole}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="font-bold">
                              {workflow.amount
                                ? formatCurrency(workflow.amount)
                                : "-"}
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
                              {workflow.approvalToken ? (
                                <div className="flex items-center gap-1 text-green-600">
                                  <Lock className="h-3 w-3" />
                                  <span className="font-mono text-xs">
                                    {workflow.approvalToken.slice(0, 12)}...
                                  </span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-xs">
                                  Pending
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Shield className="h-5 w-5" />
                  Security & Fraud Prevention
                </CardTitle>
              </CardHeader>
              <CardContent className="text-blue-700 space-y-2">
                <p className="text-sm">
                  <strong>Separation of Duties:</strong> The Maker (Settlement Officer) who creates a disbursement batch cannot be the same person who approves it.
                </p>
                <p className="text-sm">
                  <strong>Cryptographic Tokens:</strong> Upon approval, a unique token is generated that authorizes the batch for execution.
                </p>
                <p className="text-sm">
                  <strong>Bank Interface Protection:</strong> Only APPROVED batches with valid tokens can be pushed to the Remita payment gateway.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Disbursements Table */}
          <TabsContent value="disbursements" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Disbursement Records</CardTitle>
                <CardDescription>
                  All disbursements with approval workflow status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Service Provider</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Gross Amount</TableHead>
                      <TableHead>SERC (5%)</TableHead>
                      <TableHead>Net Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockDisbursements.map((disbursement) => {
                      const statusColor = getStatusColor(disbursement.status);
                      return (
                        <TableRow key={disbursement.id}>
                          <TableCell className="font-medium">
                            {disbursement.disbursementNumber}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {disbursement.serviceProviderName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {disbursement.serviceProviderType}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              Tier {disbursement.tier}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {formatCurrency(disbursement.grossAmount)}
                          </TableCell>
                          <TableCell className="text-red-600">
                            -{formatCurrency(disbursement.sercDeduction)}
                          </TableCell>
                          <TableCell className="font-bold">
                            {formatCurrency(disbursement.netAmount)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={`${statusColor.bg} ${statusColor.text}`}
                            >
                              {disbursement.status === "completed" && (
                                <CheckCircle className="mr-1 h-3 w-3" />
                              )}
                              {disbursement.status === "pending_approval" && (
                                <Clock className="mr-1 h-3 w-3" />
                              )}
                              {disbursement.status.replace("_", " ")}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SERC Split Table */}
          <TabsContent value="serc" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>SERC 5% Statutory Split</CardTitle>
                <CardDescription>
                  95% to Service Provider, 5% to State SERC
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Disbursement ID</TableHead>
                      <TableHead>Service Provider (95%)</TableHead>
                      <TableHead>State SERC</TableHead>
                      <TableHead>SERC Amount (5%)</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSercSplits.map((split) => {
                      const statusColor = getStatusColor(split.status);
                      return (
                        <TableRow key={split.id}>
                          <TableCell className="font-medium">
                            {split.disbursementId}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(split.serviceProviderAmount)}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{split.sercName}</p>
                              <p className="text-xs text-muted-foreground">
                                {split.state}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(split.sercAmount)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={`${statusColor.bg} ${statusColor.text}`}
                            >
                              {split.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
