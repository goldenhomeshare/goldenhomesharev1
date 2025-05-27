"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, X, User } from "lucide-react";
// import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Image from "next/image";

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

interface HomeownerChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  housemateId: string;
  housemateName: string;
  productName: string;
  hostId: string;
  hostName: string;
  onMessagesRead?: () => void;
}

export function HomeownerChatModal({ 
  isOpen, 
  onClose, 
  productId, 
  housemateId, 
  housemateName, 
  productName,
  hostId,
  hostName,
  onMessagesRead
}: HomeownerChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // const supabase = createClient();

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      initializeChat();
    }
  }, [isOpen, productId, housemateId]);

  const initializeChat = async () => {
    try {
      setIsLoading(true);
      
      // Get current user (homeowner)
      const userResponse = await fetch("/api/auth/user");
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setCurrentUser(userData);
        
        // Get or create chat room with the specific housemate
        await getOrCreateChatRoom(userData.id);
      }
    } catch (error) {
      console.error("Error initializing chat:", error);
      toast.error("Failed to load chat");
    } finally {
      setIsLoading(false);
    }
  };

  const getOrCreateChatRoom = async (homeownerId: string) => {
    try {
      console.log("Making API call with:", {
        productId,
        hostId: homeownerId,
        housemateId,
      });
      
      const response = await fetch("/api/chat/room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          hostId: homeownerId, // Current user is the homeowner
          housemateId, // The housemate we're chatting with
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("API response:", responseData);
        
        const { chatRoom, messages: chatMessages } = responseData;
        setChatRoomId(chatRoom.id);
        setMessages(chatMessages || []);
        
        console.log("Set messages:", chatMessages || []);
        
        // Mark messages as read when chat is opened
        await markMessagesAsRead(chatRoom.id);
        
        // Subscribe to real-time updates
        // subscribeToMessages(chatRoom.id);
      } else {
        console.error("API error:", response.status, await response.text());
      }
    } catch (error) {
      console.error("Error getting chat room:", error);
    }
  };

  const markMessagesAsRead = async (roomId: string) => {
    try {
      await fetch("/api/messages/mark-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatRoomId: roomId,
        }),
      });
      
      // Trigger refresh of unread count
      if (onMessagesRead) {
        onMessagesRead();
      }
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const subscribeToMessages = (roomId: string) => {
    // const channel = supabase
    //   .channel(`chat-room-${roomId}`)
    //   .on(
    //     "postgres_changes",
    //     {
    //       event: "INSERT",
    //       schema: "public",
    //       table: "Message",
    //       filter: `chatRoomId=eq.${roomId}`,
    //     },
    //     (payload) => {
    //       const newMessage = payload.new as any;
    //       setMessages((prev) => [...prev, {
    //         id: newMessage.id,
    //         content: newMessage.content,
    //         senderId: newMessage.senderId,
    //         createdAt: newMessage.createdAt,
    //         sender: {
    //           firstName: newMessage.senderId === currentUser?.id ? currentUser.firstName : housemateName.split(' ')[0],
    //           lastName: newMessage.senderId === currentUser?.id ? currentUser.lastName : housemateName.split(' ')[1] || '',
    //         }
    //       }]);
    //     }
    //   )
    //   .subscribe();

    // return () => {
    //   supabase.removeChannel(channel);
    // };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatRoomId || !currentUser || isSending) return;

    const messageContent = newMessage.trim();
    const tempId = `temp-${Date.now()}`;
    
    // Optimistic update - add message immediately to UI
    const optimisticMessage = {
      id: tempId,
      content: messageContent,
      senderId: currentUser.id,
      createdAt: new Date().toISOString(),
      sender: {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        profileImage: currentUser.profileImage,
      }
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatRoomId,
          content: messageContent,
          senderId: currentUser.id,
        }),
      });

      if (response.ok) {
        const sentMessage = await response.json();
        // Replace optimistic message with real message
        setMessages(prev => prev.map(msg => 
          msg.id === tempId ? { ...sentMessage, sender: optimisticMessage.sender } : msg
        ));
        // Refresh messages after sending
        await refreshMessages();
      } else {
        // Remove optimistic message on error
        setMessages(prev => prev.filter(msg => msg.id !== tempId));
        setNewMessage(messageContent); // Restore message text
        toast.error("Failed to send message");
      }
    } catch (error) {
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
      setNewMessage(messageContent); // Restore message text
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const refreshMessages = async () => {
    if (!chatRoomId) return;
    
    try {
      const response = await fetch("/api/chat/room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          hostId: currentUser?.id,
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

  const handleViewProfile = () => {
    window.open(`/profile/${housemateId}`, '_blank');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg h-[85vh] md:h-[75vh] flex flex-col p-0 mx-2 md:mx-auto">
        <DialogHeader className="px-4 md:px-6 py-3 md:py-4 border-b flex-shrink-0">
          <DialogTitle className="text-base md:text-lg">Chat with {housemateName}</DialogTitle>
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
            <span className="truncate">Property: {productName}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewProfile}
              className="text-xs px-2 py-1 h-auto ml-2 flex-shrink-0"
            >
              View Profile
            </Button>
          </div>
        </DialogHeader>

        {/* Messages Area - Takes remaining space and scrolls independently */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="px-4 md:px-6 py-2 md:py-4 space-y-3 md:space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                  </div>
                  <p className="font-medium mb-2">Start the conversation</p>
                  <p className="text-sm px-4">
                    Send a message to {housemateName.split(' ')[0]} about {productName}.
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 md:gap-3 ${
                      message.senderId === currentUser?.id ? "justify-end" : "justify-start"
                    }`}
                  >
                    {/* Profile picture - show on left for others, right for current user */}
                    {message.senderId !== currentUser?.id && (
                      <div className="relative w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden border border-gray-200 flex-shrink-0 mt-1">
                        {message.sender.profileImage ? (
                          <Image
                            src={message.sender.profileImage}
                            alt={`${message.sender.firstName}'s profile`}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <User className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[75%] md:max-w-[70%] rounded-lg md:rounded-xl px-3 py-2 break-words ${
                        message.senderId === currentUser?.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <div className="text-xs md:text-sm font-medium mb-1">
                        {message.sender.firstName} {message.sender.lastName?.charAt(0) || ''}.
                      </div>
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>

                    {/* Profile picture for current user on the right */}
                    {message.senderId === currentUser?.id && (
                      <div className="relative w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden border border-gray-200 flex-shrink-0 mt-1">
                        {currentUser?.profileImage ? (
                          <Image
                            src={currentUser.profileImage}
                            alt="Your profile"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <User className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} className="h-1" />
            </div>
          </ScrollArea>
        </div>

        {/* Message Input - Fixed at bottom */}
        <div className="px-4 md:px-6 py-3 md:py-4 border-t bg-background flex-shrink-0">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={handleKeyPress}
              disabled={isLoading || !chatRoomId || isSending}
              className="flex-1 text-base"
              style={{ fontSize: '16px' }} // Prevents zoom on iOS
            />
            <Button 
              onClick={sendMessage} 
              disabled={!newMessage.trim() || isLoading || !chatRoomId || isSending}
              size="sm"
              className="px-3 flex-shrink-0"
            >
              {isSending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 