"use client";

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { Divider } from "@nextui-org/divider";
import NextLink from "next/link";
import { User } from "@nextui-org/user";
import { siteConfig } from "@/lib/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { TwitterIcon, GithubIcon, DiscordIcon, Logo } from "@/components/icons";
import { Avatar } from "@nextui-org/avatar";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "@/redux/api/endpoints/authApi";
import { useRouter } from "next/navigation";
import { login, logout } from "@/redux/states/authStateSlice";
import { useState } from "react";
import { processImageUrl } from "@/lib/utils";
import { Input } from "@nextui-org/input";
import { useLazyGetUserQuery } from "@/redux/api/endpoints/userApi";

const UserProfileDropdown = ({
  children,
  setNavOpen,
  user,
}: {
  children: React.ReactNode;
  setNavOpen: any;
  user: any;
}) => {
  const navigator = useRouter();
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutMutation();
  return (
    <Dropdown backdrop="blur">
      <DropdownTrigger>{children}</DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem
          onClick={() => {
            setNavOpen(false);
            navigator.push("/profile");
          }}
        >
          Profile
        </DropdownItem>
        <DropdownItem
          showDivider
          onClick={() => {
            setNavOpen(false);
            navigator.push("/settings");
          }}
        >
          Settings
        </DropdownItem>
        <DropdownItem
          key="delete"
          className="text-danger"
          color="danger"
          onClick={async () => {
            setNavOpen(false);
            await logoutApi({}).unwrap();
            dispatch(logout());
            navigator.push("/");
          }}
        >
          Logout
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export const Navbar = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [isNavOpen, setNavOpen] = useState(false);

  return (
    <NextUINavbar isMenuOpen={isNavOpen} maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center" href="/">
            <Logo className="mr-3" />
            <p className="font-bold text-inherit">CodeCombat</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2"></ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link
            target="_blank"
            aria-label="Twitter"
            href={siteConfig.links.twitter}
          >
            <TwitterIcon className="text-default-500" />
          </Link>
          <Link
            target="_blank"
            aria-label="Discord"
            href={siteConfig.links.discord}
          >
            <DiscordIcon className="text-default-500" />
          </Link>
          <Link
            target="_blank"
            aria-label="Github"
            href={siteConfig.links.github}
          >
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
        {user ? (
          <UserProfileDropdown setNavOpen={setNavOpen} user={user}>
            <Avatar
              isBordered
              as="button"
              className="w-6 h-6"
              src={processImageUrl(user.avatar)}
              color="primary"
            />
          </UserProfileDropdown>
        ) : (
          <NavbarItem className="hidden md:flex gap-3">
            <Button
              as={Link}
              className="text-sm font-semibold"
              href="/auth/login"
              variant="flat"
              color="primary"
            >
              Login
            </Button>
            <Button
              as={Link}
              className="text-sm font-semibold"
              href="/auth/signup"
              variant="flat"
              color="primary"
            >
              Sign Up
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle onClick={() => setNavOpen(!isNavOpen)} />
      </NavbarContent>

      <NavbarMenu className="gap-3 flex justify-center sm:justify-end">
        {user ? (
          <UserProfileDropdown setNavOpen={setNavOpen} user={user}>
            <User
              className="flex gap-5"
              name={user.username}
              description={user.user_type}
              as="button"
              avatarProps={{
                src: processImageUrl(user.avatar),
                isBordered: true,
                color: "primary",
              }}
            />
          </UserProfileDropdown>
        ) : (
          <NavbarMenuItem className="w-full flex flex-col gap-3">
            <Button
              as={Link}
              className="text-sm font-semibold"
              href="/auth/login"
              variant="flat"
              onClick={() => setNavOpen(false)}
            >
              Login
            </Button>
            <Button
              as={Link}
              className="text-sm font-semibold"
              href="/auth/signup"
              variant="flat"
              onClick={() => setNavOpen(false)}
            >
              Sign Up
            </Button>
          </NavbarMenuItem>
        )}
        <Divider className="my-4" />
        <NavbarMenuItem>
          <div className="flex justify-center gap-4 mb-8">
            <Link
              target="_blank"
              aria-label="Github"
              href={siteConfig.links.github}
            >
              <GithubIcon className="text-default-500" />
            </Link>
            <Link
              target="_blank"
              aria-label="Twitter"
              href={siteConfig.links.twitter}
            >
              <TwitterIcon className="text-default-500" />
            </Link>
            <Link
              target="_blank"
              aria-label="Discord"
              href={siteConfig.links.discord}
            >
              <DiscordIcon className="text-default-500" />
            </Link>
          </div>
        </NavbarMenuItem>
      </NavbarMenu>
    </NextUINavbar>
  );
};
