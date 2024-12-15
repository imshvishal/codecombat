"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "@/redux/store";
import { useLazyGetUserQuery } from "@/redux/api/endpoints/userApi";
import { login } from "@/redux/states/authStateSlice";
import { Spinner } from "@nextui-org/spinner";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);
  const [getUser] = useLazyGetUserQuery();
  React.useEffect(() => {
    if (!user) {
      getUser("@me")
        .unwrap()
        .then((data) => {
          dispatch(login(data));
        })
        .catch((error) => {})
        .then(() => setIsLoading(false));
    }
  }, []);
  return isLoading ? (
    <div className="flex justify-center items-center h-screen">
      <Spinner size="lg" label="Loading!" />
    </div>
  ) : (
    <>{children}</>
  );
};

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <NextThemesProvider {...themeProps}>
      <Provider store={store}>
        <AuthProvider>{children}</AuthProvider>
      </Provider>
    </NextThemesProvider>
  );
}
