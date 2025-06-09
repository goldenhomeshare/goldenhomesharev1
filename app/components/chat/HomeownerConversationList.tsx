"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  User, 
  MoreVertical, 
  Eye, 
  EyeOff, 
  MapPin,
  UserCheck,
  FileText,
  MessageCircle
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { HomeownerChatModal } from "./HomeownerChatModal"; // Not needed for mobile routing

interface HomeownerConversationListProps {
  chatRooms: any[];
  currentUserId: string;
  user: any;
  isHidden?: boolean;
  selectedChatId?: string;
}

interface ConversationItemProps {
  chatRoom: any;
  currentUserId: string;
  user: any;
  isHidden?: boolean;
  onToggleHidden: (chatRoomId: string) => void;
  selectedChatId?: string;
}

function ConversationItem({ chatRoom, currentUserId, user, isHidden = false, onToggleHidden, selectedChatId }: ConversationItemProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const lastMessage = chatRoom.messages && chatRoom.messages.length > 0 ? chatRoom.messages[0] : null;
  const housemate = chatRoom.housemate;
  const product = chatRoom.product;
  const propertyImage = product?.images?.[0];
  
  // Calculate unread messages count
  const unreadCount = chatRoom.messages?.filter((message: any) => 
    !message.isRead && message.senderId !== currentUserId
  ).length || 0;

  const handleToggleHidden = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat/toggle-hidden', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatRoomId: chatRoom.id,
          userType: 'HOMEOWNER',
          hidden: !isHidden,
        }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Error toggling conversation visibility:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`/profile/${housemate?.id}`, '_blank');
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "now";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const truncateMessage = (message: string, maxLength: number = 50) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };

  const isSelected = selectedChatId === chatRoom.id;

  const handleConversationClick = () => {
    // Check if we're on mobile (screen width < 768px)
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      // Navigate to full-screen mobile chat view
      router.push(`/homeowner/messages/chat/${chatRoom.id}`);
    } else {
      // Desktop behavior - update URL params to select chat in sidebar
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('chatId', chatRoom.id);
      router.push(currentUrl.toString());
    }
  };

  return (
    <>
      <div 
        className={`flex items-center p-4 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${
          isSelected 
            ? 'bg-blue-50 border-l-4 border-l-blue-600' 
            : 'hover:bg-gray-50'
        }`}
        onClick={handleConversationClick}
      >
        {/* Profile Picture */}
        <div className="relative flex-shrink-0 mr-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
            {housemate?.profileImage ? (
              <Image
                src={housemate.profileImage}
                alt={`${housemate.firstName}'s profile`}
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
            )}
          </div>
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              {unreadCount > 9 ? "9+" : unreadCount}
            </div>
          )}
        </div>

        {/* Conversation Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 truncate">
                  {housemate?.firstName} {housemate?.lastName?.charAt(0) || ''}.
                </h3>
                {isHidden && (
                  <Badge variant="outline" className="text-xs">
                    <EyeOff className="w-3 h-3 mr-1" />
                    Hidden
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 truncate mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                {product?.name}
              </p>
            </div>
            
            {/* Time and Actions */}
            <div className="flex items-center gap-2 ml-2">
              {lastMessage && (
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {formatMessageTime(lastMessage.createdAt)}
                </span>
              )}
              
              {/* Quick action buttons */}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 opacity-0 group-hover:opacity-100 hover:bg-blue-100 text-blue-600"
                onClick={handleViewProfile}
              >
                <UserCheck className="w-4 h-4" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-gray-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleViewProfile}>
                    <UserCheck className="w-4 h-4 mr-2" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    <FileText className="w-4 h-4 mr-2" />
                    Request Application
                  </DropdownMenuItem>
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
          </div>
          
          {/* Last Message */}
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              {lastMessage ? (
                <p className={`text-sm truncate ${
                  unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-500'
                }`}>
                  {lastMessage.senderId === currentUserId ? "You: " : ""}
                  {truncateMessage(lastMessage.content)}
                </p>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  New inquiry - Click to respond...
                </p>
              )}
            </div>
            
            {/* Property Image */}
            {propertyImage && (
              <div className="relative w-8 h-8 rounded-md overflow-hidden border border-gray-200 ml-2 flex-shrink-0">
                <Image
                  src={propertyImage}
                  alt="Property"
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Modal - Only used for desktop when needed */}
      {/* Note: Mobile now uses direct routing to chat view */}
    </>
  );
}

export function HomeownerConversationList({ 
  chatRooms, 
  currentUserId, 
  user,
  isHidden = false,
  selectedChatId
}: HomeownerConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredChatRooms, setFilteredChatRooms] = useState(chatRooms);
  const router = useRouter();

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredChatRooms(chatRooms);
    } else {
      const filtered = chatRooms.filter(chatRoom => {
        const housemate = chatRoom.housemate;
        const product = chatRoom.product;
        
        if (!housemate) return false;
        
        const userName = `${housemate.firstName || ''} ${housemate.lastName || ''}`.toLowerCase();
        const propertyName = product?.name?.toLowerCase() || '';
        const query = searchQuery.toLowerCase();
        
        return userName.includes(query) || propertyName.includes(query);
      });
      setFilteredChatRooms(filtered);
    }
  }, [searchQuery, chatRooms]);

  const handleToggleHidden = async (chatRoomId: string) => {
    try {
      const response = await fetch('/api/chat/toggle-hidden', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatRoomId,
          userType: 'HOMEOWNER',
          hidden: !isHidden,
        }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Error toggling conversation visibility:', error);
    }
  };

  if (filteredChatRooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] p-6 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          {isHidden ? (
            <EyeOff className="w-8 h-8 text-gray-400" />
          ) : (
            <MessageCircle className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {searchQuery.trim() !== "" 
            ? "No conversations found" 
            : isHidden 
              ? "No hidden conversations" 
              : "No messages yet"
          }
        </h3>
        <p className="text-gray-500 max-w-md mb-4 text-sm leading-relaxed">
          {searchQuery.trim() !== "" 
            ? "Try adjusting your search terms to find conversations."
            : isHidden 
              ? "Hidden conversations will appear here and can be restored at any time."
              : "When potential housemates reach out about your properties, their messages will appear here."
          }
        </p>
        {!isHidden && searchQuery.trim() === "" && (
          <Button asChild className="mt-2">
            <Link href="/homeowner/dashboard">Manage Properties</Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {filteredChatRooms.map((chatRoom) => (
        <div key={chatRoom.id} className="group">
          <ConversationItem
            chatRoom={chatRoom}
            currentUserId={currentUserId}
            user={user}
            isHidden={isHidden}
            onToggleHidden={handleToggleHidden}
            selectedChatId={selectedChatId}
          />
        </div>
      ))}
    </div>
  );
} 