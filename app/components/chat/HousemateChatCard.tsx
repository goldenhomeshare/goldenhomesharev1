"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MessageCircle, User, Clock, Home, MapPin, Eye, EyeOff, MoreHorizontal } from "lucide-react";
import { ChatModal } from "./ChatModal";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HousemateChatCardProps {
  chatRoom: any;
  isHidden?: boolean;
}

export function HousemateChatCard({ chatRoom, isHidden = false }: HousemateChatCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const lastMessage = chatRoom.messages && chatRoom.messages.length > 0 ? chatRoom.messages[0] : null;
  const propertyImage = chatRoom.product.images[0];
  
  // Calculate unread messages count (messages from homeowner that are unread)
  // We need to get the current user to filter properly
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await fetch("/api/auth/user");
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error("Error getting current user:", error);
      }
    };
    getCurrentUser();
  }, []);
  
  const unreadCount = currentUser ? chatRoom.messages?.filter((message: any) => 
    !message.isRead && message.senderId !== currentUser.id
  ).length || 0 : 0;

  const handleToggleHidden = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening chat modal
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat/toggle-hidden', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatRoomId: chatRoom.id,
          userType: 'HOUSEMATE',
          hidden: !isHidden,
        }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        console.error('Failed to toggle conversation visibility');
      }
    } catch (error) {
      console.error('Error toggling conversation visibility:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessageTime = (date: string) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    } else {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <>
      <Card 
        className="hover:shadow-lg transition-all duration-200 cursor-pointer border-0 shadow-sm bg-white" 
        onClick={() => setIsModalOpen(true)}
      >
        <CardContent className="p-6">
          {/* Header with Badges */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-medium">
                <Home className="w-3 h-3 mr-1" />
                Property Discussion
              </Badge>
              {lastMessage && (
                <Badge variant="secondary" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatMessageTime(lastMessage.createdAt)}
                </Badge>
              )}
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount} unread
                </Badge>
              )}
              {isHidden && (
                <Badge variant="outline" className="text-xs text-gray-500">
                  <EyeOff className="w-3 h-3 mr-1" />
                  Hidden
                </Badge>
              )}
            </div>
            
            {/* More actions dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 px-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleToggleHidden}
                  disabled={isLoading}
                >
                  {isHidden ? (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Restore conversation
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Hide conversation
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-start gap-4">
            {/* Homeowner Profile Picture */}
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
              {chatRoom.homeowner.profileImage ? (
                <Image
                  src={chatRoom.homeowner.profileImage}
                  alt="Profile picture"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <User className="w-7 h-7 text-green-600" />
                </div>
              )}
            </div>

            {/* Chat Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {chatRoom.homeowner.firstName} {chatRoom.homeowner.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {chatRoom.product.name}
                  </p>
                </div>
                
                {/* Property Image */}
                {propertyImage && (
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 ml-4">
                    <Image
                      src={propertyImage}
                      alt="Property"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Last Message */}
              {lastMessage ? (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <span className="font-medium text-gray-900">
                      {lastMessage.sender.firstName}:
                    </span>{" "}
                    {lastMessage.content.length > 120
                      ? `${lastMessage.content.substring(0, 120)}...`
                      : lastMessage.content}
                  </p>
                </div>
              ) : (
                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-sm text-green-700 italic">
                    New conversation - Click to start chatting
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <ChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={chatRoom.productId}
        hostId={chatRoom.homeownerId}
        hostName={`${chatRoom.homeowner.firstName} ${chatRoom.homeowner.lastName}`}
        productName={chatRoom.product.name}
        onMessagesRead={() => router.refresh()}
      />
    </>
  );
} 