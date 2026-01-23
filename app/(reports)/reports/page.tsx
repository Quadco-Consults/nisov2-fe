"use client";

import {
  BarChart,
  FileText,
  Download,
  Calendar,
  PieChart,
  TrendingUp,
  FileSpreadsheet,
} from "lucide-react";
import { MainLayout } from "@/components/layouts";
import { Button } from "@/components/ui/button";
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
import { formatDate, getStatusColor } from "@/lib/utils/formatters";

const reportTypes = [
  {
    id: "collections",
    name: "Collections Report",
    description: "MTD collections by charge code and participant",
    icon: FileText,
    frequency: "Daily/Monthly",
  },
  {
    id: "disbursements",
    name: "Disbursement Report",
    description: "Waterfall allocation and SERC splits",
    icon: PieChart,
    frequency: "Monthly",
  },
  {
    id: "debt-aging",
    name: "Debt Aging Report",
    description: "Outstanding debts by aging bucket",
    icon: BarChart,
    frequency: "Weekly/Monthly",
  },
  {
    id: "phi",
    name: "Pool Health Report",
    description: "PHI trends and variance analysis",
    icon: TrendingUp,
    frequency: "Daily",
  },
  {
    id: "penalties",
    name: "Penalty Report",
    description: "Applied penalties and adjustments",
    icon: FileSpreadsheet,
    frequency: "Monthly",
  },
  {
    id: "regulatory",
    name: "Regulatory Report",
    description: "NERC compliance submissions",
    icon: FileText,
    frequency: "Monthly/Quarterly",
  },
];

const recentReports = [
  {
    id: "1",
    reportNumber: "RPT-2501-0001",
    type: "Collections Report",
    title: "January 2025 MTD Collections",
    period: "January 2025",
    status: "generated",
    generatedBy: "System",
    generatedAt: "2025-01-23T08:00:00Z",
  },
  {
    id: "2",
    reportNumber: "RPT-2501-0002",
    type: "Debt Aging Report",
    title: "Week 3 Debt Aging Analysis",
    period: "Jan 15-21, 2025",
    status: "generated",
    generatedBy: "Jane Doe",
    generatedAt: "2025-01-22T14:30:00Z",
  },
  {
    id: "3",
    reportNumber: "RPT-2501-0003",
    type: "Pool Health Report",
    title: "Daily PHI Report",
    period: "January 22, 2025",
    status: "generated",
    generatedBy: "System",
    generatedAt: "2025-01-22T23:00:00Z",
  },
  {
    id: "4",
    reportNumber: "RPT-2412-0015",
    type: "Regulatory Report",
    title: "Q4 2024 NERC Submission",
    period: "Q4 2024",
    status: "submitted",
    generatedBy: "John Smith",
    generatedAt: "2025-01-15T10:00:00Z",
  },
];

export default function ReportsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Reports</h1>
            <p className="text-muted-foreground">
              Generate and download treasury reports
            </p>
          </div>
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Report
          </Button>
        </div>

        {/* Report Types */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Available Reports</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <Card
                  key={report.id}
                  className="hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <CardHeader className="flex flex-row items-start gap-4 pb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">{report.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {report.frequency}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {report.description}
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Generate
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>
              Previously generated reports available for download
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Generated By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentReports.map((report) => {
                  const statusColor = getStatusColor(report.status);
                  return (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        {report.reportNumber}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{report.type}</Badge>
                      </TableCell>
                      <TableCell>{report.title}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {report.period}
                      </TableCell>
                      <TableCell>{report.generatedBy}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(report.generatedAt)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`${statusColor.bg} ${statusColor.text}`}
                        >
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon-sm">
                          <Download className="h-4 w-4" />
                        </Button>
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
