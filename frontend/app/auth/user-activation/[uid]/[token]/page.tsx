"use client";

import React, { useEffect } from "react";
import { useActivateUserMutation } from "@/redux/api/endpoints/authApi";
import { QueryStatus } from "@reduxjs/toolkit/query";
import { Spinner } from "@nextui-org/spinner";
import Link from "next/link";
import { Button } from "@nextui-org/button";

const UserActivationPage = ({
  params,
}: {
  params: { token: string; uid: string };
}) => {
  const [activateUser, { isLoading, status, error, data }] =
    useActivateUserMutation();
  useEffect(() => {
    activateUser({ uid: params.uid, token: params.token });
  }, []);
  return (
    <div>
      {status == QueryStatus.uninitialized || status == QueryStatus.pending ? (
        <Spinner size="lg" label="Activating..." />
      ) : (
        <div className="flex flex-col gap-1 items-center">
        Account activation Successful!
        <Button as={Link} color="primary" className="w-fit" href="/auth/login">Login</Button>
        </div>
      )}
    </div>
  );
};

export default UserActivationPage;
