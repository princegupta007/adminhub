"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTodayLabel } from "@/lib/use-now";
import { AppShell } from "@/components/layout/app-shell";
import { TopbarSearch } from "@/components/common/topbar-search";
import { ComingSoonDialog } from "@/components/common/coming-soon-dialog";
import { useTableState, useAppDispatch } from "@/store/hooks";
import { setSearch } from "@/store/tables-slice";
import { useUserDirectory, useUsersTable } from "../hooks";
import type { UserSortField } from "../types";
import { useUserColumns } from "./user-columns";
import { UsersDesktopView } from "./users-desktop-view";
import { UsersMobileList } from "./users-mobile-list";

import { APP_CONSTANTS } from "@/lib/constants";

export function UsersView() {
  const dispatch = useAppDispatch();
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const table = useTableState("users");
  const searchParams = useSearchParams();
  const columns = useUserColumns();

  const role = table.filters.role ?? "all";
  const status = table.filters.status ?? "all";
  const sortField = (table.sortBy ?? "joinDate") as UserSortField;

  // Seed the search from /users?q=… (topbar global search).
  const querySearch = searchParams.get("q") ?? "";
  useEffect(() => {
    if (querySearch && querySearch !== table.search) {
      dispatch(setSearch({ table: "users", search: querySearch }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [querySearch]);

  const { rows, total, page, isLoading, error, refetch, mode } = useUsersTable({
    page: table.page,
    pageSize: APP_CONSTANTS.TABLE_PAGE_SIZE,
    search: table.search,
    role,
    status,
    sortField,
    sortDirection: table.sortDirection,
  });

  const directory = useUserDirectory();

  const stats = useMemo(() => {
    if (!directory.data) return null;
    const users = directory.data;
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    return {
      total: users.length,
      active: users.filter((user) => user.status === "active").length,
      newThisMonth: users.filter((user) => new Date(user.joinDate) >= monthStart).length,
    };
  }, [directory.data]);

  const selectedIds = table.selectedIds;
  const allOnPageSelected =
    rows.length > 0 && rows.every((row) => selectedIds.includes(String(row.id)));

  const todayLabel = useTodayLabel();

  return (
    <AppShell
      title="User Management"
      subtitle={todayLabel ?? undefined}
      topbarActions={<TopbarSearch />}
      mobileHeading={false}
    >
      <UsersDesktopView
        rows={rows}
        total={total}
        page={page}
        isLoading={isLoading}
        error={error}
        refetch={refetch}
        mode={mode}
        table={table}
        columns={columns}
        selectedIds={selectedIds}
        allOnPageSelected={allOnPageSelected}
        stats={stats}
        role={role}
        status={status}
        sortField={sortField}
        dispatch={dispatch}
        setComingSoonOpen={setComingSoonOpen}
      />

      <UsersMobileList
        rows={rows}
        table={table}
        stats={stats}
        role={role}
        status={status}
        dispatch={dispatch}
        setComingSoonOpen={setComingSoonOpen}
      />

      <ComingSoonDialog open={comingSoonOpen} onOpenChange={setComingSoonOpen} />
    </AppShell>
  );
}
