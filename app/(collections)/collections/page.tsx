"use client";

import { useState, useMemo, useEffect, Fragment } from "react";
import {
  DollarSign,
  Plus,
  Lock,
  Unlock,
  CheckCircle,
  Clock,
  FileText,
  Search,
  Upload,
  X,
  AlertCircle,
  ChevronDown,
  ChevronRight,
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  formatCurrency,
  getStatusColor,
} from "@/lib/utils/formatters";
import {
  mockCollections,
  mockCollectionSummary,
  mockRegisteredEntities,
  mockChargeTypes,
} from "@/server/services/mock-data";
import type { SettlementPaymentLine } from "@/types";

// Generate month options for the past 12 months and next 3 months
const generateMonthOptions = () => {
  const options = [];
  const today = new Date();

  // Past 12 months
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    options.push({
      value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      label: date.toLocaleDateString("en-US", { year: "numeric", month: "long" }),
    });
  }

  // Next 3 months
  for (let i = 1; i <= 3; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
    options.push({
      value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      label: date.toLocaleDateString("en-US", { year: "numeric", month: "long" }),
    });
  }

  return options;
};

const monthOptions = generateMonthOptions();

// Entity types for settlement
const SETTLEMENT_ENTITY_TYPES = [
  { value: "DISCO", label: "Distribution Company (DISCO)" },
  { value: "GENCO", label: "Generation Company (GENCO)" },
  { value: "BILATERAL", label: "Bilateral Partner" },
] as const;

