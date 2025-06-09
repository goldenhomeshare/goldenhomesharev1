"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
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

interface InlineChatInterfaceProps {
  selectedChatRoom: any;
  userType: "HOMEOWNER" | "HOUSEMATE";
  currentUserId: string;
  user?: any;
}

export function InlineChatInterface({ selectedChatRoom, userType, currentUserId, user }: InlineChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Memoize these to prevent infinite loops
  const supabase = useMemo(() => createClient(), []);
  const otherUser = useMemo(() => 
    userType === "HOMEOWNER" ? selectedChatRoom?.housemate : selectedChatRoom?.homeowner, 
    [userType, selectedChatRoom?.housemate, selectedChatRoom?.homeowner]
  );
  const isHomeowner = userType === "HOMEOWNER";

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

  // Initialize chat when selectedChatRoom or user changes
  useEffect(() => {
    if (!selectedChatRoom || !user) return;

    const initializeChat = async () => {
      try {
        setIsLoading(true);
        setCurrentUser(user);
        
        // Load existing messages
        try {
          const response = await fetch(`/api/chat/messages?chatRoomId=${selectedChatRoom.id}`);
          if (response.ok) {
            const chatMessages = await response.json();
            setMessages(chatMessages || []);
            
            // Mark messages as read
            try {
              await fetch("/api/messages/mark-read", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  chatRoomId: selectedChatRoom.id,
                }),
              });
              
              // Messages marked as read successfully
            } catch (error) {
              console.error("Error marking messages as read:", error);
            }
            
            // Subscribe to real-time updates
            const channel = supabase
              .channel(`chat-room-${selectedChatRoom.id}`)
              .on(
                "postgres_changes",
                {
                  event: "INSERT",
                  schema: "public",
                  table: "Message",
                  filter: `chatRoomId=eq.${selectedChatRoom.id}`,
                },
                (payload: any) => {
                  const newMessage = payload.new as any;
                  const currentOtherUser = userType === "HOMEOWNER" ? selectedChatRoom?.housemate : selectedChatRoom?.homeowner;
                  setMessages((prev) => [...prev, {
                    id: newMessage.id,
                    content: newMessage.content,
                    senderId: newMessage.senderId,
                    createdAt: newMessage.createdAt,
                    sender: {
                      firstName: newMessage.senderId === user?.id ? user.firstName : currentOtherUser?.firstName,
                      lastName: newMessage.senderId === user?.id ? user.lastName : currentOtherUser?.lastName,
                      profileImage: newMessage.senderId === user?.id ? user.profileImage : currentOtherUser?.profileImage,
                    }
                  }]);
                }
              )
              .subscribe();

            // Cleanup function
            return () => {
              supabase.removeChannel(channel);
            };
          }
        } catch (error) {
          console.error("Error loading messages:", error);
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Failed to load chat");
      } finally {
        setIsLoading(false);
      }
    };

    const cleanup = initializeChat();
    
    // Return cleanup function for useEffect
    return () => {
      if (cleanup && typeof cleanup.then === 'function') {
        cleanup.then(cleanupFn => {
          if (cleanupFn && typeof cleanupFn === 'function') {
            cleanupFn();
          }
        });
      }
    };
  }, [selectedChatRoom?.id, user?.id, userType]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChatRoom.id || !currentUser || isSending) return;

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
          chatRoomId: selectedChatRoom.id,
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

  const handleViewProfile = () => {
    window.open(`/profile/${otherUser?.id}`, '_blank');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header - Hidden on mobile when used in MobileChatView */}
      <div className="hidden md:block p-4 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
              {otherUser?.profileImage ? (
                <img
                  src={otherUser.profileImage}
                  alt={`${otherUser.firstName}'s profile`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${
                  isHomeowner 
                    ? 'from-blue-100 to-blue-200' 
                    : 'from-green-100 to-green-200'
                } flex items-center justify-center`}>
                  <User className={`w-5 h-5 ${
                    isHomeowner ? 'text-blue-600' : 'text-green-600'
                  }`} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-gray-900 truncate">
                {otherUser?.firstName} {otherUser?.lastName?.charAt(0) || ''}.
              </h2>
              <p className="text-sm text-gray-500 truncate">
                {isHomeowner 
                  ? `Interested in ${selectedChatRoom.product?.name}`
                  : `Property: ${selectedChatRoom.product?.name}`
                }
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewProfile}
            className="text-xs px-2 py-1 h-auto flex-shrink-0"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Profile
          </Button>
        </div>
      </div>

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
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  isHomeowner ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  <Send className={`w-8 h-8 ${
                    isHomeowner ? 'text-blue-600' : 'text-green-600'
                  }`} />
                </div>
                <p className="font-medium mb-2">Start the conversation</p>
                <p className="text-sm px-4">
                  Send a message to {otherUser?.firstName} about {selectedChatRoom.product?.name}.
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.senderId === currentUserId ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* Profile picture - show on left for others */}
                  {message.senderId !== currentUserId && (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200 flex-shrink-0 mt-1">
                      {message.sender.profileImage ? (
                        <Image
                          src={message.sender.profileImage}
                          alt={`${message.sender.firstName}'s profile`}
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
                    className={`max-w-[70%] rounded-xl px-3 py-2 break-words ${
                      message.senderId === currentUserId
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <div className="text-xs font-medium mb-1">
                      {message.sender.firstName} {message.sender.lastName}
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
                  {message.senderId === currentUserId && (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200 flex-shrink-0 mt-1">
                      {currentUser?.profileImage ? (
                        <Image
                          src={currentUser.profileImage}
                          alt="Your profile"
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
            <div ref={messagesEndRef} className="h-1" />
          </div>
        </ScrollArea>
      </div>

      {/* Message Input - Fixed at bottom */}
      <div className="p-4 border-t bg-background flex-shrink-0">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={handleKeyPress}
            disabled={isLoading || !selectedChatRoom.id || isSending}
            className="flex-1 text-base md:text-sm"
            style={{ fontSize: '16px' }} // Prevents zoom on iOS
          />
          <Button 
            onClick={sendMessage} 
            disabled={!newMessage.trim() || isLoading || !selectedChatRoom.id || isSending}
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
    </div>
  );
} 