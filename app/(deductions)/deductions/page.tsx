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
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Tag,
  XCircle,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
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
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils/formatters";
import { PENALTY_TYPES } from "@/lib/constants";
import {
  mockDeductionTypes,
  mockPenaltyRecords,
  mockRegisteredEntities,
} from "@/server/services/mock-data";
import type { DeductionType, PenaltyRecord } from "@/types";

export default function DeductionsPage() {
  const [selectedTab, setSelectedTab] = useState("deductions");
  const [searchQuery, setSearchQuery] = useState("");

  // Deduction Types State
  const [deductionTypes, setDeductionTypes] = useState<DeductionType[]>(mockDeductionTypes);
  const [isCreateDeductionOpen, setIsCreateDeductionOpen] = useState(false);
  const [isEditDeductionOpen, setIsEditDeductionOpen] = useState(false);
  const [isDeleteDeductionOpen, setIsDeleteDeductionOpen] = useState(false);
  const [selectedDeduction, setSelectedDeduction] = useState<DeductionType | null>(null);

  // Penalty Records State
  const [penaltyRecords, setPenaltyRecords] = useState<PenaltyRecord[]>(mockPenaltyRecords);
  const [isCreatePenaltyOpen, setIsCreatePenaltyOpen] = useState(false);
  const [penaltyStatusFilter, setPenaltyStatusFilter] = useState<string>("all");
  const [penaltyEntityFilter, setPenaltyEntityFilter] = useState<string>("all");

  // New Deduction Form State
  const [newDeduction, setNewDeduction] = useState({
    code: "",
    name: "",
    description: "",
    calculationType: "percentage" as "fixed" | "percentage",
    defaultValue: 0,
    linkedServiceProviders: [] as string[],
  });

  // New Penalty Form State
  const [newPenalty, setNewPenalty] = useState({
    entityId: "",
    penaltyType: "" as "UGD" | "LPP" | "MRV" | "OTHER",
    reason: "",
    violationDate: "",
    calculationType: "fixed" as "fixed" | "percentage",
    baseAmount: 0,
    rate: 0,
    amount: 0,
  });

  // Get service providers for deduction linking
  const serviceProviders = mockRegisteredEntities.filter(
    (e) => e.category === "SERVICE_PROVIDER" && e.registrationStatus === "active"
  );

  // Get entities that can be penalized (DISCOs, GENCOs, Bilaterals)
  const penalizableEntities = mockRegisteredEntities.filter(
    (e) =>
      ["DISCO", "GENCO", "BILATERAL"].includes(e.category) &&
      e.registrationStatus === "active"
  );

  // Filter deduction types
  const filteredDeductions = deductionTypes.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter penalty records
  const filteredPenalties = penaltyRecords.filter((p) => {
    const matchesSearch =
      p.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = penaltyStatusFilter === "all" || p.status === penaltyStatusFilter;
    const matchesEntity = penaltyEntityFilter === "all" || p.entityType === penaltyEntityFilter;
    return matchesSearch && matchesStatus && matchesEntity;
  });

  // Stats
  const activeDeductions = deductionTypes.filter((d) => d.status === "active").length;
  const totalPenaltyAmount = penaltyRecords.reduce((sum, p) => sum + p.amount, 0);
  const pendingPenalties = penaltyRecords.filter((p) => p.status === "pending").length;
  const appliedPenalties = penaltyRecords.filter((p) => p.status === "applied").length;

  // Handle creating a deduction type
  const handleCreateDeduction = () => {
    const deduction: DeductionType = {
      id: `ded-type-${Date.now()}`,
      code: newDeduction.code,
      name: newDeduction.name,
      description: newDeduction.description,
      calculationType: newDeduction.calculationType,
      defaultValue: newDeduction.defaultValue,
      linkedServiceProviders: newDeduction.linkedServiceProviders,
      status: "active",
      createdBy: "Current User",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDeductionTypes([...deductionTypes, deduction]);
    toast.success("Deduction type created successfully");
    setIsCreateDeductionOpen(false);
    resetDeductionForm();
  };

  // Handle deleting a deduction type
  const handleDeleteDeduction = () => {
    if (!selectedDeduction) return;
    setDeductionTypes(deductionTypes.filter((d) => d.id !== selectedDeduction.id));
    toast.success("Deduction type deleted successfully");
    setIsDeleteDeductionOpen(false);
    setSelectedDeduction(null);
  };

  // Handle creating a penalty
  const handleCreatePenalty = () => {
    const entity = penalizableEntities.find((e) => e.id === newPenalty.entityId);
    if (!entity) return;

    const penaltyTypeInfo = PENALTY_TYPES[newPenalty.penaltyType as keyof typeof PENALTY_TYPES];
    const calculatedAmount =
      newPenalty.calculationType === "percentage"
        ? (newPenalty.baseAmount * newPenalty.rate) / 100
        : newPenalty.amount;

    const penalty: PenaltyRecord = {
      id: `pr-${Date.now()}`,
      referenceNumber: `PEN-${new Date().getFullYear()}-${String(penaltyRecords.length + 1).padStart(4, "0")}`,
      entityId: entity.id,
      entityName: `${entity.name} (${entity.alias})`,
      entityType: entity.category as "DISCO" | "GENCO" | "BILATERAL",
      penaltyType: newPenalty.penaltyType,
      penaltyTypeName: penaltyTypeInfo?.name || newPenalty.penaltyType,
      reason: newPenalty.reason,
      violationDate: newPenalty.violationDate,
      calculationType: newPenalty.calculationType,
      baseAmount: newPenalty.calculationType === "percentage" ? newPenalty.baseAmount : undefined,
      rate: newPenalty.calculationType === "percentage" ? newPenalty.rate : undefined,
      amount: calculatedAmount,
      status: "pending",
      createdBy: "Current User",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPenaltyRecords([...penaltyRecords, penalty]);
    toast.success("Penalty created successfully");
    setIsCreatePenaltyOpen(false);
    resetPenaltyForm();
  };

  const resetDeductionForm = () => {
    setNewDeduction({
      code: "",
      name: "",
      description: "",
      calculationType: "percentage",
      defaultValue: 0,
      linkedServiceProviders: [],
    });
  };

  const resetPenaltyForm = () => {
    setNewPenalty({
      entityId: "",
      penaltyType: "" as "UGD" | "LPP" | "MRV" | "OTHER",
      reason: "",
      violationDate: "",
      calculationType: "fixed",
      baseAmount: 0,
      rate: 0,
      amount: 0,
    });
  };

  const toggleServiceProvider = (spId: string) => {
    setNewDeduction((prev) => ({
      ...prev,
      linkedServiceProviders: prev.linkedServiceProviders.includes(spId)
        ? prev.linkedServiceProviders.filter((id) => id !== spId)
        : [...prev.linkedServiceProviders, spId],
    }));
  };

  const getStatusBadge = (status: string) => {
    const statusColor = getStatusColor(status);
    return (
      <Badge variant="secondary" className={`${statusColor.bg} ${statusColor.text}`}>
        {status === "applied" && <CheckCircle className="mr-1 h-3 w-3" />}
        {status === "pending" && <Clock className="mr-1 h-3 w-3" />}
        {status === "approved" && <CheckCircle className="mr-1 h-3 w-3" />}
        {status === "disputed" && <AlertTriangle className="mr-1 h-3 w-3" />}
        {status === "waived" && <XCircle className="mr-1 h-3 w-3" />}
        {status}
      </Badge>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Deductions / Penalty</h1>
            <p className="text-muted-foreground">
              Manage deduction types and market rule violation penalties
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Deduction Types</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deductionTypes.length}</div>
              <p className="text-xs text-muted-foreground">
                {activeDeductions} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Penalties</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(totalPenaltyAmount)}
              </div>
              <p className="text-xs text-muted-foreground">
                {penaltyRecords.length} penalty records
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Penalties</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingPenalties}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Applied Penalties</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{appliedPenalties}</div>
              <p className="text-xs text-muted-foreground">Successfully applied</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="deductions">Deductions</TabsTrigger>
            <TabsTrigger value="penalties">Penalties</TabsTrigger>
          </TabsList>

          {/* Deductions Tab */}
          <TabsContent value="deductions" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>Deduction Types</CardTitle>
                    <CardDescription>
                      Configure deduction types and link them to service providers
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search deductions..."
                        className="pl-8 w-[200px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button onClick={() => setIsCreateDeductionOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Deduction Type
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Default Value</TableHead>
                      <TableHead>Linked Service Providers</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDeductions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="text-muted-foreground">
                            <Tag className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No deduction types found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDeductions.map((deduction) => (
                        <TableRow key={deduction.id}>
                          <TableCell>
                            <code className="bg-muted px-2 py-1 rounded text-sm">
                              {deduction.code}
                            </code>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{deduction.name}</p>
                              {deduction.description && (
                                <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                  {deduction.description}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {deduction.calculationType === "percentage" ? (
                                <><Percent className="h-3 w-3 mr-1" /> Percentage</>
                              ) : (
                                <><DollarSign className="h-3 w-3 mr-1" /> Fixed</>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {deduction.calculationType === "percentage"
                              ? `${deduction.defaultValue}%`
                              : formatCurrency(deduction.defaultValue || 0)}
                          </TableCell>
                          <TableCell>
                            {deduction.linkedServiceProviders.length === 0 ? (
                              <span className="text-muted-foreground text-sm">None</span>
                            ) : (
                              <span className="text-sm">
                                {deduction.linkedServiceProviders.length} provider(s)
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={deduction.status === "active" ? "default" : "secondary"}
                              className={
                                deduction.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }
                            >
                              {deduction.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedDeduction(deduction);
                                    setIsEditDeductionOpen(true);
                                  }}
                                >
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedDeduction(deduction);
                                    setIsDeleteDeductionOpen(true);
                                  }}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Penalties Tab */}
          <TabsContent value="penalties" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>Penalty Records</CardTitle>
                    <CardDescription>
                      Market rule violations by DISCOs, GENCOs, and Bilateral partners
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search penalties..."
                        className="pl-8 w-[180px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select value={penaltyStatusFilter} onValueChange={setPenaltyStatusFilter}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="applied">Applied</SelectItem>
                        <SelectItem value="disputed">Disputed</SelectItem>
                        <SelectItem value="waived">Waived</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={penaltyEntityFilter} onValueChange={setPenaltyEntityFilter}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Entity Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="DISCO">DISCO</SelectItem>
                        <SelectItem value="GENCO">GENCO</SelectItem>
                        <SelectItem value="BILATERAL">Bilateral</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={() => setIsCreatePenaltyOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Penalty
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>Penalty Type</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Violation Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPenalties.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="text-muted-foreground">
                            <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No penalty records found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPenalties.map((penalty) => (
                        <TableRow key={penalty.id}>
                          <TableCell>
                            <code className="text-sm font-medium">
                              {penalty.referenceNumber}
                            </code>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{penalty.entityName}</p>
                              <Badge variant="outline" className="text-xs">
                                {penalty.entityType}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{penalty.penaltyType}</Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {penalty.penaltyTypeName}
                            </p>
                          </TableCell>
                          <TableCell className="max-w-[200px]">
                            <p className="text-sm truncate">{penalty.reason}</p>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{formatDate(penalty.violationDate)}</span>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-bold text-red-600">
                                {formatCurrency(penalty.amount)}
                              </p>
                              {penalty.calculationType === "percentage" && (
                                <p className="text-xs text-muted-foreground">
                                  {penalty.rate}% of {formatCurrency(penalty.baseAmount || 0)}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(penalty.status)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Penalty Types Reference */}
            <Card>
              <CardHeader>
                <CardTitle>Penalty Type Reference</CardTitle>
                <CardDescription>Standard penalty categories for market rule violations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {Object.values(PENALTY_TYPES).map((type) => (
                    <div key={type.code} className="rounded-lg border p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{type.code}</Badge>
                        <span className="font-medium">{type.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Deduction Dialog */}
        <Dialog open={isCreateDeductionOpen} onOpenChange={setIsCreateDeductionOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Deduction Type</DialogTitle>
              <DialogDescription>
                Define a new deduction type and link it to service providers
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Code *</Label>
                  <Input
                    placeholder="e.g., TSP-FEE"
                    value={newDeduction.code}
                    onChange={(e) =>
                      setNewDeduction({ ...newDeduction, code: e.target.value.toUpperCase() })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Calculation Type *</Label>
                  <Select
                    value={newDeduction.calculationType}
                    onValueChange={(value) =>
                      setNewDeduction({
                        ...newDeduction,
                        calculationType: value as "fixed" | "percentage",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Name *</Label>
                <Input
                  placeholder="Deduction type name"
                  value={newDeduction.name}
                  onChange={(e) => setNewDeduction({ ...newDeduction, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Brief description of this deduction type"
                  rows={2}
                  value={newDeduction.description}
                  onChange={(e) =>
                    setNewDeduction({ ...newDeduction, description: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>
                  Default Value {newDeduction.calculationType === "percentage" ? "(%)" : "(NGN)"}
                </Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newDeduction.defaultValue || ""}
                  onChange={(e) =>
                    setNewDeduction({
                      ...newDeduction,
                      defaultValue: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Linked Service Providers</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Select service providers this deduction applies to
                </p>
                <div className="border rounded-lg p-3 max-h-[150px] overflow-y-auto space-y-2">
                  {serviceProviders.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">
                      No service providers available
                    </p>
                  ) : (
                    serviceProviders.map((sp) => (
                      <div key={sp.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`sp-${sp.id}`}
                          checked={newDeduction.linkedServiceProviders.includes(sp.id)}
                          onCheckedChange={() => toggleServiceProvider(sp.id)}
                        />
                        <Label
                          htmlFor={`sp-${sp.id}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {sp.alias} - {sp.name}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDeductionOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateDeduction}
                disabled={!newDeduction.code || !newDeduction.name}
              >
                Create Deduction
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Penalty Dialog */}
        <Dialog open={isCreatePenaltyOpen} onOpenChange={setIsCreatePenaltyOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Penalty</DialogTitle>
              <DialogDescription>
                Apply a penalty for market rule violations
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Entity *</Label>
                <Select
                  value={newPenalty.entityId}
                  onValueChange={(value) => setNewPenalty({ ...newPenalty, entityId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select entity" />
                  </SelectTrigger>
                  <SelectContent>
                    {penalizableEntities.map((entity) => (
                      <SelectItem key={entity.id} value={entity.id}>
                        <span className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {entity.category}
                          </Badge>
                          {entity.alias} - {entity.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Penalty Type *</Label>
                  <Select
                    value={newPenalty.penaltyType}
                    onValueChange={(value) =>
                      setNewPenalty({
                        ...newPenalty,
                        penaltyType: value as "UGD" | "LPP" | "MRV" | "OTHER",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(PENALTY_TYPES).map((type) => (
                        <SelectItem key={type.code} value={type.code}>
                          {type.code} - {type.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="OTHER">OTHER - Other Violation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Violation Date *</Label>
                  <Input
                    type="date"
                    value={newPenalty.violationDate}
                    onChange={(e) =>
                      setNewPenalty({ ...newPenalty, violationDate: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Reason *</Label>
                <Textarea
                  placeholder="Describe the market rule violation"
                  rows={2}
                  value={newPenalty.reason}
                  onChange={(e) => setNewPenalty({ ...newPenalty, reason: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Calculation Type *</Label>
                <Select
                  value={newPenalty.calculationType}
                  onValueChange={(value) =>
                    setNewPenalty({
                      ...newPenalty,
                      calculationType: value as "fixed" | "percentage",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newPenalty.calculationType === "percentage" ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Base Amount (NGN) *</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={newPenalty.baseAmount || ""}
                      onChange={(e) =>
                        setNewPenalty({
                          ...newPenalty,
                          baseAmount: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Rate (%) *</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newPenalty.rate || ""}
                      onChange={(e) =>
                        setNewPenalty({
                          ...newPenalty,
                          rate: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="grid gap-2">
                  <Label>Amount (NGN) *</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={newPenalty.amount || ""}
                    onChange={(e) =>
                      setNewPenalty({
                        ...newPenalty,
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              )}
              {newPenalty.calculationType === "percentage" &&
                newPenalty.baseAmount > 0 &&
                newPenalty.rate > 0 && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">
                      <strong>Calculated Amount:</strong>{" "}
                      {formatCurrency((newPenalty.baseAmount * newPenalty.rate) / 100)}
                    </p>
                  </div>
                )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreatePenaltyOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreatePenalty}
                disabled={
                  !newPenalty.entityId ||
                  !newPenalty.penaltyType ||
                  !newPenalty.reason ||
                  !newPenalty.violationDate
                }
              >
                Create Penalty
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Deduction Dialog */}
        <AlertDialog open={isDeleteDeductionOpen} onOpenChange={setIsDeleteDeductionOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Deduction Type</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &quot;{selectedDeduction?.name}&quot;? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteDeduction}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
}
