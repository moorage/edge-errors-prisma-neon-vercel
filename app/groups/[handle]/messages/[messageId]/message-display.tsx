"use client";

import {
  formatDistanceToNow,
  addHours,
  addDays,
  format,
  nextSaturday,
} from "date-fns";
import { useRef } from "react";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  FaceIcon,
  HeartIcon,
  PaperPlaneIcon,
  ChatBubbleIcon,
  ExclamationTriangleIcon,
  DotsVerticalIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { cn, truncateString } from "@/lib/utils";
import dynamic from "next/dynamic";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

interface MessageDisplayProps {
  groupHandle: string;
  message?: {
    id: string;
    title?: string | null;
    content: string;
    user: {
      name?: string | null;
      email?: string | null;
      phone?: string | null;
      image?: string | null;
    };
    repliesToMessageId?: string | null;
    replyingToMessage?: {
      id: string;
      title?: string | null;
      content: string;
      repliesToMessageId?: string | null;
      createdAt: Date;
      updatedAt: Date;
      user: {
        name?: string | null;
        email?: string | null;
        phone?: string | null;
        image?: string | null;
      };
    } | null;
    createdAt: Date;
    updatedAt: Date;
    attachments: { id: string; url: string; type: string }[];
  } | null;
}

export function MessageDisplay({ groupHandle, message }: MessageDisplayProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  if (textareaRef.current) {
                    textareaRef.current.focus();
                  }
                }}
                variant="ghost"
                size="icon"
                disabled={!message}
              >
                <ChatBubbleIcon className="h-4 w-4" />
                <span className="sr-only">Reply</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reply</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-6" />
          <Tooltip>
            <Popover>
              <PopoverTrigger asChild>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={!message}>
                    <FaceIcon className="h-4 w-4" />
                    <span className="sr-only">Remoji</span>
                  </Button>
                </TooltipTrigger>
              </PopoverTrigger>
              <PopoverContent className=" w-[351px] p-0">
                <div className=" py-4 px-4 text-sm font-medium">
                  React to this Message
                </div>
                <div></div>
              </PopoverContent>
            </Popover>
            <TooltipContent>Remoji (TODO)</TooltipContent>
          </Tooltip>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!message}>
                <HeartIcon className="h-4 w-4" />
                <span className="sr-only">Love (TODO)</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Love (TODO)</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!message}>
                <PaperPlaneIcon className="h-4 w-4" />
                <span className="sr-only">Share (TODO)</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share (TODO)</TooltipContent>
          </Tooltip>
        </div>
        <Separator orientation="vertical" className="mx-2 h-6" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={!message}>
              <DotsVerticalIcon className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <div className="flex items-center gap-2">
                <ExclamationTriangleIcon /> Report spam (TODO)
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
      <ScrollArea>
        {message?.repliesToMessageId && message.replyingToMessage && (
          <div className="p-5">
            <Link
              key={message.replyingToMessage.id}
              className={cn(
                "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent "
              )}
              href={`/groups/${groupHandle}/messages/${message.repliesToMessageId}`}
            >
              <div className="flex w-full flex-col gap-1">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">
                      Replying to:{" "}
                      {message.replyingToMessage.title
                        ? message.replyingToMessage.title
                        : truncateString(message.replyingToMessage.content, 50)}
                    </div>
                  </div>
                  <div
                    className={cn("ml-auto text-xs", "text-muted-foreground")}
                  >
                    {formatDistanceToNow(
                      new Date(message.replyingToMessage.createdAt),
                      {
                        addSuffix: true,
                      }
                    )}
                  </div>
                </div>
                <div className="text-xs font-medium">
                  {message.replyingToMessage.user.name ??
                    message.replyingToMessage.user.email ??
                    message.replyingToMessage.user.phone ??
                    "Unknown"}
                </div>
              </div>
              <div className="line-clamp-2 text-xs text-muted-foreground">
                {message.replyingToMessage.content.substring(0, 300)}
              </div>
            </Link>
          </div>
        )}
        {message ? (
          <div className="flex flex-1 flex-col">
            <div className="flex items-start p-4">
              <div className="flex items-start gap-4 text-sm">
                <Avatar>
                  {message.user.image && (
                    <AvatarImage
                      src={message.user.image}
                      alt={message.user.name ?? "anonymous"}
                    />
                  )}
                  <AvatarFallback>
                    {(message.user.name ?? "? ?")
                      .split(" ")
                      .map((chunk) => chunk[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="font-semibold">
                    {message.user.name ??
                      message.user.email ??
                      message.user.phone ??
                      "Unknown"}
                  </div>
                  <div className="line-clamp-1 text-xs">
                    {message.title ?? ""}
                  </div>
                </div>
              </div>
              {message.createdAt && (
                <div className="ml-auto text-xs text-muted-foreground">
                  {format(new Date(message.createdAt), "PPpp")}
                </div>
              )}
            </div>
            <Separator />
            <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
              {message.content}
            </div>
            <Separator className="mt-auto" />
            <div className="p-4">
              <Textarea defaultValue="You would reply here" />
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No message selected
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
