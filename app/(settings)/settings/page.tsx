"use client";

import { useState } from "react";
import { Settings, Tag } from "lucide-react";
import { MainLayout } from "@/components/layouts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralTab, ChargesTab } from "@/components/settings";
import { mockChargeTypes } from "@/server/services/mock-data";
import { ChargeType } from "@/types";

export default function SettingsPage() {
  // State for charges (lifted for sharing)
  const [charges, setCharges] = useState<ChargeType[]>(mockChargeTypes);

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
            <ChargesTab charges={charges} onChargesChange={setCharges} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
