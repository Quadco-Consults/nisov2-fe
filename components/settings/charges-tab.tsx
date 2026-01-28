"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronRight,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { CreateChargeDialog } from "./create-charge-dialog";
import { EditChargeDialog } from "./edit-charge-dialog";
import { ChargeType } from "@/types";
import { ENTITY_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ChargesTabProps {
  charges: ChargeType[];
  onChargesChange: (charges: ChargeType[]) => void;
}

// Helper to get entity type display name
const getEntityTypeDisplayName = (entityType: string) => {
  if (entityType === "ALL") return "All Types";
  const category = ENTITY_CATEGORIES[entityType as keyof typeof ENTITY_CATEGORIES];
  return category ? category.name : entityType;
};

// Entity type filter options
const entityTypeFilterOptions = [
  { value: "all", label: "All Entity Types" },
  { value: "ALL", label: "General (All Types)" },
  ...Object.values(ENTITY_CATEGORIES).map((cat) => ({
    value: cat.code,
    label: cat.name,
  })),
];

export function ChargesTab({ charges, onChargesChange }: ChargesTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">(
    "all"
  );
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>("all");
  const [expandedCharges, setExpandedCharges] = useState<Set<string>>(new Set());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCharge, setSelectedCharge] = useState<ChargeType | null>(null);

  // Filter charges
  const filteredCharges = charges.filter((charge) => {
    const matchesSearch =
      charge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      charge.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      charge.subCharges?.some(
        (sub) =>
          sub.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "all" || charge.status === statusFilter;

    let matchesEntityType = entityTypeFilter === "all";
    if (!matchesEntityType) {
      if (charge.hasSubCharges) {
        matchesEntityType =
          charge.subCharges?.some((sub) => sub.entityType === entityTypeFilter) ??
          false;
      } else {
        matchesEntityType = charge.entityType === entityTypeFilter;
      }
    }

    return matchesSearch && matchesStatus && matchesEntityType;
  });

  const toggleExpanded = (chargeId: string) => {
    setExpandedCharges((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(chargeId)) {
        newSet.delete(chargeId);
      } else {
        newSet.add(chargeId);
      }
      return newSet;
    });
  };

  const handleCreateCharge = (charge: ChargeType) => {
    onChargesChange([...charges, charge]);
  };

  const handleUpdateCharge = (updatedCharge: ChargeType) => {
    onChargesChange(
      charges.map((c) => (c.id === updatedCharge.id ? updatedCharge : c))
    );
  };

  const handleDeleteCharge = () => {
    if (!selectedCharge) return;
    onChargesChange(charges.filter((c) => c.id !== selectedCharge.id));
    toast.success("Charge type deleted successfully");
    setIsDeleteDialogOpen(false);
    setSelectedCharge(null);
  };

  const handleEditClick = (charge: ChargeType) => {
    setSelectedCharge(charge);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (charge: ChargeType) => {
    setSelectedCharge(charge);
    setIsDeleteDialogOpen(true);
  };

  // Stats
  const activeCharges = charges.filter((c) => c.status === "active").length;
  const totalSubCharges = charges.reduce(
    (sum, c) => sum + (c.subCharges?.length || 0),
    0
  );
  const chargesWithSubCharges = charges.filter((c) => c.hasSubCharges).length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Charge Types</CardDescription>
            <CardTitle className="text-2xl">{charges.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Charges</CardDescription>
            <CardTitle className="text-2xl text-green-600">{activeCharges}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Composite Charges</CardDescription>
            <CardTitle className="text-2xl">{chargesWithSubCharges}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Sub-charges</CardDescription>
            <CardTitle className="text-2xl">{totalSubCharges}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search charges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as "all" | "active" | "inactive")
            }
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Entity Type" />
            </SelectTrigger>
            <SelectContent>
              {entityTypeFilterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Charge Type
        </Button>
      </div>

      {/* Charges Table */}
      <Card>
        <CardHeader>
          <CardTitle>Charge Types</CardTitle>
          <CardDescription>
            Manage charge types and their configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Code / Sub-charges</TableHead>
                <TableHead>Entity Type</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCharges.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="text-muted-foreground">
                      <Tag className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No charge types found</p>
                      {searchQuery && (
                        <p className="text-sm">
                          Try adjusting your search or filters
                        </p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCharges.map((charge) => (
                  <>
                    <TableRow key={charge.id}>
                      <TableCell>
                        {charge.hasSubCharges && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => toggleExpanded(charge.id)}
                          >
                            {expandedCharges.has(charge.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{charge.name}</span>
                        </div>
                        {charge.description && (
                          <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                            {charge.description}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        {charge.hasSubCharges ? (
                          <span className="text-sm text-muted-foreground">
                            {charge.subCharges?.length || 0} sub-charge(s)
                          </span>
                        ) : (
                          <code className="bg-muted px-2 py-1 rounded text-sm">
                            {charge.code}
                          </code>
                        )}
                      </TableCell>
                      <TableCell>
                        {charge.hasSubCharges ? (
                          <span className="text-sm text-muted-foreground">
                            Multiple
                          </span>
                        ) : (
                          <Badge variant="outline">
                            {getEntityTypeDisplayName(charge.entityType || "ALL")}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {charge.hasSubCharges ? "Composite" : "Simple"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            charge.status === "active" ? "default" : "secondary"
                          }
                          className={cn(
                            charge.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                          )}
                        >
                          {charge.status}
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
                              onClick={() => handleEditClick(charge)}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(charge)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    {/* Sub-charges expansion */}
                    {charge.hasSubCharges &&
                      expandedCharges.has(charge.id) &&
                      charge.subCharges?.map((subCharge) => (
                        <TableRow
                          key={subCharge.id}
                          className="bg-muted/30"
                        >
                          <TableCell></TableCell>
                          <TableCell className="pl-8">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground text-sm">
                                └
                              </span>
                              <span>{subCharge.name}</span>
                            </div>
                            {subCharge.description && (
                              <p className="text-sm text-muted-foreground pl-5">
                                {subCharge.description}
                              </p>
                            )}
                          </TableCell>
                          <TableCell>
                            <code className="bg-muted px-2 py-1 rounded text-sm">
                              {subCharge.code}
                            </code>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {getEntityTypeDisplayName(subCharge.entityType)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              Sub-charge
                            </span>
                          </TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>-</TableCell>
                        </TableRow>
                      ))}
                  </>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Charge Dialog */}
      <CreateChargeDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateCharge={handleCreateCharge}
      />

      {/* Edit Charge Dialog */}
      <EditChargeDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        charge={selectedCharge}
        onUpdateCharge={handleUpdateCharge}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Charge Type</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedCharge?.name}&quot;?
              {selectedCharge?.hasSubCharges && (
                <span className="block mt-2 text-amber-600">
                  This will also delete all {selectedCharge.subCharges?.length}{" "}
                  associated sub-charges.
                </span>
              )}
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCharge}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
