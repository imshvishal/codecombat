"use client";
import { Input } from "@nextui-org/input";
import { subtitle, title } from "@/components/primitives";
import { Button } from "@nextui-org/button";
import { Form, FormItem, FormField, FormMessage } from "@/components/ui/form";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { useRouter as useNavigation } from "next/navigation";
import { useLoginMutation } from "@/redux/api/endpoints/authApi";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { login } from "@/redux/states/authStateSlice";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDisclosure } from "@nextui-org/modal";
import EmailModal from "./modal";

const loginSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Minimum length should be 3" })
    .regex(/^[a-zA-Z0-9]+$/, { message: "Please enter a valid username" }),
  password: z.string().min(1, { message: "Please enter a password" }),
});

const LoginPage = () => {
  // const params = useSearchParams();
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );
  const [loginApi, { isLoading }] = useLoginMutation();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const navigator = useNavigation();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  useEffect(() => {
    if (isAuthenticated) {
      // navigator.push(params.get("next") || "/");
      navigator.push("/");
    }
  }, [isAuthenticated])



  async function handleSubmit(values: z.infer<typeof loginSchema>) {
    try {
      const data = await loginApi(values).unwrap();
      dispatch(login(data));
      toast({
        title: "Login successful",
        description: "Welcome to CodeCombat!",
        color: "success",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: new String(
          Object.values((error as { data: any }).data)[0]
        ),
        variant: "destructive",
      });
    }
  }

  return (
    <div className="md:w-1/2 lg:w-1/5 w-full flex flex-col gap-6">
      <h1 className={title({ size: "sm" })}>Login</h1>
      <h2 className={subtitle({ class: "mb-4 text-slate-500" })}>
        Please login to continue!
      </h2>
      <Form {...form}>
        <form
          className="flex flex-col gap-6 mb-2"
          onSubmit={form.handleSubmit(handleSubmit)}
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <Input
                  {...field}
                  type="password"
                  size="lg"
                  label="Password"
                  placeholder="Enter your password"
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
            Login
          </Button>
        </form>
      </Form>
      <Dropdown>
        <DropdownTrigger as="button">
          <p className="text-slate-500 text-sm text-end cursor-pointer">
            Want help?
          </p>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem>Reset username!</DropdownItem>
          <DropdownItem>Reset password!</DropdownItem>
          <DropdownItem>Activate User!</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default LoginPage;
