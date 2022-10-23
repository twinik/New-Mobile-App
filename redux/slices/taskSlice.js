import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { getRecentTasks } from "../../helpers/commonUtils";

const initialState = {
  tasks: [],
  newTasks: [],
  myTasks: [],
  historyTasks: [],
};

export const getAgentTasksAction = createAsyncThunk(
  "taskSlice/getAgentTasksAction",
  async (_, thunkApi) => {
    try {
      const auth = thunkApi.getState()?.auth;
      const uid = auth?.user?.uid;

      const tasks = await getRecentTasks(uid);

      let agentTeamIds = auth?.user?.userMetaData?.team_id_;
      if (agentTeamIds && Array.isArray(agentTeamIds)) {
        agentTeamIds = agentTeamIds?.map((p) => `${p}`);
        return (
          tasks
            // .filter((task) => agentTeamIds.includes(`${task.team_id_}`))
            .reduce(
              (prev, task, i, array) => {
                if (!agentTeamIds.includes(`${task.team_id_}`)) {
                  return prev;
                }
                if (task?.job_status_ === "created") {
                  prev.newTasks.push(task);
                } else if (
                  ["assigned", "inprogress"].includes(task?.job_status_)
                ) {
                  prev.myTasks.push(task);
                } else if (
                  ["completed", "failed"].includes(task?.job_status_)
                ) {
                  prev.historyTasks.push(task);
                }
                return prev;
              },
              {
                newTasks: [],
                myTasks: [],
                historyTasks: [],
              }
            )
        );
      } else {
        return null;
      }
    } catch (err) {
      console.log(`err`, err);
      return thunkApi.rejectWithValue(err || "Error...");
    }
  }
);

export const taskSlice = createSlice({
  name: "taskSlice",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAgentTasksAction.fulfilled, (state, action) => {
        const data = action.payload;

        state.newTasks = data?.newTasks;
        state.myTasks = data?.myTasks;
        state.historyTasks = data?.historyTasks;
      })
      .addCase(getAgentTasksAction.rejected, (state) => {
        if (!Array.isArray(state.tasks)) {
          state.newTasks = [];
          state.myTasks = [];
          state.historyTasks = [];
        }
      });
  },
});

// Selectors
export const getTaskSliceState = (state) => state.taskSlice;
export const useTaskSliceSelector = () => useSelector(getTaskSliceState);
// Reducers and actions
export const { setLoading, setRouteLoading } = taskSlice.actions;

export default taskSlice.reducer;
