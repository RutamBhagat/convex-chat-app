import { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUp,
  Search,
  Sparkles,
  Code,
  Book,
  ChevronDown,
} from "lucide-react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { ThemeSelector } from "@/components/theme-selector";

function getOrSetFakeName() {
  const NAME_KEY = "tutorial_name";
  const name = sessionStorage.getItem(NAME_KEY);
  if (!name) {
    const newName = faker.person.firstName();
    sessionStorage.setItem(NAME_KEY, newName);
    return newName;
  }
  return name;
}

const NAME = getOrSetFakeName();

export default function App() {
  const [nameFilter, setNameFilter] = useState("");

  const sendMessage = useMutation(api.chat.sendMessage);
  const messages = useQuery(api.chat.getMessages, { nameFilter });
  const [newMessageText, setNewMessageText] = useState("");

  useEffect(() => {
    setTimeout(() => {
      const messagesEnd = document.getElementById("messages-end");
      messagesEnd?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }, [messages]);

  return (
    <>
      <SidebarTrigger className="fixed top-4 left-4 z-50" />
      <AppSidebar nameFilter={nameFilter} setNameFilter={setNameFilter} />
      <SidebarInset className="flex flex-col h-screen">
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
          <div className="ml-auto flex items-center gap-2">
            <ThemeSelector />
            <ModeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {/* Main Chat Area */}
          <div className="flex flex-col items-center justify-center p-8">
            {messages?.length !== 0 ? (
              <div className="max-w-4xl w-full flex-1 p-6 space-y-4">
                {messages?.map((message) => {
                  const isOwn = message.user === NAME;
                  const initials = message.user.substring(0, 2).toUpperCase();

                  return (
                    <div
                      key={message._id}
                      className={`flex gap-3 ${isOwn ? "flex-row-reverse" : "flex-row"} animate-in slide-in-from-bottom-2 duration-300`}
                    >
                      <Avatar className="shrink-0">
                        <AvatarFallback
                          className={`${isOwn ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"} text-xs font-semibold`}
                        >
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      <div
                        className={`flex flex-col max-w-[70%] ${isOwn ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`flex items-center gap-2 mb-1 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
                        >
                          <span className="text-xs font-medium text-muted-foreground">
                            {message.user}
                          </span>
                        </div>

                        <div
                          className={`px-4 py-2 rounded-2xl max-w-full break-words ${
                            isOwn
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-muted text-muted-foreground rounded-bl-md"
                          } shadow-sm`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div id="messages-end" />
              </div>
            ) : null}
          </div>
        </main>

        {/* Bottom Input Area */}
        <div className="">
          <div className="max-w-2xl mx-auto rounded-t-2xl p-2 pb-0 bg-secondary/20">
            {/* Input Form */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newMessageText.trim()) return;
                await sendMessage({
                  user: NAME,
                  body: newMessageText.trim(),
                });
                setNewMessageText("");
              }}
              className="relative"
            >
              <div className="flex flex-col p-2 items-center bg-input rounded-t-xl overflow-hidden">
                <Input
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 border-0 bg-transparent px-6 py-4 text-base focus-visible:ring-0"
                  autoFocus
                />
                <Button
                  type="submit"
                  disabled={!newMessageText.trim()}
                  size="sm"
                  className="h-8 w-8 p-0 self-end rounded-md bg-primary hover:bg-primary/90 disabled:opacity-50"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
