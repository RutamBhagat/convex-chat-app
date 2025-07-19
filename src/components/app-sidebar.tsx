import { Search, LogIn } from "lucide-react";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

type SidebarProps = {
  nameFilter: string;
  setNameFilter: (value: string) => void;
};

export function AppSidebar({ nameFilter, setNameFilter }: SidebarProps) {
  return (
    <Sidebar>
      {/* Sidebar Header */}
      <SidebarHeader className="p-4 border-sidebar-border">
        <div className="flex items-center justify-center gap-2 mb-4">
          <p className="text-sidebar-foreground font-semibold text-xl text-center">
            T3.chat
          </p>
        </div>

        <Button className="w-full bg-primary/20 hover:bg-primary/50 text-primary-foreground">
          New Chat
        </Button>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent>
        <SidebarGroup className="p-4 py-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/60" />
            <SidebarInput
              placeholder="Search your threads..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="pl-10 !bg-transparent border-0 border-b border-sidebar-foreground/20 rounded-none text-sidebar-foreground placeholder:text-sidebar-foreground/60 focus:border-sidebar-foreground/40 focus:outline-none"
            />
          </div>
        </SidebarGroup>

        {/* Chat threads */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs text-sidebar-foreground">
            Today
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="px-4 text-sidebar-foreground hover:bg-sidebar-accent/80">
                Greeting Title
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent">
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
