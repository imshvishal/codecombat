"use client"
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";

export function useProtected(Component: any) {
  return function ProtectedComponent(props: any) {
    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated)
    const router = useRouter();
    const path = usePathname();
    if (!isAuthenticated){
      return router.push(`/auth/login?next=${path}`);
    }
    return (
      <Component {...props} />
    );
  };
}
