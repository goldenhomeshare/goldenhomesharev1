"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, User, MessageCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface ContactHousemateModalProps {
  isOpen: boolean;
  onClose: () => void;
  housemateName: string;
  housemateEmail: string;
  housemateId: string;
}

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

export function ContactHousemateModal({
  isOpen,
  onClose,
  housemateName,
  housemateEmail,
  housemateId
}: ContactHousemateModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setMessages([]);
      setChatRoomId(null);
      setError(null);
      initializeChat();
    }
  }, [isOpen, housemateId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get current user first
      const userResponse = await fetch("/api/auth/user");
      if (!userResponse.ok) {
        throw new Error("Please log in to send messages");
      }
      
      const userData = await userResponse.json();
      setCurrentUser(userData);
      
      // Then get or create chat room
      await getOrCreateProfileChat(userData.id);
      
    } catch (error) {
      console.error("Error initializing chat:", error);
      setError(error instanceof Error ? error.message : "Failed to load chat");
    } finally {
      setIsLoading(false);
    }
  };

  const getOrCreateProfileChat = async (currentUserId: string) => {
    try {
      const response = await fetch("/api/chat/profile-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          homeownerId: currentUserId,
          housemateId: housemateId,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        const { chatRoom, messages: chatMessages } = responseData;
        setChatRoomId(chatRoom.id);
        setMessages(chatMessages || []);
      } else {
        throw new Error("Unable to load chat");
      }
    } catch (error) {
      console.error("Error getting profile chat room:", error);
      throw error;
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUser || isSending) return;

    const messageContent = newMessage.trim();
    setNewMessage(""); // Clear input immediately for better UX
    setIsSending(true);
    
    try {
      if (!chatRoomId) {
        // If no chat room exists, send initial message
        const response = await fetch("/api/chat/send-profile-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipientId: housemateId,
            content: messageContent,
            senderId: currentUser.id,
          }),
        });

        if (response.ok) {
          const responseData = await response.json();
          
          // Update the chat room ID if one was created
          if (responseData.chatRoomId) {
            setChatRoomId(responseData.chatRoomId);
            // Refresh messages
            await getOrCreateProfileChat(currentUser.id);
          }
        } else {
          throw new Error("Failed to send message");
        }
      } else {
        // Use existing chat room
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
          // Refresh messages
          await getOrCreateProfileChat(currentUser.id);
        } else {
          throw new Error("Failed to send message");
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
      setNewMessage(messageContent); // Restore message on error
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md h-[600px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle className="text-blue-600" size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-gray-900 truncate">
                {housemateName}
              </h2>
              <p className="text-sm text-gray-500 truncate">
                {isLoading ? "Loading..." : chatRoomId ? "Continue conversation" : "Start conversation"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 ml-2"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center p-8 flex-1">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">Loading chat...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-8 text-center flex-1">
              <div className="text-red-500 mb-2">Failed to load chat</div>
              <button 
                onClick={initializeChat}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Try again
              </button>
            </div>
          ) : (
            <ScrollArea className="flex-1 h-0">
              <div className="p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="font-medium mb-2">Start a conversation</p>
                    <p className="text-sm px-4">
                      Send a message to {housemateName.split(' ')[0]} about homesharing opportunities.
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-2 items-start ${
                        message.senderId === currentUser?.id ? "justify-end" : "justify-start"
                      }`}
                    >
                      {/* Profile picture - show on left for others */}
                      {message.senderId !== currentUser?.id && (
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                          {message.sender.profileImage ? (
                            <Image
                              src={message.sender.profileImage}
                              alt={`${message.sender.firstName}'s profile`}
                              width={32}
                              height={32}
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
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                        style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                      >
                        <div className="text-xs font-medium mb-1 opacity-75">
                          {message.sender.firstName} {message.sender.lastName}
                        </div>
                        <div className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </div>
                        <div className={`text-xs mt-1 opacity-75`}>
                          {new Date(message.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>

                      {/* Profile picture for current user on the right */}
                      {message.senderId === currentUser?.id && (
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                          {currentUser?.profileImage ? (
                            <Image
                              src={currentUser.profileImage}
                              alt="Your profile"
                              width={32}
                              height={32}
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
          )}

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 flex-shrink-0">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message ${housemateName.split(' ')[0]}...`}
                onKeyPress={handleKeyPress}
                disabled={isLoading || isSending || !!error}
                className="flex-1"
                maxLength={500}
              />
              <Button 
                onClick={sendMessage} 
                disabled={!newMessage.trim() || isLoading || isSending || !!error}
                className="bg-blue-600 hover:bg-blue-700 flex-shrink-0"
                size="sm"
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send • {newMessage.length}/500
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 