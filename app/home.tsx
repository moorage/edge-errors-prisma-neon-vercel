import Image from "next/image";
import Link from "next/link";
import { FooterSection } from "./footer";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@radix-ui/react-icons";

const HeroSection = () => {
  return (
    <section className="container w-full">
      <div className="grid place-items-center lg:max-w-screen-xl gap-8 mx-auto py-20 md:py-32">
        <div className="text-center space-y-8">
          <Badge variant="outline" className="text-sm py-2 px-3 rounded-2xl">
            <span className="mr-2 text-primary">
              <Badge>New</Badge>
            </span>
            <span> Starting beta onboarding! </span>
          </Badge>

          <div className="max-w-screen-md mx-auto text-center text-4xl md:text-6xl font-bold">
            <h1>
              Elegant, simple
              <span className="text-transparent px-2 bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text">
                community & group
              </span>
              platform.
            </h1>
          </div>

          <p className="max-w-screen-sm mx-auto text-xl text-muted-foreground">
            Set up a community, invite friends and message via SMS. Form
            lifelong bonds, starting today.
          </p>

          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Link
              href="/groups"
              className={cn(
                buttonVariants({ variant: "default" }),
                "w-5/6 md:w-1/4 font-bold group/arrow"
              )}
            >
              Get Started
              <ArrowRightIcon className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="relative group mt-14">
          <div className="absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[90%] mx-auto h-24 lg:h-80 bg-primary/50 rounded-full blur-3xl"></div>
          <Image
            width={1200}
            height={1200}
            className="w-full md:w-[1200px] mx-auto rounded-lg relative rouded-lg leading-none flex items-center border border-t-2 border-secondary  border-t-primary/30"
            src={"/images/quan-nguyen-yDSe7sggb9Q-unsplash.jpg"}
            alt="dashboard"
          />

          <div className="absolute bottom-0 left-0 w-full h-20 md:h-28 bg-gradient-to-b from-background/0 via-background/50 to-background rounded-lg"></div>
        </div>
      </div>
    </section>
  );
};

export function Home() {
  return (
    <>
      <HeroSection />
      <FooterSection />
    </>
  );
}
