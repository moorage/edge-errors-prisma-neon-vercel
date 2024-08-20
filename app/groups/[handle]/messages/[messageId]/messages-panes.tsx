"use client";

import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { MessageList } from "./message-list";
import { MessageDisplay } from "./message-display";

interface MessagesPanesProps {
  groupHandle: string;
  currentUser: { id: string };
  currentMessage?: {
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
    replyingToMessage?: null | {
      id: string;
      title?: string | null;
      content: string;
      repliesToMessageId?: string | null;
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
    };
    createdAt: Date;
    updatedAt: Date;
    attachments: { id: string; url: string; type: string }[];
  } | null;
  defaultLayout: number[] | undefined;
}

export function MessagesPanes({
  groupHandle,
  currentUser,
  currentMessage,
  defaultLayout = [265, 440, 655],
}: MessagesPanesProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        // already happening in parent component
        // onLayout={(sizes: number[]) => {
        //   document.cookie = `react-resizable-panels:layout=${JSON.stringify(
        //     sizes
        //   )}`;
        // }}
        className="max-h-screen items-stretch"
      >
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue="all">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Messages</h1>
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="all"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Unread
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            <TabsContent value="all" className="m-0">
              <MessageList
                currentUser={currentUser}
                handle={groupHandle}
                mode="all"
                selectedId={currentMessage?.id}
              />
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              <MessageList
                currentUser={currentUser}
                handle={groupHandle}
                mode="unread"
                selectedId={currentMessage?.id}
              />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]}>
          <MessageDisplay groupHandle={groupHandle} message={currentMessage} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
