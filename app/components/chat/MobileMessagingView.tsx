"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { 
  MessageCircle, 
  User, 
  Clock, 
  Home, 
  MapPin, 
  Eye, 
  EyeOff, 
  MoreHorizontal,
  Send,
  ArrowLeft,
  Search,
  Filter,
  ChevronRight
} from "lucide-react";
import { ChatModal } from "./ChatModal";
import { HomeownerChatModal } from "./HomeownerChatModal";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MobileMessagingViewProps {
  chatRooms: any[];
  userType: "HOUSEMATE" | "HOMEOWNER";
  showHidden?: boolean;
  visibleCount: number;
  hiddenCount: number;
  user: any;
}

interface MobileChatCardProps {
  chatRoom: any;
  userType: "HOUSEMATE" | "HOMEOWNER";
  isHidden?: boolean;
  onToggleHidden: (chatRoomId: string) => void;
}

function MobileChatCard({ chatRoom, userType, isHidden = false, onToggleHidden }: MobileChatCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const lastMessage = chatRoom.messages && chatRoom.messages.length > 0 ? chatRoom.messages[0] : null;
  const propertyImage = chatRoom.product.images[0];
  const otherUser = userType === "HOUSEMATE" ? chatRoom.homeowner : chatRoom.housemate;
  
  // Early return if otherUser is not available
  if (!otherUser) {
    console.warn("Missing otherUser data for chatRoom:", chatRoom.id);
    return null;
  }
  
  const unreadCount = currentUser ? chatRoom.messages?.filter((message: any) => 
    !message.isRead && message.senderId !== currentUser.id
  ).length || 0 : 0;

  const formatMessageTime = (date: string) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return "now";
    } else if (diffInHours < 24) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) {
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    } else {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const truncateMessage = (message: string, maxLength: number = 60) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };

  return (
    <>
      <div 
        className="bg-white border-b border-gray-100 active:bg-gray-50 transition-colors"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            {/* Profile Picture */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
              {otherUser?.profileImage ? (
                <Image
                  src={otherUser.profileImage}
                  alt="Profile picture"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
              )}
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </div>
              )}
            </div>

            {/* Chat Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-base text-gray-900 truncate">
                  {otherUser?.firstName} {otherUser?.lastName}
                </h3>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {lastMessage && (
                    <span className="text-xs text-gray-500">
                      {formatMessageTime(lastMessage.createdAt)}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 truncate mb-1">
                    {chatRoom.product.name}
                  </p>
                  {lastMessage && (
                    <p className="text-sm text-gray-500 truncate">
                      {lastMessage.senderId === currentUser?.id ? "You: " : ""}
                      {truncateMessage(lastMessage.content)}
                    </p>
                  )}
                </div>
                
                {/* Property Image - smaller on mobile */}
                {propertyImage && (
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 ml-3">
                    <Image
                      src={propertyImage}
                      alt="Property"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status badges - simplified for mobile */}
          {(isHidden || unreadCount > 0) && (
            <div className="flex items-center gap-2 mt-3">
              {isHidden && (
                <Badge variant="outline" className="text-xs">
                  <EyeOff className="w-3 h-3 mr-1" />
                  Hidden
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Chat Modal */}
      {userType === "HOUSEMATE" ? (
        chatRoom.homeowner ? (
          <ChatModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            productId={chatRoom.product.id}
            hostId={chatRoom.homeowner.id}
            hostName={`${chatRoom.homeowner.firstName} ${chatRoom.homeowner.lastName}`}
            productName={chatRoom.product.name}
            onMessagesRead={() => {}}
          />
        ) : null
      ) : (
        chatRoom.housemate && chatRoom.homeowner ? (
          <HomeownerChatModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            productId={chatRoom.product.id}
            housemateId={chatRoom.housemate.id}
            housemateName={`${chatRoom.housemate.firstName} ${chatRoom.housemate.lastName}`}
            productName={chatRoom.product.name}
            hostId={chatRoom.homeowner.id}
            hostName={`${chatRoom.homeowner.firstName} ${chatRoom.homeowner.lastName}`}
            onMessagesRead={() => {}}
          />
        ) : null
      )}
    </>
  );
}

export function MobileMessagingView({ 
  chatRooms, 
  userType, 
  showHidden = false, 
  visibleCount, 
  hiddenCount,
  user 
}: MobileMessagingViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredChatRooms, setFilteredChatRooms] = useState(chatRooms);
  const router = useRouter();

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredChatRooms(chatRooms);
    } else {
      const filtered = chatRooms.filter(chatRoom => {
        const otherUser = userType === "HOUSEMATE" ? chatRoom.homeowner : chatRoom.housemate;
        if (!otherUser) return false; // Skip chat rooms without otherUser data
        
        const userName = `${otherUser.firstName || ''} ${otherUser.lastName || ''}`.toLowerCase();
        const propertyName = chatRoom.product?.name?.toLowerCase() || '';
        const query = searchQuery.toLowerCase();
        
        return userName.includes(query) || propertyName.includes(query);
      });
      setFilteredChatRooms(filtered);
    }
  }, [searchQuery, chatRooms, userType]);

  const handleToggleHidden = async (chatRoomId: string) => {
    try {
      const response = await fetch('/api/chat/toggle-hidden', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatRoomId,
          userType,
          hidden: !showHidden,
        }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Error toggling conversation visibility:', error);
    }
  };

  const dashboardPath = userType === "HOUSEMATE" ? "/housemate/dashboard" : "/homeowner/dashboard";
  const messagesPath = userType === "HOUSEMATE" ? "/housemate/messages" : "/homeowner/messages";

  return (
    <div className="min-h-screen bg-gray-50 md:hidden">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <Button variant="ghost" size="sm" asChild className="p-2">
              <Link href={dashboardPath}>
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">
              {showHidden ? "Hidden" : "Messages"}
            </h1>
            <div className="w-9" /> {/* Spacer for centering */}
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 rounded-full"
            />
          </div>

          {/* Toggle Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Link 
              href={messagesPath}
              className={`flex-1 text-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                !showHidden 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Active ({visibleCount})
            </Link>
            <Link 
              href={`${messagesPath}?showHidden=true`}
              className={`flex-1 text-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                showHidden 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Hidden ({hiddenCount})
            </Link>
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="pb-20">
        {filteredChatRooms.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {showHidden ? (
                  <EyeOff className="w-8 h-8 text-gray-400" />
                ) : searchQuery ? (
                  <Search className="w-8 h-8 text-gray-400" />
                ) : (
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {showHidden 
                  ? "No hidden conversations" 
                  : searchQuery 
                    ? "No results found"
                    : "No conversations yet"
                }
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {showHidden 
                  ? "Hidden conversations will appear here and can be restored at any time."
                  : searchQuery
                    ? "Try adjusting your search terms."
                    : "Start exploring properties and reach out to begin conversations."
                }
              </p>
              {!showHidden && !searchQuery && (
                <Button asChild className="mt-6">
                  <Link href="/">
                    <Home className="w-4 h-4 mr-2" />
                    Browse Properties
                  </Link>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredChatRooms.map((chatRoom) => (
              <MobileChatCard
                key={chatRoom.id}
                chatRoom={chatRoom}
                userType={userType}
                isHidden={showHidden}
                onToggleHidden={handleToggleHidden}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 