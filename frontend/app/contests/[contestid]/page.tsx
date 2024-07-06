"use client";
import { title } from "@/components/primitives";
import {
  useLazyGetContestQuery,
  useLazyRegisterContestQuery,
  useLazyDeregisterContestQuery,
} from "@/redux/api/endpoints/contestApi";
import { Button, Chip, Image, Spinner } from "@nextui-org/react";
import { QueryStatus } from "@reduxjs/toolkit/query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ContestPage = ({ params }: { params: { contestid: string } }) => {
  const contestCode = params.contestid.split("-").join("");
  const desc = "### Hello ";
  const { user, isAuthenticated } = useSelector((state: any) => state.auth);
  const [getContest, { data: contest, isLoading, error, status }] =
    useLazyGetContestQuery();
  const [
    registerContest,
    { isLoading: regIsLoading, error: regError, status: regStatus },
  ] = useLazyRegisterContestQuery();
  const [
    deregisterContest,
    { isLoading: deregIsLoading, error: deregError, status: deregStatus },
  ] = useLazyDeregisterContestQuery();
  useEffect(() => {
    getContest(contestCode).then((res) => {
      console.log(res);
      console.log("X", contest, status, error);
    });
  }, [getContest]);
  const [time, setTime] = useState("");
  if (!(status == QueryStatus.fulfilled)) return;
  const start_time = Date.parse(contest.start_time);
  const end_time = Date.parse(contest.end_time);
  let scheduler = setInterval(() => {
    const now = Date.now();
    if (now < start_time) {
      const diff = start_time - now;
      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      setTime(
        `Starting in ${days ? `${days}d ` : ""}${hours ? `${hours}h ` : ""}${
          minutes ? `${minutes}m ` : ""
        }${seconds ? `${seconds}s` : ""}`
      );
    } else if (start_time < now && now < end_time) {
      const diff = now - start_time;
      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      setTime(
        `Started ${days ? `${days}d ` : ""}${hours ? `${hours}h ` : ""}${
          minutes ? `${minutes}m ` : ""
        }${seconds ? `${seconds}s` : ""} ago`
      );
    } else if (now > end_time) {
      setTime(`Ended on ${new Date(end_time).toLocaleString("en-IN")}`);
      clearInterval(scheduler);
    }
  }, 1000);
  return (
    <>
      {isLoading ? (
        <Spinner color="primary" size="lg" label="Loading Contest..." />
      ) : error ? (
        <>
          {error}
          {console.log(error)}
        </>
      ) : (
        <div className="h-full w-full md:w-2/3 my-10 px-5 sm:px-0 flex flex-col items-center sm:items-stretch">
          <Link href={`/contests`} className="w-max">
            <span className="flex mb-4">
              <ArrowLeft /> &nbsp; Back to Contests
            </span>
          </Link>
          <div className="flex justify-center sm:justify-between flex-col sm:flex-row mb-10 gap-5">
            <div className="flex justify-center flex-col items-center sm:items-start">
              <h1 className={title()}>{contest?.title}</h1>
              <p className="sm:pl-2 text-slate-500">{time}</p>
            </div>
            <div>
              <div className="flex flex-col items-center">
                {Date.now() < start_time ? (
                  isAuthenticated ? (
                    contest.enrolled_users.includes(user.id) ||
                    contest.pending_users.includes(user.id) ? (
                      <>
                        <Chip
                          className="-mb-3 z-10"
                          size="sm"
                          color={
                            contest.enrolled_users.includes(user.id)
                              ? "success"
                              : "warning"
                          }
                        >
                          {contest.enrolled_users.includes(user.id)
                            ? "Enrolled"
                            : "Pending"}
                        </Chip>
                        <Button
                          variant="bordered"
                          color="danger"
                          onClick={() => {
                            deregisterContest(contestCode).then(() => {
                              getContest(contestCode);
                            });
                          }}
                        >
                          Unregister
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="bordered"
                        className="mt-3"
                        color="primary"
                        isLoading={regIsLoading}
                        onClick={() => {
                          registerContest(contestCode).then(() => {
                            getContest(contestCode);
                          });
                        }}
                      >
                        Register
                      </Button>
                    )
                  ) : (
                    <Button
                      className="mt-3"
                      as={Link}
                      variant="bordered"
                      color="primary"
                      href={`/auth/login?next=/contests/${params.contestid}`}
                    >
                      Login to Register
                    </Button>
                  )
                ) : Date.now() > start_time && Date.now() < end_time ? (
                  <Button
                    className="mt-3"
                    as={Link}
                    variant="bordered"
                    color="primary"
                    href={`/contests/${params.contestid}`}
                  >
                    Start Contest
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContestPage;
