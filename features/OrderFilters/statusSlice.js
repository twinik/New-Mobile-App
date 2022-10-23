import { createSlice } from "@reduxjs/toolkit";
import data from '../../data/statusTasks.json'

const addfilterStatusInitialState =(data) =>  {
    return (
        data.map(res=> ({...res, filterStatusInitialState: false})) 
        );
  };

const initialState = addfilterStatusInitialState(data)

const projectSlice = createSlice({
    name: "statusTasks",
    initialState,
    reducers: {
        editSelect: (state, action) => {
            const { id,filterStatusInitialState} = action.payload;
            const foundStatus = state.find((statusTasks) => statusTasks.id === id);
            if (filterStatusInitialState) {
                foundStatus .filterStatusInitialState= false;
            }else{
                foundStatus .filterStatusInitialState = true;
            } 
            //console.log(foundStatus ) 

          }
     
      }

  });
  
  export const { editSelect } = projectSlice.actions;
  export default projectSlice.reducer;