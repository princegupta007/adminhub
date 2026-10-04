import { useDispatch, useSelector, useStore } from "react-redux";

import type { AppDispatch, AppStore, RootState } from "./index";
import type { TableKey, TableState } from "./tables-slice";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

/** Selector helper for per-table UI state (search, sort, filters, page). */
export function useTableState(table: TableKey): TableState {
  return useAppSelector((state) => state.tables.tables[table]);
}
