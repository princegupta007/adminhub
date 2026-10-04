"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { ErrorState } from "@/components/common/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/formatters";
import { ComingSoonDialog } from "@/components/common/coming-soon-dialog";
import { useTodayLabel } from "@/lib/use-now";
import { TopbarSearch } from "@/components/common/topbar-search";
import { useUser } from "../hooks";
import { userStatusLabels } from "./user-columns";
import { APP_ROUTES } from "@/lib/constants";
import { USER_STATUS_STYLES } from "../constants";

const ACTIVITY_LOG = [
  {
    title: "Logged in from Chrome / macOS",
    desc: "IP: 192.168.1.45",
    time: "10 mins ago",
  },
  {
    title: "Updated security settings",
    desc: "Changed master recovery email",
    time: "2 hours ago",
  },
  {
    title: "Approved Transaction #TXN-7823",
    desc: "Value $245.00 approved manually",
    time: "1 day ago",
  },
];

const TRANSACTIONS = [
  { id: "#TXN-7823", amount: "$245.00", status: "Success", date: "Oct 1, 2024" },
  { id: "#TXN-6912", amount: "$120.00", status: "Success", date: "Sep 14, 2024" },
];

const BOOKINGS = [
  {
    id: "#BKG-2341",
    service: "Consultation",
    status: "Confirmed",
    date: "Oct 15, 14:00",
  },
  {
    id: "#BKG-1980",
    service: "Executive Coaching",
    status: "Completed",
    date: "Sep 01, 10:30",
  },
];

export function UserDetailView({ id }: { id: number }) {
  const { data: user, isPending, error, refetch } = useUser(id);
  const todayLabel = useTodayLabel();
  const [comingSoonOpen, setComingSoonOpen] = useState(false);

  if (error) {
    return (
      <AppShell title="User Directory" subtitle={todayLabel ?? undefined}>
        <ErrorState
          title="Couldn't load this user"
          description="The request failed. Please try again."
          onRetry={refetch}
        />
      </AppShell>
    );
  }

  return (
    <AppShell
      title="User Directory"
      subtitle={todayLabel ?? undefined}
      topbarActions={<TopbarSearch />}
    >
      <div className="mb-4">
        <Link
          href={APP_ROUTES.USERS}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Users / </span>
          <span className="text-foreground hidden font-semibold sm:inline">
            {user ? `${user.firstName} ${user.lastName}` : "..."}
          </span>
          <span className="sm:hidden">User Detail</span>
        </Link>
      </div>

      <div className="flex flex-col gap-6">
        {/* Top Header Card */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            {isPending || !user ? (
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                  <Skeleton className="size-20 rounded-full" />
                  <div className="space-y-2 text-center sm:text-left">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-52" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
                  <Avatar className="size-24 sm:size-16">
                    <AvatarImage
                      src={`https://i.pravatar.cc/150?u=${user.id}`}
                      alt=""
                      aria-hidden="true"
                    />
                    <AvatarFallback className="bg-brand-soft text-brand text-lg font-semibold">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center sm:text-left">
                    <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center">
                      <h2 className="text-foreground text-xl font-bold">
                        {user.firstName} {user.lastName}
                      </h2>
                      <div className="mt-1 flex items-center gap-2 sm:mt-0">
                        <span className="bg-brand-soft text-brand rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize">
                          {user.role}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${USER_STATUS_STYLES[user.status]}`}
                        >
                          {userStatusLabels(user.status)}
                        </span>
                      </div>
                    </div>
                    <p className="text-muted-foreground mt-1.5 text-sm">
                      {user.email} <span className="hidden sm:inline">&bull;</span>
                      <br className="sm:hidden" />{" "}
                      <span className="sm:hidden">Joined</span>{" "}
                      {new Date(user.joinDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex w-full items-center gap-3 sm:mt-0 sm:w-auto">
                  <Button
                    className="flex-1 bg-[#5b52df] text-white hover:bg-[#5b52df]/90 sm:flex-initial"
                    onClick={() => setComingSoonOpen(true)}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="border-danger/40 bg-danger-soft text-danger hover:bg-danger/20 flex-1 sm:flex-initial"
                    onClick={() => setComingSoonOpen(true)}
                  >
                    Suspend User
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column (Main Content) */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold">
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isPending || !user ? (
                  <Skeleton className="h-40 w-full" />
                ) : (
                  <div className="flex flex-col">
                    <DetailRow
                      label="Full Name"
                      value={`${user.firstName} ${user.lastName}`}
                    />
                    <DetailRow label="Email" value={user.email} />
                    <DetailRow label="Phone" value={user.phone} />
                    <DetailRow label="Date of Birth" value={user.birthDate} />
                    <DetailRow
                      label="Address"
                      value={`${user.addressLine}, ${user.city}`}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold">Account Details</CardTitle>
              </CardHeader>
              <CardContent>
                {isPending || !user ? (
                  <Skeleton className="h-40 w-full" />
                ) : (
                  <div className="flex flex-col">
                    <DetailRow
                      label="User ID"
                      value={`#USR-${user.id.toString().padStart(4, "0")}`}
                    />
                    <DetailRow
                      label="Joined Date"
                      value={new Date(user.joinDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    />
                    <DetailRow
                      label="Last Login"
                      value={new Date(user.lastActive).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    />
                    <DetailRow
                      label="Role"
                      value={user.role === "Admin" ? "Super Admin" : "User"}
                    />
                    <div className="flex items-center justify-between pt-3">
                      <span className="text-muted-foreground text-sm">2FA Status</span>
                      <span className="text-success text-sm font-bold">Enabled</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold">
                    Recent Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    {TRANSACTIONS.map((txn, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                      >
                        <div>
                          <p className="text-foreground text-sm font-bold">{txn.id}</p>
                          <p className="text-muted-foreground text-[10px]">{txn.date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-bold">{txn.amount}</p>
                          <span className="bg-success-soft text-success rounded-full px-2 py-0.5 text-[10px] font-semibold">
                            {txn.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="hidden md:block">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold">Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    {BOOKINGS.map((bkg, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                      >
                        <div>
                          <p className="text-foreground text-sm font-bold">{bkg.id}</p>
                          <p className="text-muted-foreground text-[10px]">
                            {bkg.service}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${bkg.status === "Confirmed" ? "bg-success-soft text-success" : "bg-brand-soft text-brand"}`}
                          >
                            {bkg.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            <Card className="h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-bold">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-brand-soft relative ml-2 space-y-6 border-l-2">
                  {ACTIVITY_LOG.map((item, i) => (
                    <div key={i} className="relative pl-6">
                      <span className="bg-brand ring-background absolute top-1.5 -left-1.5 size-3 rounded-full ring-4" />
                      <h4 className="text-foreground text-sm font-bold">{item.title}</h4>
                      <p className="text-muted-foreground mt-0.5 text-xs">{item.desc}</p>
                      <p className="text-muted-foreground mt-1 text-[10px] font-medium">
                        {item.time}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ComingSoonDialog open={comingSoonOpen} onOpenChange={setComingSoonOpen} />
    </AppShell>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between border-b py-3 last:border-0 last:pb-0">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="text-foreground text-right text-sm font-medium">
        {value || "—"}
      </span>
    </div>
  );
}
