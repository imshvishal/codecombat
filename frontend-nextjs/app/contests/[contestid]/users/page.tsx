"use client";

import { title } from "@/components/primitives";
import { useLazyGetContestQuery } from "@/redux/api/endpoints/contestApi";
import { useProtected } from "@/redux/hooks/use-protected";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { Spinner } from "@nextui-org/spinner";
import { ArrowLeft, ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const ContestUserPage = ({ params }: { params: { contestid: string } }) => {
  const user = useSelector((state: any) => state.auth.user);
  const [getContest, { data: contest, isLoading: contestIsLoading }] = useLazyGetContestQuery();
  useEffect(() => {
    getContest(params.contestid).unwrap();
  }, []);
  if (contestIsLoading) {
    return <Spinner label="Loading Contest..." color="primary" />;
  } else if (user.id != contest?.organizer.id) {
    return (
      <>
        <h1 className={title()}>You don't have permission to edit this contest.</h1>
        <Button as={Link} href="/contests" variant="bordered" color="primary" className="mt-5">
          See Contests
        </Button>
      </>
    );
  } else {
    return (
      <div className="w-full h-full mt-10 md:w-2/3">
        <Link href={`/contests/${params.contestid}`} className="w-max">
          <span className="flex mb-4">
            <ArrowLeft /> &nbsp; Back to Contest
          </span>
        </Link>
        <p className={title({ size: "sm" })}>Users</p>
        <div className="flex h-[60vh] justify-center place-items-center">
          <div>
            <p className="text-xl bg-primary rounded-lg">Pending users</p>
          </div>
          <div className="flex flex-col">
            <Button color="primary" variant="light" isIconOnly>
              <ArrowLeftCircle />
            </Button>
            <Button color="danger" variant="light" isIconOnly>
              <ArrowRightCircle />
            </Button>
          </div>
        </div>
      </div>
    );
  }
};

export default useProtected(ContestUserPage);
