"use client";

import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { signOutServerAction } from "./user-button-actions";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

export function SignIn({ redirectTo }: { redirectTo?: string }) {
  return (
    <Link className={cn(buttonVariants())} href="/signin">
      Sign In
    </Link>
  );
}

function SignOutButton(props: React.ComponentPropsWithRef<typeof Button>) {
  const { pending } = useFormStatus();

  return (
    <Button
      variant="ghost"
      className="w-full p-0"
      {...props}
      disabled={pending}
    >
      Sign Out
    </Button>
  );
}
export function SignOut({
  redirectTo,
  modifyingUrl,
  ...props
}: {
  redirectTo?: string;
  modifyingUrl?: string;
} & React.ComponentPropsWithRef<typeof Button>) {
  const initialState = {
    redirectTo,
  };
  const [state, formAction] = useActionState(
    signOutServerAction,
    initialState,
    modifyingUrl ?? redirectTo ?? "/groups"
  );
  return (
    <form action={formAction} className="w-full">
      <SignOutButton {...props} />
    </form>
  );
}
