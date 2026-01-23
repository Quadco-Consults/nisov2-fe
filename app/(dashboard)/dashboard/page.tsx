"use client";

import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  AlertTriangle,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Lock,
  CheckCircle,
  Clock,
} from "lucide-react";
import { MainLayout } from "@/components/layouts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatCurrency,
  formatPercentage,
  formatDate,
  getStatusColor,
  getPHIStatus,
} from "@/lib/utils/formatters";
import {
  mockDashboardStats,
  mockPoolHealth,
  mockRecentSettlements,
  mockVarianceAlerts,
  mockAgingBuckets,
} from "@/server/services/mock-data";

export default function DashboardPage() {
  const phiStatus = getPHIStatus(mockDashboardStats.phi);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold">Market Intelligence Hub</h1>
          <p className="text-muted-foreground">
            Real-time treasury overview and pool health monitoring
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* MTD Collections */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                MTD Collections
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(mockDashboardStats.mtdCollections)}
              </div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="mr-1 h-4 w-4" />
                +{formatPercentage(mockDashboardStats.mtdCollectionsChange)} from last month
              </div>
            </CardContent>
          </Card>

          {/* Pool Balance */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pool Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(mockDashboardStats.poolBalance)}
              </div>
              <div className="flex items-center text-sm text-red-600">
                <TrendingDown className="mr-1 h-4 w-4" />
                {formatPercentage(mockDashboardStats.poolBalanceChange)} from last month
              </div>
            </CardContent>
          </Card>

          {/* Pool Health Index */}
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Pool Health Index (PHI)
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">
                  {formatPercentage(mockDashboardStats.phi)}
                </span>
                <span className={`text-sm font-medium ${phiStatus.color}`}>
                  {phiStatus.status}
                </span>
              </div>
              <Progress value={mockDashboardStats.phi} className="mt-2" />
            </CardContent>
          </Card>

          {/* Variance Alerts */}
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Variance Alerts
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockDashboardStats.varianceAlerts}
              </div>
              <div className="flex items-center text-sm text-red-600">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                +{mockDashboardStats.varianceAlertsChange} new alerts
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pool Health Details */}
          <Card>
            <CardHeader>
              <CardTitle>Pool Health Analysis</CardTitle>
              <CardDescription>
                Total Owed vs Total Received
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Owed</span>
                <span className="font-medium">
                  {formatCurrency(mockPoolHealth.totalOwed)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Received</span>
                <span className="font-medium">
                  {formatCurrency(mockPoolHealth.totalReceived)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-4">
                <span className="text-sm font-medium">Recovery Ratio</span>
                <span className={`font-bold ${phiStatus.color}`}>
                  {formatPercentage(mockPoolHealth.phi)}
                </span>
              </div>
              <Progress value={mockPoolHealth.phi} />
              <div className="flex items-center gap-2 text-sm">
                {mockPoolHealth.trend === "down" ? (
                  <>
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                    <span className="text-red-500">Declining trend</span>
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                    <span className="text-green-500">Improving trend</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Debt Aging Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Debt Aging Overview</CardTitle>
              <CardDescription>Outstanding debts by aging bucket</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAgingBuckets.map((bucket) => (
                  <div key={bucket.bucket} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            bucket.color === "green"
                              ? "bg-green-500"
                              : bucket.color === "yellow"
                              ? "bg-yellow-500"
                              : bucket.color === "orange"
                              ? "bg-orange-500"
                              : "bg-red-500"
                          }`}
                        />
                        {bucket.label}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(bucket.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{bucket.count} participants</span>
                      <span>{bucket.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Third Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Settlements */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Settlements</CardTitle>
              <CardDescription>Latest posted settlements</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Participant</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRecentSettlements.map((settlement) => {
                    const statusColor = getStatusColor(settlement.status);
                    return (
                      <TableRow key={settlement.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {settlement.participantName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {settlement.settlementNumber}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(settlement.totalAmount)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={`${statusColor.bg} ${statusColor.text}`}
                          >
                            {settlement.status === "posted" && (
                              <Lock className="mr-1 h-3 w-3" />
                            )}
                            {settlement.status === "verified" && (
                              <CheckCircle className="mr-1 h-3 w-3" />
                            )}
                            {settlement.status === "pending" && (
                              <Clock className="mr-1 h-3 w-3" />
                            )}
                            {settlement.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Variance Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Flagged Variances</CardTitle>
              <CardDescription>
                Participants exceeding +/-15% deviation threshold
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Participant</TableHead>
                    <TableHead>Expected</TableHead>
                    <TableHead>Actual</TableHead>
                    <TableHead>Variance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockVarianceAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-medium">
                        {alert.participantName}
                      </TableCell>
                      <TableCell>{formatCurrency(alert.expected)}</TableCell>
                      <TableCell>{formatCurrency(alert.actual)}</TableCell>
                      <TableCell>
                        <span
                          className={`flex items-center gap-1 font-medium ${
                            alert.variance < 0 ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {alert.variance < 0 ? (
                            <ArrowDownRight className="h-4 w-4" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4" />
                          )}
                          {formatPercentage(Math.abs(alert.variance))}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
