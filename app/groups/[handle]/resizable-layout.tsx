"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  ChatBubbleIcon,
  GearIcon,
  Pencil2Icon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { Nav } from "./nav";
import { usePathname } from "next/navigation";

interface ResizableLayoutProps {
  children: React.ReactNode;
  currentGroup: { handle: string; name: string; icon?: string | null };
  groups: { handle: string; name: string; icon?: string | null }[];
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export function ResizableLayout({
  children,
  currentGroup,
  groups,
  defaultLayout = [265, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
}: ResizableLayoutProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className="max-h-screen min-h-screen items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={() => {
            setIsCollapsed(true);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true
            )}`;
          }}
          onExpand={() => {
            setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false
            )}`;
          }}
          className={cn(
            isCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          <div
            className={cn(
              "flex h-[52px] items-center justify-center",
              isCollapsed ? "h-[52px]" : "px-2"
            )}
          >
            Test
          </div>
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "New Message",
                icon: Pencil2Icon,
                href: `/groups/${currentGroup.handle}/new-message`,
                variant:
                  pathname === `/groups/${currentGroup.handle}/new-message`
                    ? "default"
                    : "ghost",
              },
              {
                title: "Messages",
                // label: "",
                icon: ChatBubbleIcon,
                href: `/groups/${currentGroup.handle}`,
                variant: pathname.startsWith(
                  `/groups/${currentGroup.handle}/messages`
                )
                  ? "default"
                  : "ghost",
              },

              {
                title: "Members",
                icon: PersonIcon,
                href: `/groups/${currentGroup.handle}/members`,
                variant: pathname.startsWith(
                  `/groups/${currentGroup.handle}/members`
                )
                  ? "default"
                  : "ghost",
              },
            ]}
          />
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Personal Settings",
                icon: GearIcon,
                href: `/settings`,
                variant: pathname.startsWith(`/settings`) ? "default" : "ghost",
              },
            ]}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={defaultLayout[1] + defaultLayout[2]}
          minSize={30}
        >
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
