"use client";
import { subtitle, title } from "@/components/primitives";
import { useLazyGetContestQuery, useLazyRegisterContestQuery, useLazyDeregisterContestQuery } from "@/redux/api/endpoints/contestApi";
import { Button, Card, CardBody, CardHeader, Chip, Image, Spinner } from "@nextui-org/react";
import { QueryStatus } from "@reduxjs/toolkit/query";
import {
  ArrowLeft,
  ArrowRight,
  ArrowRightCircle,
  CheckCircle,
  Edit,
  Edit2,
  Edit2Icon,
  Pencil,
  Share2Icon,
  Trash2,
  UserPlus2Icon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ContestPage = ({ params }: { params: { contestid: string } }) => {
  const router = useRouter();
  const contestCode = params.contestid.split("-").join("");
  const { user, isAuthenticated } = useSelector((state: any) => state.auth);
  const [getContest, { data: contest, isLoading, error, status }] = useLazyGetContestQuery();
  const [registerContest, { isLoading: regIsLoading, error: regError, status: regStatus }] = useLazyRegisterContestQuery();
  const [deregisterContest, { isLoading: deregIsLoading, error: deregError, status: deregStatus }] = useLazyDeregisterContestQuery();
  const [userIsPending, setUserIsPending] = useState(false);
  const [userIsEnrolled, setUserIsEnrolled] = useState(false);

  useEffect(() => {
    getContest(contestCode)
      .unwrap()
      .then((contest) => {
        console.log(contest);

        setUserIsEnrolled(contest.enrolled_users.filter((en_user: any) => en_user.id == user?.id).length > 0);
        setUserIsPending(contest.pending_users.filter((en_user: any) => en_user.id == user?.id).length > 0);
      });
  }, []);
  const [time, setTime] = useState("");
  let start_time = Date.parse(contest?.start_time);
  let end_time = Date.parse(contest?.end_time);
  let scheduler = setInterval(() => {
    const now = Date.now();
    const diff = start_time - now;
    if (Math.floor(diff / 1000) == 0) {
      clearInterval(scheduler);
      window.location.reload();
      return;
    }
    if (now < start_time) {
      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      setTime(`Starting in ${days ? `${days}d ` : ""}${hours ? `${hours}h ` : ""}${minutes ? `${minutes}m ` : ""}${seconds ? `${seconds}s` : ""}`);
    } else if (start_time <= now && now <= end_time) {
      const diff = now - start_time;
      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      setTime(`Started ${days ? `${days}d ` : ""}${hours ? `${hours}h ` : ""}${minutes ? `${minutes}m ` : ""}${seconds ? `${seconds}s` : ""} ago`);
    } else if (now > end_time) {
      setTime(`Ended on ${new Date(end_time).toLocaleString("en-IN")}`);
      clearInterval(scheduler);
    }
  }, 1000);
  return (
    <>
      {isLoading ? (
        <Spinner color="primary" size="lg" label="Loading Contest..." />
      ) : !contest ? (
        <p className={title()}>No contest found: {contestCode}</p>
      ) : (
        <div className="h-full w-full md:w-2/3 mt-10 px-5 sm:px-0 flex flex-col items-center sm:items-stretch">
          <Link href={`/contests`} className="w-max">
            <span className="flex mb-4">
              <ArrowLeft /> &nbsp; Back to Contests
            </span>
          </Link>
          <div className="flex justify-center sm:justify-between flex-col sm:flex-row mb-10 gap-5">
            <div className="flex justify-center flex-col items-center sm:items-start">
              <h1 className={title()}>{contest?.title}</h1>
              <p className="sm:pl-0.5 text-slate-500">{time}</p>
            </div>
            <div>
              <div className="flex flex-col items-center">
                {!isAuthenticated ? (
                  <Button className="mt-3" as={Link} variant="bordered" color="primary" href={`/auth/login?next=/contests/${params.contestid}`}>
                    Login to View
                  </Button>
                ) : contest.organizer.id == user.id ? (
                  <div>
                    <Button
                      className="mt-3"
                      variant="light"
                      title="Share Contest"
                      isIconOnly
                      color="primary"
                      onClick={() => {
                        alert("Not Implemented!");
                      }}
                    >
                      <Share2Icon />
                    </Button>
                    <Button
                      className="mt-3"
                      variant="light"
                      title="Check Pending and Enrolled users"
                      isIconOnly
                      as={Link}
                      color="primary"
                      href={`/contests/${params.contestid}/users`}
                    >
                      <UserPlus2Icon />
                    </Button>
                    <Button
                      className="mt-3"
                      variant="light"
                      title="Edit Contest"
                      isIconOnly
                      as={Link}
                      color="primary"
                      href={`/contests/${params.contestid}/edit`}
                    >
                      <Edit />
                    </Button>
                    <Button
                      className="mt-3"
                      variant="light"
                      title="Delete Contest"
                      isIconOnly
                      color="danger"
                      onClick={() => {
                        alert("Not Implemented!");
                      }}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ) : Date.now() < start_time ? (
                  userIsEnrolled || userIsPending ? (
                    <>
                      <Chip className="-mb-3 z-10" size="sm" color={userIsEnrolled ? "success" : "warning"}>
                        {userIsEnrolled ? "Enrolled" : "Pending"}
                      </Chip>
                      <Button
                        variant="bordered"
                        isDisabled={!(Date.now() < start_time)}
                        color="danger"
                        isLoading={deregIsLoading}
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
                      isLoading={regIsLoading}
                      color="primary"
                      isDisabled={!(Date.now() < start_time)}
                      onClick={() => {
                        registerContest(contestCode).then(() => {
                          getContest(contestCode);
                        });
                      }}
                    >
                      Register
                    </Button>
                  )
                ) : null}
              </div>
            </div>
          </div>
          <div className="text-center sm:text-left mb-10" dangerouslySetInnerHTML={{ __html: contest.description }} />

          {contest.questions.length > 0 ? <p className={title({ size: "sm" })}>Questions:</p> : null}
          <div className="w-[50%]">
            {typeof contest.questions == "object"
              ? contest.questions.map((question: any, qIndex: number) => (
                  <Card key={qIndex} className="my-5" radius="lg">
                    <CardHeader className="flex flex-col sm:flex-row sm:justify-between text-center sm:text-left">
                      <p className={subtitle()}>
                        {qIndex + 1}. {question.title}
                      </p>
                      <div className="flex h-full items-center gap-3">
                        <Chip color={question.difficulty == "E" ? "success" : question.difficulty == "M" ? "warning" : "danger"} variant="flat">
                          {question.difficulty == "E" ? "Easy" : question.difficulty == "M" ? "Medium" : "Hard"}
                        </Chip>
                        <Button
                          as={Link}
                          variant="bordered"
                          color={question.submission ? "success" : "primary"}
                          radius="full"
                          size="sm"
                          href={`/contests/${params.contestid}/attempt/${question.id}`}
                        >
                          {!question.submission ? "Attempt" : "Submitted"}
                          {!question.submission ? <ArrowRight size={15} /> : <CheckCircle size={15} />}
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              : null}
          </div>
        </div>
      )}
    </>
  );
};

export default ContestPage;
