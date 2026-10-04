"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableSkeleton } from "@/components/common/skeletons";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  headerClassName?: string;
  cellClassName?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  sortBy?: string | null;
  sortDirection?: "asc" | "desc";
  onSort?: (columnId: string) => void;
  /** When provided, rows become links to this href. */
  getRowHref?: (row: T) => string;
  loading?: boolean;
  empty?: ReactNode;
  error?: ReactNode;
  caption?: string;
}

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  sortBy,
  sortDirection = "asc",
  onSort,
  getRowHref,
  loading = false,
  empty,
  error,
  caption,
}: DataTableProps<T>) {
  const router = useRouter();
  const showSkeleton = loading && rows.length === 0;

  return (
    <Table>
      {caption ? <caption className="sr-only">{caption}</caption> : null}
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {columns.map((column) => (
            <TableHead
              key={column.id}
              className={column.headerClassName}
              aria-sort={
                onSort && column.sortValue && sortBy === column.id
                  ? sortDirection === "asc"
                    ? "ascending"
                    : "descending"
                  : undefined
              }
            >
              {onSort && column.sortValue ? (
                <button
                  type="button"
                  onClick={() => onSort(column.id)}
                  className={cn(
                    "text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 -ml-1 inline-flex items-center gap-1 rounded-sm text-xs font-semibold tracking-wide uppercase transition-colors focus-visible:ring-[3px] focus-visible:outline-none",
                    sortBy === column.id && "text-foreground",
                  )}
                >
                  {column.header}
                  {sortBy === column.id ? (
                    sortDirection === "asc" ? (
                      <ChevronUp className="size-3.5" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="size-3.5" aria-hidden="true" />
                    )
                  ) : (
                    <ChevronsUpDown className="size-3.5 opacity-50" aria-hidden="true" />
                  )}
                </button>
              ) : (
                column.header
              )}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {showSkeleton ? (
          <SkeletonRows columns={columns.length} />
        ) : error ? (
          <StateRow colSpan={columns.length}>{error}</StateRow>
        ) : rows.length === 0 && empty ? (
          <StateRow colSpan={columns.length}>{empty}</StateRow>
        ) : (
          rows.map((row) => {
            const rowId = getRowId(row);
            const href = getRowHref?.(row);
            return (
              <TableRow
                key={rowId}
                tabIndex={href ? 0 : undefined}
                onClick={href ? () => router.push(href) : undefined}
                onKeyDown={
                  href
                    ? (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          router.push(href);
                        }
                      }
                    : undefined
                }
                className={cn(href && "cursor-pointer")}
              >
                {columns.map((column) => (
                  <TableCell key={column.id} className={column.cellClassName}>
                    {column.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}

function StateRow({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={colSpan} className="p-0">
        {children}
      </TableCell>
    </TableRow>
  );
}

function SkeletonRows({ columns }: { columns: number }) {
  return (
    <>
      {Array.from({ length: 6 }).map((_, rowIndex) => (
        <TableRow key={rowIndex} className="hover:bg-transparent">
          {Array.from({ length: columns }).map((__, colIndex) => (
            <TableCell key={colIndex}>
              <TableSkeletonCell colIndex={colIndex} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function TableSkeletonCell({ colIndex }: { colIndex: number }) {
  return (
    <div
      className={cn(
        "bg-accent h-4 animate-pulse rounded-md",
        colIndex === 0 ? "w-20" : "w-full max-w-32",
      )}
    />
  );
}

export { TableSkeleton };
