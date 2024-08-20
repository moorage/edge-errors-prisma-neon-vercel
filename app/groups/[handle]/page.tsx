import { prisma } from "@/prisma/client";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { handle: string } }) {
  let group = await prisma.group.findUnique({
    where: {
      handle: params.handle,
    },
  });
  if (!group) {
    return <div>Group not found</div>;
  }

  let latestMessage = await prisma.message.findFirst({
    where: {
      groupId: group.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: { user: true, attachments: true },
  });
  if (!latestMessage) {
    return redirect(`/groups/${params.handle}/new-message`);
  }

  redirect(`/groups/${params.handle}/messages/${latestMessage.id}`);
}
