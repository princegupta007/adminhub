import { Check, UserPlus, Users as UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/common/data-table";
import type { DataTableColumn } from "@/components/common/data-table";
import { DataTableLayout } from "@/components/common/data-table-layout";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { SearchInput } from "@/components/common/search-input";
import { Pagination } from "@/components/common/pagination";
import { MiniStatCard } from "@/components/common/mini-stat-card";
import { RoleFilter, StatusFilter } from "./users-filters";
import {
  setSearch,
  setFilter,
  setSort,
  toggleSelected,
  setSelected,
  resetFilters,
  toggleSort,
  setPage,
} from "@/store/tables-slice";
import type { UserSummary } from "../types";
import type { TableState } from "@/store/tables-slice";
import type { AppDispatch } from "@/store";
import type { UserSortField } from "../types";

import { APP_CONSTANTS } from "@/lib/constants";

const SORT_OPTIONS: { value: UserSortField; label: string }[] = [
  { value: "joinDate", label: "Date Joined" },
  { value: "name", label: "Name" },
  { value: "email", label: "Email" },
  { value: "lastActive", label: "Last Active" },
  { value: "role", label: "Role" },
  { value: "status", label: "Status" },
];

export function UsersDesktopView({
  rows,
  total,
  page,
  isLoading,
  error,
  refetch,
  mode,
  table,
  columns,
  selectedIds,
  allOnPageSelected,
  stats,
  role,
  status,
  sortField,
  dispatch,
  setComingSoonOpen,
}: {
  rows: UserSummary[];
  total: number;
  page: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  mode: "client" | "server";
  table: TableState;
  columns: DataTableColumn<UserSummary>[];
  selectedIds: string[];
  allOnPageSelected: boolean;
  stats: { total: number; active: number; newThisMonth: number } | null;
  role: string;
  status: string;
  sortField: UserSortField;
  dispatch: AppDispatch;
  setComingSoonOpen: (open: boolean) => void;
}) {
  return (
    <div className="hidden h-[calc(100vh-140px)] flex-col gap-4 sm:flex">
      {/* Header row */}
      <div className="flex shrink-0 flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-foreground text-2xl font-bold tracking-tight">
            Users Directory
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage all registered users in your application
          </p>
        </div>
        <Button
          className="bg-[#5b52df] text-white hover:bg-[#5b52df]/90"
          onClick={() => setComingSoonOpen(true)}
        >
          <UserPlus className="mr-2 size-4" aria-hidden="true" />
          Add User
        </Button>
      </div>

      {/* Stats row */}
      <div className="shrink-0 grid-cols-1 gap-4 sm:grid sm:grid-cols-3">
        <MiniStatCard label="Total Users" value={stats?.total} />
        <MiniStatCard label="Active Users" value={stats?.active} tone="text-success" />
        <MiniStatCard
          label="New This Month"
          value={stats?.newThisMonth}
          tone="text-brand"
        />
      </div>

      {/* Main Card */}
      <DataTableLayout
        toolbar={
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <SearchInput
              label="Search users by name or email"
              placeholder="Search users by name or email…"
              value={table.search}
              onChange={(value) => dispatch(setSearch({ table: "users", search: value }))}
              className="lg:max-w-sm"
              disabled={isLoading && rows.length === 0}
            />
            <div className="flex flex-wrap items-center gap-2">
              <RoleFilter
                value={role}
                onChange={(value) =>
                  dispatch(setFilter({ table: "users", key: "role", value }))
                }
              />
              <StatusFilter
                value={status}
                onChange={(value) =>
                  dispatch(setFilter({ table: "users", key: "status", value }))
                }
              />
              <Select
                value={`${sortField}-${table.sortDirection}`}
                onValueChange={(value) => {
                  const [column, direction] = value.split("-") as [
                    UserSortField,
                    "asc" | "desc",
                  ];
                  dispatch(
                    setSort({
                      table: "users",
                      column,
                      direction,
                    }),
                  );
                }}
              >
                <SelectTrigger
                  size="sm"
                  className="bg-card w-[168px]"
                  aria-label="Sort users"
                >
                  <span className="text-muted-foreground">Sort by:</span>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.flatMap((option) => [
                    { value: `${option.value}-asc`, label: `${option.label} ↑` },
                    { value: `${option.value}-desc`, label: `${option.label} ↓` },
                  ]).map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        }
        bulkActions={
          selectedIds.length > 0 ? (
            <div
              role="toolbar"
              aria-label="Bulk actions"
              className="border-brand/30 flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-[#f4f3ff] px-4 py-2.5"
            >
              <p className="text-brand flex items-center gap-2 text-sm font-bold">
                <Check className="size-4" />
                {selectedIds.length} user{selectedIds.length > 1 ? "s" : ""} selected
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-foreground font-bold"
                  onClick={() => setComingSoonOpen(true)}
                >
                  Change Role
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-danger hover:bg-danger-soft hover:text-danger font-bold"
                  onClick={() => setComingSoonOpen(true)}
                >
                  Suspend Accounts
                </Button>
              </div>
            </div>
          ) : null
        }
        overlay={error ? <ErrorState onRetry={refetch} /> : null}
        table={
          <DataTable
            columns={[
              {
                id: "select",
                headerClassName: "w-12 pl-4 pr-0",
                cellClassName: "w-12 pl-4 pr-0",
                header: (
                  <span className="flex w-4 items-center justify-center">
                    <Checkbox
                      checked={allOnPageSelected}
                      onCheckedChange={(checked) => {
                        dispatch(
                          setSelected({
                            table: "users",
                            ids: checked
                              ? Array.from(
                                  new Set([
                                    ...selectedIds,
                                    ...rows.map((row) => String(row.id)),
                                  ]),
                                )
                              : selectedIds.filter(
                                  (id) => !rows.some((row) => String(row.id) === id),
                                ),
                          }),
                        );
                      }}
                      aria-label="Select all users on this page"
                    />
                  </span>
                ),
                cell: (row) => (
                  <span className="flex w-4 items-center justify-center">
                    <Checkbox
                      checked={selectedIds.includes(String(row.id))}
                      onCheckedChange={() =>
                        dispatch(
                          toggleSelected({
                            table: "users",
                            id: String(row.id),
                          }),
                        )
                      }
                      onClick={(event) => event.stopPropagation()}
                      aria-label={`Select ${row.firstName} ${row.lastName}`}
                    />
                  </span>
                ),
              },
              ...columns,
            ]}
            rows={rows}
            getRowId={(row) => String(row.id)}
            getRowHref={(row) => `/users/${row.id}`}
            sortBy={table.sortBy}
            sortDirection={table.sortDirection}
            onSort={(columnId) =>
              dispatch(toggleSort({ table: "users", column: columnId }))
            }
            loading={isLoading && rows.length === 0}
            empty={
              <EmptyState
                icon={UsersIcon}
                title="No users found"
                description="No users match your search or filters. Try adjusting them."
                actionLabel="Clear filters"
                onAction={() => dispatch(resetFilters({ table: "users" }))}
              />
            }
            caption="Users directory"
          />
        }
        pagination={
          <>
            {!error && total > 0 ? (
              <Pagination
                page={page}
                pageSize={APP_CONSTANTS.TABLE_PAGE_SIZE}
                total={total}
                itemLabel="results"
                disabled={isLoading}
                onPageChange={(next) => dispatch(setPage({ table: "users", page: next }))}
              />
            ) : null}
            {mode === "server" && isLoading && rows.length > 0 ? (
              <p className="sr-only" role="status">
                Loading users
              </p>
            ) : null}
          </>
        }
      />
    </div>
  );
}
