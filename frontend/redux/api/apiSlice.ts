
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import {Mutex} from "async-mutex"
import { login, logout } from "../states/authStateSlice";

import type {
	BaseQueryFn,
	FetchArgs,
	FetchBaseQueryError,
} from '@reduxjs/toolkit/query';

const mutex = new Mutex();
const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api',
    credentials: "include"
})

const baseQueryWithReauth: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError
> = async (args, api, extraOptions) => {
	await mutex.waitForUnlock();
	let result = await baseQuery(args, api, extraOptions);

	if (result.error && result.error.status === 401) {
		if (!mutex.isLocked()) {
			const release = await mutex.acquire();
			try {
				const refreshResult = await baseQuery(
					{
						url: '/auth/refresh/',
						method: 'POST',
					},
					api,
					extraOptions
				);
				if (refreshResult.data) {
					api.dispatch(login(refreshResult.data));
					result = await baseQuery(args, api, extraOptions);
				} else {
					api.dispatch(logout());
				}
			} finally {
				release();
			}
		} else {
			await mutex.waitForUnlock();
			result = await baseQuery(args, api, extraOptions);
		}
	}
	return result;
};

export const apiSlice = createApi({
	reducerPath: 'api',
	baseQuery: baseQueryWithReauth,
	endpoints: builder => ({}),
});
