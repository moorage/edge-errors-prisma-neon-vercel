import { prisma } from "@/prisma/client";
import {
  isCreatorOrMemberOfGroupHandle,
  assertCurrentUserWithGroupMembership,
} from "@/app/current-user";
import { type NextRequest } from "next/server";
import { waitUntil } from "@vercel/functions";
import { endPrismaPoolOnEdge } from "@/prisma/client";

export const runtime = "edge";
// export const dynamic = "force-dynamic"; // defaults to auto

const defaultPerPage = 25;
const defaultMode = "all"; // currently unused

export async function GET(
  request: NextRequest,
  { params }: { params: { handle: string } }
) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page")!) - 1
    : 0;
  const perPage = searchParams.get("perPage")
    ? parseInt(searchParams.get("perPage")!)
    : defaultPerPage;
  const _mode = searchParams.get("mode") || defaultMode;

  const [{ user, errorResponse }, group] = await Promise.all([
    assertCurrentUserWithGroupMembership(params.handle),
    prisma.group.findUnique({
      where: { handle: params.handle },
    }),
  ]);

  if (errorResponse) {
    waitUntil(endPrismaPoolOnEdge(runtime));
    return errorResponse;
  }
  if (!user) {
    waitUntil(endPrismaPoolOnEdge(runtime));
    return Response.json(
      { error: "No session user" },
      { status: 401, statusText: "No session user" }
    );
  }

  if (!group) {
    waitUntil(endPrismaPoolOnEdge(runtime));
    return Response.json(
      { error: "Group not found" },
      { status: 404, statusText: "Group not found" }
    );
  }

  if (!isCreatorOrMemberOfGroupHandle(user, group.handle)) {
    waitUntil(endPrismaPoolOnEdge(runtime));
    return Response.json(
      { error: "You are not a member of this group" },
      { status: 401, statusText: "You are not a member of this group" }
    );
  }
  const messages = await prisma.message.findMany({
    where: {
      groupId: group.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      attachments: true,
      replyingToMessage: { include: { user: true } },
      deliveries: { where: { userId: user.id } },
    },
    take: perPage,
    skip: page * perPage,
  });

  const results = messages.map((message) => {
    const delivery = message.deliveries.find((d) => d.messageId === message.id);
    return {
      message,
      delivery,
    };
  });

  waitUntil(endPrismaPoolOnEdge(runtime));
  return Response.json(results);
}
