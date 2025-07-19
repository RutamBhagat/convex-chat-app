import { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, MessageCircle, Users } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <Card className="mb-4 bg-white/80 backdrop-blur-sm border-slate-200/50 dark:bg-slate-900/80 dark:border-slate-700/50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Convex Chat
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Connected as <Badge variant="secondary" className="ml-1">{NAME}</Badge>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{uniqueUsers.length} users</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageCircle className="h-4 w-4" />
                  <span>{messageCount} messages</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600 font-medium">Online</span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Messages Container */}
        <Card className="flex-1 flex flex-col bg-white/80 backdrop-blur-sm border-slate-200/50 dark:bg-slate-900/80 dark:border-slate-700/50 overflow-hidden">
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full mb-4">
                  <MessageCircle className="h-12 w-12 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">No messages yet</h3>
                <p className="text-sm text-muted-foreground">Start the conversation by sending a message below!</p>
              </div>
            ) : (
              messages?.map((message) => {
                const isOwn = message.user === NAME;
                const initials = message.user.substring(0, 2).toUpperCase();
                
                return (
                  <div
                    key={message._id}
                    className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'} animate-in slide-in-from-bottom-2 duration-300`}
                  >
                    <Avatar className={`${isOwn ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gradient-to-r from-slate-500 to-slate-600'} shrink-0`}>
                      <AvatarFallback className={`${isOwn ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-gradient-to-r from-slate-500 to-slate-600 text-white'} text-xs font-semibold`}>
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
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md' 
                          : 'bg-slate-100 dark:bg-slate-800 text-foreground rounded-bl-md'
                      } shadow-sm`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.body}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div id="messages-end" />
          </CardContent>
        </Card>

        {/* Input Form */}
        <Card className="mt-4 bg-white/80 backdrop-blur-sm border-slate-200/50 dark:bg-slate-900/80 dark:border-slate-700/50">
          <CardContent className="p-4">
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
              className="flex gap-3"
            >
              <Input
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 h-12 text-base bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
                autoFocus
              />
              <Button 
                type="submit" 
                disabled={!newMessageText.trim()}
                className="h-12 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
