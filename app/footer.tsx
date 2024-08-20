import Link from "next/link";
import { Component1Icon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
export const FooterSection = () => {
  return (
    <footer id="footer" className="container py-24 sm:py-32">
      <div className="p-10 bg-card border border-secondary rounded-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
          <div className="col-span-full xl:col-span-2">
            <Link
              href="https://ewujo.com/"
              className="flex font-bold items-center"
            >
              <Component1Icon className="w-9 h-9 mr-2 bg-gradient-to-tr from-primary via-primary/70 to-primary rounded-lg border border-secondary text-white" />

              <h3 className="text-2xl">Ewujo</h3>
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Contact</h3>
            <div>
              <Link
                href="https://tally.so/r/wa006b"
                className="opacity-60 hover:opacity-100"
              >
                Send an Email
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">User Group</h3>
            <div>
              <Link
                href="https://tally.so/r/n0LLEj"
                className="opacity-60 hover:opacity-100"
              >
                Request Invite
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Help</h3>
            <div>
              <Link
                href="https://tally.so/r/wa006b"
                className="opacity-60 hover:opacity-100"
              >
                Send an Email
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Socials</h3>
            <div>
              <Link
                href="https://x.com/ewujo_official"
                className="opacity-60 hover:opacity-100"
              >
                X/Twitter
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-6" />
        <section className="">
          <h3 className="">&copy; 2024 Ewujo. All rights reserved.</h3>
        </section>
      </div>
    </footer>
  );
};
