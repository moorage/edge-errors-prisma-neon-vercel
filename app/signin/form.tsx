"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { signin, SignInFormState } from "./action";

function SubmitButton({
  provider,
  ...props
}: {
  provider: {
    id: string;
    name: string;
  };
} & React.ComponentPropsWithRef<typeof Button>) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="default"
      className="ml-auto w-full"
      disabled={pending}
      {...props}
    >
      Sign in with {provider.name}
    </Button>
  );
}

export function SignInWith({
  provider,
  redirectTo,
  modifyingUrl,
  ...props
}: {
  provider: {
    id: string;
    name: string;
  };
  redirectTo?: string;
  modifyingUrl?: string;
} & React.ComponentPropsWithRef<typeof Button>) {
  const initialState: SignInFormState = {
    provider,
    redirectTo,
    status: 0,
    body: "",
  };
  const [state, formAction] = useActionState(
    signin,
    initialState,
    modifyingUrl ?? redirectTo ?? "/signin"
  );
  return (
    <form action={formAction}>
      <SubmitButton provider={provider} />
      {state?.body && (
        <p className="text-sm text-red-900 font-bold">{state.body}</p>
      )}
    </form>
  );
}
