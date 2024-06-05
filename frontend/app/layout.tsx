import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@nextui-org/link";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/lib/site";
import { fontSans } from "@/lib/fonts";
import { Navbar } from "@/components/navbar";
import { HeartFilledIcon } from "@/components/icons";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/styles/github-dark.min.css"></link>
      </head>
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
        suppressHydrationWarning={true}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="flex flex-col h-screen justify-center items-center">
            <Navbar />
            <main className="flex flex-grow justify-center items-center flex-col w-full px-8">
              {children}
            </main>
            <Toaster />
            <footer className="w-full flex items-center justify-center py-3">
              <Link
                isExternal
                className="flex items-center gap-1 text-current"
                href={siteConfig.links.github}
                title="Vishal"
              >
                <span className="text-default-600 flex flex-row">
                  Made with &nbsp;
                  <HeartFilledIcon color="red" />
                  &nbsp; in
                </span>
                <p className="text-success">India</p>
              </Link>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
