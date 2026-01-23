"use client";

import { useState } from "react";
import {
  AlertCircle,
  Clock,
  AlertTriangle,
  Gavel,
  Mail,
  FileWarning,
  Calculator,
  Scale,
  Search,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
  getAgingBucketColor,
} from "@/lib/utils/formatters";
import { AGING_BUCKETS } from "@/lib/constants";
import { mockDebtRecords, mockAgingBuckets } from "@/server/services/mock-data";

const bucketIcons = {
  "0-30": Clock,
  "31-60": AlertCircle,
  "61-90": AlertTriangle,
  "90+": Gavel,
};

const actionIcons = {
  "Soft Reminder": Mail,
  "Market Rule Violation": FileWarning,
  "Late-payment penalties": Calculator,
  "Handover to NISO Legal": Scale,
};

export default function DebtAgingPage() {
  const [selectedBucket, setSelectedBucket] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDebts = mockDebtRecords.filter((debt) => {
    const matchesBucket =
      selectedBucket === "all" || debt.agingBucket === selectedBucket;
    const matchesSearch =
      debt.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      debt.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBucket && matchesSearch;
  });

  const getTotalByBucket = (bucket: string) => {
    return mockDebtRecords
      .filter((d) => d.agingBucket === bucket)
      .reduce((sum, d) => sum + d.currentBalance, 0);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Debt Recovery Framework</h1>
            <p className="text-muted-foreground">
              4-bucket aging analysis with escalation workflow
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Calculator className="mr-2 h-4 w-4" />
                Apply Penalty
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Apply Late Payment Penalty</DialogTitle>
                <DialogDescription>
                  Calculate and apply penalty for overdue debt
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Select Debt Record</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select debt" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDebtRecords
                        .filter((d) => d.agingDays > 60)
                        .map((d) => (
                          <SelectItem key={d.id} value={d.id}>
                            {d.participantName} - {formatCurrency(d.currentBalance)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Penalty Rate (%)</Label>
                  <Input type="number" placeholder="2.0" />
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm font-medium">Standard Penalty Rates</p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>61-90 days: 2% of outstanding balance</li>
                    <li>90+ days: 5% of outstanding balance</li>
                  </ul>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Apply Penalty</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Aging Bucket Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {mockAgingBuckets.map((bucket) => {
            const BucketIcon =
              bucketIcons[bucket.bucket as keyof typeof bucketIcons];
            const ActionIcon =
              actionIcons[bucket.action as keyof typeof actionIcons];
            const borderColor = getAgingBucketColor(bucket.bucket);

            return (
              <Card
                key={bucket.bucket}
                className={`border-l-4 ${borderColor} cursor-pointer hover:bg-muted/50 transition-colors ${
                  selectedBucket === bucket.bucket ? "ring-2 ring-primary" : ""
                }`}
                onClick={() =>
                  setSelectedBucket(
                    selectedBucket === bucket.bucket ? "all" : bucket.bucket
                  )
                }
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {bucket.label}
                  </CardTitle>
                  {BucketIcon && (
                    <BucketIcon className="h-4 w-4 text-muted-foreground" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(bucket.amount)}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      {bucket.count} participants
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {ActionIcon && <ActionIcon className="h-3 w-3" />}
                      {bucket.action}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Total Outstanding */}
        <Card className="bg-muted/50">
          <CardContent className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Outstanding Debt
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(
                  mockAgingBuckets.reduce((sum, b) => sum + b.amount, 0)
                )}
              </p>
            </div>
            <div className="flex gap-4">
              {mockAgingBuckets.map((bucket) => (
                <div key={bucket.bucket} className="text-center">
                  <div
                    className={`h-2 w-2 rounded-full mx-auto mb-1 ${
                      bucket.color === "green"
                        ? "bg-green-500"
                        : bucket.color === "yellow"
                        ? "bg-yellow-500"
                        : bucket.color === "orange"
                        ? "bg-orange-500"
                        : "bg-red-500"
                    }`}
                  />
                  <p className="text-xs text-muted-foreground">
                    {bucket.bucket}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Debt Records Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Debt Records</CardTitle>
                <CardDescription>
                  {selectedBucket === "all"
                    ? "All outstanding debts"
                    : `${
                        AGING_BUCKETS[
                          Object.keys(AGING_BUCKETS).find(
                            (k) =>
                              AGING_BUCKETS[k as keyof typeof AGING_BUCKETS]
                                .key === selectedBucket
                          ) as keyof typeof AGING_BUCKETS
                        ]?.label || selectedBucket
                      }`}
                </CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search participants..."
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
                  <TableHead>Participant</TableHead>
                  <TableHead>Original Amount</TableHead>
                  <TableHead>Current Balance</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Aging</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Recovery Action</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDebts.map((debt) => {
                  const statusColor = getStatusColor(debt.status);
                  const riskColor = getStatusColor(debt.riskLevel);

                  return (
                    <TableRow key={debt.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{debt.participantName}</p>
                          <p className="text-xs text-muted-foreground">
                            {debt.participantType}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatCurrency(debt.originalAmount)}
                      </TableCell>
                      <TableCell className="font-bold">
                        {formatCurrency(debt.currentBalance)}
                      </TableCell>
                      <TableCell>{formatDate(debt.dueDate)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={getAgingBucketColor(debt.agingBucket)}
                          >
                            {debt.agingBucket}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {debt.agingDays} days
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`${riskColor.bg} ${riskColor.text}`}
                        >
                          {debt.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px]">
                          <p className="text-sm truncate">
                            {debt.recoveryAction || "-"}
                          </p>
                          {debt.assignedTo && (
                            <p className="text-xs text-muted-foreground truncate">
                              Assigned: {debt.assignedTo}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`${statusColor.bg} ${statusColor.text}`}
                        >
                          {debt.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recovery Actions Reference */}
        <Card>
          <CardHeader>
            <CardTitle>Recovery Action Guidelines</CardTitle>
            <CardDescription>
              Standard escalation procedures by aging bucket
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Object.values(AGING_BUCKETS).map((bucket) => {
                const ActionIcon =
                  actionIcons[bucket.action as keyof typeof actionIcons];
                return (
                  <div
                    key={bucket.key}
                    className="rounded-lg border p-4 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          bucket.color === "green"
                            ? "bg-green-500"
                            : bucket.color === "yellow"
                            ? "bg-yellow-500"
                            : bucket.color === "orange"
                            ? "bg-orange-500"
                            : "bg-red-500"
                        }`}
                      />
                      <span className="font-medium">{bucket.label}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {ActionIcon && <ActionIcon className="h-4 w-4" />}
                      {bucket.action}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
