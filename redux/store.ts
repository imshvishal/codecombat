import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./states/authStateSlice"
import { apiSlice } from "./api/apiSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: getMiddleWare => getMiddleWare().concat(apiSlice.middleware)
})