import { prisma } from "@/prisma/client";
import * as React from "react";
import { notFound } from "next/navigation";
import { ResizableLayout } from "./resizable-layout";
import { assertCurrentUserWithMemberships } from "@/app/current-user";
import { redirect } from "next/navigation";

export default async function GroupLayout({
  children, // will be a page or nested layout
  params,
}: {
  children: React.ReactNode;
  params: { handle: string };
}) {
  const { user, errorResponse } = await assertCurrentUserWithMemberships();
  if (errorResponse) {
    return redirect(
      "/signin/error?message=" + encodeURIComponent(errorResponse.statusText)
    );
  }
  if (!user) {
    return redirect("/signin");
  }
  const group = await prisma.group.findUnique({
    where: {
      handle: params.handle,
    },
  });

  if (!group) {
    return notFound();
  }

  return (
    <ResizableLayout
      groups={user.createdGroups.concat(user.memberships.map((m) => m.group))}
      currentGroup={group}
      // eslint-disable-next-line react/no-children-prop
      children={children}
      defaultLayout={undefined}
      defaultCollapsed={undefined}
      navCollapsedSize={4}
    />
  );
}
