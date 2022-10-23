import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import appReducer from "./slices/appSlice";
import taskSlice from "./slices/taskSlice";

// SLICERS

import projectSlice from "../features/OrderFilters/projectSlice";
import statusSlice from "../features/OrderFilters/statusSlice";
import newtaskSlice from "../features/OrderFilters/newTaskSlice";
import appControlslice from "../features/statesapp/appControlSlice";
import agentstatusSlice from "../features/OrderFilters/agentstatusSlice";

export const reducers = combineReducers({
  app: appReducer,
  auth: authReducer,
  taskSlice: taskSlice,

  // SLICERS
  // projects: projectSlice,
  statusSlice: statusSlice,
  newtaskSlice: newtaskSlice,
  appControlslice: appControlslice,
  agentstatusSlice: agentstatusSlice,
});

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["auth/getUserData/fulfilled"],
      },
    }),
});
