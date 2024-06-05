"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { Provider, useDispatch, useSelector } from "react-redux"
import { store } from "@/redux/store";
import { useUserQuery } from "@/redux/api/endpoints/userApi";
import { login } from "@/redux/states/authStateSlice";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const dispatch = useDispatch();
  // const {user} = useSelector((state: any) => state.auth)
  // console.log(1, user);
  
  // React.useEffect(() => {
    try{
      // if (!user){
        const {data, isLoading} = useUserQuery({username: "@me"});
        dispatch(login(data));
      // }
      }catch(error){}
  // }, [])
  return children
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <Provider store={store}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Provider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
