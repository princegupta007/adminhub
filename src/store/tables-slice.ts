import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TableKey = "users" | "transactions" | "bookings";

export type TableFilters = Record<string, string>;

export interface TableState {
  search: string;
  /** Keyed filters, e.g. { status: "all", role: "all" }. */
  filters: TableFilters;
  sortBy: string | null;
  sortDirection: "asc" | "desc";
  page: number;
  selectedIds: string[];
}

export interface TablesState {
  tables: Record<TableKey, TableState>;
}

const initialTableState: TableState = {
  search: "",
  filters: {},
  sortBy: null,
  sortDirection: "asc",
  page: 1,
  selectedIds: [],
};

function withDefaults(overrides: Partial<TableState>): TableState {
  return { ...initialTableState, ...overrides };
}

const initialState: TablesState = {
  tables: {
    users: withDefaults({ sortBy: "joinDate", sortDirection: "asc" }),
    transactions: withDefaults({
      filters: { status: "all" },
      sortBy: "date",
      sortDirection: "desc",
    }),
    bookings: withDefaults({
      filters: { status: "all" },
      sortBy: "date",
      sortDirection: "desc",
    }),
  },
};

const tablesSlice = createSlice({
  name: "tables",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<{ table: TableKey; search: string }>) {
      const table = state.tables[action.payload.table];
      table.search = action.payload.search;
      table.page = 1;
    },
    setFilter(
      state,
      action: PayloadAction<{ table: TableKey; key: string; value: string }>,
    ) {
      const table = state.tables[action.payload.table];
      table.filters[action.payload.key] = action.payload.value;
      table.page = 1;
    },
    toggleSort(state, action: PayloadAction<{ table: TableKey; column: string }>) {
      const table = state.tables[action.payload.table];
      if (table.sortBy === action.payload.column) {
        table.sortDirection = table.sortDirection === "asc" ? "desc" : "asc";
      } else {
        table.sortBy = action.payload.column;
        table.sortDirection = "asc";
      }
    },
    setSort(
      state,
      action: PayloadAction<{
        table: TableKey;
        column: string | null;
        direction: "asc" | "desc";
      }>,
    ) {
      const table = state.tables[action.payload.table];
      table.sortBy = action.payload.column;
      table.sortDirection = action.payload.direction;
    },
    setPage(state, action: PayloadAction<{ table: TableKey; page: number }>) {
      state.tables[action.payload.table].page = action.payload.page;
    },
    toggleSelected(state, action: PayloadAction<{ table: TableKey; id: string }>) {
      const table = state.tables[action.payload.table];
      table.selectedIds = table.selectedIds.includes(action.payload.id)
        ? table.selectedIds.filter((id) => id !== action.payload.id)
        : [...table.selectedIds, action.payload.id];
    },
    setSelected(state, action: PayloadAction<{ table: TableKey; ids: string[] }>) {
      state.tables[action.payload.table].selectedIds = action.payload.ids;
    },
    clearSelected(state, action: PayloadAction<{ table: TableKey }>) {
      state.tables[action.payload.table].selectedIds = [];
    },
    /** Clears search, filters, selection and returns to page 1. */
    resetFilters(state, action: PayloadAction<{ table: TableKey }>) {
      const table = state.tables[action.payload.table];
      state.tables[action.payload.table] = withDefaults({
        sortBy: table.sortBy,
        sortDirection: table.sortDirection,
      });
    },
  },
});

export const {
  setSearch,
  setFilter,
  toggleSort,
  setSort,
  setPage,
  toggleSelected,
  setSelected,
  clearSelected,
  resetFilters,
} = tablesSlice.actions;

export default tablesSlice.reducer;
