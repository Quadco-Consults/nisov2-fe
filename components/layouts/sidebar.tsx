"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  DollarSign,
  Send,
  AlertCircle,
  Calculator,
  BarChart,
  Users,
  Settings,
  X,
  Building2,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/lib/store/auth-store";
import { useUIStore } from "@/lib/store/ui-store";
import { NAVIGATION, APP_NAME } from "@/lib/constants";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  DollarSign,
  Send,
  AlertCircle,
  Calculator,
  BarChart,
  Users,
  Settings,
  Building2,
  FileText,
};

export function Sidebar() {
  const pathname = usePathname();
  const { hasRole } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  const filteredNavigation = NAVIGATION.filter((item) => hasRole(item.roles));

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-sidebar border-r border-sidebar-border transition-transform duration-200 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                NT
              </div>
              <span className="font-semibold text-sidebar-foreground">
                {APP_NAME}
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon-sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {filteredNavigation.map((item) => {
                const Icon = iconMap[item.icon];
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    {item.title}
                  </Link>
                );
              })}
            </nav>

            <Separator className="my-4" />

            {/* System Info */}
            <div className="px-3 py-2">
              <p className="text-xs text-muted-foreground">
                NISO Treasury Management System
              </p>
              <p className="text-xs text-muted-foreground">Version 1.0.0</p>
            </div>
          </ScrollArea>
        </div>
      </aside>
    </>
  );
}
