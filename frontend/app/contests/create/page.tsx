"use client";

import { useProtected } from "@/redux/hooks/use-protected";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useTheme } from "next-themes";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { title } from "@/components/primitives";
import { any, number, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Checkbox } from "@nextui-org/checkbox";
import Link from "next/link";
import { LockIcon, Plus, X } from "lucide-react";
import { Select, SelectItem } from "@nextui-org/react";
import { useCreateContestMutation } from "@/redux/api/endpoints/contestApi";
import RichTextEditor from "@/components/rich-text-editor";

const questionSchema = z.object({
  title: z.string().min(1, { message: "Please enter a question" }),
  description: z.string().min(1, { message: "Please enter a description" }),
  difficulty: z.enum(["E", "M", "H"]).default("E"),
  code_template: z.string().optional(),
  duration: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, {
    message: "Please enter a valid duration in hh:mm:ss format.",
  }),
  testcases: z
    .array(
      z.object({
        input: z.string().min(1, { message: "Please enter input" }),
        output: z.string().min(1, { message: "Please enter output" }),
      })
    )
    .optional(),
});

const contestSchema = z.object({
  title: z.string().min(1, { message: "Please enter a title" }),
  description: z.string().optional(),
  allow_auto_complete: z.boolean().default(false),
  start_time: z.string(),
  is_private: z.boolean().default(false),
  questions: z.array(questionSchema),
});

const ContestForm = () => {
  const [coverImage, setCoverImage] = useState<FileList | null>(null);
  const [createContestApi, { isLoading }] = useCreateContestMutation();
  const { theme } = useTheme();

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
    console.log(data);

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    formData.append("organizer", user.id);
    if (coverImage) {
      formData.append("cover_image", coverImage[0]);
    }
    formData.set("questions", JSON.stringify(data.questions));
    createContestApi(formData).unwrap();
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
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      label="Title"
                      labelPlacement="outside"
                      placeholder="Contest Title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl onError={() => null}>
                    <RichTextEditor
                      field={field}
                      placeholder="Contest Description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cover_image"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      label="Cover Image"
                      accept="image/*"
                      labelPlacement="outside"
                      placeholder="Contest Cover Image"
                      classNames={{
                        input:
                          "file:h-full file:bg-primary file:border-0 -ml-[12px] rounded-lg file:cursor-pointer",
                      }}
                      type="file"
                      onChange={(e) => {
                        setCoverImage(e.target.files);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="start_time"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      label="Start Time"
                      labelPlacement="outside"
                      placeholder="Contest Start Time"
                      type="datetime-local"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between">
              <FormField
                control={form.control}
                name="is_private"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Private &nbsp;</FormLabel>
                    <FormControl>
                      <Checkbox icon={<LockIcon />} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="allow_auto_complete"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Auto Complete &nbsp;</FormLabel>
                    <FormControl>
                      <Checkbox {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {questions.map((question, qIndex) => (
              <div key={question.id} className="flex flex-col gap-2 mt-10">
                <div className="flex justify-between">
                  <div></div>
                  <p className="text-2xl">Question: {qIndex + 1}</p>
                  <Button
                    variant="flat"
                    size="lg"
                    color="danger"
                    onClick={() => removeQuestion(qIndex)}
                    isIconOnly
                  >
                    <X />
                  </Button>
                </div>
                <FormField
                  control={form.control}
                  name={`questions.${qIndex}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          label="Title"
                          labelPlacement="outside"
                          placeholder="Question Title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`questions.${qIndex}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel onError={() => null}>Description</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          field={field}
                          placeholder="Question Description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`questions.${qIndex}.difficulty`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          label="Difficulty"
                          labelPlacement="outside"
                          {...field}
                          defaultSelectedKeys="E"
                        >
                          <SelectItem key={"E"} value="E">
                            Easy
                          </SelectItem>
                          <SelectItem key={"M"} value="M">
                            Medium
                          </SelectItem>
                          <SelectItem key={"H"} value="H">
                            Hard
                          </SelectItem>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`questions.${qIndex}.duration`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          label="Duration"
                          labelPlacement="outside"
                          placeholder="hh:mm:ss format"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Controller
                  control={form.control}
                  name={`questions.${qIndex}.testcases`}
                  render={({ field, fieldState }) => (
                    <>
                      <div className="flex justify-between">
                        <p className="text-xl">
                          Testcases: {(field.value || []).length}
                        </p>
                        <Button
                          size="sm"
                          variant="flat"
                          color="success"
                          isIconOnly
                          onClick={() => {
                            field.onChange([
                              ...(field.value || []),
                              { input: "", output: "" },
                            ]);
                          }}
                        >
                          <Plus />
                        </Button>
                      </div>
                      {field.value?.map((testcase: any, tIndex: number) => (
                        <div
                          key={tIndex}
                          className="flex gap-2 w-full  items-center"
                        >
                          <FormField
                            control={form.control}
                            name={`questions.${qIndex}.testcases.${tIndex}.input`}
                            render={({ field: inputField }) => (
                              <FormItem className="w-full">
                                <FormControl>
                                  <Textarea
                                    classNames={{ input: "resize-y" }}
                                    placeholder="Input"
                                    {...inputField}
                                    value={testcase.input}
                                    onChange={(e) => {
                                      const updatedTestcases = field.value.map(
                                        (el: any, index: number) => {
                                          if (index == tIndex) {
                                            return {
                                              ...el,
                                              input: e.target.value,
                                            };
                                          }
                                          return el;
                                        }
                                      );
                                      field.onChange(updatedTestcases);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`questions.${qIndex}.testcases.${tIndex}.output`}
                            render={({ field: outputField }) => (
                              <FormItem className="w-full">
                                <FormControl>
                                  <Textarea
                                    classNames={{ input: "resize-y" }}
                                    placeholder="Output"
                                    {...outputField}
                                    value={testcase.output}
                                    onChange={(e) => {
                                      const updatedTestcases = field.value.map(
                                        (el: any, index: number) => {
                                          if (index == tIndex) {
                                            return {
                                              ...el,
                                              output: e.target.value,
                                            };
                                          }
                                          return el;
                                        }
                                      );
                                      field.onChange(updatedTestcases);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            color="danger"
                            size="sm"
                            variant="flat"
                            isIconOnly
                            onClick={() => {
                              const updatedTestcases = form
                                .getValues(`questions.${qIndex}.testcases`)
                                .filter(
                                  (el: any, index: number) => index != tIndex
                                );
                              form.setValue(
                                `questions.${qIndex}.testcases`,
                                updatedTestcases
                              );
                            }}
                          >
                            <X />
                          </Button>
                        </div>
                      ))}
                    </>
                  )}
                />
              </div>
            ))}
            <div className="w-full flex justify-end">
              <Button
                size="lg"
                type="button"
                variant="bordered"
                color="success"
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
