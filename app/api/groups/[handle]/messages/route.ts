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

  console.warn(
    "in GET /api/groups/[handle]/messages, about to run assertCurrentUserWithGroupMembership"
  );

  const { user, errorResponse } = await assertCurrentUserWithGroupMembership(
    params.handle
  );

  console.warn(
    "in GET /api/groups/[handle]/messages, Finished assertCurrentUserWithGroupMembership"
  );

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
  const group =
    user.createdGroups.find((g) => g.handle === params.handle) ||
    user.memberships
      .map((m) => m.group)
      .find((g) => g.handle === params.handle);

  // check if authorized
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
  console.warn(
    "in GET /api/groups/[handle]/messages, starting prisma.message.findMany"
  );
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
  console.warn(
    "in GET /api/groups/[handle]/messages, finished prisma.message.findMany"
  );

  const results = messages.map((message) => {
    const delivery = message.deliveries.find((d) => d.messageId === message.id);
    return {
      message,
      delivery,
    };
  });

  waitUntil(endPrismaPoolOnEdge(runtime));
  console.warn(
    "in GET /api/groups/[handle]/messages, about to return Response.json"
  );
  return Response.json(results);
}
