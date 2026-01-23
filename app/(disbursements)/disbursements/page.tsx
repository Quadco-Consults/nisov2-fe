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
  formatCurrency,
  formatPercentage,
  getStatusColor,
} from "@/lib/utils/formatters";
import { WATERFALL_TIERS, SERC_SPLIT } from "@/lib/constants";
import {
  mockDisbursements,
  mockWaterfall,
  mockSercSplits,
} from "@/server/services/mock-data";

export default function DisbursementsPage() {
  const [selectedTab, setSelectedTab] = useState("waterfall");

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Payment Waterfall</h1>
            <p className="text-muted-foreground">
              Tiered disbursement allocation and statutory 5% SERC split
            </p>
          </div>
          <Button>
            <Send className="mr-2 h-4 w-4" />
            Process Disbursements
          </Button>
        </div>

        {/* Pool Status */}
        <div className="grid gap-4 md:grid-cols-3">
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
