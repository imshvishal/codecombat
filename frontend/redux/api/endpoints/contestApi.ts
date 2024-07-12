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
    updateContest: builder.mutation({
      query: ({ contest_code, body }) => ({
        method: "PATCH",
        url: `/contests/${contest_code}/`,
        body: body,
      }),
    }),
    getQuestion: builder.query({
      query: (questionID) => `/questions/${questionID}/`,
    }),
    deleteQuestion: builder.mutation({
      query: (questionID) => ({
        method: "DELETE",
        url: `/questions/${questionID}/`,
      }),
    }),
    deleteTestCase: builder.mutation({
      query: (testCaseID) => ({
        method: "DELETE",
        url: `/testcases/${testCaseID}/`,
      }),
    }),
    createSubmission: builder.mutation({
      query: (body) => ({
        method: "POST",
        url: `/submissions/run/`,
        body: body,
      }),
    }),
    createAttemptStatus: builder.mutation({
      query: (body) => ({
        method: "POST",
        url: `/attempt-status/`,
        body: body,
      }),
    }),
    updateAttemptStatus: builder.mutation({
      query: (body) => ({
        method: "PATCH",
        url: `/attempt-status/${body.id}/`,
        body: body,
      }),
    }),
  }),
});

export const {
  useGetQuestionQuery,
  useLazyGetQuestionQuery,
  useGetContestQuery,
  useLazyGetContestQuery,
  useLazyRegisterContestQuery,
  useLazyDeregisterContestQuery,
  useCreateContestMutation,
  useUpdateContestMutation,
  useDeleteQuestionMutation,
  useCreateSubmissionMutation,
  useCreateAttemptStatusMutation,
  useUpdateAttemptStatusMutation,
} = contestApi;
