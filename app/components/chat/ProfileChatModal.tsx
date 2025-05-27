"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  sender: {
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
}

interface ProfileChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  housemateId: string;
  housemateName: string;
}

export function ProfileChatModal({ 
  isOpen, 
  onClose, 
  housemateId, 
  housemateName
}: ProfileChatModalProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      initializeChat();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    try {
      setIsLoading(true);
      
      // Get current user (homeowner)
      const userResponse = await fetch("/api/auth/user");
      if (!userResponse.ok) {
        toast.error("Please log in to send messages.");
        onClose(); // Close the modal
        router.push("/api/auth/login");
        return;
      }
      
      const userData = await userResponse.json();
      setCurrentUser(userData);
      
      // Get or create profile chat room
      await getOrCreateProfileChatRoom(userData.id);
    } catch (error) {
      console.error("Error initializing chat:", error);
      toast.error("Please log in to send messages.");
      onClose(); // Close the modal
      router.push("/api/auth/login");
    } finally {
      setIsLoading(false);
    }
  };

  const getOrCreateProfileChatRoom = async (homeownerId: string) => {
    try {
      console.log("Making profile chat API call with:", {
        homeownerId,
        housemateId,
      });
      
      const response = await fetch("/api/chat/profile-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          homeownerId,
          housemateId,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Profile chat API response:", responseData);
        
        const { chatRoom, messages: chatMessages } = responseData;
        setChatRoomId(chatRoom.id);
        setMessages(chatMessages || []);
        
        console.log("Set messages:", chatMessages || []);
      } else {
        console.error("Profile chat API error:", response.status, await response.text());
        toast.error("Failed to load chat");
      }
    } catch (error) {
      console.error("Error getting profile chat room:", error);
      toast.error("Failed to load chat");
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatRoomId || !currentUser) return;

    try {
      const response = await fetch("/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatRoomId,
          content: newMessage.trim(),
          senderId: currentUser.id,
        }),
      });

      if (response.ok) {
        setNewMessage("");
        // Refresh messages after sending
        await refreshMessages();
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const refreshMessages = async () => {
    if (!chatRoomId || !currentUser) return;
    
    try {
      const response = await fetch("/api/chat/profile-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          homeownerId: currentUser.id,
          housemateId,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        const { messages: chatMessages } = responseData;
        setMessages(chatMessages || []);
      }
    } catch (error) {
      console.error("Error refreshing messages:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg h-[75vh] md:h-[70vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <DialogTitle>Chat with {housemateName}</DialogTitle>
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
            <span>Profile Chat</span>
          </div>
        </DialogHeader>

        {/* Messages Area - Takes remaining space and scrolls independently */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.senderId === currentUser?.id ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.senderId !== currentUser?.id && (
                      <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                        {message.sender.profileImage ? (
                          <Image
                            src={message.sender.profileImage}
                            alt="Profile picture"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] rounded-lg px-3 py-2 ${
                        message.senderId === currentUser?.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {message.senderId === currentUser?.id && (
                      <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                        {currentUser?.profileImage ? (
                          <Image
                            src={currentUser.profileImage}
                            alt="Your profile picture"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Message Input - Fixed at bottom */}
        <div className="flex gap-2 p-4 border-t flex-shrink-0">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <Button onClick={sendMessage} disabled={!newMessage.trim() || isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 