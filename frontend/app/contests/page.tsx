"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { FormEvent } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { title } from "@/components/primitives";
import { useRouter } from "next/navigation";
import {
  useGetUserEnrolledContestsQuery,
  useGetUserCreatedContestsQuery,
  useGetUserPastContestsQuery,
} from "@/redux/api/endpoints/userApi";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Divider, Image } from "@nextui-org/react";
import { ScrollShadow } from "@nextui-org/react";
import { AtSignIcon, Clock4Icon, Plus } from "lucide-react";
import Link from "next/link";
import { useVerifyMutation } from "@/redux/api/endpoints/authApi";
import { useProtected } from "@/redux/hooks/use-protected";
import { processImageUrl } from "@/lib/utils";

const Contests = ({
  contests,
  heading,
}: {
  contests: Array<any>;
  heading: string;
}) => {
  return (
    <>
      {contests.length == 0 ? null : (
        <div className="flex flex-col gap-5 mb-10 items-center">
          <h1 className={title({ size: "sm" })}>{heading}</h1>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:px-5">
            {contests?.map((contest: any) => (
              <Card
                key={contest.id}
                isFooterBlurred
                className="h-[200px] sm:h-[300px] text-slate-300"
              >
                <CardHeader className="absolute z-10 bg-black/40 flex-col items-start">
                  <span className="flex">
                    <AtSignIcon size={10} />
                    <p className="text-tiny lowercase font-bold -mt-1">
                      {contest.contest_code}
                    </p>
                  </span>
                  <h4 className="font-medium text-2xl">{contest.title}</h4>
                </CardHeader>
                <Image
                  removeWrapper
                  alt="Relaxing app background"
                  className="z-0 w-full h-full object-cover"
                  src={processImageUrl(contest.cover_image, 200)}
                />
                <CardFooter className="absolute bg-black/40 gap-2 bottom-0 z-10 flex flex-col md:flex-row">
                  <div className="flex flex-grow gap-2 items-center flex-col md:flex-row">
                    {contest.organizer.avatar && (
                      <Image
                        alt="Breathing app icon"
                        className="rounded-full w-10 h-10 bg-black"
                        src={processImageUrl(contest.organizer.avatar)}
                      />
                    )}
                    <div className="flex flex-col gap-1 items-center md:items-start">
                      <span className="flex">
                        <AtSignIcon size={10} />
                        <p className="text-tiny -mt-1">
                          {contest.organizer.username}
                        </p>
                      </span>
                      <span className="flex gap-1">
                        <Clock4Icon size={12} />
                        <p className="text-tiny -mt-0.5">
                          {contest.start_time}
                        </p>
                      </span>
                    </div>
                  </div>
                  <Button
                    as={Link}
                    href={`/contests/${contest.contest_code}`}
                    color="primary"
                    radius="full"
                    size="sm"
                  >
                    See Contest Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

const ContestsPage = () => {
  const router = useRouter();
  const { user } = useSelector((state: any) => state.auth);
  const {
    data: enrolled_contests,
    isLoading: ec_isLoading,
    error: ec_error,
  } = useGetUserEnrolledContestsQuery(user.username);
  const {
    data: created_contests,
    isLoading: cc_isLoading,
    error: cc_error,
  } = useGetUserCreatedContestsQuery(user.username);
  const {
    data: past_contests,
    isLoading: pc_isLoading,
    error: pc_error,
  } = useGetUserPastContestsQuery(user.username);
  const handleContestSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/contests/${e.currentTarget.contestId.value}`);
  };
  return (
    <div className="flex flex-col-reverse lg:flex-row w-full">
      <div className="p-8 lg:w-3/4 h-[65vh] lg:h-[90vh]">
        {ec_isLoading || cc_isLoading || pc_isLoading ? (
          <div className="w-full h-full flex sm:justify-center items-center justify-start">
            Loading...
          </div>
        ) : enrolled_contests.length ||
          created_contests.length ||
          past_contests.length ? (
          <ScrollShadow hideScrollBar className="h-full">
            <Contests contests={created_contests} heading="Created Contests" />
            <Contests
              contests={enrolled_contests}
              heading="Enrolled Contests"
            />
            <Contests contests={past_contests} heading="Past Contests" />
          </ScrollShadow>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            No Contests Found
          </div>
        )}
      </div>
      <Divider className="hidden lg:block" orientation="vertical" />
      <div className="flex flex-col h-max sm:h-full items-center sm:justify-center px-8 lg:w-1/4 gap-2">
        <div className="w-full flex flex-col items-center">
          <h1 className={title({ size: "sm" })}>Find Contest!</h1>
          <form
            className="gap-3 w-full flex flex-col items-center"
            onSubmit={handleContestSearchSubmit}
          >
            <Input
              variant="bordered"
              name="contestId"
              size="lg"
              label="Contest ID"
              labelPlacement="outside"
              errorMessage="Contest ID is required"
            />
            <Button
              type="submit"
              variant="flat"
              className="w-full sm:w-max"
              color="primary"
            >
              Get Details
            </Button>
          </form>
        </div>
        <Button
          as={Link}
          href="/contests/create"
          variant="flat"
          className="w-full sm:w-max"
          color="primary"
        >
          <Plus />
          Create Contest
        </Button>
      </div>
    </div>
  );
};

export default useProtected(ContestsPage);
