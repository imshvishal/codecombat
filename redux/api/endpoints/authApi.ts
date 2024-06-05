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
      query: ({ username, email, password, re_password }) => ({
        method: "POST",
        url: "/users/",
        body: { username, email, password, re_password },
      }),
    }),
    userActivation: builder.mutation({
      query: ({ uid, token }) => ({
        url: "/users/activation/",
        method: "POST",
        body: { uid, token },
      }),
    }),
    resetPassword: builder.mutation({
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
  useUserActivationMutation,
  useResetPasswordMutation,
  useResetPasswordConfirmMutation,
} = authApi;
