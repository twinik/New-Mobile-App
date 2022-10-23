import { createSlice } from "@reduxjs/toolkit";

const initialState = [
    {
    "map_view" : false,
    "filters_on": false,
    "user_log_uuid": "",
    "z":0
    }
]

const appControlslice = createSlice({
    name: "appControlslice",
    initialState,
    reducers: {
        updateappControlsliceField: (state, action) => {
            const { value, key} = action.payload;
            console.log(action.payload)
            let value_prev = state[0][key]
            state[0][key] = value
            state[0]["z"] =  state[0]["z"] +1
            console.log('appControlSlice | parametro: ', value, '--> valor previo:', value_prev, '--> cambia a:', state[0][key], )               
      }
    }
});


export const { updateappControlsliceField} = appControlslice.actions;
export default appControlslice.reducer;