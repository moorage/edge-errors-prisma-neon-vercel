import { Navbar } from "./navbar";
import { Home } from "./home";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  return (
    <>
      <Navbar session={session} />
      <Home />
    </>
  );
}
