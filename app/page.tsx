"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { useAuthStore } from "@/lib/store/auth-store";
import { demoUser } from "@/server/services/mock-data";

export default function LoginPage() {
  const router = useRouter();
  const { setUser, isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState("demo@niso.gov.ng");
  const [password, setPassword] = useState("demo123");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email === "demo@niso.gov.ng" && password === "demo123") {
      setUser(demoUser);
      toast.success("Login successful", {
        description: "Welcome to NISO Treasury Management System",
      });
      router.push("/dashboard");
    } else {
      toast.error("Login failed", {
        description: "Invalid credentials. Use demo@niso.gov.ng / demo123",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Login Form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
              NT
            </div>
            <CardTitle className="text-2xl font-bold">
              NISO Treasury Management
            </CardTitle>
            <CardDescription>
              Sign in to access the treasury management system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-6 rounded-lg bg-muted p-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Demo Credentials
              </p>
              <p className="text-sm text-muted-foreground">
                Email: demo@niso.gov.ng
              </p>
              <p className="text-sm text-muted-foreground">
                Password: demo123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right side - Branding */}
      <div className="hidden lg:flex lg:flex-1 items-center justify-center bg-primary p-8">
        <div className="max-w-md text-center text-primary-foreground">
          <h1 className="text-4xl font-bold mb-4">
            Nigerian Independent System Operator
          </h1>
          <p className="text-xl opacity-90 mb-8">
            Treasury Management System
          </p>
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-foreground/20">
                1
              </div>
              <div>
                <p className="font-medium">Market Intelligence Hub</p>
                <p className="text-sm opacity-75">Real-time pool health monitoring</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-foreground/20">
                2
              </div>
              <div>
                <p className="font-medium">Recursive Ledger</p>
                <p className="text-sm opacity-75">Collections with charge code resolution</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-foreground/20">
                3
              </div>
              <div>
                <p className="font-medium">Payment Waterfall</p>
                <p className="text-sm opacity-75">Tiered disbursement allocation</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-foreground/20">
                4
              </div>
              <div>
                <p className="font-medium">Debt Recovery Framework</p>
                <p className="text-sm opacity-75">4-bucket aging analysis</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
