"use client";
import Link from "next/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { title, subtitle } from "@/components/primitives";
import { HeartFilledIcon, Logo } from "@/components/icons";
import { siteConfig } from "@/lib/site";
import { useSelector } from "react-redux";

export default function Home() {
  const user = useSelector((state: any) => state.auth.user);
  return (
    <>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 h-full">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Unleash your&nbsp;</h1>
          <h1 className={title({ color: "primary" })}>Algorithms!</h1>
          <br />
          <h2 className={subtitle({ class: "mt-4" })}>Welcome to CodeCombat: Where keystrokes become epic battles!</h2>
        </div>

        <div className="flex gap-3">
          <Link className={buttonStyles({ variant: "bordered", radius: "full" })} href="/contests">
            <Logo size={20} />
            {user?.user_type == "ORG" ? "Create" : "Join"} a Contest
          </Link>
        </div>

        <div className="mt-8">
          <Snippet hideCopyButton hideSymbol variant="flat">
            <span>
              Get started by {user?.user_type == "ORG" ? "creating" : "joining"} a <Code color="primary">contest</Code>
            </span>
          </Snippet>
        </div>
      </section>
      <footer className="w-full flex items-center text-center justify-center py-3">
        <Link target="_blank" className="flex items-center gap-1 text-current" href={siteConfig.links.github} title="Vishal">
          <span className="text-default-600 flex flex-col sm:flex-row">
            {/* Made with &nbsp; */}
            {/* <HeartFilledIcon color="red" />
        &nbsp; in */}
            Shut the fuck Up! I am not a &nbsp;
            <p className="text-primary"> frontend developer.</p>
          </span>
          {/* <p className="text-primary">India</p> */}
        </Link>
      </footer>
    </>
  );
}
