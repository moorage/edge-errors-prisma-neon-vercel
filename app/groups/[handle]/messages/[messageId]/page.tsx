import { MessagesPanes } from "./messages-panes";
import { notFound } from "next/navigation";
import { prisma } from "@/prisma/client";
import {
  assertCurrentUser,
  assertCurrentUserWithGroupMembership,
  isCreatorOrMemberOfGroupHandle,
} from "@/app/current-user";
import { redirect } from "next/navigation";

export default async function Page({
  params,
  searchParams,
}: {
  params: { handle: string; messageId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [group, message, { user, errorResponse }] = await Promise.all([
    prisma.group.findUnique({
      where: {
        handle: params.handle,
      },
    }),
    prisma.message.findFirst({
      where: {
        id: params.messageId,
      },
      include: {
        user: true,
        attachments: true,
        replyingToMessage: { include: { user: true } },
      },
    }),
    assertCurrentUserWithGroupMembership(params.handle),
  ]);
  if (errorResponse) {
    return redirect(
      "/signin/error?message=" + encodeURIComponent(errorResponse.statusText)
    );
  }
  if (!user) {
    return redirect("/signin");
  }
  if (!group || !message || group.id !== message.groupId) {
    return notFound();
  }
  if (!isCreatorOrMemberOfGroupHandle(user, group.handle)) {
    return notFound();
  }

  return (
    <MessagesPanes
      currentUser={user}
      groupHandle={params.handle}
      currentMessage={message}
      defaultLayout={undefined}
    />
  );
}
