import { createSlice } from "@reduxjs/toolkit";
import dataProjectList from '../../data/ProjectsList.json'

const addfilterProjectInitialState =(dataProjectList) =>  {
    return (
        dataProjectList.map(res=> ({...res, filterProjectInitialState: false})) 
        );
  };

const initialState = addfilterProjectInitialState(dataProjectList)


const projectSlice = createSlice({
    name: "projects",
    initialState,
    reducers: {
        editSelect: (state, action) => {
            const { id,filterProjectInitialState} = action.payload;
            const foundTask = state.find((projects) => projects.id === id);
            if (filterProjectInitialState) {
                foundTask.filterProjectInitialState= false;
            }else{
                foundTask.filterProjectInitialState = true;
            } 
            console.log(foundTask) 

          }
     
      }

  });
  
  export const { editSelect } = projectSlice.actions;
  export default projectSlice.reducer;