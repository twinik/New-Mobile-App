import { createSlice } from "@reduxjs/toolkit";
import data from '../../data/statusAgents.json'

const addfilterStatusInitialState =(data) =>  {
    return (
        data.map(res=> ({...res, filterAgentStatusInitialState: false})) 
        );
  };

const initialState = addfilterStatusInitialState(data)

const agentstatusSlice = createSlice({
    name: "agentstatusSlice",
    initialState,
    reducers: {
        editSelect: (state, action) => {
            const { id,filterAgentStatusInitialState} = action.payload;
            const foundStatus = state.find((agentstatusSlice) => agentstatusSlice.id === id);
            if (filterAgentStatusInitialState) {
                foundStatus .filterAgentStatusInitialState= false;
            }else{
                foundStatus .filterAgentStatusInitialState = true;
            } 
            //console.log(foundStatus ) 

          }
     
      }

  });
  
  export const { editSelect } = agentstatusSlice.actions;
  export default agentstatusSlice.reducer;