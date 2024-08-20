"use client";

import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { truncateString } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import useSWRInfinite from "swr/infinite";
import { Fetcher } from "swr";
import {
  type GroupMessagesGetResult,
  type GroupMessagesGetResultElement,
} from "@/app/api/groups/[handle]/messages/types";
import { useRef, useEffect } from "react";
import { useOnScreen } from "@/components/use-onscreen";
import { FileIcon } from "@radix-ui/react-icons";

const pageSize = 25;
const fetcher: Fetcher<GroupMessagesGetResult> = async (url: string) => {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error(
      `An error occurred while fetching the data (code ${
        res.status
      }).\n\n${await res.text()}`
    );

    throw error;
  }

  return res.json();
};

const getKey = (
  pageIndex: number,
  previousPageData: any[],
  handle: string,
  mode: string,
  pageSize: number
) => {
  if (previousPageData && !previousPageData.length) return null; // reached the end

  return `/api/groups/${handle}/messages?page=${
    pageIndex + 1
  }&mode=${encodeURIComponent(mode)}&pageSize=${pageSize}`;
};

interface MessageListProps {
  mode: "all" | "unread";
  handle: string;
  currentUser: { id: string };
  selectedId?: string | null;
}

export function MessageList({
  mode,
  handle,
  selectedId,
  currentUser,
}: MessageListProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isVisible = useOnScreen(ref);

  const { data, error, mutate, size, setSize, isValidating, isLoading } =
    useSWRInfinite(
      (...args) => getKey(...args, handle, mode, pageSize),
      fetcher
    );

  const items = data
    ? new Array<GroupMessagesGetResultElement>().concat(...data)
    : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = size === pageSize;
  const isRefreshing = isValidating && data && data.length === size;

  useEffect(() => {
    if (isVisible && !isReachingEnd && !isRefreshing) {
      setSize(size + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, isRefreshing]);

  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {items.map((item) => (
          <Link
            key={item.message.id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              selectedId === item.message.id && "bg-muted"
            )}
            href={`/groups/${handle}/messages/${item.message.id}`}
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">
                    {item.message.title
                      ? item.message.title
                      : truncateString(item.message.content, 50)}
                  </div>
                  {item.message.userId !== currentUser.id &&
                    (!item.delivery || !item.delivery.sentAt) && (
                      <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                    )}
                </div>
                <div
                  className={cn(
                    "ml-auto text-xs",
                    selectedId === item.message.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {formatDistanceToNow(new Date(item.message.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              </div>
              <div className="text-xs font-medium">
                {item.message.user.name ??
                  item.message.user.email ??
                  item.message.user.phone ??
                  "Unknown"}
              </div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {item.message.content.substring(0, 300)}
              {(item.message.attachments || []).length > 0 &&
                (item.message.attachments || []).map((attachment) => (
                  <div key={attachment.id} className="flex items-center gap-2">
                    {attachment.type === "image" ? (
                      <Image
                        width={12}
                        height={12}
                        src={attachment.url}
                        alt="Image Attachment"
                        className="rounded-sm"
                      />
                    ) : (
                      <FileIcon className="w-4 h-4" />
                    )}
                  </div>
                ))}
            </div>
            {/* {item.labels.length ? (
              <div className="flex items-center gap-2">
                {item.labels.map((label) => (
                  <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null} */}
          </Link>
        ))}
      </div>
      <div ref={ref}>
        {!isLoading
          ? ""
          : isLoadingMore
          ? "loading..."
          : isReachingEnd
          ? "no more messages"
          : ""}
      </div>
    </ScrollArea>
  );
}
