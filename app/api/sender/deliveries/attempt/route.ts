import { validateDigitalSignature } from "../../verify-signature";
import { prisma } from "@/prisma/client";
import { senderAttemptTimeout } from "../../constants";
import { type NextRequest } from "next/server";
import { waitUntil } from "@vercel/functions";
import { endPrismaPoolOnEdge } from "@/prisma/client";

export const dynamic = "force-dynamic"; // defaults to auto
export const runtime = "edge";

const expectedBody = {};
type RequestFormat = {
  body: typeof expectedBody;
  signature: string;
};
type DeliverableWithoutSignedAccessUrl = {
  id: string;
  messageId: string;
  userId: string;
  sentAt: Date | null;
  senderAttemptAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string | null;
    handle: string | null;
    email: string | null;
    emailVerified: Date | null;
    phone: string | null;
    phoneVerified: Date | null;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  message: {
    id: string;
    group: {
      id: string;
      handle: string;
      name: string;
      description: string | null;
      icon: string | null;
      creatorId: string;
      createdAt: Date;
      updatedAt: Date;
    };
    user: {
      id: string;
      name: string | null;
      handle: string | null;
      email: string | null;
      emailVerified: Date | null;
      phone: string | null;
      phoneVerified: Date | null;
      image: string | null;
      createdAt: Date;
      updatedAt: Date;
    };
    title: string | null;
    content: string;
    repliesToMessageId?: string | null;
    createdAt: Date;
    updatedAt: Date;

    replyingToMessage?: {
      id: string;
      groupId: string;

      user: {
        id: string;
        name: string | null;
        handle: string | null;
        email: string | null;
        emailVerified: Date | null;
        phone: string | null;
        phoneVerified: Date | null;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
      };
      title: string | null;
      content: string;
      repliesToMessageId?: string | null;
      createdAt: Date;
      updatedAt: Date;
    } | null;
    attachments: {
      id: string;
      messageId: string;
      url: string;
      type: string;
      systemGenerated?: boolean;
      systemGeneratedSource?: string | null;
      createdAt: Date;
      updatedAt: Date;
      signedUrl: string;
    }[];
  };
};
type AttachmentWithSignedUrl =
  DeliverableWithoutSignedAccessUrl["message"]["attachments"][0] & {
    signedUrl: string;
  };

type DeliverableWithSignedAccessUrl = Omit<
  DeliverableWithoutSignedAccessUrl,
  "message"
> & {
  message: Omit<DeliverableWithoutSignedAccessUrl["message"], "attachments"> & {
    attachments: AttachmentWithSignedUrl[];
  };
};

type ResponseFormat = {
  deliverable: DeliverableWithSignedAccessUrl | null;
  type: "message" | "systemMessage" | null;
};

export async function POST(request: NextRequest) {
  const res = (await request.json()) as RequestFormat; // res now contains body

  if (res.body === null || res.signature === null) {
    waitUntil(endPrismaPoolOnEdge(runtime));
    return Response.json(
      { error: "Invalid request format" },
      { status: 400, statusText: "Bad Request" }
    );
  }

  const valid = await validateDigitalSignature(res.body, res.signature);

  if (!valid) {
    waitUntil(endPrismaPoolOnEdge(runtime));
    return Response.json(
      { error: "Invalid signature" },
      { status: 401, statusText: "Not Authorized" }
    );
  }

  const [msgDeliverable, sysMsgDeliverable] = await Promise.all([
    messageDeliverable(),
    systemMessageDeliverable(),
  ]);

  if (msgDeliverable.exists) {
    waitUntil(endPrismaPoolOnEdge(runtime));
    return Response.json(msgDeliverable.data, msgDeliverable.init);
  }

  if (sysMsgDeliverable.exists) {
    waitUntil(endPrismaPoolOnEdge(runtime));
    return Response.json(sysMsgDeliverable.data, sysMsgDeliverable.init);
  }

  if (msgDeliverable.init.status === 500) {
    waitUntil(endPrismaPoolOnEdge(runtime));
    return Response.json(msgDeliverable.data, msgDeliverable.init);
  } else if (sysMsgDeliverable.init?.status === 500) {
    waitUntil(endPrismaPoolOnEdge(runtime));
    return Response.json(sysMsgDeliverable.data, sysMsgDeliverable.init);
  }

  // Neither exists or errored so just return the first case
  waitUntil(endPrismaPoolOnEdge(runtime));
  return Response.json(msgDeliverable.data, msgDeliverable.init);
}

