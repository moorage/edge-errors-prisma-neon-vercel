import { redirect } from "next/navigation";
import { assertCurrentUserWithMemberships } from "@/app/current-user";
import { prisma } from "@/prisma/client";

export default async function Page() {
  const { user, errorResponse } = await assertCurrentUserWithMemberships();

  if (errorResponse) {
    return redirect(
      "/signin/error?message=" + encodeURIComponent(errorResponse.statusText)
    );
  }
  if (!user) {
    return redirect("/signin");
  }

  const firstCreated = user.createdGroups.length ? user.createdGroups[0] : null;
  if (firstCreated) {
    return redirect(`/groups/${firstCreated.handle}`);
  }

  const firstMembership = user.memberships.length ? user.memberships[0] : null;

  if (firstMembership) {
    return redirect(`/groups/${firstMembership.group.handle}`);
  }

  // make a membership for this user in the test group if not already a member
  if (!process.env.DEFAULT_GROUP_ID) {
    return <>Server Setup Error: process.env.DEFAULT_GROUP_ID not set</>;
  }
  const groupMembership = await prisma.groupMember.create({
    data: {
      userId: user.id,
      groupId: process.env.DEFAULT_GROUP_ID,
      role: "MEMBER",
    },
    include: { group: true },
  });

  return redirect("/groups/" + groupMembership.group.handle);
}
