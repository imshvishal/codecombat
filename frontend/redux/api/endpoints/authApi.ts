import { apiSlice } from "../apiSlice";

const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ username, password }) => ({
        url: "/auth/login/",
        method: "POST",
        body: { username, password },
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        method: "POST",
        url: "/auth/logout/",
      }),
    }),
    refreshLogin: builder.mutation({
      query: () => ({
        method: "POST",
        url: "/auth/refresh/",
      }),
    }),
    verify: builder.mutation({
      query: () => ({
        method: "POST",
        url: "/auth/verify/",
      }),
    }),
    signUp: builder.mutation({
      query: (body) => ({
        method: "POST",
        url: "/users/",
        body: body,
      }),
    }),
    activateUser: builder.mutation({
      query: ({ uid, token }) => ({
        url: "/users/activation/",
        method: "POST",
        body: { uid, token },
      }),
    }),
    sendUserActivationMail: builder.mutation({
      query: (email) => ({
        url: "/users/resend_activation/",
        method: "POST",
        body: { email },
      }),
    }),
    sendUsernameResetMail: builder.mutation({
      query: (email) => ({
        url: "/users/reset_username/",
        method: "POST",
        body: { email },
      }),
    }),
    resetUsernameConfirm: builder.mutation({
      query: ({ uid, token, new_username, re_new_password }) => ({
        url: "/users/reset_username_confirm/",
        method: "POST",
        body: { uid, token, new_username },
      }),
    }),
    sendPasswordResetMail: builder.mutation({
      query: (email) => ({
        url: "/users/reset_password/",
        method: "POST",
        body: { email },
      }),
    }),
    resetPasswordConfirm: builder.mutation({
      query: ({ uid, token, new_password, re_new_password }) => ({
        url: "/users/reset_password_confirm/",
        method: "POST",
        body: { uid, token, new_password, re_new_password },
      }),
    }),
    //TODO: Resend Username Set And Reset
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRefreshLoginMutation,
  useVerifyMutation,
  useSignUpMutation,
  useActivateUserMutation,
  useSendUserActivationMailMutation,
  useSendPasswordResetMailMutation,
  useResetPasswordConfirmMutation,
  useSendUsernameResetMailMutation,
} = authApi;
