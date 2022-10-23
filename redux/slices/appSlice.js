import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  isRouteLoading: false,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setRouteLoading: (state, action) => {
      state.isRouteLoading = action.payload;
    },
  },
});

// Reducers and actions
export const { setLoading, setRouteLoading } = appSlice.actions;

export default appSlice.reducer;
