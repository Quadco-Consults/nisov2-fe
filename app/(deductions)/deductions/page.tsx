"use client";

import { useState } from "react";
import {
  Calculator,
  Plus,
  Percent,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
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
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils/formatters";
import { PENALTY_TYPES, ADJUSTMENT_TYPES } from "@/lib/constants";
import {
  mockPenalties,
  mockAdjustments,
  mockParticipants,
} from "@/server/services/mock-data";

export default function DeductionsPage() {
  const [selectedTab, setSelectedTab] = useState("penalties");
  const [searchQuery, setSearchQuery] = useState("");

  const totalPenalties = mockPenalties.reduce((sum, p) => sum + p.amount, 0);
  const pendingPenalties = mockPenalties.filter(
    (p) => p.status === "pending"
  ).length;
  const ugdPenalties = mockPenalties.filter((p) => p.type === "UGD");

  const filteredPenalties = mockPenalties.filter(
    (p) =>
      p.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAdjustments = mockAdjustments.filter(
    (a) =>
      a.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Penalty Administration</h1>
            <p className="text-muted-foreground">
              UGD penalties, fixed/percentage adjustments, and market deductions
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  New Adjustment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Market Adjustment</DialogTitle>
                  <DialogDescription>
                    Add tax, levy, credit, or other adjustment
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Participant</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select participant" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockParticipants.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Adjustment Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ADJUSTMENT_TYPES).map((type) => (
                          <SelectItem key={type.code} value={type.code}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Description</Label>
                    <Input placeholder="Enter description" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Amount</Label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="isDebit" />
                    <Label htmlFor="isDebit">Debit (charge to participant)</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Create Adjustment</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Penalty
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Penalty</DialogTitle>
                  <DialogDescription>
                    Apply penalty for market rule violations
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Participant</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select participant" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockParticipants.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Penalty Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select penalty type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(PENALTY_TYPES).map((type) => (
                          <SelectItem key={type.code} value={type.code}>
                            {type.code} - {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Reason</Label>
                    <Input placeholder="Describe the violation" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Calculation Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select calculation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                        <SelectItem value="percentage">Percentage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Base Amount (for %)</Label>
                      <Input type="number" placeholder="0.00" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Rate / Amount</Label>
                      <Input type="number" placeholder="0.00" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Create Penalty</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Penalties
              </CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalPenalties)}
              </div>
              <p className="text-xs text-muted-foreground">
                {mockPenalties.length} penalty records
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                UGD Penalties
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  ugdPenalties.reduce((sum, p) => sum + p.amount, 0)
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {ugdPenalties.length} dispatch violations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Approval
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingPenalties}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting confirmation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Adjustments MTD
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  mockAdjustments.reduce(
                    (sum, a) => sum + (a.isDebit ? a.amount : -a.amount),
                    0
                  )
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Net adjustment amount
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Penalties & Adjustments Tables */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Deductions & Adjustments</CardTitle>
                <CardDescription>
                  Manage penalties and market adjustments
                </CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-8 w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList>
                <TabsTrigger value="penalties">Penalties</TabsTrigger>
                <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
              </TabsList>

              {/* Penalties Table */}
              <TabsContent value="penalties" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Participant</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Calculation</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPenalties.map((penalty) => {
                      const statusColor = getStatusColor(penalty.status);
                      return (
                        <TableRow key={penalty.id}>
                          <TableCell className="font-medium">
                            {penalty.referenceNumber}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {penalty.participantName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {penalty.period}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{penalty.type}</Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px]">
                            <p className="text-sm truncate">{penalty.reason}</p>
                          </TableCell>
                          <TableCell>
                            {penalty.calculationType === "percentage" ? (
                              <div className="flex items-center gap-1">
                                <Percent className="h-3 w-3" />
                                <span className="text-sm">
                                  {penalty.percentage}% of{" "}
                                  {formatCurrency(penalty.baseAmount || 0)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm">Fixed</span>
                            )}
                          </TableCell>
                          <TableCell className="font-bold text-red-600">
                            {formatCurrency(penalty.amount)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={`${statusColor.bg} ${statusColor.text}`}
                            >
                              {penalty.status === "applied" && (
                                <CheckCircle className="mr-1 h-3 w-3" />
                              )}
                              {penalty.status === "pending" && (
                                <Clock className="mr-1 h-3 w-3" />
                              )}
                              {penalty.status === "disputed" && (
                                <AlertTriangle className="mr-1 h-3 w-3" />
                              )}
                              {penalty.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TabsContent>

              {/* Adjustments Table */}
              <TabsContent value="adjustments" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Participant</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Direction</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAdjustments.map((adjustment) => {
                      const statusColor = getStatusColor(adjustment.status);
                      return (
                        <TableRow key={adjustment.id}>
                          <TableCell className="font-medium">
                            {adjustment.referenceNumber}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {adjustment.participantName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {adjustment.period}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {
                                ADJUSTMENT_TYPES[
                                  adjustment.type.toUpperCase() as keyof typeof ADJUSTMENT_TYPES
                                ]?.name || adjustment.type
                              }
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px]">
                            <p className="text-sm truncate">
                              {adjustment.description}
                            </p>
                          </TableCell>
                          <TableCell
                            className={`font-bold ${
                              adjustment.isDebit
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {adjustment.isDebit ? "" : "-"}
                            {formatCurrency(adjustment.amount)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                adjustment.isDebit ? "destructive" : "default"
                              }
                              className={
                                adjustment.isDebit
                                  ? ""
                                  : "bg-green-100 text-green-700"
                              }
                            >
                              {adjustment.isDebit ? "Debit" : "Credit"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={`${statusColor.bg} ${statusColor.text}`}
                            >
                              {adjustment.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Penalty Types Reference */}
        <Card>
          <CardHeader>
            <CardTitle>Penalty Type Reference</CardTitle>
            <CardDescription>
              Standard penalty categories and descriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {Object.values(PENALTY_TYPES).map((type) => (
                <div key={type.code} className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{type.code}</Badge>
                    <span className="font-medium">{type.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {type.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
