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
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChatModal } from "./ChatModal";

interface HousemateConversationListProps {
  chatRooms: any[];
  currentUserId: string;
  isHidden?: boolean;
  selectedChatId?: string;
}

interface ConversationItemProps {
  chatRoom: any;
  currentUserId: string;
  isHidden?: boolean;
  onToggleHidden: (chatRoomId: string) => void;
  selectedChatId?: string;
}

function ConversationItem({ chatRoom, currentUserId, isHidden = false, onToggleHidden, selectedChatId }: ConversationItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const lastMessage = chatRoom.messages && chatRoom.messages.length > 0 ? chatRoom.messages[0] : null;
  const homeowner = chatRoom.homeowner;
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
          userType: 'HOUSEMATE',
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
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('chatId', chatRoom.id);
    router.push(currentUrl.toString());
  };

  return (
    <>
      <div 
        className={`flex items-center p-4 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${
          isSelected 
            ? 'bg-green-50 border-l-4 border-l-green-600' 
            : 'hover:bg-gray-50'
        }`}
        onClick={handleConversationClick}
      >
        {/* Profile Picture */}
        <div className="relative flex-shrink-0 mr-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
            {homeowner?.profileImage ? (
              <Image
                src={homeowner.profileImage}
                alt={`${homeowner.firstName}'s profile`}
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
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
                  {homeowner?.firstName} {homeowner?.lastName}
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
                  Start a conversation...
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

      {/* Chat Modal */}
      <ChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={chatRoom.productId}
        hostId={chatRoom.homeownerId}
        hostName={`${homeowner?.firstName} ${homeowner?.lastName}`}
        productName={product?.name}
        onMessagesRead={() => router.refresh()}
      />
    </>
  );
}

export function HousemateConversationList({ 
  chatRooms, 
  currentUserId, 
  isHidden = false,
  selectedChatId
}: HousemateConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredChatRooms, setFilteredChatRooms] = useState(chatRooms);
  const router = useRouter();

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredChatRooms(chatRooms);
    } else {
      const filtered = chatRooms.filter(chatRoom => {
        const homeowner = chatRoom.homeowner;
        const product = chatRoom.product;
        
        if (!homeowner) return false;
        
        const userName = `${homeowner.firstName || ''} ${homeowner.lastName || ''}`.toLowerCase();
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
          userType: 'HOUSEMATE',
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

  return (
    <div className="divide-y divide-gray-100">
      {filteredChatRooms.map((chatRoom) => (
        <div key={chatRoom.id} className="group">
          <ConversationItem
            chatRoom={chatRoom}
            currentUserId={currentUserId}
            isHidden={isHidden}
            onToggleHidden={handleToggleHidden}
            selectedChatId={selectedChatId}
          />
        </div>
      ))}
    </div>
  );
} 