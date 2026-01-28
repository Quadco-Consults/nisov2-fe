"use client";

import { useState } from "react";
import {
  Building2,
  Plus,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Link as LinkIcon,
  Banknote,
  Shield,
  Star,
  Filter,
  Percent,
  Trash2,
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
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils/formatters";
import {
  ENTITY_CATEGORIES,
  ENTITY_REGISTRATION_STATUSES,
  NIGERIAN_STATES,
} from "@/lib/constants";
import { mockRegisteredEntities } from "@/server/services/mock-data";

const categoryIcons = {
  DISCO: Building2,
  GENCO: Building2,
  SERVICE_PROVIDER: Shield,
  SERC: Building2,
  BILATERAL: LinkIcon,
};

// Types for SERC service provider allocations
interface ServiceProviderAllocation {
  serviceProviderId: string;
  percentage: number;
}

export default function EntitiesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newEntityCategory, setNewEntityCategory] = useState("");

  // SERC-specific state
  const [selectedDiscos, setSelectedDiscos] = useState<string[]>([]);
  const [spAllocations, setSpAllocations] = useState<ServiceProviderAllocation[]>([]);
  const [selectedState, setSelectedState] = useState<string>("");

  // Get DISCOs and Service Providers from mock data
  const availableDiscos = mockRegisteredEntities.filter(
    (e) => e.category === "DISCO" && e.registrationStatus === "active"
  );
  const availableServiceProviders = mockRegisteredEntities.filter(
    (e) => e.category === "SERVICE_PROVIDER" && e.registrationStatus === "active"
  );

  // Handle adding a DISCO for SERC
  const handleAddDisco = () => {
    const availableDisco = availableDiscos.find(
      (disco) => !selectedDiscos.includes(disco.id)
    );
    if (availableDisco) {
      setSelectedDiscos((prev) => [...prev, availableDisco.id]);
    }
  };

  // Handle removing a DISCO
  const handleRemoveDisco = (discoId: string) => {
    setSelectedDiscos((prev) => prev.filter((id) => id !== discoId));
  };

  // Handle changing a DISCO selection
  const handleDiscoChange = (oldDiscoId: string, newDiscoId: string) => {
    setSelectedDiscos((prev) =>
      prev.map((id) => (id === oldDiscoId ? newDiscoId : id))
    );
  };

  // Handle adding a service provider allocation
  const handleAddSpAllocation = () => {
    const availableSp = availableServiceProviders.find(
      (sp) => !spAllocations.some((alloc) => alloc.serviceProviderId === sp.id)
    );
    if (availableSp) {
      setSpAllocations((prev) => [
        ...prev,
        { serviceProviderId: availableSp.id, percentage: 0 },
      ]);
    }
  };

  // Handle removing a service provider allocation
  const handleRemoveSpAllocation = (serviceProviderId: string) => {
    setSpAllocations((prev) =>
      prev.filter((alloc) => alloc.serviceProviderId !== serviceProviderId)
    );
  };

  // Reset SERC fields when category changes
  const handleCategoryChange = (category: string) => {
    setNewEntityCategory(category);
    if (category !== "SERC") {
      setSelectedDiscos([]);
      setSpAllocations([]);
      setSelectedState("");
    }
  };

  const filteredEntities = mockRegisteredEntities.filter((entity) => {
    const matchesCategory =
      selectedCategory === "all" || entity.category === selectedCategory;
    const matchesSearch =
      entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.alias.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categoryCounts = {
    all: mockRegisteredEntities.length,
    DISCO: mockRegisteredEntities.filter((e) => e.category === "DISCO").length,
    GENCO: mockRegisteredEntities.filter((e) => e.category === "GENCO").length,
    SERVICE_PROVIDER: mockRegisteredEntities.filter(
      (e) => e.category === "SERVICE_PROVIDER"
    ).length,
    SERC: mockRegisteredEntities.filter((e) => e.category === "SERC").length,
    BILATERAL: mockRegisteredEntities.filter((e) => e.category === "BILATERAL")
      .length,
  };

  const activeEntities = mockRegisteredEntities.filter(
    (e) => e.registrationStatus === "active"
  ).length;
  const pendingEntities = mockRegisteredEntities.filter(
    (e) => e.registrationStatus === "pending_validation"
  ).length;
  const prioritySPs = mockRegisteredEntities.filter((e) => e.isPrioritySP)
    .length;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Entity Registry</h1>
            <p className="text-muted-foreground">
              Master Data Directory for all market participants
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Register Entity
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Register New Entity</DialogTitle>
                <DialogDescription>
                  Create a new market participant in the registry
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Unique Alias *</Label>
                    <Input placeholder="e.g., IKEDC, EGBIN" />
                    <p className="text-xs text-muted-foreground">
                      Market identifier (must be unique)
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label>Category *</Label>
                    <Select value={newEntityCategory} onValueChange={handleCategoryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ENTITY_CATEGORIES).map((cat) => (
                          <SelectItem key={cat.code} value={cat.code}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Full Name *</Label>
                  <Input placeholder="Legal entity name" />
                </div>
                <div className="grid gap-2">
                  <Label>Description</Label>
                  <Input placeholder="Brief description of the entity" />
                </div>

                {/* Contact Information */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Contact Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Contact Person</Label>
                      <Input placeholder="Full name" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Phone</Label>
                      <Input placeholder="+234 xxx xxx xxxx" />
                    </div>
                  </div>
                  <div className="grid gap-2 mt-4">
                    <Label>Email</Label>
                    <Input type="email" placeholder="email@domain.com" />
                  </div>
                  <div className="grid gap-2 mt-4">
                    <Label>Address</Label>
                    <Input placeholder="Full address" />
                  </div>
                </div>

                {/* Bank Details (Remita Integration) */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">
                    Bank Details (Remita Integration)
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Bank Name *</Label>
                      <Input placeholder="Bank name" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Bank Code</Label>
                      <Input placeholder="e.g., 011" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="grid gap-2">
                      <Label>Account Number *</Label>
                      <Input placeholder="10-digit NUBAN" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Account Name *</Label>
                      <Input placeholder="Account holder name" />
                    </div>
                  </div>
                </div>

                {/* Service Provider Settings - Only show for Service Providers */}
                {newEntityCategory === "SERVICE_PROVIDER" && (
                  <>
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">Entity Type Linkage</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Select the entity types this service provider will be linked to for disbursements
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.values(ENTITY_CATEGORIES)
                          .filter((cat) => cat.code !== "SERVICE_PROVIDER")
                          .map((cat) => (
                            <div key={cat.code} className="flex items-center space-x-2">
                              <Checkbox id={`linkage-${cat.code}`} />
                              <Label
                                htmlFor={`linkage-${cat.code}`}
                                className="text-sm font-normal cursor-pointer"
                              >
                                {cat.name}
                              </Label>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Priority Flag - Only for Service Providers */}
                    <div className="border-t pt-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="isPriority" />
                        <Label htmlFor="isPriority" className="font-normal cursor-pointer">
                          Mark as Priority Service Provider
                        </Label>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Priority SPs are moved to Tier 1 of the Disbursement
                        Waterfall
                      </p>
                    </div>
                  </>
                )}

                {/* SERC Settings - Only show for State Regulatory Commission */}
                {newEntityCategory === "SERC" && (
                  <>
                    {/* State Selection */}
                    <div className="border-t pt-4">
                      <div className="grid gap-2">
                        <Label htmlFor="sercState">State *</Label>
                        <Select value={selectedState} onValueChange={setSelectedState}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {NIGERIAN_STATES.map((state) => (
                              <SelectItem key={state.code} value={state.code}>
                                {state.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          The Nigerian state this regulatory commission operates in
                        </p>
                      </div>
                    </div>

                    {/* Linked DISCOs */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">Linked DISCOs</h4>
                          <p className="text-sm text-muted-foreground">
                            Select the Distribution Companies (DISCOs) operating in this SERC&apos;s jurisdiction
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAddDisco}
                          disabled={selectedDiscos.length >= availableDiscos.length}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>

                      {selectedDiscos.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic text-center py-4 border rounded-lg bg-muted/30">
                          No DISCOs linked. Click &quot;Add&quot; to select DISCOs.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {selectedDiscos.map((discoId, index) => {
                            const disco = availableDiscos.find((d) => d.id === discoId);
                            return (
                              <div
                                key={discoId}
                                className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30"
                              >
                                <div className="flex-1">
                                  <Select
                                    value={discoId}
                                    onValueChange={(value) => handleDiscoChange(discoId, value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select DISCO" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {availableDiscos
                                        .filter(
                                          (d) =>
                                            d.id === discoId ||
                                            !selectedDiscos.includes(d.id)
                                        )
                                        .map((d) => (
                                          <SelectItem key={d.id} value={d.id}>
                                            {d.alias} - {d.name}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveDisco(discoId)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Service Provider Allocations */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">Service Provider Allocations</h4>
                          <p className="text-sm text-muted-foreground">
                            Configure what percentage of payments from each service provider goes to this SERC
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAddSpAllocation}
                          disabled={spAllocations.length >= availableServiceProviders.length}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>

                      {spAllocations.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic text-center py-4 border rounded-lg bg-muted/30">
                          No service provider allocations added. Click &quot;Add&quot; to configure.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {spAllocations.map((allocation, index) => {
                            const selectedSp = availableServiceProviders.find(
                              (sp) => sp.id === allocation.serviceProviderId
                            );
                            return (
                              <div
                                key={allocation.serviceProviderId}
                                className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30"
                              >
                                <div className="flex-1">
                                  <Label className="text-xs text-muted-foreground">
                                    Service Provider
                                  </Label>
                                  <Select
                                    value={allocation.serviceProviderId}
                                    onValueChange={(value) => {
                                      // Update the allocation with new SP ID
                                      setSpAllocations((prev) =>
                                        prev.map((alloc, i) =>
                                          i === index
                                            ? { ...alloc, serviceProviderId: value }
                                            : alloc
                                        )
                                      );
                                    }}
                                  >
                                    <SelectTrigger className="mt-1">
                                      <SelectValue placeholder="Select service provider" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {availableServiceProviders
                                        .filter(
                                          (sp) =>
                                            sp.id === allocation.serviceProviderId ||
                                            !spAllocations.some(
                                              (alloc) => alloc.serviceProviderId === sp.id
                                            )
                                        )
                                        .map((sp) => (
                                          <SelectItem key={sp.id} value={sp.id}>
                                            {sp.alias} - {sp.name}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="w-[120px]">
                                  <Label className="text-xs text-muted-foreground">
                                    Percentage
                                  </Label>
                                  <div className="flex items-center gap-1 mt-1">
                                    <Input
                                      type="number"
                                      min="0"
                                      max="100"
                                      step="0.01"
                                      value={allocation.percentage}
                                      onChange={(e) =>
                                        setSpAllocations((prev) =>
                                          prev.map((alloc, i) =>
                                            i === index
                                              ? {
                                                  ...alloc,
                                                  percentage: parseFloat(e.target.value) || 0,
                                                }
                                              : alloc
                                          )
                                        )
                                      }
                                      className="text-right"
                                    />
                                    <Percent className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleRemoveSpAllocation(allocation.serviceProviderId)
                                  }
                                  className="text-destructive hover:text-destructive mt-5"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {spAllocations.length > 0 && (
                        <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <p className="text-xs text-blue-700 dark:text-blue-300">
                            <strong>Note:</strong> Multiple SERCs can receive percentages from the same
                            service provider. Ensure total allocations from each service provider
                            don&apos;t exceed 100%.
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Submit for Validation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Entities
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockRegisteredEntities.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Registered in the system
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Active Entities
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {activeEntities}
              </div>
              <p className="text-xs text-muted-foreground">
                Validated and operational
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Validation
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {pendingEntities}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting Remita & regulatory checks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Priority SPs</CardTitle>
              <Star className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {prioritySPs}
              </div>
              <p className="text-xs text-muted-foreground">
                Tier 1 Waterfall allocation
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Player Taxonomy Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Player Taxonomy</CardTitle>
            <CardDescription>
              Market participant classification by functional group
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-5">
              {Object.values(ENTITY_CATEGORIES).map((cat) => (
                <div
                  key={cat.code}
                  className={`rounded-lg border p-4 cursor-pointer transition-colors ${
                    selectedCategory === cat.code
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === cat.code ? "all" : cat.code
                    )
                  }
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{cat.name}</span>
                    <Badge variant="secondary">
                      {categoryCounts[cat.code as keyof typeof categoryCounts]}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {cat.description}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {cat.canBePayer && (
                      <Badge variant="outline" className="text-xs">
                        Payor
                      </Badge>
                    )}
                    {cat.canBePayee && (
                      <Badge variant="outline" className="text-xs">
                        Payee
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Entity Registry Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Registered Entities</CardTitle>
                <CardDescription>
                  {selectedCategory === "all"
                    ? "All market participants"
                    : `${
                        ENTITY_CATEGORIES[
                          selectedCategory as keyof typeof ENTITY_CATEGORIES
                        ]?.name || selectedCategory
                      } entities`}
                </CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or alias..."
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
                  <TableHead>Entity</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Bank Details</TableHead>
                  <TableHead>Remita</TableHead>
                  <TableHead>Linkage</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntities.map((entity) => {
                  const statusConfig =
                    ENTITY_REGISTRATION_STATUSES[
                      entity.registrationStatus as keyof typeof ENTITY_REGISTRATION_STATUSES
                    ];
                  const statusColor = getStatusColor(entity.registrationStatus);

                  return (
                    <TableRow key={entity.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {entity.isPrioritySP && (
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          )}
                          <div>
                            <p className="font-medium">{entity.alias}</p>
                            <p className="text-xs text-muted-foreground">
                              {entity.name}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {
                            ENTITY_CATEGORIES[
                              entity.category as keyof typeof ENTITY_CATEGORIES
                            ]?.name || entity.category
                          }
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{entity.bankDetails.bankName}</p>
                          <p className="text-xs text-muted-foreground">
                            {entity.bankDetails.accountNumber}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {entity.remitaValidated ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-xs">Validated</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-yellow-600">
                            <Clock className="h-4 w-4" />
                            <span className="text-xs">Pending</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {entity.linkedServiceProviderName ? (
                          <div className="flex items-center gap-1">
                            <LinkIcon className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">
                              {entity.linkedServiceProviderName}
                            </span>
                          </div>
                        ) : entity.isPrioritySP ? (
                          <Badge className="text-xs bg-blue-100 text-blue-700">
                            Tier {entity.waterfallTier}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {formatCurrency(entity.currentBalance)}
                          </p>
                          {entity.outstandingDebt > 0 && (
                            <p className="text-xs text-red-600">
                              Debt: {formatCurrency(entity.outstandingDebt)}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`${statusColor.bg} ${statusColor.text}`}
                        >
                          {statusConfig?.label || entity.registrationStatus}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Registration Workflow Info */}
        <Card>
          <CardHeader>
            <CardTitle>Registration Workflow</CardTitle>
            <CardDescription>
              Entity validation and activation process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium">Draft</p>
                    <p className="text-xs text-muted-foreground">Data entry</p>
                  </div>
                </div>
                <div className="h-px w-8 bg-border" />
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium">Validation</p>
                    <p className="text-xs text-muted-foreground">
                      Remita & regulatory
                    </p>
                  </div>
                </div>
                <div className="h-px w-8 bg-border" />
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-medium">Validated</p>
                    <p className="text-xs text-muted-foreground">
                      Approved for activation
                    </p>
                  </div>
                </div>
                <div className="h-px w-8 bg-border" />
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    4
                  </div>
                  <div>
                    <p className="text-sm font-medium">Active</p>
                    <p className="text-xs text-muted-foreground">Operational</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
