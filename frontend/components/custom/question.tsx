import { Button } from "@nextui-org/button";
import { Textarea } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/react";
import { X, Plus } from "lucide-react";
import { Input } from "@nextui-org/input";
import React from "react";
import { Controller } from "react-hook-form";

const RichTextEditor = dynamic(() => import("../rich-text-editor"), {
  ssr: false,
});
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "../ui/form";
import { z } from "zod";
import dynamic from "next/dynamic";
import { useDeleteQuestionMutation } from "@/redux/api/endpoints/contestApi";

export const questionSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, { message: "Please enter a question" }),
  description: z.string().default(""),
  difficulty: z.enum(["E", "M", "H"]).default("E"),
  code_template: z.string().optional(),
  duration: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, {
    message: "Please enter a valid duration in hh:mm:ss format.",
  }),
  testcases: z
    .array(
      z.object({
        id: z.number().optional(),
        input: z.string().min(1, { message: "Please enter input" }),
        output: z.string().min(1, { message: "Please enter output" }),
      })
    )
    .optional(),
});

const QuestionInfoForm = ({
  form,
  question,
  qIndex,
  removeQuestion,
  isDisabled,
}: any) => {
  const [deleteQuestion, { isLoading: isDeleting }] =
    useDeleteQuestionMutation();
  return (
    <div key={question.id} className="flex flex-col gap-2 mt-10">
      <div className="flex justify-between">
        <div></div>
        <p className="text-2xl">Question: {qIndex + 1}</p>
        <Button
          isLoading={isDeleting}
          isDisabled={isDisabled}
          variant="flat"
          size="lg"
          color="danger"
          onClick={() => {
            if (question.id) {
              deleteQuestion(question.id).unwrap();
            }
            removeQuestion(qIndex);
          }}
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
                isDisabled={isDisabled}
                variant="bordered"
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
                isDisabled={isDisabled}
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
                isDisabled={isDisabled}
                variant="bordered"
                label="Difficulty"
                labelPlacement="outside"
                {...field}
                defaultSelectedKeys={field.value || "E"}
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
                isDisabled={isDisabled}
                variant="bordered"
                label="Duration"
                labelPlacement="outside"
                placeholder="hh:mm:ss format"
                {...field}
                value={field.value}
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
              <p className="text-xl">Testcases: {(field.value || []).length}</p>
              <Button
                isDisabled={isDisabled}
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
              <div key={tIndex} className="flex gap-2 w-full  items-center">
                <FormField
                  control={form.control}
                  name={`questions.${qIndex}.testcases.${tIndex}.input`}
                  render={({ field: inputField }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Textarea
                          isDisabled={isDisabled}
                          variant="bordered"
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
                          isDisabled={isDisabled}
                          variant="bordered"
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
                  isDisabled={isDisabled}
                  variant="flat"
                  isIconOnly
                  onClick={() => {
                    console.log(testcase.id);
                    const updatedTestcases = form
                      .getValues(`questions.${qIndex}.testcases`)
                      .filter((el: any, index: number) => index != tIndex);
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
  );
};

export default QuestionInfoForm;
