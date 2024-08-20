"use client";

import { useState } from "react";
import {
  Component1Icon,
  HamburgerMenuIcon,
  PlusIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@/components/user-button";
import { type Session } from "next-auth";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "https://tally.so/r/wa006b",
    label: "Contact",
  },
];

export const Navbar = ({
  session,
  hideUserBtn,
}: {
  session: Session | null;
  hideUserBtn?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="shadow-inner bg-opacity-15 w-[90%] md:w-[70%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky border border-secondary z-40 rounded-md flex justify-between items-center p-2 bg-card">
      <Link href="/" className="font-bold text-lg flex items-center">
        <Component1Icon className="bg-gradient-to-tr border-secondary from-primary via-primary/70 to-primary rounded-lg w-9 h-9 mr-2 border text-white" />
        Ewujo
      </Link>
      {/* <!-- Mobile --> */}
      <div className="flex items-center lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <HamburgerMenuIcon
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer lg:hidden"
            />
          </SheetTrigger>

          <SheetContent
            side="left"
            className="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-card border-secondary"
          >
            <div>
              <SheetHeader className="mb-4 ml-4">
                <SheetTitle className="flex items-center">
                  <Link href="https://ewujo.com/" className="flex items-center">
                    <Component1Icon className="bg-gradient-to-tr border-secondary from-primary via-primary/70 to-primary rounded-lg w-9 h-9 mr-2 border text-white" />
                    Ewujo
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-2">
                {!hideUserBtn && (
                  <UserButton
                    signInRedirectTo={"/groups"}
                    session={session}
                    displayGroups={false}
                  />
                )}
                {session && (
                  <>
                    <CreateGroupListItem setIsOpen={setIsOpen} />
                  </>
                )}
                {routeList.map(({ href, label }) => (
                  <Button
                    key={href}
                    onClick={() => setIsOpen(false)}
                    asChild
                    variant="ghost"
                    className="justify-start text-base"
                  >
                    <Link href={href}>{label}</Link>
                  </Button>
                ))}
              </div>
            </div>

            <SheetFooter className="flex-col sm:flex-col justify-start items-start">
              <Separator className="mb-2" />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* <!-- Desktop --> */}
      <NavigationMenu className="hidden lg:block mx-auto">
        <NavigationMenuList>
          <NavigationMenuItem>
            {routeList.map(({ href, label }) => (
              <NavigationMenuLink key={href} asChild>
                <Link href={href} className="text-base px-2">
                  {label}
                </Link>
              </NavigationMenuLink>
            ))}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="hidden lg:flex">
        {!hideUserBtn && (
          <UserButton
            signInRedirectTo={"/groups"}
            session={session}
            displayGroups={true}
          />
        )}
        <Button
          asChild
          // size="sm"
          variant="ghost"
          aria-label="View on X / Twitter"
        >
          <Link
            aria-label="View on X / Twitter"
            href="https://x.com/ewujo_official"
            target="_blank"
          >
            <TwitterLogoIcon className="size-5" />
          </Link>
        </Button>
      </div>
    </header>
  );
};

function CreateGroupListItem({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Button
      onClick={() => setIsOpen(false)}
      asChild
      variant="ghost"
      className="justify-start text-base"
    >
      <Link href={`/groups`}>
        <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
          <PlusIcon />
          Create Group (TODO)
        </div>
      </Link>
    </Button>
  );
}
