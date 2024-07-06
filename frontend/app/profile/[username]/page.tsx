"use client";

import { title } from "@/components/primitives";
import { processImageUrl } from "@/lib/utils";
import { Avatar } from "@nextui-org/avatar";
import { useSelector } from "react-redux";
import { useLazyGetUserQuery } from "@/redux/api/endpoints/userApi";
import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ProfilePage = ({ params }: { params: { username: string } }) => {
  const { user, isAuthenticated } = useSelector((state: any) => state.auth);
  const [profileData, setProfileData] = useState(user);
  const [getUser, { isLoading, error }] = useLazyGetUserQuery();
  const router = useRouter();
  useEffect(() => {
    if (params.username != "%40me" && params.username !== user?.username) {
      getUser(params.username)
        .unwrap()
        .then((response) => {
          setProfileData(response);
        });
    }
  }, [isAuthenticated, params.username]);
  return (
    <>
      {!isAuthenticated && params.username == "%40me" ? (
        <>
          <Button as={Link} color="primary" href="/auth/login?next=/profile/@me" variant="bordered">
            Login to view
          </Button>
        </>
      ) : isLoading ? (
        <Spinner color="primary" size="lg" label="Loading Profile..." />
      ) : (
        <>
          <p className={title()}>{profileData?.username}</p>
          <br />
          <br />
          <Avatar
            src={processImageUrl(profileData?.avatar)}
            color="primary"
            isBordered
            style={{ width: 200, height: 200 }}
          ></Avatar>
        </>
      )}
    </>
  );
};

export default ProfilePage;
