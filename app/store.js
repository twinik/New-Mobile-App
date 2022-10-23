import { configureStore } from "@reduxjs/toolkit";
import projectSlice from "../features/OrderFilters/projectSlice";
import statusSlice from "../features/OrderFilters/statusSlice";
import newtaskSlice from "../features/OrderFilters/newTaskSlice";
import appControlslice from "../features/statesapp/appControlSlice";
import agentstatusSlice from "../features/OrderFilters/agentstatusSlice";

export const store = configureStore({
  reducer: {
    projects: projectSlice,
    statusSlice: statusSlice,
    newtaskSlice: newtaskSlice,
    appControlslice: appControlslice,
    agentstatusSlice: agentstatusSlice,
  },
});
