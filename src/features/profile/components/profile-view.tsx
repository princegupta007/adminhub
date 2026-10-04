"use client";

import { Bell, Globe, KeyRound, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { TopbarSearch } from "@/components/common/topbar-search";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTodayLabel } from "@/lib/use-now";

/**
 * Demo profile page for the signed-in admin (Sarah Jenkins), matching the
 * app's design language. Reachable from the mobile bottom tab bar.
 */
export function ProfileView() {
  const todayLabel = useTodayLabel();

  return (
    <AppShell
      title="Profile"
      subtitle={todayLabel ?? undefined}
      topbarActions={<TopbarSearch />}
    >
      <div className="mx-auto max-w-2xl space-y-4">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-8 sm:flex-row sm:items-start sm:py-6">
            <Avatar className="size-16 border">
              <AvatarFallback className="bg-brand-soft text-brand text-xl font-semibold">
                SJ
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col items-center gap-1 sm:flex-row sm:items-center sm:gap-2">
                <h2 className="text-foreground text-xl font-semibold tracking-tight">
                  Sarah Jenkins
                </h2>
                <span className="bg-brand-soft text-brand inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium">
                  <ShieldCheck className="size-3.5" aria-hidden="true" />
                  Super Admin
                </span>
              </div>
              <p className="text-muted-foreground mt-1 text-sm">
                Manages workspace settings, users and billing for AdminHub.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                <Button size="sm">Edit profile</Button>
                <Button size="sm" variant="outline">
                  Change password
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              <InfoRow icon={Mail} label="Email" value="sarah.jenkins@adminhub.com" />
              <InfoRow icon={Phone} label="Phone" value="+1 (555) 014-2210" />
              <InfoRow icon={MapPin} label="Location" value="San Francisco, CA" />
              <InfoRow icon={Globe} label="Timezone" value="PST (UTC−08:00)" />
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              <InfoRow icon={Bell} label="Notifications" value="Email + in-app" />
              <InfoRow icon={KeyRound} label="Two-factor auth" value="Enabled" />
            </dl>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="text-muted-foreground mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0">
        <dt className="text-muted-foreground text-xs">{label}</dt>
        <dd className="text-foreground truncate text-sm font-medium">{value}</dd>
      </div>
    </div>
  );
}
