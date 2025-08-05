"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Shield, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { verifySecretKey } from "@/lib/actions";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip auth check for security page

    const verifySecretKeyFn = async () => {
      if (pathname === "/security") {
        setIsAuthenticated(true);
        return;
      }

      // Check if user has valid auth token
      const authToken = localStorage.getItem("tiles-inventory-auth");

      if (!authToken) {
        router.push("/security");
        return;
      }

      const response = await verifySecretKey(authToken);

      if (response.success) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("tiles-inventory-auth");
        router.push("/security");
      }
    };

    if (!isAuthenticated) {
      verifySecretKeyFn();
    }
  }, [pathname, router]);

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600/25 border border-emerald-600/50">
              <Shield className="h-8 w-8 text-emerald-500" />
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Verifying access...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
