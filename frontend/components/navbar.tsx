"use client"

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { link as linkStyles } from "@nextui-org/theme";
import {Divider} from "@nextui-org/divider";
import NextLink from "next/link";
import clsx from "clsx";
import {User} from "@nextui-org/user"
import { siteConfig } from "@/lib/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { TwitterIcon, GithubIcon, DiscordIcon, Logo } from "@/components/icons";
import { Avatar } from "@nextui-org/avatar";
import { useSelector } from "react-redux";
import { useLogoutMutation } from "@/redux/api/endpoints/authApi";
import { useRouter } from "next/navigation";

const UserProfileDropdown = ({children}: {children: React.ReactNode}) => {
  const navigator = useRouter()
  const [logout] = useLogoutMutation();
  return (
    <Dropdown>
    <DropdownTrigger>
      {children}
    </DropdownTrigger>
    <DropdownMenu aria-label="Static Actions">
      <DropdownItem onClick={() => navigator.push("/profile")}>Profile</DropdownItem>
      <DropdownItem showDivider onClick={() => navigator.push("/settings")}>Settings</DropdownItem>
      <DropdownItem key="delete" className="text-danger" color="danger" onClick={async () => {
        await logout({}).unwrap()
        navigator.refresh()
      }}>
        Logout
      </DropdownItem>
    </DropdownMenu>
  </Dropdown>
  )
}

export const Navbar = () => {
  const {user} = useSelector((state: any) => state.auth)
  // const {user} = {user: {avatar: "https://i.pravatar.cc/300", username: "Vishal", user_type:"DEV"}}
  
  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center" href="/">
            <Logo className="mr-3"/>
            <p className="font-bold text-inherit">CodeCombat</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal aria-label="Twitter" href={siteConfig.links.twitter}>
            <TwitterIcon className="text-default-500" />
          </Link>
          <Link isExternal aria-label="Discord" href={siteConfig.links.discord}>
            <DiscordIcon className="text-default-500" />
          </Link>
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
        {user ? (
          <UserProfileDropdown>
            <Avatar isBordered as="button" color="success" className="w-6 h-6" src={user.avatar}/>
          </UserProfileDropdown>
        ) : (
          <NavbarItem className="hidden md:flex gap-3">
            <Button
              as={Link}
              className="text-sm font-semibold"
              color="success"
              href="/login"
              variant="flat"
            >
              Login
            </Button>
            <Button
              as={Link}
              className="text-sm font-semibold"
              href="/signup"
              variant="flat"
            >
              Sign Up
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu className="gap-3 flex justify-end">
        {user ? (
          <UserProfileDropdown>
            <User  className="flex gap-5" name={user.username} description={user.user_type} as="button" avatarProps={{src:user.avatar, isBordered:true, color:"success"}} />
          </UserProfileDropdown>
        ) : (
          <NavbarMenuItem className="w-full flex flex-col gap-3">
            <Button
              as={Link}
              className="text-sm font-semibold"
              color="success"
              href="/login"
              variant="flat"
            >
              Login
            </Button>
            <Button
              as={Link}
              className="text-sm font-semibold"
              href="/signup"
              variant="flat"
            >
              Sign Up
            </Button>
          </NavbarMenuItem>
        )}
        <Divider className="my-4" />
        <NavbarMenuItem>
          <div className="flex justify-center gap-4 mb-8">
            <Link isExternal aria-label="Github" href={siteConfig.links.github}>
              <GithubIcon className="text-default-500" />
            </Link>
            <Link
              isExternal
              aria-label="Twitter"
              href={siteConfig.links.twitter}
            >
              <TwitterIcon className="text-default-500" />
            </Link>
            <Link
              isExternal
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
