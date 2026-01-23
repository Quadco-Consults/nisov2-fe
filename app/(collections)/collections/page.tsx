"use client";

import { useState } from "react";
import {
  DollarSign,
  Plus,
  Lock,
  Unlock,
  CheckCircle,
  Clock,
  FileText,
  Search,
  Filter,
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
} from "@/lib/utils/formatters";
import { CHARGE_CODES } from "@/lib/constants";
import {
  mockCollections,
  mockCollectionSummary,
  mockParticipants,
} from "@/server/services/mock-data";

export default function CollectionsPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCollections = mockCollections.filter((collection) => {
    const matchesTab =
      selectedTab === "all" || collection.chargeCode === selectedTab;
    const matchesSearch =
      collection.participantName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      collection.referenceNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Recursive Ledger</h1>
            <p className="text-muted-foreground">
              Collections management with charge code resolution
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Register Settlement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Register New Settlement</DialogTitle>
                <DialogDescription>
                  Create a new collection entry with recursive balancer calculation
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="participant">Participant</Label>
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
                  <Label htmlFor="chargeCode">Charge Code</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select charge code" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(CHARGE_CODES).map((cc) => (
                        <SelectItem key={cc.code} value={cc.code}>
                          {cc.code} - {cc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="principal">Current Principal</Label>
                    <Input
                      id="principal"
                      type="number"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="legacy">Legacy Debt</Label>
                    <Input
                      id="legacy"
                      type="number"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="credits">Unapplied Credits</Label>
                  <Input
                    id="credits"
                    type="number"
                    placeholder="0.00"
                  />
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm text-muted-foreground mb-1">
                    Recursive Balance Formula
                  </p>
                  <p className="text-sm font-medium">
                    (Current Principal + Legacy Debt) - Unapplied Credits
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Create Collection</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
              Collections by MET.TSP, MET.ISO, DLR, and TLF
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
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="MET.TSP">MET.TSP</TabsTrigger>
                <TabsTrigger value="MET.ISO">MET.ISO</TabsTrigger>
                <TabsTrigger value="DLR">DLR</TabsTrigger>
                <TabsTrigger value="TLF">TLF</TabsTrigger>
              </TabsList>
              <TabsContent value={selectedTab} className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Participant</TableHead>
                      <TableHead>Charge Code</TableHead>
                      <TableHead>Principal</TableHead>
                      <TableHead>Legacy</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Audit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCollections.map((collection) => {
                      const statusColor = getStatusColor(collection.status);
                      return (
                        <TableRow key={collection.id}>
                          <TableCell className="font-medium">
                            {collection.referenceNumber}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {collection.participantName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {collection.participantType}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {collection.chargeCode}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {formatCurrency(collection.currentPrincipal)}
                          </TableCell>
                          <TableCell className="text-orange-600">
                            +{formatCurrency(collection.legacyDebt)}
                          </TableCell>
                          <TableCell className="text-green-600">
                            -{formatCurrency(collection.unappliedCredits)}
                          </TableCell>
                          <TableCell className="font-bold">
                            {formatCurrency(collection.totalAmount)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={`${statusColor.bg} ${statusColor.text}`}
                            >
                              {collection.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {collection.auditLocked ? (
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
                      );
                    })}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