async function messageDeliverable(): Promise<{
  exists: boolean;
  data: ResponseFormat | { error: string };
  init: ResponseInit;
}> {
  const deliverable = await prisma.$transaction(async (tx) => {
    const nextDelivery = await tx.messageDelivery.findFirst({
      where: {
        sentAt: null,
        OR: [
          { senderAttemptAt: null },
          {
            senderAttemptAt: {
              lte: new Date(new Date().getTime() - senderAttemptTimeout),
            },
          },
        ],
      },
    });

    if (!nextDelivery) {
      return null;
    }

    await tx.messageDelivery.update({
      where: { id: nextDelivery.id },
      data: {
        senderAttemptAt: new Date(),
      },
    });

    return nextDelivery;
  });

  if (!deliverable) {
    return {
      exists: false,
      data: { deliverable: null, type: null },
      init: { status: 200 },
    };
  }

  if (
    deliverable.senderAttemptAt &&
    new Date().getTime() - deliverable.senderAttemptAt!.getTime() >
      senderAttemptTimeout
  ) {
    // TODO report timeout to developers
  }

  const deliverableWithAttachments = await prisma.messageDelivery.findUnique({
    where: { id: deliverable.id },
    include: {
      message: {
        include: {
          group: true,
          user: true,
          attachments: true,
          replyingToMessage: { include: { user: true } },
        },
      },
      user: true,
    },
  });

  if (!deliverableWithAttachments) {
    return {
      exists: false,
      data: { error: "Deliverable not found even though it was checked out" },
      init: { status: 500 },
    };
  }

  const attachmentsWithSignedUrls = await Promise.all(
    deliverableWithAttachments.message.attachments.map(async (attachment) => {
      const signedUrl = await getSignedAccessUrl(attachment.url);
      return { ...attachment, signedUrl: signedUrl.presignedUrl };
    })
  );

  const response: ResponseFormat = {
    deliverable: {
      ...deliverableWithAttachments,
      message: {
        ...deliverableWithAttachments.message,
        attachments: attachmentsWithSignedUrls,
      },
    },
    type: "message",
  };

  return {
    exists: true,
    data: response,
    init: { status: 200 },
  };
}

async function systemMessageDeliverable(): Promise<{
  exists: boolean;
  data: ResponseFormat | { error: string };
  init?: ResponseInit;
}> {
  const deliverable = await prisma.$transaction(async (tx) => {
    const nextDelivery = await tx.systemMessageDelivery.findFirst({
      where: {
        sentAt: null,
        OR: [
          { senderAttemptAt: null },
          {
            senderAttemptAt: {
              lte: new Date(new Date().getTime() - senderAttemptTimeout),
            },
          },
        ],
      },
    });

    if (!nextDelivery) {
      return null;
    }

    await tx.systemMessageDelivery.update({
      where: { id: nextDelivery.id },
      data: {
        senderAttemptAt: new Date(),
      },
    });

    return nextDelivery;
  });

  if (!deliverable) {
    return {
      exists: false,
      data: { deliverable: null, type: null },
      init: { status: 200 },
    };
  }

  if (
    deliverable.senderAttemptAt &&
    new Date().getTime() - deliverable.senderAttemptAt!.getTime() >
      senderAttemptTimeout
  ) {
    // TODO report timeout to developers
  }

  const deliverableWithAttachments =
    await prisma.systemMessageDelivery.findUnique({
      where: { id: deliverable.id },
      include: {
        message: {
          include: {
            group: true,
            user: true,
            attachments: true,
          },
        },
        user: true,
      },
    });

  if (!deliverableWithAttachments) {
    return {
      exists: false,
      data: {
        error:
          "System Message Deliverable not found even though it was checked out",
      },
      init: { status: 500 },
    };
  }

  const attachmentsWithSignedUrls = await Promise.all(
    deliverableWithAttachments.message.attachments.map(async (attachment) => {
      const signedUrl = await getSignedAccessUrl(attachment.url);
      return { ...attachment, signedUrl: signedUrl.presignedUrl };
    })
  );

  const response: ResponseFormat = {
    deliverable: {
      ...deliverableWithAttachments,
      message: {
        ...deliverableWithAttachments.message,
        attachments: attachmentsWithSignedUrls,
      },
    },
    type: "systemMessage",
  };

  return {
    exists: true,
    data: response,
    init: { status: 200 },
  };
}

async function getSignedAccessUrl(
  url: string
): Promise<{ presignedUrl: string }> {
  // This is a placeholder function that would actually call a service to get a signed URL
  return { presignedUrl: url };
}
