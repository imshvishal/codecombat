"use client";

import { useProtected } from "@/redux/hooks/use-protected";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Form } from "@/components/ui/form";
import { title } from "@/components/primitives";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useCreateContestMutation } from "@/redux/api/endpoints/contestApi";
import ContestInfoForm, { contestSchema } from "@/components/custom/contest";
import QuestionInfoForm from "@/components/custom/question";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const ContestForm = () => {
  const [coverImage, setCoverImage] = useState<FileList | null>(null);
  const [createContestApi, { isLoading }] = useCreateContestMutation();
  const router = useRouter();
  const user = useSelector((state: any) => state.auth.user);
  const form = useForm({
    resolver: zodResolver(contestSchema),
  });
  const {
    fields: questions,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  async function handleSubmit(data: any) {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    formData.append("organizer", user.id);
    formData.set("questions", JSON.stringify(data.questions));
    if (coverImage) {
      formData.append("cover_image", coverImage[0]);
    }
    try {
      await createContestApi(formData).unwrap();
      toast({
        title: "Contest Created",
        description: "Contest has been created successfully",
        variant: "default",
      });
      router.push(`/contests/`);
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  }

  if (user.user_type == "DEV") {
    return (
      <>
        <h1 className={title()}>
          You don't have permission to create a contest.
        </h1>
        <Button
          as={Link}
          href="/contests"
          variant="bordered"
          color="primary"
          className="mt-5"
        >
          Go to contests
        </Button>
      </>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-10 my-10">
      <h1 className={title()}>Create Contest</h1>
      <div className="w-full sm:w-2/3 md:w-1/2 px-10 sm:px-0 gap-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-2"
            encType="multipart/form-data"
          >
            <ContestInfoForm form={form} setCoverImage={setCoverImage} />
            {questions.map((question, qIndex) => (
              <QuestionInfoForm
                key={question.id}
                form={form}
                question={question}
                qIndex={qIndex}
                removeQuestion={removeQuestion}
              />
            ))}
            <div className="w-full flex justify-end">
              <Button
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
            <Button
              isLoading={isLoading}
              size="lg"
              type="submit"
              variant="flat"
              color="primary"
            >
              Create
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default useProtected(ContestForm);
