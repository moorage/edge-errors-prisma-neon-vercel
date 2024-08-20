"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { type Session } from "next-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { SignIn, SignOut } from "./auth-button";
import { FaceIcon, PlusIcon } from "@radix-ui/react-icons";

export function UserButton({
  session,
  signInRedirectTo,
  displayGroups,
  ...props
}: {
  session: Session | null;
  signInRedirectTo?: string;
  displayGroups?: boolean;
} & React.ComponentPropsWithRef<typeof Button>) {
  if (!session?.user) return <SignIn redirectTo={signInRedirectTo} />;
  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative rounded-full">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={
                  session.user.image ??
                  "https://source.boringavatars.com/marble/120"
                }
                alt={session.user.name ?? "Me"}
              />
              <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
            </Avatar>{" "}
            Home
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          {displayGroups && (
            <>
              <CreateGroupListItem />
            </>
          )}
          <DropdownMenuItem>
            <SignOut {...props} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function CreateGroupListItem() {
  return (
    <DropdownMenuItem>
      <Link href={`/groups`}>
        <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
          <PlusIcon />
          My Groups
        </div>
      </Link>
    </DropdownMenuItem>
  );
}
