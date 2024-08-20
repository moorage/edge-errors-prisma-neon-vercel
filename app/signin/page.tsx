import { providerMap } from "@/auth.config";
import Link from "next/link";
import { SignInWith } from "./form";
import { FooterSection } from "../footer";
import { Navbar } from "../navbar";
import { auth } from "@/auth";

export default async function SignInPage() {
  const redirectTo = "/groups";
  const session = await auth();

  return (
    <>
      <Navbar session={session} />
      <div className="container relative h-[600px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 pt-10">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            Ewujo
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;I love how simple it is to run a community - everyone
                uses a communication tool they&apos;ve been using for years;
                SMS.&rdquo;
              </p>
              <footer className="text-sm">Jane Smith</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Sign In / Create an Account
              </h1>
              <p className="text-sm text-muted-foreground">
                Connect with one of the services below to get started.
              </p>
            </div>
            {Object.values(providerMap).map((provider) => (
              <SignInWith
                key={provider.id}
                provider={provider}
                redirectTo={redirectTo}
              />
            ))}
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      <FooterSection />
    </>
  );
}
