import { Checkbox } from "@nextui-org/checkbox";
import { LockIcon } from "lucide-react";
import { Input } from "@nextui-org/input";
import React from "react";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "../ui/form";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { questionSchema } from "./question";
import dynamic from "next/dynamic";

const formatDatetimeLocal = (datetimeString: string) => {
  const date = new Date(datetimeString);
  const offset = date.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
  console.log(adjustedDate.toISOString().slice(0, 16));

  return adjustedDate.toISOString().slice(0, 16);
};

export const contestSchema = z.object({
  title: z.string().min(1, { message: "Please enter a title" }),
  description: z.string().default(""),
  allow_auto_complete: z.boolean().default(false),
  start_time: z.string(),
  is_private: z.boolean().default(false),
  questions: z.array(questionSchema),
  organizer: z
    .any()
    .optional()
    .transform((data) => data?.id),
  contest_code: z.string().optional(),
  id: z.number().optional(),
});

const RichTextEditor = dynamic(() => import("../rich-text-editor"), {
  ssr: false,
});

const ContestInfoForm = ({
  form,
  setCoverImage,
  isDisabled = false,
}: {
  form: UseFormReturn;
  setCoverImage: any;
  isDisabled?: boolean;
}) => {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                variant="bordered"
                isDisabled={isDisabled}
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
                isDisabled={isDisabled}
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
                variant="bordered"
                isDisabled={isDisabled}
                label="Cover Image"
                accept="image/*"
                labelPlacement="outside"
                placeholder="Contest Cover Image"
                classNames={{
                  input:
                    "file:h-full file:bg-primary file:border-0 -ml-[12px] rounded-lg file:cursor-pointer",
                }}
                type="file"
                onChange={(e: { target: { files: any } }) => {
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
                variant="bordered"
                isDisabled={isDisabled}
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
                <Checkbox
                  key={field.value}
                  radius="full"
                  isDisabled={isDisabled}
                  {...field}
                  icon={<LockIcon />}
                  defaultSelected={field.value}
                />
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
                <Checkbox
                  key={field.value}
                  radius="full"
                  isDisabled={isDisabled}
                  {...field}
                  defaultSelected={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default ContestInfoForm;
