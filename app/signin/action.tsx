"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { signIn } from "@/auth";

export type SignInFormState = {
  provider: {
    id: string;
    name: string;
  };
  redirectTo?: string;
  status: number;
  body: string;
};

export async function signin(
  currentState: SignInFormState,
  formData: FormData
) {
  const context = {
    provider: currentState.provider,
    redirectTo: currentState.redirectTo,
  };
  const revalidatesPath = currentState.redirectTo ?? "/signin";
  try {
    if (revalidatesPath) {
      revalidatePath(revalidatesPath);
    }
    await signIn(
      currentState.provider.id,
      currentState.redirectTo
        ? {
            redirect: true,
            redirectTo: currentState.redirectTo,
          }
        : undefined
    );
    return { status: 200, body: `You should have been redirected`, ...context };
  } catch (error) {
    // Signin can fail for a number of reasons, such as the user
    // not existing, or the user not having the correct role.
    // In some cases, you may want to redirect to a custom error
    if (error instanceof AuthError) {
      return redirect(`/signin/error?error=${error.type}`);
    }

    // Otherwise if a redirects happens NextJS can handle it
    // so you can just re-thrown the error and let NextJS handle it.
    // Docs:
    // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
    throw error;
  }
}
