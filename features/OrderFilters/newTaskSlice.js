import { createSlice } from "@reduxjs/toolkit";

const initialState = [
    {
    "id": "newtaskid",
    "job_id" : "",
    "job_description" : "",
    "job_type" : "",
    "job_status" : "",
    "customer_id" : "",
    "customer_username" : "",
    "agente_id" : "",
    "agente_name" : "",
    "job_inicio_plan_date" : "",
    "job_inicio_plan_time" : "",
    "job_fin_plan_date" : "",
    "job_fin_plan_time" : "",
    "job_latitude_create" : "",
    "job_longitude_create" : "",
    "template" : "",
    "slotsSB":"",
    "slotsEB":"",
    "z": 0
    }
]

const newtaskSlice = createSlice({
    name: "newtask",
    initialState,
    reducers: {
        updateNewTaskField: (state, action) => {
            const { value, key} = action.payload;
            let value_prev = state[0][key]
            state[0][key] = value
            state[0]["z"] =  state[0]["z"] +1
            
            if (key != "slotsSB" && key != "slotsEB") {
                console.log('UPDATE STATE ----> ', key, ' : ', value_prev, ' cambio a: ', value , " z= ", state[0]["z"])
            }
            
      }
    }
});


export const { updateNewTaskField} = newtaskSlice.actions;
export default newtaskSlice.reducer;