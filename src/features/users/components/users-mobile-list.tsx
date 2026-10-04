import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/common/search-input";
import { MobileFilterDrawer } from "@/components/common/mobile-filter-drawer";
import { MiniStatCard } from "@/components/common/mini-stat-card";
import { setFilter, setSearch, resetFilters } from "@/store/tables-slice";
import { RoleFilter, StatusFilter } from "./users-filters";
import { userStatusLabels } from "./user-columns";
import { USER_ROLE_STYLES, USER_STATUS_STYLES } from "../constants";
import type { UserSummary } from "../types";
import type { TableState } from "@/store/tables-slice";
import type { AppDispatch } from "@/store";

export function UsersMobileList({
  rows,
  table,
  stats,
  role,
  status,
  dispatch,
  setComingSoonOpen,
}: {
  rows: UserSummary[];
  table: TableState;
  stats: { total: number; active: number; newThisMonth: number } | null;
  role: string;
  status: string;
  dispatch: AppDispatch;
  setComingSoonOpen: (open: boolean) => void;
}) {
  return (
    <div className="mt-2 flex flex-col gap-4 sm:hidden">
      <div className="flex items-center gap-2">
        <SearchInput
          label="Search users"
          placeholder="Search users..."
          value={table.search}
          onChange={(value) => dispatch(setSearch({ table: "users", search: value }))}
          className="bg-card flex-1"
        />
        <MobileFilterDrawer>
          <div className="flex flex-col gap-2">
            <span className="text-foreground text-sm font-medium">Role</span>
            <RoleFilter
              value={role}
              onChange={(value) =>
                dispatch(setFilter({ table: "users", key: "role", value }))
              }
              className="h-11 w-full"
              hidePrefix
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-foreground text-sm font-medium">Status</span>
            <StatusFilter
              value={status}
              onChange={(value) =>
                dispatch(setFilter({ table: "users", key: "status", value }))
              }
              className="h-11 w-full"
              hidePrefix
            />
          </div>
          <div className="pt-2">
            <Button
              variant="outline"
              className="h-11 w-full border-dashed"
              onClick={() => dispatch(resetFilters({ table: "users" }))}
            >
              Reset Filters
            </Button>
          </div>
        </MobileFilterDrawer>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <MiniStatCard label="Total Users" value={stats?.total} className="min-h-0 p-3" />
        <MiniStatCard label="Active" value={stats?.active} className="min-h-0 p-3" />
        <MiniStatCard
          label="New This Mo"
          value={stats?.newThisMonth}
          className="min-h-0 p-3"
        />
      </div>

      <Button className="w-full bg-[#5b52df] text-white hover:bg-[#5b52df]/90">
        Add New User
      </Button>

      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.id} className="bg-card rounded-xl border p-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarImage
                  src={`https://i.pravatar.cc/150?u=${row.id}`}
                  alt={row.firstName}
                />
                <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
                  {row.firstName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm font-semibold">
                  {row.firstName} {row.lastName}
                </p>
                <p className="text-muted-foreground truncate text-xs">{row.email}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:bg-muted size-8 shrink-0 rounded-full"
                asChild
              >
                <Link href={`/users/${row.id}`} aria-label="View user details">
                  <Eye className="size-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:bg-muted size-8 shrink-0 rounded-full"
                onClick={() => setComingSoonOpen(true)}
                aria-label="Edit user"
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-danger-soft text-danger hover:bg-danger/20 size-8 shrink-0 rounded-full"
                onClick={() => setComingSoonOpen(true)}
                aria-label="Delete user"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
            <div className="border-muted/30 mt-3 flex items-center justify-between border-t pt-3">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${USER_ROLE_STYLES[row.role] || "bg-muted text-muted-foreground"}`}
                >
                  {row.role}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${USER_STATUS_STYLES[row.status]}`}
                >
                  {userStatusLabels(row.status)}
                </span>
              </div>
              <span className="text-muted-foreground text-[10px]">
                Active {new Date(row.lastActive).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
