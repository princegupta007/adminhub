import { configureStore } from "@reduxjs/toolkit";

import tablesReducer from "./tables-slice";
import uiReducer from "./ui-slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      ui: uiReducer,
      tables: tablesReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
