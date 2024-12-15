"use client";

import ContestInfoForm, { contestSchema } from "@/components/custom/contest";
import QuestionInfoForm from "@/components/custom/question";
import { title } from "@/components/primitives";
import { Form } from "@/components/ui/form";
import { useUpdateContestMutation, useLazyGetContestQuery } from "@/redux/api/endpoints/contestApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useProtected } from "@/redux/hooks/use-protected";
import Link from "next/link";
import Image from "next/image";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const ContestEditPage = ({ params }: { params: { contestid: string } }) => {
  const [isEditing, setIsEditing] = useState(true);
  const contestCode = params.contestid.split("-").join("");
  const [coverImage, setCoverImage] = useState<FileList | null>(null);

  const user = useSelector((state: any) => state.auth.user);
  const form = useForm({
    resolver: zodResolver(contestSchema),
  });
  const [getContest, { data: contest }] = useLazyGetContestQuery();
  const [updateContest, { isLoading: isUpdating }] = useUpdateContestMutation();
  const router = useRouter();
  useEffect(() => {
    getContest(contestCode)
      .unwrap()
      .then((data) => {
        console.log("LOADED", data);

        form.reset(data);
        const start_time = new Date(data.start_time);
        const offset = start_time.getTimezoneOffset();
        const adjustedDate = new Date(start_time.getTime() - offset * 60 * 1000);
        form.setValue("start_time", adjustedDate.toISOString().slice(0, 16));
        form.setValue("is_private", data.is_private);
      });
  }, []);
  const {
    fields: questions,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control: form.control,
    name: "questions",
    keyName: "_id",
  });

  async function handleSubmit(data: any) {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    formData.set("questions", JSON.stringify(data.questions));
    if (coverImage) {
      formData.append("cover_image", coverImage[0]);
    }
    try {
      await updateContest({
        contest_code: contestCode,
        body: formData,
      }).unwrap();
      toast({
        title: "Contest Updated",
        description: "Contest has been updated successfully",
        variant: "default",
      });
      router.push(`/contests/${contestCode}`);
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  }

  if (user.id != contest?.organizer.id) {
    return (
      <>
        <h1 className={title()}>You don't have permission to edit this contest.</h1>
        <Button as={Link} href="/contests" variant="bordered" color="primary" className="mt-5">
          See Contests
        </Button>
      </>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-10 my-10">
      {contest?.cover_image ? (
        <div className="rounded-full border-4 border-primary p-0.5">
          <Image
            src={contest?.cover_image}
            alt="cover"
            width={200}
            height={125}
            className="border-2 border-primary p-0.5 rounded-full h-[100px] w-[100px]"
          />
        </div>
      ) : null}
      <span className="z-10">
        <h1 className={title()}>Edit Contest</h1>
      </span>

      <div className="w-full sm:w-2/3 md:w-1/2 px-10 sm:px-0 gap-2 z-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-2">
            <ContestInfoForm form={form} setCoverImage={setCoverImage} isDisabled={!isEditing} />
            {questions.map((question, qIndex) => (
              <QuestionInfoForm
                isDisabled={!isEditing}
                key={question._id}
                form={form}
                question={question}
                qIndex={qIndex}
                removeQuestion={removeQuestion}
              />
            ))}
            <div className="w-full flex justify-end">
              <Button
                isDisabled={!isEditing}
                size="lg"
                type="button"
                variant="bordered"
                color="primary"
                className="my-10"
                onClick={() => appendQuestion({})}
              >
                <Plus /> Add Question
              </Button>
            </div>
            <Button isDisabled={!isEditing} size="lg" type="submit" variant="flat" color="primary" isLoading={isUpdating}>
              Update
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default useProtected(ContestEditPage);
