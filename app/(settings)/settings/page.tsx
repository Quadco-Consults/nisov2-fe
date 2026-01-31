"use client";

import { useState } from "react";
import { Settings, Tag, Building2, Link as LinkIcon } from "lucide-react";
import { MainLayout } from "@/components/layouts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralTab, ChargesTab } from "@/components/settings";
import { mockChargeTypes } from "@/server/services/mock-data";
import { ChargeType } from "@/types";

export default function SettingsPage() {
  // State for charges (lifted for sharing)
  const [charges, setCharges] = useState<ChargeType[]>(mockChargeTypes);
  const [chargeSubTab, setChargeSubTab] = useState<"disco" | "bilateral">("disco");

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">
            Configure system parameters and preferences
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="charges" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Charge Types
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralTab />
          </TabsContent>

          <TabsContent value="charges">
            {/* Sub-tabs for DISCO and Bilateral charges */}
            <Tabs value={chargeSubTab} onValueChange={(v) => setChargeSubTab(v as "disco" | "bilateral")} className="space-y-4">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="disco" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  DISCO Charges
                </TabsTrigger>
                <TabsTrigger value="bilateral" className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  Bilateral Charges
                </TabsTrigger>
              </TabsList>

              <TabsContent value="disco">
                <ChargesTab
                  charges={charges}
                  onChargesChange={setCharges}
                  chargeCategory="DISCO"
                />
              </TabsContent>

              <TabsContent value="bilateral">
                <ChargesTab
                  charges={charges}
                  onChargesChange={setCharges}
                  chargeCategory="BILATERAL"
                />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
