"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { InlineChatInterface } from "./InlineChatInterface";

interface MobileChatViewProps {
  chatRoomId: string;
  userType: "HOUSEMATE" | "HOMEOWNER";
  currentUserId: string;
  user: any;
  backPath: string;
}

export function MobileChatView({ 
  chatRoomId, 
  userType, 
  currentUserId, 
  user, 
  backPath 
}: MobileChatViewProps) {
  const [selectedChatRoom, setSelectedChatRoom] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchChatRoom = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/chat/room/${chatRoomId}`);
        if (response.ok) {
          const chatRoom = await response.json();
          setSelectedChatRoom(chatRoom);
        } else {
          console.error("Failed to fetch chat room");
          router.push(backPath);
        }
      } catch (error) {
        console.error("Error fetching chat room:", error);
        router.push(backPath);
      } finally {
        setIsLoading(false);
      }
    };

    if (chatRoomId) {
      fetchChatRoom();
    }
  }, [chatRoomId, router, backPath]);

  const handleBack = () => {
    router.push(backPath);
  };

  const handleViewProfile = () => {
    const otherUser = userType === "HOUSEMATE" ? selectedChatRoom?.homeowner : selectedChatRoom?.housemate;
    if (otherUser?.id) {
      window.open(`/profile/${otherUser.id}`, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 md:hidden">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!selectedChatRoom) {
    return (
      <div className="min-h-screen bg-gray-50 md:hidden">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Chat room not found</p>
            <Button onClick={handleBack}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white md:hidden flex flex-col">
      {/* Mobile Header with Back Button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 flex-shrink-0">
        <div className="flex items-center px-4 py-3">
          <Button variant="ghost" size="sm" onClick={handleBack} className="p-2 mr-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {userType === "HOUSEMATE" 
                ? `${selectedChatRoom.homeowner?.firstName} ${selectedChatRoom.homeowner?.lastName || ''}`
                : `${selectedChatRoom.housemate?.firstName} ${selectedChatRoom.housemate?.lastName || ''}`
              }
            </h1>
            <p className="text-sm text-gray-500 truncate">
              {selectedChatRoom.product?.name}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewProfile}
            className="text-xs px-2 py-1 h-auto flex-shrink-0 ml-2"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Profile
          </Button>
        </div>
      </div>

      {/* Chat Interface - Takes remaining space */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <InlineChatInterface
          selectedChatRoom={selectedChatRoom}
          userType={userType}
          currentUserId={currentUserId}
          user={user}
        />
      </div>
    </div>
  );
} 