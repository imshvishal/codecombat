import { apiSlice } from "../apiSlice";

const contestApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getContest: builder.query({
      query: (contestid) => `/contests/${contestid}/`,
    }),
    registerContest: builder.query({
      query: (contestid) => `/contests/${contestid}/register/`,
    }),
    deregisterContest: builder.query({
      query: (contestid) => `/contests/${contestid}/deregister/`,
    }),
    createContest: builder.mutation({
      query: (body) => ({
        method: "POST",
        url: "/contests/",
        body: body,
      }),
    }),
  }),
});

export const {
  useLazyGetContestQuery,
  useLazyRegisterContestQuery,
  useLazyDeregisterContestQuery,
  useCreateContestMutation,
} = contestApi;
