"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { BrandMark } from "@/components/layout/brand";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_ROUTES } from "@/lib/constants";

export function LoginView() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Minimal demo implementation. Does not simulate network failure.
    // In a real application, this would authenticate against a backend.
    router.push(APP_ROUTES.DASHBOARD);
  };

  const handleGuestAccess = () => {
    setIsGuestLoading(true);
    router.push(APP_ROUTES.DASHBOARD);
  };

  return (
    <div className="bg-muted/30 flex min-h-svh flex-col items-center justify-center p-4 sm:p-8">
      <div className="mb-8">
        <BrandMark className="pointer-events-none scale-125" />
      </div>

      <Card className="border-border/50 w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 pb-6 text-center">
          <CardTitle className="text-foreground text-2xl font-bold tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                required
                disabled={isLoading || isGuestLoading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={isLoading || isGuestLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#5b52df] text-white hover:bg-[#5b52df]/90"
              disabled={isLoading || isGuestLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="border-border w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card text-muted-foreground px-2 font-medium">Or</span>
            </div>
          </div>

          <div className="space-y-4 text-center">
            <p className="text-muted-foreground text-sm">
              Explore the AdminHub dashboard using demo data.
            </p>
            <Button
              type="button"
              variant="outline"
              className="border-brand/20 bg-brand-soft text-brand hover:bg-brand/10 hover:text-brand w-full"
              onClick={handleGuestAccess}
              disabled={isLoading || isGuestLoading}
            >
              {isGuestLoading ? (
                <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
              ) : null}
              Continue as Guest
            </Button>
          </div>
        </CardContent>
      </Card>

      <p className="text-muted-foreground mt-8 text-center text-xs">
        Demo/guest access is temporary frontend functionality
        <br />
        and is NOT production authentication.
      </p>
    </div>
  );
}
