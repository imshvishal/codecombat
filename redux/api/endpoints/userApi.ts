import { apiSlice } from "../apiSlice";

const userApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        user: builder.query({
            query: ({username}) => `/users/${username}/`
        }),
        updateUser: builder.mutation({
            query: (body) => ({
                method: "PATCH",
                url: `/users/@me/`,
                body: body
            })
        })
    })
})

export const {useUserQuery, useUpdateUserMutation} = userApi;