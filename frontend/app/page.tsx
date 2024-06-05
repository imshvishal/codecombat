import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { title, subtitle } from "@/components/primitives";
import { Logo } from "@/components/icons";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>Unleash your&nbsp;</h1>
        <h1 className={title({ color: "green" })}>Algorithms!</h1>
        <br />
        <h2 className={subtitle({ class: "mt-4" })}>
        Welcome to CodeCombat: Where keystrokes become epic battles!
        </h2>
      </div>

      <div className="flex gap-3">
        <Link
          className={buttonStyles({ variant: "bordered", radius: "full" })}
          href="/login"
        >
          <Logo size={20} />
          Join a Contest
        </Link>
      </div>

      <div className="mt-8">
        <Snippet hideCopyButton hideSymbol variant="flat">
          <span>
            Get started by joining a <Code color="success">contest</Code>
          </span>
        </Snippet>
      </div>
    </section>
  );
}
