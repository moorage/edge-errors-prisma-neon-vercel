export type GroupMessagesGetResult = {
  message: {
    id: string;
    groupId: string;
    userId: string;
    title: string | null;
    content: string;
    repliesToMessageId: string | null;
    createdAt: Date;
    updatedAt: Date;
    user: {
      id: string;
      name: string | null;
      email: string | null;
      emailVerified: Date | null;
      phone: string | null;
      phoneVerified: Date | null;
      image: string | null;
      createdAt: Date;
      updatedAt: Date;
    };
    attachments: {
      id: string;
      messageId: string;
      url: string;
      type: string;
      systemGenerated?: boolean;
      systemGeneratedSource?: string | null;
      createdAt: Date;
      updatedAt: Date;
    }[];
  };
  delivery:
    | {
        id: string;
        messageId: string;
        userId: string;
        sentAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
      }
    | undefined;
}[];

type ElementType<T> = T extends (infer U)[] ? U : never;
export type GroupMessagesGetResultElement = ElementType<GroupMessagesGetResult>;
