"use client";

import React, { useEffect } from "react";
import { Input } from "@nextui-org/input";
import { subtitle, title } from "@/components/primitives";
import { Button } from "@nextui-org/button";
import { z } from "zod";
import { useSignUpMutation } from "@/redux/api/endpoints/authApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const signUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Minimum length should be 3" })
    .regex(/^[a-zA-Z0-9]+$/, { message: "Please enter a valid username" }),
  email: z
    .string()
    .min(1, { message: "Please enter an email" })
    .email({ message: "Please enter a valid email" }),
  password: z.string().min(8, { message: "Please enter a valid password" }),
  re_password: z.string().min(8, { message: "Please re-enter your password" }),
});

const SingUpPage = () => {
  const navigator = useRouter();
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
  useEffect(() => {
    if (isAuthenticated) {
      navigator.push("/");
    }
  }, [isAuthenticated])
  const [signUpApi, { isLoading }] = useSignUpMutation();
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      re_password: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof signUpSchema>) {
    try {
      const data = await signUpApi(values).unwrap();
      toast({
        title: "Sign up successful",
        description:
          "Welcome to CodeCombat! Kindly activate your account to continue!",
      });
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: new String(
          Object.values((error as { data: Array<Array<string>> }).data)[0][0]
        ),
        variant: "destructive",
      });
    }
  }

  return (
    <div className="md:w-1/2 lg:w-1/5 w-full">
      <h1 className={title({ size: "sm" })}>Sign Up</h1>
      <h2 className={subtitle({ class: "mb-4 text-slate-500" })}>
        Create an account to continue!
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-6 mb-2"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <Input
                  {...field}
                  size="lg"
                  label="Username"
                  placeholder="Enter your username"
                  labelPlacement="outside"
                  variant="bordered"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Input
                  {...field}
                  size="lg"
                  label="Email"
                  placeholder="Enter your email"
                  labelPlacement="outside"
                  variant="bordered"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Input
                  {...field}
                  size="lg"
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  labelPlacement="outside"
                  variant="bordered"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="re_password"
            render={({ field }) => (
              <FormItem>
                <Input
                  {...field}
                  size="lg"
                  label="Re-Enter Password"
                  placeholder="Re-Enter your password"
                  type="password"
                  labelPlacement="outside"
                  variant="bordered"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            size="lg"
            type="submit"
            variant="flat"
            color="success"
            isLoading={isLoading}
          >
            Sign Up
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SingUpPage;
