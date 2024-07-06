import { apiSlice } from "../apiSlice";

const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (username) => `/users/${username}/`,
    }),
    updateUser: builder.mutation({
      query: ({ username, body }) => ({
        method: "PATCH",
        url: `/users/${username}/`,
        body: body,
      }),
    }),
    getUserEnrolledContests: builder.query({
      query: (username) => `/users/${username}/enrolled_contests/`,
    }),
    getUserCreatedContests: builder.query({
      query: (username) => `/users/${username}/created_contests/`,
    }),
    getUserPastContests: builder.query({
      query: (username) => `/users/${username}/past_contests/`,
    }),
    getPendingContests: builder.query({
      query: (username) => `/users/${username}/pending_contests/`,
    }),
  }),
});

export const {
  useGetUserQuery,
  useUpdateUserMutation,
  useLazyGetUserQuery,
  useGetUserEnrolledContestsQuery,
  useGetUserCreatedContestsQuery,
  useGetUserPastContestsQuery,
} = userApi;