export default function CollectionsPage() {
  const [selectedTab, setSelectedTab] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Settlement Registration Dialog State
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [selectedEntityType, setSelectedEntityType] = useState<string>("");
  const [selectedEntityId, setSelectedEntityId] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [paymentLines, setPaymentLines] = useState<SettlementPaymentLine[]>([]);

  // Bulk Upload Dialog State
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  // Get entities filtered by selected type
  const availableEntities = useMemo(() => {
    if (!selectedEntityType) return [];
    return mockRegisteredEntities.filter(
      (e) => e.category === selectedEntityType && e.registrationStatus === "active"
    );
  }, [selectedEntityType]);

  // Get service providers
  const serviceProviders = useMemo(() => {
    return mockRegisteredEntities.filter(
      (e) => e.category === "SERVICE_PROVIDER" && e.registrationStatus === "active"
    );
  }, []);

  // Generate payment lines when entity is selected
  useEffect(() => {
    if (!selectedEntityId || !selectedEntityType) {
      setPaymentLines([]);
      return;
    }

    const selectedEntity = mockRegisteredEntities.find((e) => e.id === selectedEntityId);
    if (!selectedEntity) {
      setPaymentLines([]);
      return;
    }

    // Find applicable charge types for this entity type
    const applicableCharges = mockChargeTypes.filter((charge) => {
      if (charge.status !== "active") return false;
      if (charge.hasSubCharges) return false; // Skip composite charges for now

      // Check if charge applies to this entity type or ALL
      return charge.entityType === selectedEntityType || charge.entityType === "ALL";
    });

    // Generate payment lines for each charge type + service provider combination
    const lines: SettlementPaymentLine[] = [];

    applicableCharges.forEach((charge) => {
      if (!charge.code || !charge.linkedServiceProviders) return;

      charge.linkedServiceProviders.forEach((spId) => {
        const sp = serviceProviders.find((s) => s.id === spId);
        if (!sp) return;

        lines.push({
          chargeCode: charge.code,
          chargeName: charge.name,
          serviceProviderId: sp.id,
          serviceProviderAlias: sp.alias,
          serviceProviderName: sp.name,
          paymentIdentifier: `${charge.code}-${sp.alias}`,
          amount: 0,
        });
      });
    });

    setPaymentLines(lines);
  }, [selectedEntityId, selectedEntityType, serviceProviders]);

  // Handle amount change for a payment line
  const handleAmountChange = (index: number, amount: number) => {
    setPaymentLines((prev) =>
      prev.map((line, i) => (i === index ? { ...line, amount } : line))
    );
  };

  // Calculate total amount
  const totalAmount = useMemo(() => {
    return paymentLines.reduce((sum, line) => sum + (line.amount || 0), 0);
  }, [paymentLines]);

  // Handle settlement submission
  const handleSubmitSettlement = () => {
    const entity = mockRegisteredEntities.find((e) => e.id === selectedEntityId);
    if (!entity || !selectedMonth) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (paymentLines.some((line) => line.amount <= 0)) {
      toast.error("Please enter amounts for all payment lines");
      return;
    }

    // In a real app, this would submit to the backend
    toast.success(`Settlement registered for ${entity.alias} - ${selectedMonth}`);
    handleCloseDialog();
  };

  // Reset and close dialog
  const handleCloseDialog = () => {
    setSelectedEntityType("");
    setSelectedEntityId("");
    setSelectedMonth("");
    setPaymentLines([]);
    setIsRegisterDialogOpen(false);
  };

  // Handle entity type change
  const handleEntityTypeChange = (value: string) => {
    setSelectedEntityType(value);
    setSelectedEntityId(""); // Reset entity selection
    setPaymentLines([]); // Clear payment lines
  };

  // Get unique charge codes for tabs (from charge types)
  const chargeCodes = useMemo(() => {
    return mockChargeTypes
      .filter((ct) => ct.code && ct.status === "active" && !ct.hasSubCharges)
      .map((ct) => ({ code: ct.code!, name: ct.name }));
  }, []);

  // Set default selected tab to first charge code
  useEffect(() => {
    if (chargeCodes.length > 0 && !selectedTab) {
      setSelectedTab(chargeCodes[0].code);
    }
  }, [chargeCodes, selectedTab]);

  // Aggregate collections by entity for the selected charge type
  const aggregatedCollections = useMemo(() => {
    // Filter collections for selected charge code
    const filtered = mockCollections.filter(
      (c) => c.chargeCode === selectedTab
    );

    // Group by entity + period
    const grouped = new Map<
      string,
      {
        entityId: string;
        entityAlias: string;
        entityName: string;
        entityType: "DISCO" | "GENCO" | "BILATERAL";
        period: string;
        totalAmount: number;
        paymentBreakdown: Array<{
          paymentId: string;
          serviceProviderAlias: string;
          amount: number;
          status: string;
        }>;
        overallStatus: string;
        auditLocked: boolean;
      }
    >();

    filtered.forEach((collection) => {
      const key = `${collection.entityId}-${collection.period}`;
      const existing = grouped.get(key);

      if (existing) {
        existing.totalAmount += collection.amount;
        existing.paymentBreakdown.push({
          paymentId: collection.paymentId,
          serviceProviderAlias: collection.serviceProviderAlias,
          amount: collection.amount,
          status: collection.status,
        });
        // Update overall status (use worst status)
        if (collection.status === "pending" || existing.overallStatus === "pending") {
          existing.overallStatus = "pending";
        } else if (collection.status === "verified" && existing.overallStatus !== "pending") {
          existing.overallStatus = "verified";
        }
        // Only locked if all are locked
        existing.auditLocked = existing.auditLocked && collection.auditLocked;
      } else {
        grouped.set(key, {
          entityId: collection.entityId,
          entityAlias: collection.entityAlias,
          entityName: collection.entityName,
          entityType: collection.entityType,
          period: collection.period,
          totalAmount: collection.amount,
          paymentBreakdown: [
            {
              paymentId: collection.paymentId,
              serviceProviderAlias: collection.serviceProviderAlias,
              amount: collection.amount,
              status: collection.status,
            },
          ],
          overallStatus: collection.status,
          auditLocked: collection.auditLocked,
        });
      }
    });

    return Array.from(grouped.values());
  }, [selectedTab]);

  // Filter aggregated collections by search
  const filteredCollections = useMemo(() => {
    if (!searchQuery) return aggregatedCollections;
    return aggregatedCollections.filter(
      (item) =>
        item.entityAlias.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.period.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [aggregatedCollections, searchQuery]);

  // Toggle row expansion
  const toggleRowExpansion = (key: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // Get selected charge name
  const selectedChargeName = useMemo(() => {
    const charge = chargeCodes.find((c) => c.code === selectedTab);
    return charge?.name || "";
  }, [chargeCodes, selectedTab]);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Collections</h1>
            <p className="text-muted-foreground">
              Settlement registration and collections management
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsBulkUploadOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Bulk Upload
            </Button>
            <Button onClick={() => setIsRegisterDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Register Settlement
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Collections
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(mockCollectionSummary.totalCollections)}
              </div>
              <p className="text-xs text-muted-foreground">
                Current period settlements
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Brought Forward
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(mockCollectionSummary.broughtForward)}
              </div>
              <p className="text-xs text-muted-foreground">
                Legacy debt carried over
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Applied Credits
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                -{formatCurrency(mockCollectionSummary.appliedCredits)}
              </div>
              <p className="text-xs text-muted-foreground">
                Deducted from balance
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Grand Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(mockCollectionSummary.grandTotal)}
              </div>
              <p className="text-xs text-muted-foreground">
                Recursive balance total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charge Code Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Charge Code Breakdown</CardTitle>
            <CardDescription>
              Collections by charge code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {mockCollectionSummary.byChargeCode.map((item) => (
                <div
                  key={item.code}
                  className="rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="text-sm font-medium text-muted-foreground">
                    {item.code}
                  </div>
                  <div className="text-xl font-bold mt-1">
                    {formatCurrency(item.amount)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {item.count} entries
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Collections Table with Tabs */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Collection Entries</CardTitle>
                <CardDescription>
                  Manage and track settlement collections
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search collections..."
                    className="pl-8 w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="flex-wrap h-auto gap-1">
                {chargeCodes.map((charge) => (
                  <TabsTrigger key={charge.code} value={charge.code}>
                    {charge.code}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value={selectedTab} className="mt-4">
                {selectedChargeName && (
                  <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">{selectedTab}</span>
                      <span className="text-muted-foreground"> - {selectedChargeName}</span>
                    </p>
                  </div>
                )}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead className="text-right">Total Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Audit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCollections.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No collections found for this charge type
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCollections.map((item) => {
                        const rowKey = `${item.entityId}-${item.period}`;
                        const isExpanded = expandedRows.has(rowKey);
                        const statusColor = getStatusColor(item.overallStatus);
                        const hasMultiplePayments = item.paymentBreakdown.length > 1;

                        return (
                          <Fragment key={rowKey}>
                            <TableRow
                              className={hasMultiplePayments ? "cursor-pointer hover:bg-muted/50" : ""}
                              onClick={() => hasMultiplePayments && toggleRowExpansion(rowKey)}
                            >
                              <TableCell>
                                {hasMultiplePayments && (
                                  isExpanded ? (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                  )
                                )}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium">
                                    {item.entityAlias}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {item.entityName} ({item.entityType})
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>{item.period}</TableCell>
                              <TableCell className="text-right font-semibold">
                                {formatCurrency(item.totalAmount)}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="secondary"
                                  className={`${statusColor.bg} ${statusColor.text}`}
                                >
                                  {item.overallStatus}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {item.auditLocked ? (
                                  <div className="flex items-center gap-1 text-green-600">
                                    <Lock className="h-4 w-4" />
                                    <span className="text-xs">Locked</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <Unlock className="h-4 w-4" />
                                    <span className="text-xs">Open</span>
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                            {/* Expanded Payment Breakdown */}
                            {isExpanded && (
                              <TableRow className="bg-muted/30">
                                <TableCell colSpan={6} className="p-0">
                                  <div className="px-8 py-3">
                                    <p className="text-xs font-medium text-muted-foreground mb-2">
                                      Payment Breakdown by Service Provider
                                    </p>
                                    <div className="grid gap-2">
                                      {item.paymentBreakdown.map((payment) => {
                                        const paymentStatusColor = getStatusColor(payment.status);
                                        return (
                                          <div
                                            key={payment.paymentId}
                                            className="flex items-center justify-between bg-background rounded-md px-4 py-2 border"
                                          >
                                            <div className="flex items-center gap-4">
                                              <code className="bg-muted px-2 py-1 rounded text-xs font-medium">
                                                {payment.paymentId}
                                              </code>
                                              <span className="text-sm text-muted-foreground">
                                                {payment.serviceProviderAlias}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                              <span className="font-medium">
                                                {formatCurrency(payment.amount)}
                                              </span>
                                              <Badge
                                                variant="secondary"
                                                className={`${paymentStatusColor.bg} ${paymentStatusColor.text} text-xs`}
                                              >
                                                {payment.status}
                                              </Badge>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </Fragment>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Register Settlement Dialog */}
        <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Register New Settlement</DialogTitle>
              <DialogDescription>
                Select entity type and entity to view applicable charges and service providers
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Step 1: Entity Type Selection */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Entity Type *</Label>
                  <Select value={selectedEntityType} onValueChange={handleEntityTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select entity type" />
                    </SelectTrigger>
                    <SelectContent>
                      {SETTLEMENT_ENTITY_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Settlement Period *</Label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {monthOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Step 2: Entity Selection */}
              {selectedEntityType && (
                <div className="grid gap-2">
                  <Label>Select Entity *</Label>
                  <Select value={selectedEntityId} onValueChange={setSelectedEntityId}>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${selectedEntityType}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableEntities.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">
                          No active {selectedEntityType}s found
                        </div>
                      ) : (
                        availableEntities.map((entity) => (
                          <SelectItem key={entity.id} value={entity.id}>
                            <span className="font-medium">{entity.alias}</span>
                            <span className="text-muted-foreground ml-2">- {entity.name}</span>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Step 3: Payment Lines */}
              {selectedEntityId && paymentLines.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">Payment Lines</h3>
                        <p className="text-sm text-muted-foreground">
                          Enter amounts for each charge type and service provider combination
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        {paymentLines.length} line(s)
                      </Badge>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead>Payment ID</TableHead>
                            <TableHead className="text-right">Amount (NGN)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paymentLines.map((line, index) => (
                            <TableRow key={line.paymentIdentifier}>
                              <TableCell>
                                <code className="bg-muted px-2 py-1 rounded text-sm font-medium">
                                  {line.paymentIdentifier}
                                </code>
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  placeholder="0.00"
                                  className="w-[180px] text-right ml-auto"
                                  value={line.amount || ""}
                                  onChange={(e) =>
                                    handleAmountChange(index, parseFloat(e.target.value) || 0)
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Total */}
                    <div className="mt-4 flex justify-end">
                      <div className="bg-muted rounded-lg p-4 min-w-[250px]">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Total Settlement Amount</span>
                          <span className="text-xl font-bold">
                            {formatCurrency(totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* No charges message */}
              {selectedEntityId && paymentLines.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No applicable charges found for this entity type.</p>
                  <p className="text-sm">Please configure charge types in Settings.</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmitSettlement}
                disabled={
                  !selectedEntityId ||
                  !selectedMonth ||
                  paymentLines.length === 0 ||
                  totalAmount <= 0
                }
              >
                Register Settlement
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bulk Upload Dialog */}
        <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Bulk Settlement Upload</DialogTitle>
              <DialogDescription>
                Upload a CSV or Excel file with multiple settlement entries
              </DialogDescription>
            </DialogHeader>

            <div className="py-6">
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop your file here, or click to browse
                </p>
                <Input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  id="bulk-upload"
                />
                <Button variant="outline" asChild>
                  <label htmlFor="bulk-upload" className="cursor-pointer">
                    Choose File
                  </label>
                </Button>
              </div>

              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-medium text-sm mb-2">File Format Requirements</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Accepted formats: CSV, XLSX, XLS</li>
                  <li>• Required columns: Entity Alias, Settlement Period, Payment ID, Amount</li>
                  <li>• Payment ID format: ChargeCode-ServiceProviderAlias (e.g., MET.TSP-TCN)</li>
                  <li>• Maximum file size: 10MB</li>
                </ul>
                <Button variant="link" className="text-xs p-0 h-auto mt-2">
                  Download Template
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsBulkUploadOpen(false)}>
                Cancel
              </Button>
              <Button disabled>
                Upload & Process
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
