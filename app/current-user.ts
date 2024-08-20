import { auth } from "../auth";
import { prisma } from "../prisma/client";

export const assertCurrentUser = async () => {
  const session = await auth();
  if (!session?.user) {
    return {
      errorResponse: Response.json(
        { error: "No session user" },
        { status: 401, statusText: "No session user" }
      ),
      user: null,
    };
  }
  if (!session.user.email || session.user.email === "") {
    console.error("Invalid account email");
    return {
      errorResponse: Response.json(
        { error: "No session user email" },
        { status: 401, statusText: "No session user email" }
      ),
      user: null,
    };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    console.error("User account not found");
    return {
      errorResponse: Response.json(
        { error: "No session user account" },
        { status: 401, statusText: "No session user account" }
      ),
      user: null,
    };
  }
  return { errorResponse: null, user };
};

export const assertCurrentUserWithGroupMembership = async (
  groupHandle: string
) => {
  const session = await auth();
  if (!session?.user) {
    return {
      errorResponse: Response.json(
        { error: "No session user" },
        { status: 401, statusText: "No session user" }
      ),
      user: null,
    };
  }
  if (!session.user.email || session.user.email === "") {
    console.error("Invalid account email");
    return {
      errorResponse: Response.json(
        { error: "No session user email" },
        { status: 401, statusText: "No session user email" }
      ),
      user: null,
    };
  }

  const group = await prisma.group.findUnique({
    where: { handle: groupHandle },
    include: {
      creator: true,
      members: { include: { user: true } },
    },
  });
  if (!group) {
    console.error("Group not found");
    return {
      errorResponse: Response.json(
        { error: "Group not found" },
        { status: 404, statusText: "Group not found" }
      ),
      user: null,
    };
  }
  const groupId = group.id;
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      createdGroups: {
        where: { id: groupId },
      },

      memberships: {
        where: { groupId },
        include: { group: true },
      },
    },
  });

  if (!user) {
    console.error("User account not found");
    return {
      errorResponse: Response.json(
        { error: "No session user account" },
        { status: 401, statusText: "No session user account" }
      ),
      user: null,
    };
  }

  // user is required to have a dmatching createdGroup or membership, or both
  if (!user.createdGroups.length && !user.memberships.length) {
    console.error("User does not have access to group");
    return {
      errorResponse: Response.json(
        { error: "You do not have access to this group" },
        { status: 401, statusText: "You do not have access to this group" }
      ),
      user: null,
    };
  }
  return { errorResponse: null, user };
};

export const isCreatorOrAdminOfGroupHandle = (
  user: Awaited<
    ReturnType<typeof assertCurrentUserWithGroupMembership>
  >["user"],
  groupHandle: string
) => {
  if (!user) {
    return false;
  }
  const createdGroup = user.createdGroups.find((g) => g.handle === groupHandle);
  const membership = user.memberships.find(
    (m) => m.group.handle === groupHandle
  );
  return !!createdGroup || (!!membership && membership.role === "ADMIN");
};

export const isCreatorOrMemberOfGroupHandle = (
  user: Awaited<
    ReturnType<typeof assertCurrentUserWithGroupMembership>
  >["user"],
  groupHandle: string
) => {
  if (!user) {
    return false;
  }
  const createdGroup = user.createdGroups.find((g) => g.handle === groupHandle);
  const membership = user.memberships.find(
    (m) => m.group.handle === groupHandle
  );
  return createdGroup || membership;
};
export const assertCurrentUserWithMemberships = async () => {
  const session = await auth();
  if (!session?.user) {
    return {
      errorResponse: Response.json(
        { error: "No session user" },
        { status: 401, statusText: "No session user" }
      ),
      user: null,
    };
  }
  if (!session.user.email || session.user.email === "") {
    console.error("Invalid account email");
    return {
      errorResponse: Response.json(
        { error: "No session user email" },
        { status: 401, statusText: "No session user email" }
      ),
      user: null,
    };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      createdGroups: true,
      memberships: { include: { group: true } },
    },
  });
  if (!user) {
    console.error("User account not found");
    return {
      errorResponse: Response.json(
        { error: "No session user account" },
        { status: 401, statusText: "No session user account" }
      ),
      user: null,
    };
  }
  return { errorResponse: null, user };
};
