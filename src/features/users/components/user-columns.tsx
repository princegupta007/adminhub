"use client";

import type { DataTableColumn } from "@/components/common/data-table";
import { UserCell } from "@/components/common/user-cell";
import { UserRowActions } from "./user-row-actions";
import { formatRelativeTime } from "@/lib/formatters";
import type { UserSummary } from "../types";

import { USER_STATUS_STYLES, USER_ROLE_STYLES } from "../constants";

export function userStatusLabels(status: UserSummary["status"]): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function useUserColumns(): DataTableColumn<UserSummary>[] {
  return [
    {
      id: "name",
      header: "USER",
      cell: (row) => (
        <UserCell
          firstName={row.firstName}
          lastName={row.lastName}
          avatarUrl={`https://i.pravatar.cc/150?u=${row.id}`}
          subtitle={row.email}
        />
      ),
      sortValue: (row) => `${row.firstName} ${row.lastName}`,
      cellClassName: "pl-4",
    },
    {
      id: "role",
      header: "ROLE",
      cell: (row) => (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${USER_ROLE_STYLES[row.role] || "bg-muted text-muted-foreground"}`}
        >
          {row.role}
        </span>
      ),
      sortValue: (row) => row.role,
    },
    {
      id: "status",
      header: "STATUS",
      cell: (row) => (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${USER_STATUS_STYLES[row.status]}`}
        >
          {userStatusLabels(row.status)}
        </span>
      ),
      sortValue: (row) => row.status,
    },
    {
      id: "joinDate",
      header: "JOIN DATE",
      cell: (row) => (
        <span className="text-foreground text-sm font-medium">
          {new Date(row.joinDate).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })}
        </span>
      ),
      sortValue: (row) => new Date(row.joinDate).getTime(),
    },
    {
      id: "lastActive",
      header: "LAST ACTIVE",
      cell: (row) => (
        <span className="text-muted-foreground text-sm">
          {formatRelativeTime(row.lastActive)}
        </span>
      ),
      sortValue: (row) => new Date(row.lastActive).getTime(),
    },
    {
      id: "actions",
      header: "ACTIONS",
      cell: () => <UserRowActions />,
      headerClassName: "text-right",
      cellClassName: "text-right pr-4",
    },
  ];
}
