"use client";

import { Settings, Bell, Shield, Database, Globe, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SERC_SPLIT, VARIANCE_THRESHOLD } from "@/lib/constants";

export function GeneralTab() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Treasury Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Treasury Configuration
          </CardTitle>
          <CardDescription>
            Core treasury and market parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>SERC Split Rate (%)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={SERC_SPLIT.STATE_SERC * 100}
                disabled
                className="max-w-[100px]"
              />
              <span className="text-sm text-muted-foreground">
                Statutory 5% deduction to State SERC
              </span>
            </div>
          </div>
          <Separator />
          <div className="grid gap-2">
            <Label>Variance Threshold (%)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                defaultValue={VARIANCE_THRESHOLD}
                className="max-w-[100px]"
              />
              <span className="text-sm text-muted-foreground">
                Flag deviations exceeding +/-{VARIANCE_THRESHOLD}%
              </span>
            </div>
          </div>
          <Separator />
          <div className="grid gap-2">
            <Label>Default Settlement Period</Label>
            <Select defaultValue="monthly">
              <SelectTrigger className="max-w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="mt-4">Save Configuration</Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Configure alert preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Variance Alerts</p>
              <p className="text-sm text-muted-foreground">
                Notify when collections exceed threshold
              </p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Debt Aging Alerts</p>
              <p className="text-sm text-muted-foreground">
                Notify when debts enter critical buckets
              </p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Disbursement Approvals</p>
              <p className="text-sm text-muted-foreground">
                Notify when disbursements need approval
              </p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Pool Health Warnings</p>
              <p className="text-sm text-muted-foreground">
                Notify when PHI drops below 70%
              </p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>Security and audit settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Session Timeout (minutes)</Label>
            <Input
              type="number"
              defaultValue={30}
              className="max-w-[100px]"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">
                Require 2FA for all users
              </p>
            </div>
            <input type="checkbox" className="h-4 w-4" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Audit Logging</p>
              <p className="text-sm text-muted-foreground">
                Log all user actions
              </p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Cryptographic Audit Lock</p>
              <p className="text-sm text-muted-foreground">
                Enable hash verification for posted settlements
              </p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>

      {/* Regional Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Regional
          </CardTitle>
          <CardDescription>Localization and format settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Default Currency</Label>
            <Select defaultValue="NGN">
              <SelectTrigger className="max-w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NGN">Nigerian Naira (NGN)</SelectItem>
                <SelectItem value="USD">US Dollar (USD)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="grid gap-2">
            <Label>Date Format</Label>
            <Select defaultValue="dmy">
              <SelectTrigger className="max-w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="grid gap-2">
            <Label>Timezone</Label>
            <Select defaultValue="wat">
              <SelectTrigger className="max-w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wat">West Africa Time (WAT)</SelectItem>
                <SelectItem value="utc">UTC</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
