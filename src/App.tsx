import { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, MessageCircle, Users, Plus, Search, Sparkles, Code, Book, ChevronDown, Settings, Sun } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

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
  const sendMessage = useMutation(api.chat.sendMessage);
  const messages = useQuery(api.chat.getMessages);
  const [newMessageText, setNewMessageText] = useState("");

  useEffect(() => {
    setTimeout(() => {
      const messagesEnd = document.getElementById('messages-end');
      messagesEnd?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }, [messages]);

  const uniqueUsers = Array.from(new Set(messages?.map(m => m.user) || []));
  const messageCount = messages?.length || 0;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-2 w-2 bg-white rounded-full"></div>
            <span className="text-sidebar-foreground font-semibold">T3.chat</span>
            <div className="ml-auto flex items-center gap-1">
              <Settings className="h-4 w-4 text-sidebar-foreground/60" />
              <Sun className="h-4 w-4 text-sidebar-foreground/60" />
            </div>
          </div>
          
          <Button className="w-full bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground border border-sidebar-border/50">
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/60" />
            <Input 
              placeholder="Search your threads..." 
              className="w-full pl-10 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/60"
            />
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-auto p-4">
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent">
            Login
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          {messages?.length === 0 ? (
            <div className="max-w-2xl w-full text-center">
              <h1 className="text-4xl font-normal text-foreground mb-8">How can I help you?</h1>
              
              {/* Suggestion Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                <Button variant="outline" className="h-auto p-4 text-left border-border hover:bg-accent/50">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-foreground">Create</div>
                      <div className="text-sm text-muted-foreground">Generate content</div>
                    </div>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 text-left border-border hover:bg-accent/50">
                  <div className="flex items-start gap-3">
                    <Search className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-foreground">Explore</div>
                      <div className="text-sm text-muted-foreground">Find information</div>
                    </div>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 text-left border-border hover:bg-accent/50">
                  <div className="flex items-start gap-3">
                    <Code className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-foreground">Code</div>
                      <div className="text-sm text-muted-foreground">Write and debug</div>
                    </div>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 text-left border-border hover:bg-accent/50">
                  <div className="flex items-start gap-3">
                    <Book className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-foreground">Learn</div>
                      <div className="text-sm text-muted-foreground">Study and research</div>
                    </div>
                  </div>
                </Button>
              </div>

              {/* Example Questions */}
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>How does AI work?</div>
                <div>Are black holes real?</div>
                <div>How many Rs are in the word "strawberry"?</div>
                <div>What is the meaning of life?</div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl w-full flex-1 overflow-y-auto p-6 space-y-4">
              {messages?.map((message) => {
                const isOwn = message.user === NAME;
                const initials = message.user.substring(0, 2).toUpperCase();
                
                return (
                  <div
                    key={message._id}
                    className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'} animate-in slide-in-from-bottom-2 duration-300`}
                  >
                    <Avatar className="shrink-0">
                      <AvatarFallback className={`${isOwn ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'} text-xs font-semibold`}>
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className={`flex flex-col max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
                      <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                        <span className="text-xs font-medium text-muted-foreground">{message.user}</span>
                        {isOwn && <Badge variant="secondary" className="text-xs">You</Badge>}
                      </div>
                      
                      <div className={`px-4 py-2 rounded-2xl max-w-full break-words ${
                        isOwn 
                          ? 'bg-primary text-primary-foreground rounded-br-md' 
                          : 'bg-muted text-muted-foreground rounded-bl-md'
                      } shadow-sm`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.body}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div id="messages-end" />
            </div>
          )}
        </div>

        {/* Bottom Input Area */}
        <div className="p-4 border-t border-border">
          <div className="max-w-4xl mx-auto">
            {/* Terms */}
            <div className="text-center text-xs text-muted-foreground mb-4">
              Make sure you agree to our <span className="underline">Terms</span> and our <span className="underline">Privacy Policy</span>
            </div>
            
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
              <div className="flex items-center bg-input border border-border rounded-3xl overflow-hidden">
                <Input
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 border-0 bg-transparent px-6 py-4 text-base focus-visible:ring-0"
                  autoFocus
                />
                <div className="flex items-center gap-2 px-4">
                  <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">
                    <span>Gemini 2.5 Flash</span>
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Button 
                    type="submit" 
                    disabled={!newMessageText.trim()}
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
