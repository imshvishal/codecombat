import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false
}

export const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload
            state.isAuthenticated = true
        },
        logout: (state) => {
            state.isAuthenticated = false
            state.user = null;
        }
    }
})

export const {login, logout} = authSlice.actions
export default authSlice.reducer